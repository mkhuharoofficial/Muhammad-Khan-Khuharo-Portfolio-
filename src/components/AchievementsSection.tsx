import { motion } from 'motion/react';
import { Award, Eye, FileText, Medal, Trophy } from 'lucide-react';
import type { AwardItem, OtherQualificationItem } from '../types/portfolio';

interface AchievementsSectionProps {
  awards: AwardItem[];
  otherQualifications: OtherQualificationItem[];
  onPreviewDocument: (item: {
    title: string;
    subtitle: string;
    fileUrl?: string;
    fileType?: 'image' | 'pdf' | '';
  }) => void;
}

export function AchievementsSection({
  awards,
  otherQualifications,
  onPreviewDocument,
}: AchievementsSectionProps) {
  const steamCompetition = awards.filter((a) => a.isSteamCompetition);
  const otherAwards = awards.filter((a) => !a.isSteamCompetition);

  return (
    <section
      id="achievements"
      className="py-20 bg-white dark:bg-[#060d1f] border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Competition Recognition & Awards */}
        <div>
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              Awards &amp; Competition Recognition
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              Achievements &amp; Honors
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
              Academic recognition, science and technology competitions, and public speaking honors.
            </p>
          </div>

          {/* Primary Science, Technology & Mathematics Competition */}
          {steamCompetition.map((steam) => (
            <motion.div
              key={steam.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-blue-200 dark:border-blue-900/70 bg-gradient-to-br from-blue-50/80 via-white to-slate-50 dark:from-[#0d1c3d] dark:via-[#0b152c] dark:to-[#071024] p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    Science, Technology &amp; Mathematics Competition ·{' '}
                    <span className="font-mono tabular-nums">{steam.year}</span>
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {steam.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Organizer: {steam.issuer}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onPreviewDocument({
                    title: steam.title,
                    subtitle: `${steam.issuer} · ${steam.year}`,
                    fileUrl: steam.certificateFileUrl,
                    fileType: steam.certificateFileType,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-blue-300 dark:border-blue-800 bg-white dark:bg-[#071024] text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors whitespace-nowrap self-start md:self-auto"
              >
                <Eye className="w-4 h-4" />
                <span>
                  {steam.certificateFileUrl ? 'View Certificate' : 'Certificate Preview'}
                </span>
              </button>
            </motion.div>
          ))}

          {/* Other Awards and Certificates */}
          <div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-5">
              Other Awards &amp; Certificates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherAwards.map((award, idx) => (
                <motion.article
                  key={award.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0b152c] p-5 sm:p-6 flex flex-col justify-between gap-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
                        <Medal className="w-3.5 h-3.5" />
                        <span>Award</span>
                      </span>
                      <span className="font-mono tabular-nums">{award.year}</span>
                    </div>
                    <h4 className="font-display text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {award.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Issued by: {award.issuer}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() =>
                        onPreviewDocument({
                          title: award.title,
                          subtitle: `${award.issuer} · ${award.year}`,
                          fileUrl: award.certificateFileUrl,
                          fileType: award.certificateFileType,
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>
                        {award.certificateFileUrl
                          ? 'View Uploaded Certificate'
                          : 'Certificate File Slot'}
                      </span>
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>

        {/* Other Qualifications and Certificates (Below online courses & competition awards) */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl mb-8">
            <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              Additional Credentials
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1.5">
              Other Qualifications &amp; Certificates
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherQualifications.map((qual, idx) => (
              <motion.article
                key={qual.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b152c] p-5 sm:p-6 flex flex-col justify-between gap-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
                      <Award className="w-3.5 h-3.5" />
                      <span>Qualification</span>
                    </span>
                    <span className="font-mono tabular-nums">{qual.year}</span>
                  </div>
                  <h4 className="font-display text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {qual.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {qual.institution}
                    {qual.issuedBy ? ` · Issued by: ${qual.issuedBy}` : ''}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() =>
                      onPreviewDocument({
                        title: qual.title,
                        subtitle: `${qual.institution} · ${qual.year}`,
                        fileUrl: qual.certificateFileUrl,
                        fileType: qual.certificateFileType,
                      })
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>
                      {qual.certificateFileUrl
                        ? 'View Uploaded Certificate'
                        : 'Certificate File Slot'}
                    </span>
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
