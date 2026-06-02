import { useState, useCallback, useRef, useEffect } from 'react';
import type { Subject, Group, Student } from '../types';
import SubjectCard from './SubjectCard';
import PdfModal from './PdfModal';

interface Props {
  student: Student;
  subjects: Subject[];
  groups: Group[];
  groupLabels: Record<string, string>;
  onToast: (msg: string, type?: 'success') => void;
}

export default function Portal({ student, subjects, groups, groupLabels, onToast }: Props) {
  const [activeGroup, setActiveGroup] = useState('all');
  const [modalSubject, setModalSubject] = useState<Subject | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredSubjects = activeGroup === 'all'
    ? subjects
    : activeGroup === 'compulsory'
      ? subjects.filter(s => s.group === 'compulsory')
      : subjects.filter(s => s.group === activeGroup || s.group === 'compulsory');

  /* trigger fade-in animation after each render */
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('.fade-in');
    cards?.forEach((el, i) => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), i * 40);
    });
  }, [filteredSubjects]);

  const handlePreview = useCallback((id: string) => {
    const s = subjects.find(s => s.id === id);
    if (s?.available) setModalSubject(s);
  }, [subjects]);

  const handleDownload = useCallback((id: string) => {
    const s = subjects.find(s => s.id === id);
    if (!s?.available) return;
    if (!s.driveId) { onToast('PDF link not available yet.'); return; }
    const url = s.type === 'docs'
      ? `https://docs.google.com/document/d/${s.driveId}/export?format=pdf`
      : `https://drive.google.com/uc?export=download&id=${s.driveId}`;
    window.open(url, '_blank');
    onToast('⬇️ Download started!', 'success');
  }, [subjects, onToast]);

  return (
    <section id="portal-section">

      <div className="portal-banner">
        <div className="portal-banner-inner">
          <div className="welcome-text">
            <h3>স্বাগতম, <span>{student.name.split(' ')[0]}</span>! 👋</h3>
            <p>নিচে থেকে তোমার HSC 2026 বিষয়ভিত্তিক সাজেশনগুলো ডাউনলোড করো।</p>
          </div>
          <div className="portal-meta">
            <div className="meta-chip"><span>📱</span> {student.mobile}</div>
            <div className="meta-chip"><span>🎓</span> {student.cls}</div>
          </div>
        </div>
      </div>

      <div className="portal-body">
        <div className="section-header">
          <div className="section-title">বিষয়ভিত্তিক সাজেশন</div>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-btn ${activeGroup === 'all' ? 'active' : ''}`}
            onClick={() => setActiveGroup('all')}
          >
            সব বিষয়
          </button>
          {groups.map(g => (
            <button
              key={g.key}
              className={`filter-btn ${activeGroup === g.key ? 'active' : ''}`}
              onClick={() => setActiveGroup(g.key)}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="subjects-grid" ref={gridRef}>
          {filteredSubjects.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📭</div>
              <p>এই ক্যাটাগরিতে এখনো কোনো বিষয় নেই।</p>
            </div>
          ) : (
            filteredSubjects.map(s => (
              <SubjectCard
                key={s.id}
                subject={s}
                groupLabel={groupLabels[s.group] ?? s.group}
                onPreview={handlePreview}
                onDownload={handleDownload}
              />
            ))
          )}
        </div>
      </div>

      <PdfModal
        subject={modalSubject}
        groupLabel={modalSubject ? (groupLabels[modalSubject.group] ?? modalSubject.group) : ''}
        onClose={() => setModalSubject(null)}
      />

    </section>
  );
}
