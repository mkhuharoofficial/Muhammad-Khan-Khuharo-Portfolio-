import { useEffect } from 'react';
import { ExternalLink, FileText, X } from 'lucide-react';

interface CertificatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  fileUrl?: string;
  fileType?: 'image' | 'pdf' | '';
  externalUrl?: string;
}

export function CertificatePreviewModal({
  isOpen,
  onClose,
  title,
  subtitle,
  fileUrl,
  fileType,
  externalUrl,
}: CertificatePreviewModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPdf = fileType === 'pdf' || fileUrl?.toLowerCase().endsWith('.pdf');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b152c] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <span>Verify Official Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-[#060d1f] max-h-[78vh] overflow-auto flex items-center justify-center">
          {fileUrl ? (
            isPdf ? (
              <iframe
                src={fileUrl}
                title={title}
                className="w-full h-[68vh] rounded-lg border border-slate-200 dark:border-slate-800 bg-white"
              />
            ) : (
              <img
                src={fileUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="max-h-[68vh] w-auto object-contain rounded-lg shadow-sm"
              />
            )
          ) : (
            <div className="w-full py-16 px-6 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b152c]">
              <FileText className="w-10 h-10 mx-auto text-blue-600 dark:text-blue-400 mb-3" />
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Certificate file not uploaded yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Upload your authentic certificate image or PDF via Portfolio Studio to preview it directly here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
