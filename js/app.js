/* ── CONFIG: paste your deployed Apps Script Web App URL here ── */
const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzuB-uhtAeJ_SNsS8fFn_Bz5ejAupe45sAOfxj7d61a1j73cfMBUSqll3NBE9ARt6w/exec';

/* ── Data — loaded from JSON ── */
let subjects = [];
let groupLabels = {}; /* { key: label } — built from data/groups.json */

/* ── Validation ── */
function validateName(v) {
  v = v.trim();
  if (!v) return 'নাম লিখতে হবে।';
  if (!/^[a-zA-Zঀ-৿\s]+$/.test(v)) return 'নামে শুধু অক্ষর ব্যবহার করুন।';
  if (v.replace(/\s/g, '').length < 2) return 'পূর্ণ নাম লিখুন (কমপক্ষে ২ অক্ষর)।';
  return null;
}
function validateMobile(v) {
  v = v.trim().replace(/\s/g, '');
  if (!v) return 'মোবাইল নম্বর দিতে হবে।';
  if (!/^\d{10}$/.test(v)) return 'ঠিক ১০ সংখ্যার নম্বর দিন (যেমন 1712345678)।';
  if (!/^(11|12|13|14|15|16|17|18|19)\d{8}$/.test(v)) return 'সঠিক বাংলাদেশী নম্বর দিন।';
  return null;
}
function validateClass(v) {
  if (!v) return 'তোমার HSC বছর নির্বাচন করো।';
  return null;
}
function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = '⚠ ' + msg;
  el.classList.remove('hidden');
}
function clearError(id) { document.getElementById(id).classList.add('hidden'); }

/* ── Form ── */
const form = document.getElementById('student-form');

document.getElementById('full-name').addEventListener('input', function () {
  const err = validateName(this.value);
  if (err) showError('name-error', err); else clearError('name-error');
});
document.getElementById('mobile').addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 10);
  const err = validateMobile(this.value);
  if (err) showError('mobile-error', err); else clearError('mobile-error');
});
document.getElementById('hsc-class').addEventListener('change', function () {
  const err = validateClass(this.value);
  if (err) showError('class-error', err); else clearError('class-error');
});

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name   = document.getElementById('full-name').value;
  const mobile = document.getElementById('mobile').value;
  const cls    = document.getElementById('hsc-class').value;

  const nameErr   = validateName(name);
  const mobileErr = validateMobile(mobile);
  const classErr  = validateClass(cls);

  if (nameErr)   showError('name-error', nameErr);
  if (mobileErr) showError('mobile-error', mobileErr);
  if (classErr)  showError('class-error', classErr);
  if (nameErr || mobileErr || classErr) return;

  const student = { name: name.trim(), mobile: '+880' + mobile.trim(), cls };

  /* submit to Google Sheets */
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="bolt">⏳</span> সাবমিট হচ্ছে...';

  if (SHEET_ENDPOINT && SHEET_ENDPOINT !== 'YOUR_APPS_SCRIPT_URL_HERE') {
    try {
      await fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
          name: student.name,
          mobile: student.mobile,
          hscYear: student.cls,
        }),
      });
    } catch (_) {
      /* network error — proceed anyway so the user isn't blocked */
    }
  }

  btn.disabled = false;
  btn.innerHTML = '<span class="bolt">⚡</span> ফ্রি সাজেশন ডাউনলোড করুন';

  localStorage.setItem('brritto_hsc_student', JSON.stringify(student));
  openPortal(student);
});

/* ── Portal ── */
function openPortal(student) {
  document.getElementById('gate-section').style.display = 'none';
  const portal = document.getElementById('portal-section');
  portal.style.display = 'block';
  document.getElementById('student-name-display').textContent = student.name.split(' ')[0];
  document.getElementById('student-mobile-display').textContent = student.mobile;
  document.getElementById('student-class-display').textContent = student.cls;
  renderCards('all');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => showToast('✅ এক্সেস পাওয়া গেছে! ফ্রি সাজেশন উপভোগ করো।', 'success'), 400);
}

/* ── Cards ── */
function buildCard(s) {
  const isAvail = s.available;
  const dis = !isAvail ? 'disabled' : '';
  return `
    <div class="subject-card ${isAvail ? '' : 'coming-soon'} fade-in" data-group="${s.group}">
      <div class="card-body">
        <div class="card-top">
          <div class="card-icon">${s.icon}</div>
          <div class="card-info">
            <div class="card-group">${groupLabels[s.group] || s.group}</div>
            <div class="card-title">${s.title}</div>
            <div class="card-subtitle">${s.subtitle}</div>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-preview" ${dis} onclick="openPdf('${s.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            প্রিভিউ
          </button>
          <button class="btn-download" ${dis} onclick="downloadPdf('${s.id}')">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            ডাউনলোড
          </button>
        </div>
      </div>
      ${!isAvail ? `<div class="card-footer"><span class="coming-label">⏳ শীঘ্রই আসছে</span></div>` : ''}
    </div>
  `;
}

