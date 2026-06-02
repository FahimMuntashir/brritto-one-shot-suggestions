import { useState } from 'react';
import type { Student } from '../types';

const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx6H6ym9YuQ4Vc5yt3X2K94ZgcsfvKfdo0rK1-V8uetm_ZUxryY6kTIKbQR1O-oN_tY1Q/exec';

function validateName(v: string) {
  v = v.trim();
  if (!v) return 'নাম লিখতে হবে।';
  if (!/^[a-zA-Zঀ-৿\s]+$/.test(v)) return 'নামে শুধু অক্ষর ব্যবহার করুন।';
  if (v.replace(/\s/g, '').length < 2) return 'পূর্ণ নাম লিখুন (কমপক্ষে ২ অক্ষর)।';
  return null;
}
function validateMobile(v: string) {
  v = v.trim().replace(/\s/g, '');
  if (!v) return 'মোবাইল নম্বর দিতে হবে।';
  if (!/^\d{10}$/.test(v)) return 'ঠিক ১০ সংখ্যার নম্বর দিন (যেমন 1712345678)।';
  if (!/^(11|12|13|14|15|16|17|18|19)\d{8}$/.test(v)) return 'সঠিক বাংলাদেশী নম্বর দিন।';
  return null;
}
function validateClass(v: string) {
  if (!v) return 'তোমার HSC বছর নির্বাচন করো।';
  return null;
}

interface Props {
  onAccess: (student: Student) => void;
}

export default function GatePage({ onAccess }: Props) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [cls, setCls] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const setError = (key: string, msg: string | null) => {
    setErrors(prev => {
      if (msg === null) { const n = { ...prev }; delete n[key]; return n; }
      return { ...prev, [key]: msg };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameErr = validateName(name);
    const mobileErr = validateMobile(mobile);
    const classErr = validateClass(cls);

    setErrors({
      ...(nameErr ? { name: nameErr } : {}),
      ...(mobileErr ? { mobile: mobileErr } : {}),
      ...(classErr ? { cls: classErr } : {}),
    });
    if (nameErr || mobileErr || classErr) return;

    const student: Student = { name: name.trim(), mobile: '+880' + mobile.trim(), cls };
    setLoading(true);

    try {
      await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ name: student.name, mobile: student.mobile, hscYear: student.cls }),
      });
    } catch (_) { /* proceed even on network error */ }

    setLoading(false);
    localStorage.setItem('brritto_hsc_student', JSON.stringify(student));
    onAccess(student);
  };

  return (
    <section id="gate-section">
      {/* background blobs */}
      {[1,2,3,4,5,6,7,8].map(n => <div key={n} className={`bg-blob blob-${n}`} />)}

      {/* floating badges */}
      <div className="float-badge badge-bulb">💡</div>
      <div className="float-badge badge-timer">⏱</div>

      {/* logo */}
      <div className="logo-area">
        <img src="/assets/logo.png" alt="One Shot Suggestion Class" className="main-logo" />
      </div>

      {/* form card */}
      <div className="form-card">
        <div className="card-heading">
          <div className="heading-main">
            তোমার ফ্রি সাজেশন পেতে<br />
            তথ্য দিয়ে এক্সেস করো <span className="yellow-mark">👆</span>
          </div>
          <p className="heading-desc">
            তোমার তথ্য দিলে সকল বিষয়ের HSC সাজেশন PDF গুলো অফিসিয়ালভাবে ডাউনলোড করতে পারবে — এক্সেস <strong>ফ্রি!</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* name */}
          <div className="form-group">
            <label className="form-label" htmlFor="full-name">
              তোমার নাম <span className="req">*</span>
            </label>
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/>
                </svg>
              </span>
              <input
                id="full-name" type="text" className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="নামঃ ফাহিম মুনতাসির"
                value={name}
                onChange={e => { setName(e.target.value); setError('name', validateName(e.target.value)); }}
                autoComplete="name"
              />
            </div>
            {errors.name && <div className="field-error">⚠ {errors.name}</div>}
          </div>

          {/* mobile */}
          <div className="form-group">
            <label className="form-label" htmlFor="mobile">
              মোবাইল নম্বর <span className="req">*</span>
              <span className="hint"> (বাংলাদেশী নম্বর)</span>
            </label>
            <div className="phone-row">
              <div className="phone-prefix">
                <span className="flag">🇧🇩</span>+880
              </div>
              <input
                id="mobile" type="tel" className={`form-input ${errors.mobile ? 'error' : ''}`}
                placeholder="17XXXXXXXX" maxLength={10}
                value={mobile}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setMobile(v);
                  setError('mobile', validateMobile(v));
                }}
                autoComplete="tel"
              />
            </div>
            {errors.mobile && <div className="field-error">⚠ {errors.mobile}</div>}
          </div>

          {/* hsc year */}
          <div className="form-group">
            <label className="form-label" htmlFor="hsc-class">
              তোমার HSC বছর <span className="req">*</span>
            </label>
            <div className="select-wrap">
              <span className="select-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
              </span>
              <select
                id="hsc-class" className={`form-select ${errors.cls ? 'error' : ''}`}
                value={cls}
                onChange={e => { setCls(e.target.value); setError('cls', validateClass(e.target.value)); }}
              >
                <option value="" disabled>তোমার বছর নির্বাচন করুন</option>
                <option value="HSC 2026">HSC 2026</option>
                <option value="HSC 2027">HSC 2027</option>
                <option value="HSC 2028">HSC 2028</option>
              </select>
              <span className="select-arrow">▾</span>
            </div>
            {errors.cls && <div className="field-error">⚠ {errors.cls}</div>}
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            <span className="bolt">{loading ? '⏳' : '⚡'}</span>
            {loading ? 'সাবমিট হচ্ছে...' : 'ফ্রি সাজেশন ডাউনলোড করুন'}
          </button>

        </form>

        <div className="privacy-note">
          <svg className="shield-icon" width="22" height="22" fill="none" viewBox="0 0 24 24">
            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
            <path d="M9 12l2 2 4-4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>তোমার তথ্য সম্পূর্ণ নিরাপদ এবং শুধুমাত্র একাডেমিক কন্টেন্ট সরবরাহের জন্য ব্যবহার করা হবে।</span>
        </div>
      </div>
    </section>
  );
}
