import type { Subject } from '../types';

interface Props {
  subject: Subject;
  groupLabel: string;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
}

export default function SubjectCard({ subject: s, groupLabel, onPreview, onDownload }: Props) {
  return (
    <div className={`subject-card ${s.available ? '' : 'coming-soon'} fade-in`} data-group={s.group}>
      <div className="card-body">
        <div className="card-top">
          <div className="card-icon">{s.icon}</div>
          <div className="card-info">
            <div className="card-group">{groupLabel}</div>
            <div className="card-title">{s.title}</div>
            <div className="card-subtitle">{s.subtitle}</div>
          </div>
        </div>
        <div className="card-actions">
          <button
            className="btn-preview"
            disabled={!s.available}
            onClick={() => onPreview(s.id)}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            প্রিভিউ
          </button>
          <button
            className="btn-download"
            disabled={!s.available}
            onClick={() => onDownload(s.id)}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            ডাউনলোড
          </button>
        </div>
      </div>
      {!s.available && (
        <div className="card-footer">
          <span className="coming-label">⏳ শীঘ্রই আসছে</span>
        </div>
      )}
    </div>
  );
}
