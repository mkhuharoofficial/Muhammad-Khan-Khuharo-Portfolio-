import { motion } from 'motion/react';
import { BookOpen, Compass, GraduationCap } from 'lucide-react';
import type { EducationItem, PortfolioProfile } from '../types/portfolio';

interface AboutAndJourneyProps {
  profile: PortfolioProfile;
  education: EducationItem[];
}

export function AboutAndJourney({ profile, education }: AboutAndJourneyProps) {
  return (
    <>
      {/* About Me Section */}
      <section
        id="about"
        className="py-20 bg-white dark:bg-[#060d1f] border-b border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-5 space-y-4"
            >
              <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                About Me
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
                Driven by curiosity, continuous learning, and real-world building.
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {profile.headline}
              </p>
              <div className="pt-2 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    Connecting classroom fundamentals with practical AI and web development.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    Sharing knowledge through mathematics instruction and student career mentoring.
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0b152c]/80 p-6 sm:p-8 space-y-4">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                  Personal Introduction
                </h3>
                {profile.introduction.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b152c] p-6 sm:p-8 space-y-4">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                  Philosophy &amp; Focus
                </h3>
                {profile.aboutParagraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Educational Journey Timeline */}
      <section
        id="journey"
        className="py-20 bg-slate-50 dark:bg-[#071024] border-b border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              My Journey
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              Educational Journey
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
              Academic milestones in Shikarpur that built my foundation in science, analytical thinking, and information technology.
            </p>
          </div>

          <div className="relative pl-8 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-blue-600 before:via-blue-400/60 before:to-transparent">
            {education.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative"
              >
                <div
                  aria-hidden="true"
                  className="absolute -left-8 sm:-left-10 top-5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#0b152c] border-2 border-blue-600 dark:border-blue-400 flex items-center justify-center shadow-sm"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b152c] p-6 sm:p-7 hover:border-blue-400/70 dark:hover:border-blue-500/60 transition-colors">
                  <p className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400">
                    {item.period}
                  </p>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1.5">
                    {item.institution}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
