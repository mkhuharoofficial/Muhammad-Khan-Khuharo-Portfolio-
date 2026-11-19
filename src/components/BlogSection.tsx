import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Edit3, Plus, X } from 'lucide-react';
import type { BlogPost } from '../types/portfolio';

interface BlogSectionProps {
  posts: BlogPost[];
  isAdmin: boolean;
  onOpenBlogStudio: (postId?: string) => void;
}

export function BlogSection({ posts, isAdmin, onOpenBlogStudio }: BlogSectionProps) {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (!activePost) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePost(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activePost]);

  const publishedPosts = posts.filter((p) => p.status === 'published');
  const draftTopics = posts.filter((p) => p.status === 'draft');

  return (
    <section
      id="blog"
      className="py-20 bg-slate-50 dark:bg-[#071024] border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              Blog &amp; Writing
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              My Learning Journey
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
              Reflections, learning notes, and upcoming topics covering Artificial Intelligence, Python, and real-world software building.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenBlogStudio()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b152c] text-slate-800 dark:text-slate-100 hover:border-blue-500 transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{isAdmin ? 'Manage & Publish Articles' : 'Write / Manage Articles'}</span>
          </button>
        </div>

        {/* Published Articles */}
        {publishedPosts.length > 0 && (
          <div className="mb-12">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-5">
              Published Articles ({publishedPosts.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b152c] p-6 flex flex-col justify-between gap-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {post.topic}
                      </span>
                      <span className="font-mono tabular-nums">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : 'Published'}
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {post.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setActivePost(post)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Article</span>
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onOpenBlogStudio(post.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Topics (Clearly labeled as planned / suggested topics, not fabricated published articles) */}
        {draftTopics.length > 0 && (
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Planned &amp; Suggested Article Topics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {draftTopics.map((topic, idx) => (
                <motion.article
                  key={topic.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-[#0b152c]/70 p-6 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        {topic.topic}
                      </span>
                      <span>Suggested Topic · Draft</span>
                    </div>
                    <h4 className="font-display text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {topic.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {topic.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800/80">
                    <button
                      type="button"
                      onClick={() => onOpenBlogStudio(topic.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Draft &amp; Publish in Studio</span>
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {activePost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActivePost(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b152c] shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {activePost.topic}
                  {activePost.publishedAt
                    ? ` · ${new Date(activePost.publishedAt).toLocaleDateString()}`
                    : ''}
                </p>
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {activePost.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {activePost.content || activePost.excerpt}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
