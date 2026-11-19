import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, FileText, Github, Linkedin, Mail, MapPin, Upload } from 'lucide-react';
import type { PortfolioProfile } from '../types/portfolio';

interface HeroSectionProps {
  profile: PortfolioProfile;
  isAdmin: boolean;
  onOpenStudioPortrait: () => void;
}

export function HeroSection({
  profile,
  isAdmin,
  onOpenStudioPortrait,
}: HeroSectionProps) {
  const titles =
    profile.animatedTitles.length > 0
      ? profile.animatedTitles
      : [
          'AI Enthusiast',
          'Aspiring AI Developer',
          'Computer Science Enthusiast',
          'Software Developer',
        ];
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [titles.length]);

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-blue-50/70 via-white to-slate-50 dark:from-[#0a1633] dark:via-[#071024] dark:to-[#060d1f]"
    >
      {/* Subtle Ambient Blue Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-0 w-[34rem] h-[34rem] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-sky-400/10 dark:bg-blue-500/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Identity & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <p className="font-mono text-xs sm:text-sm font-medium tracking-[0.22em] text-blue-600 dark:text-blue-400">
              HELLO EVERYONE, I AM
            </p>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] text-balance">
              MUHAMMAD KHAN
            </h1>

            <div className="h-9 sm:h-10 flex items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={titles[titleIndex]}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-xl sm:text-2xl font-semibold text-blue-600 dark:text-blue-400"
                >
                  {titles[titleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {profile.heroDescription}
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                <span>Explore My Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#resume"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-[#0b152c]/80 text-slate-900 dark:text-slate-100 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all whitespace-nowrap"
              >
                <FileText className="w-4 h-4" />
                <span>View My Resume</span>
              </a>
            </div>

            {/* Direct Profile Links */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{profile.location}</span>
              </span>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Portrait inside Animated Blue Circular Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              {/* Outer Glowing Halo */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-blue-500/20 dark:bg-blue-500/25 blur-2xl"
              />

              {/* Rotating Blue Orbital Ring 1 */}
              <div
                aria-hidden="true"
                className="absolute inset-1 rounded-full border-2 border-dashed border-blue-500/40 dark:border-blue-400/40 animate-orbit-slow"
              />

              {/* Rotating Gradient Arc Ring 2 */}
              <div
                aria-hidden="true"
                className="absolute inset-4 rounded-full p-[3px] bg-gradient-to-tr from-blue-600 via-sky-400 to-blue-900/40 animate-orbit-reverse"
              >
                <div className="w-full h-full rounded-full bg-slate-50 dark:bg-[#071024]" />
              </div>

              {/* Inner Portrait Frame */}
              <div className="relative z-10 w-56 h-56 sm:w-68 sm:h-68 rounded-full overflow-hidden border-4 border-white dark:border-[#0f1d3a] shadow-2xl shadow-blue-900/20 bg-gradient-to-br from-slate-100 to-blue-50 dark:from-[#0b152c] dark:to-[#0f224a] flex items-center justify-center">
                {profile.portraitUrl ? (
                  <img
                    src={profile.portraitUrl}
                    alt={`${profile.fullName} portrait`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
                    <div className="w-20 h-20 rounded-full border border-blue-500/30 bg-blue-600/10 dark:bg-blue-500/15 flex items-center justify-center mb-3">
                      <span className="font-display text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
                        MK
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      Muhammad Khan
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Personal portrait slot
                    </p>
                    <button
                      type="button"
                      onClick={onOpenStudioPortrait}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-blue-600/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{isAdmin ? 'Upload Photo' : 'Upload in Studio'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width 4-Column Identity Summary Strip */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-[#0b152c]/80 backdrop-blur-sm p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Location
            </p>
            <p className="font-display text-base font-semibold text-slate-900 dark:text-white mt-1">
              Shikarpur, Sindh, Pakistan
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-[#0b152c]/80 backdrop-blur-sm p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Verified Online Courses
            </p>
            <p className="font-display text-base font-semibold text-slate-900 dark:text-white mt-1 tabular-nums">
              10 Coursera Certifications
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-[#0b152c]/80 backdrop-blur-sm p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Live Web Applications
            </p>
            <p className="font-display text-base font-semibold text-slate-900 dark:text-white mt-1">
              DreamPath AI · Health Guide · ThumbForge
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-[#0b152c]/80 backdrop-blur-sm p-5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Guiding Motto
            </p>
            <p className="font-display text-base font-bold tracking-wide text-blue-600 dark:text-blue-400 mt-1">
              {profile.tagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
