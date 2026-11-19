import { useState } from 'react';
import { motion } from 'motion/react';
import { Award, Download, ExternalLink, Eye, FileCheck2 } from 'lucide-react';
import type { CertificateCategory, OnlineCourseCertificate } from '../types/portfolio';

interface ResumeAndCertificationsProps {
  courses: OnlineCourseCertificate[];
  onDownloadCv: () => void;
  onPreviewCertificate: (cert: OnlineCourseCertificate) => void;
}

const CATEGORY_ORDER: Array<{ code: string; label: CertificateCategory }> = [
  { code: 'A1', label: 'Python & Programming' },
  { code: 'A2', label: 'Mathematics & Computer Science' },
  { code: 'A3', label: 'Artificial Intelligence & Machine Learning' },
  { code: 'A4', label: 'IT & Cybersecurity' },
  { code: 'A5', label: 'English Language & Communication' },
];

export function ResumeAndCertifications({
  courses,
  onDownloadCv,
  onPreviewCertificate,
}: ResumeAndCertificationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | CertificateCategory>('ALL');

  const visibleCategories =
    selectedCategory === 'ALL'
      ? CATEGORY_ORDER
      : CATEGORY_ORDER.filter((c) => c.label === selectedCategory);

  return (
    <section
      id="resume"
      className="py-20 bg-white dark:bg-[#060d1f] border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Resume Header & ATS PDF Download */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-50/90 via-white to-slate-50 dark:from-[#0d1c3d] dark:via-[#0b152c] dark:to-[#071024] p-6 sm:p-10 mb-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              Curriculum Vitae &amp; Verified Credentials
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Resume &amp; Online Course Certifications
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Structured in ATS-friendly order with verified Coursera coursework in Python, Mathematics for Computer Science, Artificial Intelligence, IT Security, and English Communication.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onDownloadCv}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Resume</span>
            </button>
          </div>
        </div>

        {/* Certifications Anchor */}
        <div id="certifications" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                Category A · Subject-Area Online Study Courses
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1.5">
                Verified Coursera Certifications ({courses.length})
              </h3>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0b152c] border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === 'ALL'
                    ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({courses.length})
              </button>
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat.code}
                  type="button"
                  onClick={() => setSelectedCategory(cat.label)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === cat.label
                      ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {cat.code}. {cat.label.split(' & ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Categorized Certificate Groups */}
          <div className="space-y-10">
            {visibleCategories.map((cat) => {
              const items = courses.filter((c) => c.category === cat.label);
              if (items.length === 0) return null;

              return (
                <div key={cat.code} className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {cat.code}
                    </span>
                    <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {cat.label}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((cert, idx) => (
                      <motion.article
                        key={cert.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0b152c] p-5 sm:p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {cert.institution}
                            </span>
                            <span className="font-mono tabular-nums">{cert.year}</span>
                          </div>
                          <h5 className="font-display text-base sm:text-lg font-semibold text-slate-900 dark:text-white leading-snug">
                            {cert.title}
                          </h5>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
                          <a
                            href={cert.verificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                          >
                            <FileCheck2 className="w-3.5 h-3.5" />
                            <span>Verify Certificate</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            type="button"
                            onClick={() => onPreviewCertificate(cert)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
                          >
                            {cert.certificateFileUrl ? (
                              <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Uploaded Copy</span>
                              </>
                            ) : (
                              <>
                                <Award className="w-3.5 h-3.5" />
                                <span>Certificate Preview</span>
                              </>
                            )}
                          </button>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
