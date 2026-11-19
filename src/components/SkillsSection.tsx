import { motion } from 'motion/react';
import { Brain, Code2, Globe, Layers } from 'lucide-react';
import type { SkillCategory, SkillItem } from '../types/portfolio';

interface SkillsSectionProps {
  skills: SkillItem[];
}

const CATEGORY_META: Array<{
  category: SkillCategory;
  icon: typeof Code2;
}> = [
  { category: 'Programming', icon: Code2 },
  { category: 'AI & Machine Learning', icon: Brain },
  { category: 'Web Development', icon: Globe },
  { category: 'Other', icon: Layers },
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section
      id="skills"
      className="py-20 bg-slate-50 dark:bg-[#071024] border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            Technical Capabilities
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
            My Technical Skills
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
            Core competencies developed through structured coursework, hands-on projects, and continuous practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORY_META.map((group, groupIdx) => {
            const items = skills.filter((s) => s.category === group.category);
            if (items.length === 0) return null;
            const Icon = group.icon;

            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: groupIdx * 0.07 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b152c] p-6 sm:p-7"
              >
                <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-200/80 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/70 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {group.category}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {items.length} skills
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {items.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-xl bg-slate-50 dark:bg-[#071024] border border-slate-200/70 dark:border-slate-800/90 p-4 hover:border-blue-400/70 dark:hover:border-blue-500/60 transition-colors"
                    >
                      <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-white">
                        {skill.name}
                      </h4>
                      {skill.description && (
                        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
