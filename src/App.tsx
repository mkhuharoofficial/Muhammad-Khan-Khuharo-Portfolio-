/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { DEFAULT_PORTFOLIO_DATA } from './data/defaultPortfolio';
import type { OnlineCourseCertificate, PortfolioData } from './types/portfolio';
import { generateResumePdf } from './utils/generateResumePdf';
import { Navbar, NAV_ITEMS } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutAndJourney } from './components/AboutAndJourney';
import { ResumeAndCertifications } from './components/ResumeAndCertifications';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsAndGithub } from './components/ProjectsAndGithub';
import { ExperienceSection } from './components/ExperienceSection';
import { AchievementsSection } from './components/AchievementsSection';
import { BlogSection } from './components/BlogSection';
import { ContactAndFooter } from './components/ContactAndFooter';
import { CertificatePreviewModal } from './components/CertificatePreviewModal';
import { AdminStudioModal, type StudioTab } from './components/AdminStudioModal';

export default function App() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [showIntroLoader, setShowIntroLoader] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  const [adminToken, setAdminToken] = useState<string>(() => {
    try {
      return sessionStorage.getItem('mk-admin-token') || '';
    } catch {
      return '';
    }
  });

  const [studioOpen, setStudioOpen] = useState(false);
  const [studioTab, setStudioTab] = useState<StudioTab>('profile');
  const [studioBlogId, setStudioBlogId] = useState<string | undefined>(undefined);

  const [previewDoc, setPreviewDoc] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    fileUrl?: string;
    fileType?: 'image' | 'pdf' | '';
    externalUrl?: string;
  }>({
    isOpen: false,
    title: '',
  });

  // Brief, lightweight loading screen (dismisses automatically in 550ms)
  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntroLoader(false), 550);
    return () => window.clearTimeout(timer);
  }, []);

  // Load persisted portfolio data from backend
  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: PortfolioData | null) => {
        if (data && data.profile) {
          setPortfolio(data);
        }
      })
      .catch(() => {});
  }, []);

  // Verify stored admin session token if present
  useEffect(() => {
    if (!adminToken) return;
    fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => {
        if (!res.ok) handleAuthChange('');
      })
      .catch(() => {});
  }, [adminToken]);

  // Active section scroll spy
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('mk-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('mk-theme', 'light');
      }
      return next;
    });
  };

  const handleAuthChange = (token: string) => {
    setAdminToken(token);
    try {
      if (token) {
        sessionStorage.setItem('mk-admin-token', token);
      } else {
        sessionStorage.removeItem('mk-admin-token');
      }
    } catch {
      // Ignore storage errors
    }
  };

  const handleSavePortfolio = async (updated: PortfolioData) => {
    const res = await fetch('/api/admin/portfolio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updated),
    });
    const data = (await res.json()) as { portfolio?: PortfolioData; error?: string };
    if (!res.ok || !data.portfolio) {
      throw new Error(data.error || 'Failed to save portfolio updates.');
    }
    setPortfolio(data.portfolio);
  };

  const handleOpenStudio = (tab: StudioTab = 'profile', blogId?: string) => {
    setStudioTab(tab);
    setStudioBlogId(blogId);
    setStudioOpen(true);
  };

  const handlePreviewCertificate = (cert: OnlineCourseCertificate) => {
    setPreviewDoc({
      isOpen: true,
      title: cert.title,
      subtitle: `${cert.institution} · ${cert.year}`,
      fileUrl: cert.certificateFileUrl,
      fileType: cert.certificateFileType,
      externalUrl: cert.verificationUrl,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060d1f] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Lightweight Animated Loading Screen */}
      <AnimatePresence>
        {showIntroLoader && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060d1f] text-white"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-2"
            >
              <p className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                MUHAMMAD KHAN
              </p>
              <p className="font-mono text-xs tracking-[0.26em] text-blue-400">
                LEARN. BUILD. INNOVATE.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onDownloadCv={() => generateResumePdf(portfolio)}
        activeSection={activeSection}
      />

      <main className="flex-1">
        <HeroSection
          profile={portfolio.profile}
          isAdmin={Boolean(adminToken)}
          onOpenStudioPortrait={() => handleOpenStudio('profile')}
        />

        <AboutAndJourney
          profile={portfolio.profile}
          education={portfolio.education}
        />

        <ResumeAndCertifications
          courses={portfolio.onlineCourses}
          onDownloadCv={() => generateResumePdf(portfolio)}
          onPreviewCertificate={handlePreviewCertificate}
        />

        <SkillsSection skills={portfolio.skills} />

        <ProjectsAndGithub
          projects={portfolio.projects}
          profile={portfolio.profile}
          isAdmin={Boolean(adminToken)}
          onPreviewImage={(title, subtitle, fileUrl, externalUrl) =>
            setPreviewDoc({
              isOpen: true,
              title,
              subtitle,
              fileUrl,
              fileType: 'image',
              externalUrl,
            })
          }
          onOpenStudioProjects={() => handleOpenStudio('projects')}
        />

        <ExperienceSection experience={portfolio.experience} />

        <AchievementsSection
          awards={portfolio.awards}
          otherQualifications={portfolio.otherQualifications}
          onPreviewDocument={(doc) =>
            setPreviewDoc({
              isOpen: true,
              title: doc.title,
              subtitle: doc.subtitle,
              fileUrl: doc.fileUrl,
              fileType: doc.fileType,
            })
          }
        />

        <BlogSection
          posts={portfolio.blogPosts}
          isAdmin={Boolean(adminToken)}
          onOpenBlogStudio={(postId) => handleOpenStudio('blog', postId)}
        />

        <ContactAndFooter
          profile={portfolio.profile}
          isAdmin={Boolean(adminToken)}
          onOpenStudio={() => handleOpenStudio('profile')}
        />
      </main>

      <CertificatePreviewModal
        isOpen={previewDoc.isOpen}
        onClose={() => setPreviewDoc((prev) => ({ ...prev, isOpen: false }))}
        title={previewDoc.title}
        subtitle={previewDoc.subtitle}
        fileUrl={previewDoc.fileUrl}
        fileType={previewDoc.fileType}
        externalUrl={previewDoc.externalUrl}
      />

      <AdminStudioModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        initialTab={studioTab}
        initialBlogPostId={studioBlogId}
        portfolio={portfolio}
        onSavePortfolio={handleSavePortfolio}
        adminToken={adminToken}
        onAuthChange={handleAuthChange}
      />
    </div>
  );
}
