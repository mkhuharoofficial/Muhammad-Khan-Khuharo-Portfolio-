import { motion } from 'motion/react';
import { Briefcase } from 'lucide-react';
import type { ExperienceItem } from '../types/portfolio';

interface ExperienceSectionProps {
  experience: ExperienceItem[];
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      className="py-20 bg-slate-50 dark:bg-[#071024] border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            Experience &amp; Community Service
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
            Work &amp; Community Experience
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
            Teaching, community welfare assistance, and guiding students toward educational and career pathways.
          </p>
        </div>

        <div className="relative pl-8 sm:pl-10 space-y-8 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-blue-600 before:via-blue-400/60 before:to-transparent">
          {experience.map((item, idx) => (
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
                <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b152c] p-6 sm:p-7 hover:border-blue-400/70 dark:hover:border-blue-500/60 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {item.organization}
                  </span>
                  <span className="font-mono tabular-nums">{item.period}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mt-1.5">
                  {item.position}
                </h3>
                <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
