/* =============================================
   갤러리 관리자 패널 — admin.js
   접근: /?admin=true
   ============================================= */

import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, query, orderBy, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js';

const CLOUDINARY_CLOUD = 'donipr7ss';
const CLOUDINARY_PRESET = 'jaehee';

// ── 비밀번호 (변경 필요) ──
// 정적 사이트라 클라이언트 코드에 평문으로 두면 개발자 도구로 바로 노출되므로
// 최소한 코드를 봐도 바로 읽히지 않도록 간단히 인코딩해 둠 (완전한 보안은 아님 —
// 진짜 보안이 필요하면 서버/백엔드 인증으로 옮겨야 함).
const _PW_ENC = '2UTM0UDO';
function _decodePw(s) { return atob(s.split('').reverse().join('')); }
const ADMIN_PASSWORD = _decodePw(_PW_ENC);

const firebaseConfig = {
  apiKey: "AIzaSyDyp2J3WQr9W4GlZYEmrrFLKo8J2t6_5LA",
  authDomain: "jaehee-6c0d9.firebaseapp.com",
  projectId: "jaehee-6c0d9",
  storageBucket: "jaehee-6c0d9.firebasestorage.app",
  messagingSenderId: "216940939683",
  appId: "1:216940939683:web:c9b053f62af3cd5e91b216"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ── Firestore 갤러리 불러오기 (모든 방문자) ── */
export async function loadFirestoreGallery() {
  const container = document.getElementById('gallery');
  if (!container) return;

  try {
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    // 기존 Firestore 항목 제거 (새로고침 시)
    container.querySelectorAll('.gallery-item[data-fs]').forEach(el => el.remove());

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const el = createGalleryItem(data, docSnap.id);
      container.insertBefore(el, container.firstChild);
    });

    // 현재 필터 재적용
    const active = document.querySelector('.filter-btn.active');
    if (active && active.dataset.filter !== 'all') {
      const filter = active.dataset.filter;
      container.querySelectorAll('.gallery-item').forEach(el => {
        el.classList.toggle('hidden', el.dataset.category !== filter);
      });
    }
  } catch (e) {
    console.warn('갤러리 로드 오류:', e);
  }

  // 저장된 정렬 순서 적용 (정적 + Firestore 이미지 통합)
  try {
    const order = await loadGalleryOrder();
    applyGalleryOrder(order);
  } catch (e) {
    console.warn('순서 적용 오류:', e);
  }

  if (window._applyPageLimit) window._applyPageLimit();
}

function createGalleryItem(item, id) {
  const el = document.createElement('div');
  el.className = 'gallery-item';
  el.draggable = true;
  el.dataset.category = item.category;
  el.dataset.src = item.src;
  el.dataset.title = item.title;
  el.dataset.desc = item.desc || '';
  el.dataset.fs = id;

  const img = document.createElement('img');
  img.src = item.src;
  img.alt = item.title;
  img.loading = 'lazy';
  img.onerror = () => {
    img.remove();
    const ph = document.createElement('div');
    ph.className = 'gallery-placeholder';
    ph.textContent = item.title;
    el.insertBefore(ph, el.firstChild);
  };

  const overlay = document.createElement('div');
  overlay.className = 'gallery-item-overlay';
  overlay.innerHTML = `<div class="gallery-item-info"><h4>${item.title}</h4><p>${item.desc || ''}</p></div>`;

  // 삭제 버튼
  const delBtn = document.createElement('button');
  delBtn.className = 'gallery-delete-btn';
  delBtn.innerHTML = '✕';
  delBtn.title = '삭제';
  delBtn.addEventListener('click', e => {
    e.stopPropagation();
    showDeleteConfirm(el, id);
  });

  const dragHandle = document.createElement('div');
  dragHandle.className = 'gallery-drag-handle';
  dragHandle.innerHTML = '⠿';
  dragHandle.title = '드래그해서 순서 변경';

  el.appendChild(img);
  el.appendChild(overlay);
  el.appendChild(delBtn);
  el.appendChild(dragHandle);
  return el;
}

