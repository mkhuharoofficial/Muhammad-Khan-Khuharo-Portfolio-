import { useState, type FormEvent } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Send,
  AlertCircle,
} from 'lucide-react';
import type { PortfolioProfile } from '../types/portfolio';

interface ContactAndFooterProps {
  profile: PortfolioProfile;
  isAdmin: boolean;
  onOpenStudio: () => void;
}

export function ContactAndFooter({
  profile,
  isAdmin,
  onOpenStudio,
}: ContactAndFooterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        setFeedback({
          type: 'error',
          text: data.error || 'Unable to send message. Please check your entries.',
        });
      } else {
        setFeedback({
          type: 'success',
          text:
            data.message ||
            'Thank you! Your message has been received by Muhammad Khan.',
        });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch {
      setFeedback({
        type: 'error',
        text: 'Network error while sending message. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section
        id="contact"
        className="py-20 bg-white dark:bg-[#060d1f] border-b border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              Get In Touch
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              Contact &amp; Direct Links
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
              Open to learning collaborations, AI and web development opportunities, and educational discussions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Direct Profile & Project Links */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0b152c] p-6 space-y-5">
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Direct Contact
                </h3>

                <div className="space-y-4 text-sm">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-start gap-3 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                      <p className="font-medium break-all">{profile.email}</p>
                    </div>
                  </a>

                  <div className="flex items-start gap-3 text-slate-700 dark:text-slate-200">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                      <p className="font-medium">{profile.location}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Professional Profiles
                  </p>
                  <div className="flex flex-col gap-2.5 text-sm">
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071024] text-slate-800 dark:text-slate-100 hover:border-blue-500 transition-colors"
                    >
                      <span className="inline-flex items-center gap-2.5 font-medium">
                        <Github className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>GitHub · mkhuharoofficial</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>

                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071024] text-slate-800 dark:text-slate-100 hover:border-blue-500 transition-colors"
                    >
                      <span className="inline-flex items-center gap-2.5 font-medium">
                        <Linkedin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>LinkedIn · Muhammad Khan</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Live Deployed Projects
                  </p>
                  <div className="flex flex-col gap-2 text-sm">
                    <a
                      href="https://dreampathai.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                    >
                      <span className="font-medium">DreamPath AI</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <a
                      href="https://health-guide-app.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                    >
                      <span className="font-medium">Health Guide App</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                    <a
                      href="https://thumb-forge-beta.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1"
                    >
                      <span className="font-medium">ThumbForge</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Functional Contact Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0b152c] p-6 sm:p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Project inquiry, collaboration, or message"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-y"
                  />
                </div>

                {feedback && (
                  <div
                    role="status"
                    className={`flex items-start gap-2.5 p-4 rounded-xl text-sm ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{feedback.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-md shadow-blue-600/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Portfolio Footer */}
      <footer className="bg-slate-50 dark:bg-[#050b1a] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              MUHAMMAD KHAN
            </p>
            <p className="font-mono text-xs font-semibold tracking-widest text-blue-600 dark:text-blue-400 mt-1">
              {profile.tagline}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Shikarpur, Sindh, Pakistan · © {new Date().getFullYear()} Muhammad Khan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
            <a href="#home" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </a>
            <a href="#resume" className="hover:text-blue-600 dark:hover:text-blue-400">
              Resume
            </a>
            <a href="#projects" className="hover:text-blue-600 dark:hover:text-blue-400">
              Projects
            </a>
            <a href="#certifications" className="hover:text-blue-600 dark:hover:text-blue-400">
              Certifications
            </a>
            <a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400">
              Contact
            </a>
            <button
              type="button"
              onClick={onOpenStudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b152c] text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isAdmin ? 'Portfolio Studio (Unlocked)' : 'Portfolio Studio'}</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
