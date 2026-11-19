import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  FolderGit2,
  Github,
  Image as ImageIcon,
  Rocket,
  Sparkles,
  Upload,
} from 'lucide-react';
import type { GitHubRepo, PortfolioProfile, ProjectItem } from '../types/portfolio';

interface ProjectsAndGithubProps {
  projects: ProjectItem[];
  profile: PortfolioProfile;
  isAdmin: boolean;
  onPreviewImage: (title: string, subtitle: string, imageUrl: string, liveUrl?: string) => void;
  onOpenStudioProjects: () => void;
}

export function ProjectsAndGithub({
  projects,
  profile,
  isAdmin,
  onPreviewImage,
  onOpenStudioProjects,
}: ProjectsAndGithubProps) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [repoError, setRepoError] = useState('');

  useEffect(() => {
    let active = true;
    setLoadingRepos(true);
    fetch('/api/github-repos')
      .then(async (res) => {
        const data = (await res.json()) as { repos?: GitHubRepo[]; error?: string };
        if (!active) return;
        if (!res.ok) {
          setRepoError(data.error || 'Could not load public repositories right now.');
          setRepos([]);
        } else {
          setRepos(data.repos || []);
          setRepoError('');
        }
      })
      .catch(() => {
        if (!active) return;
        setRepoError('Could not connect to GitHub API right now.');
      })
      .finally(() => {
        if (active) setLoadingRepos(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);
  const additionalProjects = projects.filter((p) => !p.featured);

  return (
    <section
      id="projects"
      className="py-20 bg-white dark:bg-[#060d1f] border-b border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Featured Project Participation */}
        <div>
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
              Project Participation
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
              Featured AI &amp; Web Applications
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
              Real-world applications designed, developed, and deployed to support students, healthcare guidance, and digital workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project, idx) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0b152c] overflow-hidden flex flex-col hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                {/* Project Screenshot Slot */}
                <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-slate-100 via-blue-50/60 to-slate-200/70 dark:from-[#081229] dark:via-[#0d1c3d] dark:to-[#060d1f] border-b border-slate-200 dark:border-slate-800 overflow-hidden group">
                  {project.imageUrl ? (
                    <button
                      type="button"
                      onClick={() =>
                        onPreviewImage(
                          project.title,
                          `Project Screenshot · ${project.year}`,
                          project.imageUrl || '',
                          project.liveUrl
                        )
                      }
                      className="w-full h-full block cursor-zoom-in"
                      aria-label={`Preview ${project.title} screenshot`}
                    >
                      <img
                        src={project.imageUrl}
                        alt={`${project.title} screenshot`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </button>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="font-display text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {project.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                        Project screenshot ready for upload in Portfolio Studio
                      </p>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={onOpenStudioProjects}
                          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Screenshot</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Project Body */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-medium text-blue-600 dark:text-blue-400 tabular-nums">
                        {project.year}
                      </span>
                      <span>Featured Application</span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                      {project.title}
                    </h3>

                    <div className="space-y-2.5 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {project.description}
                    </div>

                    {project.techStack.length > 0 && (
                      <p className="pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {project.techStack.join(' · ')}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        <span>Visit Live Website</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 transition-colors whitespace-nowrap"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Additional Projects + Upcoming Card */}
        <div>
          <h3 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Additional Projects &amp; Explorations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalProjects.map((project, idx) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b152c] overflow-hidden flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                {project.imageUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      onPreviewImage(
                        project.title,
                        `Project Screenshot · ${project.year}`,
                        project.imageUrl || '',
                        project.liveUrl
                      )
                    }
                    className="aspect-[16/9] w-full overflow-hidden border-b border-slate-200 dark:border-slate-800 cursor-zoom-in"
                  >
                    <img
                      src={project.imageUrl}
                      alt={`${project.title} screenshot`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                        {project.year}
                      </span>
                      <span>Web Project</span>
                    </div>
                    <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                      {project.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {project.description}
                    </p>
                    {project.techStack.length > 0 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                        {project.techStack.join(' · ')}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                      >
                        <span>Visit Live Project</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    ) : project.title.toLowerCase().includes('portfolio') ? (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {profile.portfolioUrl ? (
                          <a
                            href={profile.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <span>View Live Portfolio</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          'Currently viewing this website'
                        )}
                      </span>
                    ) : null}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}

            {/* Elegant Upcoming Projects Card */}
            <article className="rounded-2xl border border-dashed border-blue-300 dark:border-blue-800/80 bg-blue-50/40 dark:bg-[#091532]/70 p-6 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Rocket className="w-5 h-5" />
                </div>
                <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Upcoming Projects
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Continuously exploring new AI-assisted tools, Python applications, and student-centered software built to solve practical problems.
                </p>
              </div>
              <div className="pt-3 border-t border-blue-200/70 dark:border-blue-900/60 flex items-center justify-between text-xs text-blue-700 dark:text-blue-300 font-medium">
                <span>In Exploration</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </article>
          </div>
        </div>

        {/* Live GitHub Profile & Repositories */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0b152c] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  GitHub Repositories
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Live public repositories from github.com/mkhuharoofficial
                </p>
              </div>
            </div>

            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity whitespace-nowrap self-start sm:self-auto"
            >
              <Github className="w-4 h-4" />
              <span>Visit GitHub Profile</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-6">
            {loadingRepos ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#071024]/60 animate-pulse p-4"
                  />
                ))}
              </div>
            ) : repoError ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071024] p-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {repoError} You can browse all public repositories directly on GitHub.
                </p>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>{profile.githubUrl}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : repos.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071024] p-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  No public repositories are currently listed via the GitHub API.
                </p>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Open GitHub Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#071024] p-5 hover:border-blue-500 transition-colors flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          <FolderGit2 className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                          <span className="truncate">{repo.name}</span>
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {repo.description || 'Repository hosted on GitHub.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span>{repo.language || 'Repository'}</span>
                      <span className="font-mono tabular-nums">
                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