function renderCards(group) {
  const grid = document.getElementById('subjects-grid');

  if (!subjects.length) {
    grid.innerHTML = `<div class="empty-state"><div class="icon">⏳</div><p>লোড হচ্ছে...</p></div>`;
    return;
  }

  let list;
  if (group === 'all') {
    list = subjects;
  } else if (group === 'compulsory') {
    list = subjects.filter(s => s.group === 'compulsory');
  } else {
    /* include compulsory (common) subjects in every group filter */
    list = subjects.filter(s => s.group === group || s.group === 'compulsory');
  }

  if (!list.length) {
    grid.innerHTML = `<div class="empty-state"><div class="icon">📭</div><p>এই ক্যাটাগরিতে এখনো কোনো বিষয় নেই।</p></div>`;
    return;
  }
  grid.innerHTML = list.map(buildCard).join('');
  requestAnimationFrame(() => {
    grid.querySelectorAll('.fade-in').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 40);
    });
  });
}

let filterBound = false;
function setupFilters(groups) {
  /* build filter bar from groups JSON */
  const bar = document.getElementById('filter-bar');
  const allBtn = `<button class="filter-btn active" data-group="all">সব বিষয়</button>`;
  const groupBtns = groups.map(g =>
    `<button class="filter-btn" data-group="${g.key}">${g.label}</button>`
  ).join('');
  bar.innerHTML = allBtn + groupBtns;

  if (filterBound) return;
  filterBound = true;
  bar.addEventListener('click', function (e) {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCards(btn.dataset.group);
  });
}

/* ── PDF Modal ── */
function getSubject(id) { return subjects.find(s => s.id === id); }

function getUrls(s) {
  if (!s.driveId) return { preview: '', download: '#' };
  if (s.type === 'docs') {
    return {
      preview:  `https://docs.google.com/document/d/${s.driveId}/preview`,
      download: `https://docs.google.com/document/d/${s.driveId}/export?format=pdf`,
    };
  }
  if (s.type === 'sheets') {
    return {
      preview:  `https://docs.google.com/spreadsheets/d/${s.driveId}/preview`,
      download: `https://docs.google.com/spreadsheets/d/${s.driveId}/export?format=pdf`,
    };
  }
  /* default: uploaded file in Google Drive */
  return {
    preview:  `https://drive.google.com/file/d/${s.driveId}/preview`,
    download: `https://drive.google.com/uc?export=download&id=${s.driveId}`,
  };
}

function openPdf(id) {
  const s = getSubject(id);
  if (!s || !s.available) return;
  const { preview, download } = getUrls(s);
  document.getElementById('modal-title').textContent = s.title + ' — One Shot Suggestion 2026';
  document.getElementById('modal-group-tag').textContent = groupLabels[s.group] || s.group;
  document.getElementById('pdf-frame').src = preview;
  document.getElementById('modal-download-btn').href = download;
  document.getElementById('pdf-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePdf() {
  document.getElementById('pdf-modal').classList.remove('open');
  document.getElementById('pdf-frame').src = '';
  document.body.style.overflow = '';
}

function downloadPdf(id) {
  const s = getSubject(id);
  if (!s || !s.available) return;
  if (!s.driveId) { showToast('PDF link not available yet.'); return; }
  const { download } = getUrls(s);
  const a = document.createElement('a');
  a.href = download;
  a.target = '_blank';
  a.click();
  showToast('⬇️ Download started!', 'success');
}

document.getElementById('modal-close-btn').addEventListener('click', closePdf);
document.getElementById('modal-backdrop').addEventListener('click', closePdf);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePdf(); });

/* ── Toast ── */
let toastTimer;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = type ? `show ${type}` : 'show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.className = ''; }, 3000);
}

/* ── Init ── */
async function init() {
  /* load both JSON files in parallel */
  const [subjectsRes, groupsRes] = await Promise.allSettled([
    fetch('data/subjects.json').then(r => r.json()),
    fetch('data/groups.json').then(r => r.json()),
  ]);

  subjects = subjectsRes.status === 'fulfilled' ? subjectsRes.value : [];

  const groups = groupsRes.status === 'fulfilled' ? groupsRes.value : [];
  groupLabels = Object.fromEntries(groups.map(g => [g.key, g.label]));

  /* render filter tabs from groups JSON */
  setupFilters(groups);

  /* check if already logged in */
  try {
    const stored = JSON.parse(localStorage.getItem('brritto_hsc_student'));
    if (stored && stored.name && stored.mobile && stored.cls) {
      openPortal(stored);
    }
  } catch (_) {}
}

init();