window._showDeleteConfirm = showDeleteConfirm;

function showDeleteConfirm(el, id) {
  const existing = el.querySelector('.gallery-delete-confirm');
  if (existing) return;

  const confirm = document.createElement('div');
  confirm.className = 'gallery-delete-confirm';
  confirm.innerHTML = `
    <p>삭제할까요?</p>
    <div class="gallery-delete-actions">
      <button class="gallery-delete-cancel">취소</button>
      <button class="gallery-delete-ok">삭제</button>
    </div>
  `;

  confirm.querySelector('.gallery-delete-cancel').addEventListener('click', e => {
    e.stopPropagation();
    confirm.remove();
  });

  confirm.querySelector('.gallery-delete-ok').addEventListener('click', async e => {
    e.stopPropagation();
    try {
      if (id) {
        // Firestore 이미지 → DB에서 영구 삭제
        await deleteDoc(doc(db, 'gallery', id));
      } else {
        // 정적 이미지 → localStorage에 기록
        const src = el.dataset.src;
        const deleted = JSON.parse(localStorage.getItem('deleted_gallery') || '[]');
        if (!deleted.includes(src)) {
          deleted.push(src);
          localStorage.setItem('deleted_gallery', JSON.stringify(deleted));
        }
      }
      el.remove();
      if (window._applyPageLimit) window._applyPageLimit();
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  });

  el.appendChild(confirm);
}

/* ── 갤러리 순서 변경 (관리자 모드 전용, 드래그 앤 드롭) ── */
const ORDER_DOC_REF = doc(db, 'meta', 'galleryOrder');
let draggedGalleryItem = null;

function isGalleryAdminActive() {
  return document.getElementById('gallery')?.classList.contains('gallery--admin');
}

function galleryItemKey(el) {
  return el.dataset.fs ? `fs:${el.dataset.fs}` : `static:${el.dataset.src}`;
}

async function loadGalleryOrder() {
  try {
    const snap = await getDoc(ORDER_DOC_REF);
    return snap.exists() ? (snap.data().order || []) : [];
  } catch (e) {
    console.warn('순서 불러오기 실패:', e);
    return [];
  }
}

function applyGalleryOrder(order) {
  const container = document.getElementById('gallery');
  if (!container || !order || !order.length) return;
  const items = [...container.querySelectorAll('.gallery-item')];
  const map = new Map(items.map(el => [galleryItemKey(el), el]));
  order.forEach(key => {
    if (map.has(key)) {
      container.appendChild(map.get(key));
      map.delete(key);
    }
  });
  // 저장된 순서에 없는 항목(새로 추가된 이미지 등)은 마지막에 그대로 둠
  map.forEach(el => container.appendChild(el));
}

async function saveGalleryOrder() {
  const container = document.getElementById('gallery');
  if (!container) return;
  const order = [...container.querySelectorAll('.gallery-item')].map(galleryItemKey);
  try {
    await setDoc(ORDER_DOC_REF, { order });
  } catch (e) {
    console.warn('순서 저장 실패:', e);
  }
}

function initGalleryReorder() {
  const container = document.getElementById('gallery');
  if (!container) return;

  container.addEventListener('dragstart', e => {
    const item = e.target.closest('.gallery-item');
    if (!item || !isGalleryAdminActive()) { e.preventDefault(); return; }
    draggedGalleryItem = item;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', galleryItemKey(item)); } catch (err) {}
  });

  container.addEventListener('dragover', e => {
    if (!draggedGalleryItem) return;
    e.preventDefault();
    const target = e.target.closest('.gallery-item');
    if (!target || target === draggedGalleryItem) return;
    const items = [...container.querySelectorAll('.gallery-item')];
    const draggedIdx = items.indexOf(draggedGalleryItem);
    const targetIdx = items.indexOf(target);
    if (draggedIdx < targetIdx) {
      container.insertBefore(draggedGalleryItem, target.nextSibling);
    } else {
      container.insertBefore(draggedGalleryItem, target);
    }
  });

  container.addEventListener('drop', e => {
    if (!draggedGalleryItem) return;
    e.preventDefault();
  });

  container.addEventListener('dragend', () => {
    if (!draggedGalleryItem) return;
    draggedGalleryItem.classList.remove('dragging');
    draggedGalleryItem = null;
    saveGalleryOrder();
  });
}

window._applyGalleryOrder = async () => applyGalleryOrder(await loadGalleryOrder());
initGalleryReorder();

/* ── 갤러리 순서 변경 모달 (세로 목록, 관리자 모드 전용) ── */
const reorderModal = document.getElementById('reorderModal');
const reorderList = document.getElementById('reorderList');
let draggedReorderRow = null;

function buildReorderList() {
  const container = document.getElementById('gallery');
  if (!container || !reorderList) return;
  reorderList.innerHTML = '';

  [...container.querySelectorAll('.gallery-item')].forEach(item => {
    const row = document.createElement('div');
    row.className = 'reorder-row';
    row.draggable = true;
    row.dataset.key = galleryItemKey(item);

    const thumb = document.createElement('div');
    thumb.className = 'reorder-thumb';
    const srcImg = item.querySelector('img');
    if (srcImg) {
      const i = document.createElement('img');
      i.src = srcImg.src;
      i.alt = item.dataset.title || '';
      thumb.appendChild(i);
    }

    const info = document.createElement('div');
    info.className = 'reorder-info';
    info.innerHTML = `
      <p class="reorder-title">${item.dataset.title || '(제목 없음)'}</p>
      <p class="reorder-cat">${item.dataset.category || ''}</p>
    `;

    const moveBtns = document.createElement('div');
    moveBtns.className = 'reorder-move-btns';
    moveBtns.innerHTML = `
      <button type="button" class="reorder-move-btn" data-dir="-1" aria-label="위로">▲</button>
      <button type="button" class="reorder-move-btn" data-dir="1" aria-label="아래로">▼</button>
    `;

    const handle = document.createElement('div');
    handle.className = 'reorder-handle';
    handle.innerHTML = '⠿';

    row.appendChild(thumb);
    row.appendChild(info);
    row.appendChild(moveBtns);
    row.appendChild(handle);
    reorderList.appendChild(row);
  });
}

function openReorderModal() {
  if (!isGalleryAdminActive()) return;
  buildReorderList();
  reorderModal?.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeReorderModal() {
  reorderModal?.classList.remove('open');
  document.body.classList.remove('modal-open');
}

document.getElementById('galleryReorderBtn')?.addEventListener('click', openReorderModal);
document.getElementById('reorderModalClose')?.addEventListener('click', closeReorderModal);
document.getElementById('reorderCancelBtn')?.addEventListener('click', closeReorderModal);
document.getElementById('reorderModalBackdrop')?.addEventListener('click', closeReorderModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && reorderModal?.classList.contains('open')) closeReorderModal();
});

