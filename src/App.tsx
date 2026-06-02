import { useState, useEffect, useCallback } from 'react';
import type { Student } from './types';
import { useData } from './hooks/useData';
import GatePage from './components/GatePage';
import Portal from './components/Portal';
import Toast from './components/Toast';

interface ToastState {
  message: string;
  type?: 'success';
}

export default function App() {
  const [student, setStudent] = useState<Student | null>(null);
  const [toast, setToast] = useState<ToastState>({ message: '' });
  const { subjects, groups, groupLabels, loading } = useData();

  /* restore session from localStorage */
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('brritto_hsc_student') ?? 'null');
      if (stored?.name && stored?.mobile && stored?.cls) setStudent(stored);
    } catch (_) {}
  }, []);

  const handleAccess = useCallback((s: Student) => {
    setStudent(s);
    setTimeout(() => setToast({ message: '✅ এক্সেস পাওয়া গেছে! ফ্রি সাজেশন উপভোগ করো।', type: 'success' }), 400);
  }, []);

  const showToast = useCallback((message: string, type?: 'success') => {
    setToast({ message, type });
  }, []);

  if (loading && student) return null;

  return (
    <>
      {!student
        ? <GatePage onAccess={handleAccess} />
        : <Portal
            student={student}
            subjects={subjects}
            groups={groups}
            groupLabels={groupLabels}
            onToast={showToast}
          />
      }
      <Toast
        message={toast.message}
        type={toast.type}
        onClear={() => setToast({ message: '' })}
      />
    </>
  );
}
