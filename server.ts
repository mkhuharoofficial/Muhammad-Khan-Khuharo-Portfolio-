import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { DEFAULT_PORTFOLIO_DATA } from './src/data/defaultPortfolio.ts';
import type { ContactMessage, PortfolioData } from './src/types/portfolio.ts';

dotenv.config();

const PORT = 3000;
const ROOT_DIR = process.cwd();
const DATA_DIR = path.join(ROOT_DIR, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'mk-admin-2026';
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  crypto.createHash('sha256').update(`mk-portfolio-${ADMIN_PASSCODE}`).digest('hex');

function ensureStorage(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  if (!fs.existsSync(PORTFOLIO_FILE)) {
    fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(DEFAULT_PORTFOLIO_DATA, null, 2), 'utf-8');
  }
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readPortfolio(): PortfolioData {
  ensureStorage();
  try {
    const raw = fs.readFileSync(PORTFOLIO_FILE, 'utf-8');
    return JSON.parse(raw) as PortfolioData;
  } catch {
    return DEFAULT_PORTFOLIO_DATA;
  }
}

function writePortfolio(data: PortfolioData): void {
  ensureStorage();
  fs.writeFileSync(PORTFOLIO_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function readMessages(): ContactMessage[] {
  ensureStorage();
  try {
    const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
    return JSON.parse(raw) as ContactMessage[];
  } catch {
    return [];
  }
}

function writeMessages(messages: ContactMessage[]): void {
  ensureStorage();
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}

function signToken(payload: { role: string; exp: number }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token: string): boolean {
  if (!token || !token.includes('.')) return false;
  const [data, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  if (sig.length !== expected.length) return false;
  const validSig = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  if (!validSig) return false;
  try {
    const decoded = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'admin' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!verifyToken(token)) {
    res.status(401).json({ error: 'Unauthorized. Please unlock Portfolio Studio.' });
    return;
  }
  next();
}

async function startServer(): Promise<void> {
  ensureStorage();

  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Serve uploaded real photographs, project screenshots, and certificate images/PDFs
  app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

  // Public portfolio data endpoint
  app.get('/api/portfolio', (_req, res) => {
    res.json(readPortfolio());
  });

  // Public GitHub live repositories proxy (avoids fabricating any repo or stats)
  app.get('/api/github-repos', async (_req, res) => {
    try {
      const response = await fetch(
        'https://api.github.com/users/mkhuharoofficial/repos?sort=updated&per_page=6',
        {
          headers: {
            Accept: 'application/vnd.github+json',
            'User-Agent': 'Muhammad-Khan-Portfolio',
          },
        }
      );
      if (!response.ok) {
        res.status(response.status).json({
          repos: [],
          error: 'GitHub API temporarily unavailable.',
        });
        return;
      }
      const repos = (await response.json()) as Array<{
        id: number;
        name: string;
        description: string | null;
        language: string | null;
        html_url: string;
        updated_at: string;
        homepage: string | null;
        fork: boolean;
      }>;
      const sanitized = repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language,
        html_url: repo.html_url,
        updated_at: repo.updated_at,
        homepage: repo.homepage,
        fork: repo.fork,
      }));
      res.json({ repos: sanitized });
    } catch {
      res.status(502).json({
        repos: [],
        error: 'Could not reach GitHub API right now.',
      });
    }
  });

  // Contact form endpoint (persists message + sends email if SMTP env vars are configured)
  app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      res.status(400).json({ error: 'All contact fields are required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    let emailDelivered = false;
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactTo = process.env.CONTACT_TO_EMAIL || 'mkhuharoofficial@gmail.com';

    if (smtpHost && smtpUser && smtpPass && smtpPass !== 'YOUR_APP_PASSWORD') {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT || 587) === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });
        await transporter.sendMail({
          from: `"Portfolio Contact" <${smtpUser}>`,
          to: contactTo,
          replyTo: email.trim(),
          subject: `[Portfolio] ${subject.trim()}`,
          text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${subject.trim()}\n\n${message.trim()}`,
        });
        emailDelivered = true;
      } catch (err) {
        console.error('SMTP email error:', err);
      }
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      emailDelivered,
    };

    const messages = readMessages();
    messages.unshift(newMessage);
    writeMessages(messages);

    res.status(201).json({
      success: true,
      emailDelivered,
      message: emailDelivered
        ? 'Your message has been delivered to Muhammad Khan via email.'
        : 'Your message has been saved securely to Muhammad Khan’s Portfolio Inbox.',
    });
  });

  // Admin auth
  app.post('/api/admin/login', (req, res) => {
    const { passcode } = req.body as { passcode?: string };
    if (!passcode || passcode !== ADMIN_PASSCODE) {
      res.status(401).json({ error: 'Invalid Portfolio Studio passcode.' });
      return;
    }
    const token = signToken({
      role: 'admin',
      exp: Date.now() + 1000 * 60 * 60 * 12,
    });
    res.json({ token });
  });

  app.get('/api/admin/verify', requireAdmin, (_req, res) => {
    res.json({ authenticated: true });
  });

  app.get('/api/admin/messages', requireAdmin, (_req, res) => {
    res.json({ messages: readMessages() });
  });

  app.delete('/api/admin/messages/:id', requireAdmin, (req, res) => {
    const messages = readMessages().filter((m) => m.id !== req.params.id);
    writeMessages(messages);
    res.json({ messages });
  });

  // Save full portfolio updates
  app.put('/api/admin/portfolio', requireAdmin, (req, res) => {
    const updated = req.body as PortfolioData;
    if (!updated || !updated.profile || !Array.isArray(updated.onlineCourses)) {
      res.status(400).json({ error: 'Invalid portfolio payload.' });
      return;
    }
    writePortfolio(updated);
    res.json({ success: true, portfolio: updated });
  });

  // Upload real images or certificate PDFs
  app.post('/api/admin/upload', requireAdmin, (req, res) => {
    const { fileName, dataUrl } = req.body as { fileName?: string; dataUrl?: string };
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      res.status(400).json({ error: 'Invalid file data.' });
      return;
    }

    const match = /^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
      res.status(400).json({ error: 'Malformed base64 upload.' });
      return;
    }

    const mime = match[1];
    const base64Body = match[2];
    const allowedMimes: Record<string, { ext: string; type: 'image' | 'pdf' }> = {
      'image/jpeg': { ext: '.jpg', type: 'image' },
      'image/jpg': { ext: '.jpg', type: 'image' },
      'image/png': { ext: '.png', type: 'image' },
      'image/webp': { ext: '.webp', type: 'image' },
      'application/pdf': { ext: '.pdf', type: 'pdf' },
    };

    const meta = allowedMimes[mime];
    if (!meta) {
      res.status(400).json({ error: 'Only JPG, PNG, WebP images and PDF files are allowed.' });
      return;
    }

    const safeBase = (fileName || 'asset')
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .slice(0, 40);
    const storedName = `${safeBase || 'asset'}-${Date.now()}${meta.ext}`;
    const targetPath = path.join(UPLOADS_DIR, storedName);

    fs.writeFileSync(targetPath, Buffer.from(base64Body, 'base64'));
    res.status(201).json({
      url: `/uploads/${storedName}`,
      fileType: meta.type,
    });
  });

  // Mount Vite in dev or serve static dist in production
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(ROOT_DIR, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Muhammad Khan Portfolio running on http://localhost:${PORT}`);
  });
}

startServer();