// 드래그로 순서 변경 (세로 단일 목록 — 컬럼 줄바꿈 없음)
reorderList?.addEventListener('dragstart', e => {
  const row = e.target.closest('.reorder-row');
  if (!row) { e.preventDefault(); return; }
  draggedReorderRow = row;
  row.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  try { e.dataTransfer.setData('text/plain', row.dataset.key); } catch (err) {}
});

reorderList?.addEventListener('dragover', e => {
  if (!draggedReorderRow) return;
  e.preventDefault();
  const target = e.target.closest('.reorder-row');
  if (!target || target === draggedReorderRow) return;
  const rows = [...reorderList.querySelectorAll('.reorder-row')];
  const draggedIdx = rows.indexOf(draggedReorderRow);
  const targetIdx = rows.indexOf(target);
  if (draggedIdx < targetIdx) {
    reorderList.insertBefore(draggedReorderRow, target.nextSibling);
  } else {
    reorderList.insertBefore(draggedReorderRow, target);
  }
});

reorderList?.addEventListener('dragend', () => {
  draggedReorderRow?.classList.remove('dragging');
  draggedReorderRow = null;
});

// 화살표 버튼으로 순서 변경 (드래그가 번거로울 때 대안)
reorderList?.addEventListener('click', e => {
  const btn = e.target.closest('.reorder-move-btn');
  if (!btn) return;
  const row = btn.closest('.reorder-row');
  if (!row) return;
  const dir = parseInt(btn.dataset.dir, 10);
  if (dir === -1 && row.previousElementSibling) {
    reorderList.insertBefore(row, row.previousElementSibling);
  } else if (dir === 1 && row.nextElementSibling) {
    reorderList.insertBefore(row.nextElementSibling, row);
  }
});

