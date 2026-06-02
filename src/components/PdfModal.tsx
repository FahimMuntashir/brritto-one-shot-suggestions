import { useEffect } from 'react';
import type { Subject } from '../types';

interface Props {
  subject: Subject | null;
  groupLabel: string;
  onClose: () => void;
}

function getUrls(s: Subject) {
  if (!s.driveId) return { preview: '', download: '#' };
  if (s.type === 'docs') return {
    preview: `https://docs.google.com/document/d/${s.driveId}/preview`,
    download: `https://docs.google.com/document/d/${s.driveId}/export?format=pdf`,
  };
  if (s.type === 'sheets') return {
    preview: `https://docs.google.com/spreadsheets/d/${s.driveId}/preview`,
    download: `https://docs.google.com/spreadsheets/d/${s.driveId}/export?format=pdf`,
  };
  return {
    preview: `https://drive.google.com/file/d/${s.driveId}/preview`,
    download: `https://drive.google.com/uc?export=download&id=${s.driveId}`,
  };
}

export default function PdfModal({ subject, groupLabel, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = subject ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [subject]);

  if (!subject) return null;

  const { preview, download } = getUrls(subject);

  return (
    <div id="pdf-modal" className="open">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <div className="modal-subject-tag">{groupLabel}</div>
            <div className="modal-title">{subject.title} — One Shot Suggestion 2026</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <iframe className="pdf-frame" src={preview} allow="fullscreen" />
        </div>
        <div className="modal-footer">
          <div className="modal-note">📄 Preview only — use the download button to save a copy.</div>
          <a href={download} target="_blank" rel="noreferrer" className="btn-modal-download">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}
