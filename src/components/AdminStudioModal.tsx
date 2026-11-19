import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  CheckCircle2,
  Inbox,
  Lock,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type {
  BlogPost,
  CertificateCategory,
  ContactMessage,
  OnlineCourseCertificate,
  PortfolioData,
  ProjectItem,
} from '../types/portfolio';

export type StudioTab =
  | 'profile'
  | 'projects'
  | 'certificates'
  | 'awards'
  | 'experience'
  | 'blog'
  | 'inbox';

interface AdminStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: StudioTab;
  initialBlogPostId?: string;
  portfolio: PortfolioData;
  onSavePortfolio: (updated: PortfolioData) => Promise<void>;
  adminToken: string;
  onAuthChange: (token: string) => void;
}

const CATEGORY_CODE_MAP: Record<CertificateCategory, 'A1' | 'A2' | 'A3' | 'A4' | 'A5'> = {
  'Python & Programming': 'A1',
  'Mathematics & Computer Science': 'A2',
  'Artificial Intelligence & Machine Learning': 'A3',
  'IT & Cybersecurity': 'A4',
  'English Language & Communication': 'A5',
};

export function AdminStudioModal({
  isOpen,
  onClose,
  initialTab = 'profile',
  initialBlogPostId,
  portfolio,
  onSavePortfolio,
  adminToken,
  onAuthChange,
}: AdminStudioModalProps) {
  const [tab, setTab] = useState<StudioTab>(initialTab);
  const [draft, setDraft] = useState<PortfolioData>(portfolio);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [uploadingKey, setUploadingKey] = useState('');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedBlogId, setSelectedBlogId] = useState<string>('');

  useEffect(() => {
    setDraft(portfolio);
  }, [portfolio]);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      if (initialBlogPostId) setSelectedBlogId(initialBlogPostId);
    }
  }, [isOpen, initialTab, initialBlogPostId]);

  useEffect(() => {
    if (!isOpen || !adminToken || tab !== 'inbox') return;
    fetch('/api/admin/messages', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => (res.ok ? res.json() : { messages: [] }))
      .then((data: { messages?: ContactMessage[] }) => setMessages(data.messages || []))
      .catch(() => {});
  }, [isOpen, adminToken, tab]);

  if (!isOpen) return null;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !data.token) {
        setAuthError(data.error || 'Invalid passcode.');
        return;
      }
      onAuthChange(data.token);
      setPasscode('');
    } catch {
      setAuthError('Could not verify passcode.');
    }
  };

  const handleUploadFile = async (
    file: File,
    key: string,
    onDone: (url: string, fileType: 'image' | 'pdf') => void
  ) => {
    setUploadingKey(key);
    setStatusMsg('');
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Read failed'));
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ fileName: file.name, dataUrl }),
      });
      const result = (await res.json()) as {
        url?: string;
        fileType?: 'image' | 'pdf';
        error?: string;
      };
      if (!res.ok || !result.url) {
        setStatusMsg(result.error || 'Upload failed.');
        return;
      }
      onDone(result.url, result.fileType || 'image');
      setStatusMsg('File uploaded! Click "Save All Changes" to publish.');
    } catch {
      setStatusMsg('Upload error. Use JPG, PNG, WebP, or PDF up to 10MB.');
    } finally {
      setUploadingKey('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg('');
    try {
      await onSavePortfolio(draft);
      setStatusMsg('Changes saved and published live.');
    } catch (err) {
      setStatusMsg(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (res.ok) {
      const data = (await res.json()) as { messages?: ContactMessage[] };
      setMessages(data.messages || []);
    }
  };

  const addProject = () => {
    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Project',
      year: String(new Date().getFullYear()),
      description: '',
      techStack: ['React', 'TypeScript'],
      liveUrl: '',
      githubUrl: '',
      imageUrl: '',
      featured: false,
    };
    setDraft((prev) => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const addCertificate = () => {
    const newCert: OnlineCourseCertificate = {
      id: `cert-${Date.now()}`,
      category: 'Artificial Intelligence & Machine Learning',
      categoryCode: 'A3',
      title: 'New Course Certificate',
      institution: '',
      year: String(new Date().getFullYear()),
      verificationUrl: 'https://coursera.org/verify/',
      certificateFileUrl: '',
      certificateFileType: '',
    };
    setDraft((prev) => ({
      ...prev,
      onlineCourses: [...prev.onlineCourses, newCert],
    }));
  };

  const addBlogPost = () => {
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: 'New Article Title',
      topic: 'Artificial Intelligence',
      excerpt: 'Short summary of this article.',
      content: '',
      publishedAt: new Date().toISOString(),
      status: 'published',
    };
    setDraft((prev) => ({ ...prev, blogPosts: [newPost, ...prev.blogPosts] }));
    setSelectedBlogId(newPost.id);
  };

  const activeBlog =
    draft.blogPosts.find((b) => b.id === selectedBlogId) || draft.blogPosts[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio Content Management Studio"
    >
      <div className="w-full max-w-5xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b152c] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Portfolio Studio · Content &amp; Media Manager
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload real photos, screenshots, certificates, and manage all portfolio content
            </p>
          </div>
          <div className="flex items-center gap-2">
            {adminToken && (
              <button
                type="button"
                onClick={() => onAuthChange('')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Gate */}
        {!adminToken ? (
          <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto w-full space-y-5 my-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Unlock Portfolio Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your server-configured <code className="font-mono">ADMIN_PASSCODE</code> to upload your portrait, project screenshots, certificate files, and publish blog articles. (Default dev passcode: <code className="font-mono">mk-admin-2026</code>)
              </p>
            </div>
            <input
              type="password"
              required
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter admin passcode"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm text-slate-900 dark:text-white"
            />
            {authError && <p className="text-xs text-rose-500">{authError}</p>}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Unlock Studio
            </button>
          </form>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#071024] overflow-x-auto">
              {(
                [
                  ['profile', 'Profile & Photo'],
                  ['projects', 'Projects & Screenshots'],
                  ['certificates', 'Online Certificates'],
                  ['awards', 'Awards & Qualifications'],
                  ['experience', 'Experience & Skills'],
                  ['blog', 'Blog Articles'],
                  ['inbox', 'Messages Inbox'],
                ] as Array<[StudioTab, string]>
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    tab === id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {tab === 'profile' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#071024] flex items-center justify-center shrink-0">
                        {draft.profile.portraitUrl ? (
                          <img
                            src={draft.profile.portraitUrl}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-display font-bold text-blue-600">MK</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          Personal Portrait Photograph
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Upload your real portrait photo (JPG, PNG, WebP)
                        </p>
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer whitespace-nowrap">
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {uploadingKey === 'portrait' ? 'Uploading...' : 'Upload Portrait'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleUploadFile(f, 'portrait', (url) =>
                              setDraft((prev) => ({
                                ...prev,
                                profile: { ...prev.profile, portraitUrl: url },
                              }))
                            );
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={draft.profile.email}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, email: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={draft.profile.location}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, location: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={draft.profile.githubUrl}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, githubUrl: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={draft.profile.linkedinUrl}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, linkedinUrl: e.target.value },
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Current Portfolio URL (optional — shown on Personal Portfolio project card if provided)
                      </label>
                      <input
                        type="url"
                        value={draft.profile.portfolioUrl}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            profile: { ...prev.profile, portfolioUrl: e.target.value },
                          }))
                        }
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {tab === 'projects' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      Projects ({draft.projects.length})
                    </h3>
                    <button
                      type="button"
                      onClick={addProject}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>

                  {draft.projects.map((proj, index) => (
                    <div
                      key={proj.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[index] = { ...proj, title: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm font-semibold"
                        />
                        <div className="flex items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 cursor-pointer hover:border-blue-500">
                            <Upload className="w-3.5 h-3.5 text-blue-600" />
                            <span>
                              {uploadingKey === proj.id
                                ? 'Uploading...'
                                : proj.imageUrl
                                  ? 'Replace Screenshot'
                                  : 'Upload Screenshot'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  handleUploadFile(f, proj.id, (url) => {
                                    const next = [...draft.projects];
                                    next[index] = { ...proj, imageUrl: url };
                                    setDraft((prev) => ({ ...prev, projects: next }));
                                  });
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setDraft({
                                ...draft,
                                projects: draft.projects.filter((p) => p.id !== proj.id),
                              })
                            }
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            aria-label="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={proj.year}
                          placeholder="Year"
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[index] = { ...proj, year: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                        />
                        <input
                          type="url"
                          value={proj.liveUrl}
                          placeholder="Live URL"
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[index] = { ...proj, liveUrl: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                        />
                        <input
                          type="url"
                          value={proj.githubUrl || ''}
                          placeholder="GitHub Repo URL (optional)"
                          onChange={(e) => {
                            const next = [...draft.projects];
                            next[index] = { ...proj, githubUrl: e.target.value };
                            setDraft({ ...draft, projects: next });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                        />
                      </div>

                      <textarea
                        rows={3}
                        value={proj.description}
                        placeholder="Project description"
                        onChange={(e) => {
                          const next = [...draft.projects];
                          next[index] = { ...proj, description: e.target.value };
                          setDraft({ ...draft, projects: next });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                      />
                    </div>
                  ))}
                </div>
              )}

              {tab === 'certificates' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      Online Course Certificates ({draft.onlineCourses.length})
                    </h3>
                    <button
                      type="button"
                      onClick={addCertificate}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Certificate</span>
                    </button>
                  </div>

                  {draft.onlineCourses.map((cert, idx) => (
                    <div
                      key={cert.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={cert.title}
                          onChange={(e) => {
                            const next = [...draft.onlineCourses];
                            next[idx] = { ...cert, title: e.target.value };
                            setDraft({ ...draft, onlineCourses: next });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs font-semibold"
                        />
                        <select
                          value={cert.category}
                          onChange={(e) => {
                            const category = e.target.value as CertificateCategory;
                            const next = [...draft.onlineCourses];
                            next[idx] = {
                              ...cert,
                              category,
                              categoryCode: CATEGORY_CODE_MAP[category],
                            };
                            setDraft({ ...draft, onlineCourses: next });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                        >
                          {Object.keys(CATEGORY_CODE_MAP).map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={cert.institution}
                          placeholder="Institution"
                          onChange={(e) => {
                            const next = [...draft.onlineCourses];
                            next[idx] = { ...cert, institution: e.target.value };
                            setDraft({ ...draft, onlineCourses: next });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                        />
                        <input
                          type="url"
                          value={cert.verificationUrl}
                          placeholder="Verification URL"
                          onChange={(e) => {
                            const next = [...draft.onlineCourses];
                            next[idx] = { ...cert, verificationUrl: e.target.value };
                            setDraft({ ...draft, onlineCourses: next });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 cursor-pointer hover:border-blue-500">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            {uploadingKey === cert.id
                              ? 'Uploading...'
                              : cert.certificateFileUrl
                                ? 'Replace Image/PDF'
                                : 'Upload Image/PDF'}
                          </span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                handleUploadFile(f, cert.id, (url, fileType) => {
                                  const next = [...draft.onlineCourses];
                                  next[idx] = {
                                    ...cert,
                                    certificateFileUrl: url,
                                    certificateFileType: fileType,
                                  };
                                  setDraft((prev) => ({ ...prev, onlineCourses: next }));
                                });
                              }
                            }}
                          />
                        </label>
                        {cert.certificateFileUrl && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                            File attached
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'awards' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      Competition &amp; Awards Certificates
                    </h3>
                    {draft.awards.map((award, idx) => (
                      <div
                        key={award.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {award.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {award.issuer} · {award.year}
                          </p>
                        </div>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 cursor-pointer hover:border-blue-500 shrink-0">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            {award.certificateFileUrl
                              ? 'Replace Certificate'
                              : 'Upload Image/PDF'}
                          </span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                handleUploadFile(f, award.id, (url, fileType) => {
                                  const next = [...draft.awards];
                                  next[idx] = {
                                    ...award,
                                    certificateFileUrl: url,
                                    certificateFileType: fileType,
                                  };
                                  setDraft((prev) => ({ ...prev, awards: next }));
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      Other Qualifications Certificates
                    </h3>
                    {draft.otherQualifications.map((qual, idx) => (
                      <div
                        key={qual.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {qual.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {qual.institution} · {qual.year}
                          </p>
                        </div>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 cursor-pointer hover:border-blue-500 shrink-0">
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>
                            {qual.certificateFileUrl
                              ? 'Replace Certificate'
                              : 'Upload Image/PDF'}
                          </span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                handleUploadFile(f, qual.id, (url, fileType) => {
                                  const next = [...draft.otherQualifications];
                                  next[idx] = {
                                    ...qual,
                                    certificateFileUrl: url,
                                    certificateFileType: fileType,
                                  };
                                  setDraft((prev) => ({
                                    ...prev,
                                    otherQualifications: next,
                                  }));
                                });
                              }
                            }}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'experience' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      Work Experience
                    </h3>
                    {draft.experience.map((exp, idx) => (
                      <div
                        key={exp.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <input
                            type="text"
                            value={exp.position}
                            onChange={(e) => {
                              const next = [...draft.experience];
                              next[idx] = { ...exp, position: e.target.value };
                              setDraft({ ...draft, experience: next });
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs font-semibold"
                          />
                          <input
                            type="text"
                            value={exp.organization}
                            onChange={(e) => {
                              const next = [...draft.experience];
                              next[idx] = { ...exp, organization: e.target.value };
                              setDraft({ ...draft, experience: next });
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                          />
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              const next = [...draft.experience];
                              next[idx] = { ...exp, period: e.target.value };
                              setDraft({ ...draft, experience: next });
                            }}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                          />
                        </div>
                        <textarea
                          rows={2}
                          value={exp.description}
                          onChange={(e) => {
                            const next = [...draft.experience];
                            next[idx] = { ...exp, description: e.target.value };
                            setDraft({ ...draft, experience: next });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                      Skill Descriptions (Editable)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {draft.skills.map((skill, idx) => (
                        <div
                          key={skill.id}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1.5"
                        >
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {skill.name}{' '}
                            <span className="text-slate-400 font-normal">
                              · {skill.category}
                            </span>
                          </p>
                          <textarea
                            rows={2}
                            value={skill.description}
                            onChange={(e) => {
                              const next = [...draft.skills];
                              next[idx] = { ...skill, description: e.target.value };
                              setDraft({ ...draft, skills: next });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'blog' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                        Articles &amp; Draft Topics
                      </h3>
                      <button
                        type="button"
                        onClick={addBlogPost}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Article</span>
                      </button>
                    </div>
                    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                      {draft.blogPosts.map((post) => (
                        <button
                          key={post.id}
                          type="button"
                          onClick={() => setSelectedBlogId(post.id)}
                          className={`w-full text-left p-3 rounded-xl border transition-colors ${
                            activeBlog?.id === post.id
                              ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40'
                              : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'
                          }`}
                        >
                          <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {post.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {post.status === 'published' ? 'Published' : 'Draft Topic'} ·{' '}
                            {post.topic}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeBlog && (
                    <div className="lg:col-span-7 space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <select
                          value={activeBlog.status}
                          onChange={(e) => {
                            const status = e.target.value as 'published' | 'draft';
                            setDraft({
                              ...draft,
                              blogPosts: draft.blogPosts.map((b) =>
                                b.id === activeBlog.id
                                  ? {
                                      ...b,
                                      status,
                                      publishedAt:
                                        status === 'published' && !b.publishedAt
                                          ? new Date().toISOString()
                                          : b.publishedAt,
                                    }
                                  : b
                              ),
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs font-semibold"
                        >
                          <option value="draft">Draft / Suggested Topic</option>
                          <option value="published">Published Live</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            const remaining = draft.blogPosts.filter(
                              (b) => b.id !== activeBlog.id
                            );
                            setDraft({ ...draft, blogPosts: remaining });
                            setSelectedBlogId(remaining[0]?.id || '');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>

                      <input
                        type="text"
                        value={activeBlog.title}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            blogPosts: draft.blogPosts.map((b) =>
                              b.id === activeBlog.id ? { ...b, title: e.target.value } : b
                            ),
                          })
                        }
                        placeholder="Article title"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-sm font-semibold"
                      />

                      <input
                        type="text"
                        value={activeBlog.topic}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            blogPosts: draft.blogPosts.map((b) =>
                              b.id === activeBlog.id ? { ...b, topic: e.target.value } : b
                            ),
                          })
                        }
                        placeholder="Topic"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                      />

                      <textarea
                        rows={2}
                        value={activeBlog.excerpt}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            blogPosts: draft.blogPosts.map((b) =>
                              b.id === activeBlog.id ? { ...b, excerpt: e.target.value } : b
                            ),
                          })
                        }
                        placeholder="Short excerpt"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs"
                      />

                      <textarea
                        rows={7}
                        value={activeBlog.content}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            blogPosts: draft.blogPosts.map((b) =>
                              b.id === activeBlog.id ? { ...b, content: e.target.value } : b
                            ),
                          })
                        }
                        placeholder="Write full article content here..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071024] text-xs leading-relaxed"
                      />
                    </div>
                  )}
                </div>
              )}

              {tab === 'inbox' && (
                <div className="space-y-4">
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-blue-600" />
                    <span>Contact Form Messages ({messages.length})</span>
                  </h3>
                  {messages.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">
                      No contact form inquiries yet.
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {msg.subject}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              From: {msg.name} ({msg.email}) ·{' '}
                              {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            aria-label="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                          {msg.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#071024]">
              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                {statusMsg && (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{statusMsg}</span>
                  </>
                )}
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