// 저장 — 목록 순서를 실제 갤러리에 반영 후 Firestore에 기록
document.getElementById('reorderSaveBtn')?.addEventListener('click', async () => {
  const container = document.getElementById('gallery');
  if (!container || !reorderList) { closeReorderModal(); return; }

  const saveBtn = document.getElementById('reorderSaveBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = '저장 중...';

  try {
    const keys = [...reorderList.querySelectorAll('.reorder-row')].map(r => r.dataset.key);
    const items = [...container.querySelectorAll('.gallery-item')];
    const map = new Map(items.map(el => [galleryItemKey(el), el]));
    keys.forEach(key => {
      if (map.has(key)) {
        container.appendChild(map.get(key));
        map.delete(key);
      }
    });
    map.forEach(el => container.appendChild(el));

    await saveGalleryOrder();
  } catch (e) {
    console.warn('순서 저장 실패:', e);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = '저장';
    closeReorderModal();
  }
});

/* ── 관리자 패널 UI ── */
const adminPanel = document.getElementById('adminPanel');
const loginSection = document.getElementById('adminLoginSection');
const uploadSection = document.getElementById('adminUploadSection');
let isAdminAuthenticated = false;

function openAdmin(showUpload = false) {
  adminPanel?.classList.add('open');
  document.body.classList.add('admin-open');
  const title = document.querySelector('.admin-title');
  if (showUpload && isAdminAuthenticated) {
    loginSection.style.display = 'none';
    uploadSection.style.display = 'block';
    if (title) title.textContent = '이미지 등록';
  } else if (!isAdminAuthenticated) {
    loginSection.style.display = 'block';
    uploadSection.style.display = 'none';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminPwError').textContent = '';
    if (title) title.textContent = '관리자 로그인';
  }
}

function closeAdmin() {
  adminPanel?.classList.remove('open');
  document.body.classList.remove('admin-open');
  history.replaceState({}, '', location.pathname);
}

// URL param 또는 푸터 버튼으로 패널 열기
if (new URLSearchParams(location.search).get('admin') === 'true') {
  openAdmin();
}
document.getElementById('footerAdminBtn')?.addEventListener('click', () => openAdmin(false));
document.getElementById('galleryAddBtn')?.addEventListener('click', () => openAdmin(true));

// 패널 닫기 (오버레이 클릭 또는 X 버튼)
adminPanel?.addEventListener('click', e => {
  if (!e.target.closest('.admin-drawer')) closeAdmin();
});
document.getElementById('adminCloseBtn')?.addEventListener('click', closeAdmin);

// 로그인
document.getElementById('adminLoginSubmit')?.addEventListener('click', checkPassword);
document.getElementById('adminPassword')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') checkPassword();
});

function checkPassword() {
  const pw = document.getElementById('adminPassword').value;
  if (pw === ADMIN_PASSWORD) {
    isAdminAuthenticated = true;
    document.getElementById('adminPwError').textContent = '';
    document.getElementById('gallery')?.classList.add('gallery--admin');
    const addBtn = document.getElementById('galleryAddBtn');
    if (addBtn) addBtn.style.display = 'inline-flex';
    const reorderBtn = document.getElementById('galleryReorderBtn');
    if (reorderBtn) reorderBtn.style.display = 'inline-flex';
    closeAdmin();
    showLoginSuccessModal();
  } else {
    const err = document.getElementById('adminPwError');
    err.textContent = '비밀번호가 틀렸습니다.';
    document.getElementById('adminPassword').classList.add('shake');
    setTimeout(() => document.getElementById('adminPassword').classList.remove('shake'), 500);
  }
}

// 이미지 미리보기
document.getElementById('adminFile')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const preview = document.getElementById('adminPreview');
    preview.src = ev.target.result;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// 드래그 앤 드롭
const fileLabel = document.querySelector('.admin-file-label');
fileLabel?.addEventListener('dragover', e => { e.preventDefault(); fileLabel.classList.add('drag-over'); });
fileLabel?.addEventListener('dragleave', () => fileLabel.classList.remove('drag-over'));
fileLabel?.addEventListener('drop', e => {
  e.preventDefault();
  fileLabel.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const dt = new DataTransfer();
    dt.items.add(file);
    document.getElementById('adminFile').files = dt.files;
    document.getElementById('adminFile').dispatchEvent(new Event('change'));
  }
});

// 업로드
document.getElementById('adminUploadSubmit')?.addEventListener('click', handleUpload);

async function handleUpload() {
  const file = document.getElementById('adminFile').files[0];
  const title = document.getElementById('adminTitle').value.trim();
  const desc = document.getElementById('adminDesc').value.trim();
  const category = document.getElementById('adminCategory').value;

  if (!file) { showMsg('이미지를 선택해주세요.', 'error'); return; }
  if (!title) { showMsg('제목을 입력해주세요.', 'error'); return; }

  const submitBtn = document.getElementById('adminUploadSubmit');
  const progressWrap = document.getElementById('adminProgressWrap');
  const progressBar = document.getElementById('adminProgressBar');

  submitBtn.disabled = true;
  submitBtn.textContent = '업로드 중...';
  progressWrap.style.display = 'block';
  progressBar.style.width = '0%';

  try {
    // Cloudinary 업로드 (XMLHttpRequest로 진행률 추적)
    const url = await uploadToCloudinary(file, pct => {
      progressBar.style.width = pct + '%';
    });

    await addDoc(collection(db, 'gallery'), {
      src: url, category, title,
      desc: desc || category + ' 디자인',
      createdAt: new Date()
    });

    progressBar.style.width = '0%';
    progressWrap.style.display = 'none';
    resetUploadForm();
    closeAdmin();
    showSuccessModal();
    await loadFirestoreGallery();
  } catch (e) {
    console.error('[upload] 오류:', e);
    showMsg('업로드 실패: ' + e.message, 'error');
    progressWrap.style.display = 'none';
  } finally {
    resetSubmitBtn(submitBtn);
  }
}

function uploadToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    formData.append('folder', 'gallery');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`);

    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        resolve(res.secure_url);
      } else {
        reject(new Error('Cloudinary 응답 오류: ' + xhr.status));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('네트워크 오류')));
    xhr.send(formData);
  });
}

function resetSubmitBtn(btn) {
  btn.disabled = false;
  btn.textContent = '업로드';
}

function resetUploadForm() {
  document.getElementById('adminFile').value = '';
  document.getElementById('adminTitle').value = '';
  document.getElementById('adminDesc').value = '';
  document.getElementById('adminPreview').style.display = 'none';
}

function showLoginSuccessModal() {
  const modal = document.getElementById('loginSuccessModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.classList.add('modal-open');
  document.getElementById('loginSuccessClose')?.addEventListener('click', () => {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }, { once: true });
}

function showSuccessModal() {
  const modal = document.getElementById('uploadSuccessModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.classList.add('modal-open');
  document.getElementById('uploadSuccessClose')?.addEventListener('click', () => {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
  }, { once: true });
}

function showMsg(msg, type) {
  const el = document.getElementById('adminMsg');
  el.textContent = msg;
  el.className = 'admin-msg admin-msg--' + type;
  setTimeout(() => { el.textContent = ''; el.className = 'admin-msg'; }, 3000);
}

/* ── 초기 로드 ── */
loadFirestoreGallery();
