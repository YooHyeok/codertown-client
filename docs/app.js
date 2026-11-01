/* =====================================================================
   CoderTown Mock - 화면 렌더링 & 목업 동작 (빌드 없음, Vanilla JS)
   - Hash Router (#/coggle ...) : GitHub Pages 새로고침 404 회피
   - 원본 React 컴포넌트 구조/문구/스타일을 그대로 옮기고 axios/STOMP 는 data.js 로 대체
   ===================================================================== */

/* ---------- 상태 ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
};
const S = {
  userId: store.get('ct_user', DEMO_USER), /* 첫 방문은 데모 계정 자동 로그인 (로그아웃하면 '' 저장되어 유지) */
  mainTab: '1',
  mypageTab: store.get('activeTab', '1'),
  dmOpen: false,
  chatRoomNo: null,
  focusComment: null,
  lists: {},
};

/* ---------- 유틸 ---------- */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
const app = () => $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl2br = s => esc(s).replace(/\n/g, '<br/>');
const pad = n => String(n).padStart(2, '0');
function ymd(iso) { if (!iso) return ''; const d = new Date(iso); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function fullDate(iso) {
  const d = new Date(iso); let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  return `${ymd(iso)} / ${pad(h)}:${pad(d.getMinutes())} ${ap}`;
}
function timeago(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 45) return 'just now';
  const units = [[60, 'minute'], [3600, 'hour'], [86400, 'day'], [2592000, 'month'], [31536000, 'year']];
  let out = '';
  for (let i = units.length - 1; i >= 0; i--) {
    const v = Math.floor(s / units[i][0]);
    if (v >= 1) { out = `${v} ${units[i][1]}${v > 1 ? 's' : ''} ago`; break; }
  }
  return out || 'just now';
}
const nowIso = () => new Date().toISOString();
const zoomFactor = () => parseFloat(getComputedStyle(document.body).zoom) || 1;
const user = email => USERS.find(u => u.email === email) || { email, nickname: '알수없음', profileUrl: null };
const avatar = u => (u && u.profileUrl) || 'assets/default_profile.png';
const me = () => S.userId ? user(S.userId) : null;
const isLogin = () => S.userId !== '';
const go = path => { location.hash = '#' + path; };
const catText = c => c === 'T' ? 'TechQue' : c === 'C' ? 'Carrier' : 'DevLife';

/* ---------- Toast (react-toastify 룩) ---------- */
function toast(type, msg) {
  const pos = type === 'success' || type === 'default' ? 'top-right' : 'top-center';
  let box = $(`.ct-toasts.${pos}`);
  if (!box) { box = document.createElement('div'); box.className = `ct-toasts ${pos}`; document.body.appendChild(box); }
  const ico = { warning: 'bi-exclamation-triangle-fill', success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', default: 'bi-info-circle-fill' }[type];
  const el = document.createElement('div');
  el.className = `ct-toast ${type}`;
  el.innerHTML = `<i class="bi ${ico} ico"></i><div>${esc(msg).replace(/\\n|\n/g, '<br/>')}</div><span class="x">✕</span><div class="bar"></div>`;
  const close = () => el.remove();
  el.addEventListener('click', close);
  el.querySelector('.bar').addEventListener('animationend', close);
  box.appendChild(el);
}
const warn = m => toast('warning', m), ok = m => toast('success', m), err = m => toast('error', m);

/* ---------- Confirm (react-confirm-alert 룩) ---------- */
function confirmBox(title, message, onOk) {
  const ov = document.createElement('div');
  ov.className = 'ct-confirm-overlay';
  ov.innerHTML = `<div class="ct-confirm"><h1>${esc(title)}</h1><p>${esc(message).replace(/\\n/g, '\n')}</p>
    <div class="group"><button data-a="ok">확인</button><button data-a="no">취소</button></div></div>`;
  ov.addEventListener('click', e => {
    const a = e.target.dataset.a;
    if (a || e.target === ov) { ov.remove(); if (a === 'ok') onOk && onOk(); }
  });
  document.body.appendChild(ov);
}

/* ---------- Modal (reactstrap Modal → Bootstrap Modal) ---------- */
function showModal(inner, setup, width = 325) {
  const el = document.createElement('div');
  el.className = 'modal fade ct-modal';
  el.tabIndex = -1;
  el.innerHTML = `<div class="modal-dialog" style="width:${width}px"><div class="modal-content">${inner}</div></div>`;
  document.body.appendChild(el);
  const m = new bootstrap.Modal(el);
  el.addEventListener('hidden.bs.modal', () => { m.dispose(); el.remove(); });
  const ctx = { el, hide: () => m.hide(), then: fn => el.addEventListener('hidden.bs.modal', fn, { once: true }) };
  setup && setup(ctx);
  m.show();
  return ctx;
}
const modalHead = title => `<div class="modal-header"><h5 class="modal-title"><span>${title}</span></h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>`;

/* ---------- SVG 버튼 ---------- */
const bookmarkSvg = on => `<svg class="svg-btn" data-bookmark viewBox="-4 -4 24 24" height="24" width="24"stroke="${on ? '#ffbf00' : 'currentColor'}" fill="${on ? '#ffbf00' : 'none'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>`;
/* 목록 '인기' 컬럼용: 코끼리/맘모스는 북마크 수 → 북마크 아이콘 (코글은 좋아요 수 → 하트 💞) */
const BM_ICON = '<i class="bi bi-bookmark-fill" style="color:#ffbf00;margin-left:3px"></i>';
const heartSvg = on => `<svg class="svg-btn" data-like viewBox="0 0 24 24" height="24" width="24" stroke="${on ? '#ef4444' : 'currentColor'}" fill="${on ? '#ef4444' : 'none'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"/></svg>`;

/* ---------- Lottie ---------- */
function lottieInto(el, file) {
  if (!el || !window.lottie) return;
  lottie.loadAnimation({ container: el, renderer: 'svg', loop: true, autoplay: true, path: 'assets/' + file });
}

/* ---------- Toast UI Editor ---------- */
function makeEditor(el, html) {
  if (window.toastui && toastui.Editor) {
    const ed = new toastui.Editor({
      el, height: '600px', initialEditType: 'wysiwyg', previewStyle: 'vertical', initialValue: '', autofocus: false,
      toolbarItems: [['heading', 'bold', 'italic', 'strike'], ['hr', 'quote'], ['ul', 'ol', 'task', 'indent', 'outdent'], ['table', 'image', 'link'], ['code', 'codeblock']],
    });
    if (html) ed.setHTML(html);
    return { getHTML: () => ed.getHTML(), isEmpty: () => !ed.getMarkdown().trim() };
  }
  el.innerHTML = `<textarea class="editor-fallback">${esc((html || '').replace(/<[^>]+>/g, ''))}</textarea>`;
  const ta = el.querySelector('textarea');
  return { getHTML: () => ta.value.split('\n').map(l => `<p>${esc(l)}</p>`).join(''), isEmpty: () => !ta.value.trim() };
}

/* ---------- 파트 현황 툴팁 ---------- */
function partsTable(parts, includeLeader = false) {
  const rows = parts.filter(p => includeLeader || p.partNo !== 1)
    .map(p => `<tr><td>${esc(p.partName)}</td><td>${p.recruitCount}</td><td>${p.recruitCount - p.currentCount}</td></tr>`).join('');
  return `<table class="table table-bordered"><thead><tr><th>파트 / 현황</th><th>모집 인원</th><th>남은 자리</th></tr></thead><tbody>${rows}</tbody></table>`;
}
document.addEventListener('mouseover', e => {
  const t = e.target.closest('[data-tip]');
  if (!t || t._tip) return;
  const r = RECRUITS.find(x => x.recruitNo == t.dataset.tip);
  if (!r || !r.project) return;
  const tip = document.createElement('div');
  tip.className = 'ct-tooltip';
  tip.innerHTML = partsTable(r.project.projectParts);
  document.body.appendChild(tip);
  /* body zoom(해상도 배율) 보정: 화면 좌표 → 레이아웃 좌표 */
  const z = zoomFactor(), b = t.getBoundingClientRect();
  tip.style.left = ((b.left + window.scrollX) / z + b.width / z / 2 - 150) + 'px';
  tip.style.top = ((b.bottom + window.scrollY) / z + 8) + 'px';
  t._tip = tip;
  t.addEventListener('mouseleave', () => { tip.remove(); t._tip = null; }, { once: true });
});
const clearTips = () => { $$('.ct-tooltip').forEach(x => x.remove()); $$('[data-tip]').forEach(x => x._tip = null); };

/* ---------- 페이징 ---------- */
const PAGE_SIZE = 10;
function paginate(list, page, size = PAGE_SIZE) {
  const allPage = Math.max(1, Math.ceil(list.length / size));
  const cur = Math.min(Math.max(1, page), allPage);
  const startPage = Math.floor((cur - 1) / 10) * 10 + 1;
  const endPage = Math.min(startPage + 9, allPage);
  return { rows: list.slice((cur - 1) * size, cur * size), pageInfo: { allPage, curPage: cur, startPage, endPage } };
}
/* 목록 화면: 푸터 구분선이 스크롤 직전 브라우저 끝선에 오도록 한 페이지 줄 수(5~10)를 화면 높이에 맞춘다 */
const ROW_H = 37; /* 표 한 줄(=머리글) 높이(px) — .table-area min-height 계산과 동일 */
const tableMinHeight = size => `min-height:${ROW_H * (size + 1)}px`;
function fitListRows(st, rerender) {
  const pl = $('.page-list');
  if (!pl) return;
  /* 웹폰트 로드 전후로 제목 높이가 달라지므로 로드 완료 후 다시 계산 */
  /* 웹폰트(동적으로 불러오는 Pretendard 포함)·이미지 로드 등으로 목록 높이가 바뀌면 즉시 다시 맞춘다 */
  if (window.ResizeObserver && pl._fitObserved !== true) {
    pl._fitObserved = true;
    if (fitListRows.ro) fitListRows.ro.disconnect();
    fitListRows.ro = new ResizeObserver(() => { if ($('.page-list') === pl) fitListRows(st, rerender); });
    fitListRows.ro.observe(pl);
  }
  if (document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(() => { if ($('.page-list') === pl) fitListRows(st, rerender); });
  }
  const z = zoomFactor();
  const over = pl.getBoundingClientRect().bottom + window.scrollY - window.innerHeight; /* 화면 px */
  const cur = st.size || PAGE_SIZE;
  const target = Math.max(3, Math.min(PAGE_SIZE, cur - Math.ceil(over / (ROW_H * z))));
  if (target !== cur) { st.size = target; rerender(); }
}
function pagerHtml(count, pi) {
  if (count === 0) return `<button class="btn btn-secondary">1</button>`;
  let h = `<button class="btn btn-outline-secondary" data-page="${pi.curPage - 1}">&lt;</button>`;
  for (let i = pi.startPage; i <= pi.endPage; i++) h += `<button class="btn ${i === pi.curPage ? 'btn-secondary' : 'btn-outline-secondary'}" data-page="${i}">${i}</button>`;
  return h + `<button class="btn btn-outline-secondary" data-page="${pi.curPage + 1}">&gt;</button>`;
}
function bindPager(root, pi, onPage) {
  $$('[data-page]', root).forEach(b => b.addEventListener('click', () => {
    const p = +b.dataset.page;
    if (p < 1 || p > pi.allPage || p === pi.curPage) return;
    onPage(p);
  }));
}
const searchGroupHtml = (kw = '') => `<div class="search-group"><div class="input-group">
  <input type="text" class="form-control" placeholder="검색어를 입력하세요" value="${esc(kw)}" data-kw>
  <button class="btn btn-outline-secondary" data-search><i class="bi bi-search"></i></button></div></div>`;
function bindSearch(root, onSearch) {
  const inp = $('[data-kw]', root);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') onSearch(inp.value.trim()); });
  $('[data-search]', root).addEventListener('click', () => onSearch(inp.value.trim()));
}

/* =====================================================================
   Header / Footer / Side / Messenger
   ===================================================================== */
function renderHeader() {
  const u = me();
  const unread = NOTIFICATIONS.filter(n => !n.isClicked && !n.seen).length;
  const right = !u
    ? `<li class="nav-item-dropdown"><div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle header-toggle" data-bs-toggle="dropdown" data-bs-display="static"><i class="bi bi-person-circle"></i></button>
          <div class="dropdown-menu dropdown-menu-end">
            <a class="dropdown-item" href="javascript:void(0)" data-open="login"><b>로그인</b></a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="javascript:void(0)" data-open="signup"><b>회원가입</b></a>
          </div></div></li>`
    : `<li class="nav-item-dropdown"><div class="dropdown" id="alarmDropdown">
          <button class="btn btn-secondary dropdown-toggle header-toggle" data-bs-toggle="dropdown" data-bs-display="static" data-bs-auto-close="outside"><i class="bi bi-lightbulb"></i></button>
          ${unread > 0 ? `<span class="alarm-badge">${unread}</span>` : ''}
          <div class="dropdown-menu dropdown-menu-end alarm-menu">
            <div class="alarm-head"><b>새 소식</b></div>
            <div class="alarm-body">${alarmItems()}</div>
          </div></div></li>
       <li class="nav-item-dropdown"><div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle header-toggle" data-bs-toggle="dropdown" data-bs-display="static"><img class="profile-sm" src="${avatar(u)}" alt="profile"></button>
          <div class="dropdown-menu dropdown-menu-end">
            <a class="dropdown-item" href="#/mypage" data-mypage><b>마이페이지</b></a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="javascript:void(0)" data-logout><b>로그아웃</b></a>
          </div></div></li>`;

  $('#header').innerHTML = `
    <ul class="nav-items-1"><li class="nav-item">
      <a href="#/" class="logo-link"><div class="logo-container">
        <img class="logo-image" src="assets/elephant-header.png" alt=""><div class="logo-text"><b>C</b>oder<b>Town</b></div></div></a>
    </li></ul>
    <img src="assets/header-spring.png" class="header-spring left" alt="">
    <ul class="nav-items-2">
      <li class="nav-item"><a href="#/cokkiri"><span>코끼리</span></a></li>
      <li class="nav-item"><a href="#/mammoth"><span>맘모스</span></a></li>
      <li class="nav-item"><a href="#/coggle"><span>코글</span></a></li>
    </ul>
    <img src="assets/header-spring.png" class="header-spring right" alt="">
    <ul class="nav-items-3">${right}</ul>`;

  const h = $('#header');
  $$('[data-open]', h).forEach(a => a.addEventListener('click', () => a.dataset.open === 'login' ? openLogin() : openSignUp()));
  const lo = $('[data-logout]', h);
  if (lo) lo.addEventListener('click', () => {
    S.userId = ''; store.set('ct_user', '');
    if (location.hash.startsWith('#/mypage')) go('/');
    refreshChrome(); route();
  });
  const mp = $('[data-mypage]', h);
  if (mp) mp.addEventListener('click', () => { S.mypageTab = '1'; store.set('activeTab', '1'); if (location.hash === '#/mypage') route(); });
  const ad = $('#alarmDropdown');
  if (ad) {
    ad.addEventListener('show.bs.dropdown', () => { NOTIFICATIONS.forEach(n => n.seen = true); const b = $('.alarm-badge', ad); b && b.remove(); });
    $$('[data-noti]', ad).forEach(it => it.addEventListener('click', () => {
      const n = NOTIFICATIONS.find(x => x.notificationNo == it.dataset.noti);
      n.isClicked = true;
      it.classList.add('clicked');
      bootstrap.Dropdown.getOrCreateInstance($('.dropdown-toggle', ad)).hide();
      S.focusComment = n.commentNo;
      const target = '#/coggle-detail/' + n.coggleNo;
      if (location.hash === target) route(); else location.hash = target;
    }));
  }
}
function alarmItems() {
  const list = NOTIFICATIONS.slice().sort((a, b) => b.firstRegDate.localeCompare(a.firstRegDate));
  if (!list.length) return '';
  return list.map(n => {
    const from = user(n.from);
    const coggle = COGGLES.find(c => c.coggleNo === n.coggleNo);
    const head = n.replyCondition === 'MYPOST' || n.replyCondition === 'MYMENTION'
      ? `<b>${esc(from.nickname)}</b>님이 댓글을 남겼습니다.`
      : `<b>${esc(from.nickname)}</b>님이 <b>${esc(n.mentionNickname)}</b>님에게 댓글을 남겼습니다.`;
    return `<div class="alarm-item ${n.isClicked ? 'clicked' : ''}" data-noti="${n.notificationNo}"><div class="alarm-inner">
      <img src="${avatar(from)}" alt="">
      <div class="alarm-text"><span style="white-space:pre-wrap">${head}</span>
        <span class="ell">${esc(n.commentContent)}</span><span class="ell title">${esc(coggle ? coggle.title : '')}</span></div>
      <div class="alarm-date">${ymd(n.firstRegDate)}</div></div></div>`;
  }).join('');
}

function renderFooter() {
  $('#footer').innerHTML = `
    <div class="footer-items-0"></div>
    <div class="footer-items-1">
      <div class="footer-brand">
        <img src="assets/elephant-footer.png" class="footer-logo-img" alt="">
        <div class="footer-logo-text">
          <div class="logo-text"><b>C</b>oder<b>Town</b></div>
          <div class="footer-slogan">코딩하는 사람 끼리 | 맘 맞는 사람 모여 스터디<br/>채팅 커뮤니티 플랫폼</div>
        </div>
      </div>
      <ul class="footer-links"><li>이용약관</li><li>개인정보 처리 방침</li><li>FAQ</li></ul>
      <div class="footer-info">경기 광명시 오리로 835 해보자컴퍼니 유재혁<span class="sep">|</span>webdevyoo@gmail.com</div>
      <div class="footer-copy">Copyright© By 2023. CoderTown All Rights Reserved.</div>
    </div>
    <div class="footer-items-2"><div class="footer-sns">
      <button class="btn btn-dark btn-sm"><i class="bi bi-github"></i></button>&nbsp;&nbsp;
      <button class="btn btn-dark btn-sm"><i class="bi bi-instagram"></i></button>
    </div></div>`;
}

/* ---------- Messenger (MessengerFrame + Chat) ---------- */
function totalUnread() { return CHAT_ROOMS.reduce((a, r) => a + r.newMsgCount, 0); }
function renderMessenger() {
  const m = $('#messenger');
  if (!isLogin()) { m.innerHTML = ''; S.dmOpen = false; return; }
  const n = totalUnread();
  m.innerHTML = `
    <div class="dm-btn dm-icon-onoff-button" data-dm="on" style="display:${S.dmOpen ? 'none' : 'flex'}">
      <i class="bi bi-messenger"></i>${n > 0 ? `<span class="dm-badge">${n}</span>` : ''}</div>
    <div class="dm-btn off dm-icon-onoff-button" data-dm="off" style="display:${S.dmOpen ? 'flex' : 'none'}"><i class="bi bi-x"></i></div>
    <div class="dm-frame ${S.dmOpen ? 'open' : ''}"><div class="chat-stack">
      <div id="chatList"></div><div id="chatRoom" class="chat-room-layer"></div>
    </div></div>`;
  /* 다시 그리지 않고 클래스만 토글해야 열림/닫힘 트랜지션이 동작한다 */
  const setDm = open => {
    S.dmOpen = open;
    $('[data-dm=on]', m).style.display = open ? 'none' : 'flex';
    $('[data-dm=off]', m).style.display = open ? 'flex' : 'none';
    if (open) {
      /* 열 때는 항상 목록부터: 채팅방 레이어를 애니메이션 없이 닫아둔다 */
      const room = $('#chatRoom');
      room.style.transition = 'none'; room.classList.remove('in'); void room.offsetWidth; room.style.transition = '';
      S.chatRoomNo = null; renderChatList();
    }
    $('.dm-frame', m).classList.toggle('open', open);
  };
  $('[data-dm=on]', m).addEventListener('click', () => setDm(true));
  $('[data-dm=off]', m).addEventListener('click', () => setDm(false));
  renderChatList();
  if (S.chatRoomNo) openRoom(S.chatRoomNo, true);
}
function citem(u, title, sub, date, unread) {
  return `<div class="citem-avatar"><img src="${avatar(u)}" alt=""></div><div class="citem-body">
    <div class="citem-top"><div class="citem-title">${title}</div><div class="citem-date">${date ? timeago(date) : ''}</div></div>
    <div class="citem-bottom"><div class="citem-sub">${sub}</div>${unread > 0 ? `<span class="citem-unread">${unread}</span>` : ''}</div></div>`;
}
function renderChatList() {
  const el = $('#chatList');
  if (!el) return;
  const rooms = CHAT_ROOMS.slice().sort((a, b) => lastMsg(b).chatSendDate.localeCompare(lastMsg(a).chatSendDate));
  el.innerHTML = `<div class="chat-pane list">${rooms.length === 0 ? '<div class="chat-empty">참여중인 채팅방이 없습니다.</div>'
    : rooms.map(r => {
      const lm = lastMsg(r);
      return `<div class="citem" data-room="${r.chatRoomNo}">${citem(user(r.friend), esc(user(r.friend).nickname), lm.message ? esc(lm.message) : '파트신청 대화 신청', lm.chatSendDate, r.newMsgCount)}</div>`;
    }).join('')}</div>`;
  $$('[data-room]', el).forEach(x => x.addEventListener('click', () => openRoom(x.dataset.room)));
}
const lastMsg = r => r.messages[r.messages.length - 1] || { message: null, chatSendDate: r.createdAt || nowIso() };
function openRoom(no, keep) {
  const r = CHAT_ROOMS.find(x => x.chatRoomNo === no);
  if (!r) return;
  S.chatRoomNo = no;
  if (!keep) { r.newMsgCount = 0; updateDmBadge(); }
  const f = user(r.friend);
  const status = !r.isRoomMaker && !r.isConfirm ? `<button class="btn btn-sm btn-purple" data-accept>수락</button>`
    : r.isRoomMaker && !r.isConfirm ? `<p>수락<br/>대기</p>`
      : !r.isRoomMaker ? `<p style="color:rgb(104,97,236)">수락<br/>완료</p>` : `<p style="color:rgb(104,97,236)">참여<br/>완료</p>`;
  const el = $('#chatRoom');
  el.innerHTML = `<div class="chat-pane" style="overflow:hidden">
    <div class="chat-head"><i class="bi bi-chevron-left" data-back></i><div class="citem">${citem(f, (r.friendConnected ? '🟢' : '🔴') + esc(f.nickname), '', nowIso(), 0)}</div></div>
    <div class="chat-proj"><div class="part"><ul class="main_project_part_list_ul keep-kotra" style="width:auto"><li class="main_project_part_list_li">${esc(r.partName)}</li></ul></div>
      <div class="ptitle keep-kotra"><a href="#/cokkiri-detail/${r.cokkiriNo}"><b>${esc(r.projectTitle)}</b></a></div><div class="pstatus">${status}</div></div>
    <div class="chat-body" id="chatBody"></div>
    <div class="chat-foot"><textarea rows="1" placeholder="내용을 입력하세요" id="chatInput"></textarea><button class="btn btn-sm btn-purple" id="chatSend">전송</button></div>
  </div>`;
  /* 채팅방 레이어가 오른쪽에서 목록 위로 덮으며 진입 (재렌더 시에는 애니메이션 없이 바로 표시) */
  if (!keep) void el.offsetWidth; /* 현재 위치(오른쪽 밖)를 확정시켜 트랜지션이 거기서 시작되도록 */
  el.classList.add('in');
  renderMessages(r);
  $('[data-back]', el).addEventListener('click', () => { S.chatRoomNo = null; el.classList.remove('in'); renderChatList(); });
  const acc = $('[data-accept]', el);
  if (acc) acc.addEventListener('click', () => confirmBox('참여 요청 수락 확인', '프로젝트 참여 요청을 수락하시겠습니까?', () => { r.isConfirm = true; openRoom(no, true); }));
  const ta = $('#chatInput');
  const send = () => {
    const v = ta.value.trim();
    if (!v) return;
    r.messages.push({ sender: S.userId, message: v, chatSendDate: nowIso(), isReaded: r.friendConnected });
    ta.value = ''; ta.style.height = '';
    renderMessages(r);
    fakeReply(r);
  };
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
  ta.addEventListener('input', () => {
    ta.style.height = '';
    ta.style.height = Math.min(114, ta.scrollHeight + 2) + 'px'; /* +2: 테두리 */
    ta.style.overflowY = ta.scrollHeight + 2 > 114 ? 'auto' : 'hidden';
  });
  $('#chatSend').addEventListener('click', send);
}
function renderMessages(r) {
  const body = $('#chatBody');
  if (!body) return;
  body.innerHTML = r.messages.length === 0 ? `<div style="width:100px;margin:162px auto">채팅 데이터 없음</div>`
    : r.messages.map(m => {
      const mine = m.sender === S.userId;
      return `<div class="mbox-row"><div class="mbox ${mine ? 'right' : ''}"><div class="mbox-title">${esc(user(m.sender).nickname)}</div>
        <div class="mbox-text">${esc(m.message)}</div>
        <div class="mbox-time">${timeago(m.chatSendDate)}${mine ? `<i class="bi bi-check2-all ${m.isReaded ? 'read' : ''}"></i>` : ''}</div></div></div>`;
    }).join('');
  body.scrollTop = body.scrollHeight;
}
const REPLIES = ['넵 확인했습니다!', '좋아요 👍', '이번 주말에 회의 어떠세요?', '디스코드 링크 보내드릴게요.', '감사합니다 🙇'];
function fakeReply(r) {
  setTimeout(() => {
    r.messages.forEach(m => { if (m.sender === S.userId) m.isReaded = true; });
    r.messages.push({ sender: r.friend, message: REPLIES[Math.floor(Math.random() * REPLIES.length)], chatSendDate: nowIso(), isReaded: false });
    if (S.dmOpen && S.chatRoomNo === r.chatRoomNo) renderMessages(r);
    else { r.newMsgCount++; updateDmBadge(); renderChatList(); }
  }, 1500);
}
function updateDmBadge() {
  const b = $('[data-dm=on]');
  if (!b) return;
  const n = totalUnread();
  const old = $('.dm-badge', b); old && old.remove();
  if (n > 0) b.insertAdjacentHTML('beforeend', `<span class="dm-badge">${n}</span>`);
}

function refreshChrome() { renderHeader(); renderMessenger(); }

/* =====================================================================
   Modals: 로그인 / 회원가입 / 간편가입 / 소셜가입 / 계정찾기
   ===================================================================== */
function login(email) {
  S.userId = email; store.set('ct_user', email);
  ok('로그인에 성공했습니다');
  refreshChrome(); route();
}
function openLogin() {
  showModal(`${modalHead('로그인')}
    <div class="modal-body"><form onsubmit="return false">
      <div class="mb-3"><label class="col-form-label">이메일</label><input class="form-control" name="email" value="${DEMO_USER}"></div>
      <div class="mb-3"><label class="col-form-label">패스워드</label><input class="form-control" type="password" name="password" value="Demo1234!"></div>
      <div class="mb-3" style="overflow:hidden"><label><input type="checkbox"> Remember Me</label>
        <a href="javascript:void(0)" style="float:right" data-to-signup>회원가입</a><br/>
        <a href="javascript:void(0)" style="float:right" data-to-find>아이디/패스워드 찾기</a></div>
    </form></div>
    <div class="modal-footer"><button class="btn btn-secondary" style="margin:0 auto;width:100%" data-login>로그인</button></div>`, m => {
    const email = $('[name=email]', m.el), pw = $('[name=password]', m.el);
    const submit = () => {
      if (!email.value.trim()) return warn('이메일을 입력해주세요');
      if (!pw.value) return warn('패스워드를 입력해주세요');
      const u = USERS.find(x => x.email === email.value.trim());
      if (u && u.password && u.password !== pw.value) return err('입력하신 회원정보가 일치하지 않습니다. \n 회원 정보를 찾으시려면 아래 아이디/패스워드 찾기를 눌러주세요');
      m.hide(); login(u ? u.email : DEMO_USER);
    };
    $('[data-login]', m.el).addEventListener('click', submit);
    [email, pw].forEach(i => i.addEventListener('keydown', e => e.key === 'Enter' && submit()));
    $('[data-to-signup]', m.el).addEventListener('click', () => { m.then(openSignUp); m.hide(); });
    $('[data-to-find]', m.el).addEventListener('click', () => { m.then(openFindUser); m.hide(); });
  }, 320);
}
function openSignUp() {
  showModal(`${modalHead('회원가입')}
    <div class="modal-body">
      <div class="mb-3"><button class="btn btn-secondary" style="width:285px">구글로 시작하기</button></div>
      <div class="mb-3"><button class="btn btn-warning" style="width:285px" data-kakao>카카오로 시작하기</button></div>
    </div>
    <div class="modal-footer"><button class="btn btn-outline-secondary" style="width:285px;margin:0 auto" data-simple>ID / PW 회원가입</button></div>`, m => {
    $('[data-simple]', m.el).addEventListener('click', () => { m.then(openSignUpSimple); m.hide(); });
    $('[data-kakao]', m.el).addEventListener('click', () => { toast('default', '[목업] 카카오 OAuth2 인증 성공 → 소셜 회원가입'); m.then(openSignUpSocial); m.hide(); });
  });
}
function openSignUpSocial() {
  showModal(`${modalHead('소셜 회원가입')}
    <div class="modal-body"><div class="mb-3"><label class="col-form-label">닉네임</label>
      <span class="smsg" style="color:red" data-m="reg">❌ 닉네임 양식 오류</span>
      <span class="smsg" style="color:red" data-m="exist">❌ 이미 사용중 입니다</span>
      <span class="smsg" style="color:#0d6efd" data-m="ok">✔ 사용가능</span>
      <input class="form-control" placeholder="첫글자 한or영문자 & 특수문자를 제외한 2글자 이상"></div></div>
    <div class="modal-footer"><button class="btn btn-outline-secondary" style="width:285px;margin:0 auto" data-bs-dismiss="modal">회원가입</button></div>`, m => {
    const inp = $('input', m.el);
    inp.addEventListener('input', () => {
      $$('.smsg', m.el).forEach(s => s.classList.remove('on'));
      const v = inp.value;
      if (!v) return;
      const k = !/^[a-zA-Z가-힣][a-zA-Z가-힣0-9]{1,9}$/.test(v) ? 'reg' : USERS.some(u => u.nickname === v) ? 'exist' : 'ok';
      $(`[data-m=${k}]`, m.el).classList.add('on');
    });
  });
}
function openSignUpSimple() {
  const st = { checked: false, code: null, authed: false };
  showModal(`${modalHead('간편 회원가입')}
    <div class="modal-body"><form onsubmit="return false">
      <div class="row mb-3">
        <div class="col-9"><label class="col-form-label">이메일</label>
          <span class="smsg" data-m="ereg">❌ 이메일 양식 오류</span><span class="smsg" data-m="eexist">❌ 이미 사용중 입니다</span><span class="smsg" data-m="eok">✔ 사용가능</span>
          <input class="form-control" type="email" name="email"></div>
        <div class="col-3" style="padding-left:0"><button class="btn btn-outline-secondary btn-sm w-100" data-reset disabled>초기화</button>
          <button class="btn btn-outline-secondary btn-sm w-100" style="margin-top:10px" data-dup>중복 확인</button></div>
      </div>
      <div class="row mb-3">
        <div class="col-9"><label class="col-form-label">인증번호</label><input class="form-control" name="code" disabled></div>
        <div class="col-3" style="padding-left:0"><button class="btn btn-outline-secondary btn-sm w-100" data-issue disabled>(재)발급</button>
          <button class="btn btn-outline-secondary btn-sm w-100" style="margin-top:10px" data-auth disabled>인증</button></div>
      </div>
      <div class="mb-3"><label class="col-form-label">패스워드</label>
        <span class="smsg" data-m="pok">✔ 사용가능</span><span class="smsg" data-m="pbad">❌ 패스워드 사용불가</span>
        <input class="form-control" type="password" name="pw" placeholder="특수문자, 대문자를 각각 1자 이상 포함한 최소 10자리"></div>
      <div class="mb-3"><label class="col-form-label">재입력</label>
        <span class="smsg" data-m="cok">✔ 패스워드 일치</span><span class="smsg" data-m="cbad">❌ 패스워드 불일치</span>
        <input class="form-control" type="password" name="pw2"></div>
    </form></div>
    <div class="modal-footer"><button class="btn btn-secondary" style="margin:0 auto;width:100%" data-submit>가입신청</button></div>`, m => {
    const q = s => $(s, m.el);
    const show = (keys, on) => keys.forEach(k => q(`[data-m=${k}]`).classList.toggle('on', on));
    const email = q('[name=email]'), code = q('[name=code]'), pw = q('[name=pw]'), pw2 = q('[name=pw2]');
    const eReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const pReg = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-])(?=.*[A-Z]).{9,}$/;
    const lock = on => { email.disabled = on; q('[data-dup]').disabled = on; q('[data-reset]').disabled = !on; };
    email.addEventListener('input', () => { show(['ereg', 'eexist', 'eok'], false); if (email.value && !eReg.test(email.value)) show(['ereg'], true); st.checked = false; st.code = null; });
    const chkConfirm = () => { show(['cok', 'cbad'], false); if (pw2.value) show([pw2.value === pw.value ? 'cok' : 'cbad'], true); };
    pw.addEventListener('input', () => { show(['pok', 'pbad'], false); if (pw.value) show([pReg.test(pw.value) ? 'pok' : 'pbad'], true); chkConfirm(); });
    pw2.addEventListener('input', chkConfirm);
    q('[data-dup]').addEventListener('click', () => {
      if (!email.value) return warn('이메일을 입력해주세요.');
      if (!eReg.test(email.value)) return warn('사용이 불가능한 이메일입니다. \n안내문구를 확인 하셨다면 양식을 지켜주세요.');
      show(['ereg', 'eexist', 'eok'], false);
      if (USERS.some(u => u.email === email.value)) return show(['eexist'], true);
      show(['eok'], true); st.checked = true;
      code.disabled = false; q('[data-issue]').disabled = false; q('[data-auth]').disabled = false;
    });
    q('[data-issue]').addEventListener('click', () => {
      if (!st.checked) return err('메일 전송 불가능. \n 입력하신 이메일 중복여부를 확인해주세요.');
      st.code = '123456';
      ok('메일 전송요청 완료. \n 입력하신 이메일을 확인해주세요. \n (목업 인증번호: 123456)');
    });
    q('[data-auth]').addEventListener('click', () => {
      if (!code.value) return warn('인증번호를 입력해주세요.');
      if (!st.checked) return warn('인증번호가 발급된 상태에서 인증되기 전 입력하신 이메일이 수정되었습니다. \n 다시한번 수정하신 메일을 중복 확인 하시 후 번호를 발급받아 주세요.');
      if (code.value !== st.code) return warn('인증번호가 일치하지 않습니다. \n 재 발급을 시도해보세요.');
      ok('인증 완료'); st.authed = true; lock(true);
      code.disabled = true; q('[data-issue]').disabled = true; q('[data-auth]').disabled = true;
    });
    q('[data-reset]').addEventListener('click', () => confirmBox('입력폼 초기화 확인', '초기화시 중복확인 및 본인인증을 다시 진행하셔야 합니다. \n 초기화 하시겠습니까?', () => {
      email.value = ''; code.value = ''; Object.assign(st, { checked: false, code: null, authed: false }); lock(false); show(['ereg', 'eexist', 'eok'], false);
    }));
    q('[data-submit]').addEventListener('click', () => {
      if (!email.value) return warn('이메일을 입력해 주세요');
      if (!eReg.test(email.value)) return warn('이메일 양식 불량');
      if (!st.checked) return warn('중복인증 체크');
      if (!st.authed) return warn('인증번호 체크');
      if (!pw.value) return warn('패스워드를 입력해 주세요.');
      if (!pReg.test(pw.value)) return warn('패스워드 조건에 맞지 않습니다. \n 입력란 문구를 확인해주세요.');
      if (!pw2.value) return warn('재입력을 입력해 주세요');
      if (pw.value !== pw2.value) return warn('패스워드가 일치하지 않습니다.');
      USERS.push({ email: email.value, nickname: email.value.split('@')[0].slice(0, 10), password: pw.value, profileUrl: null });
      ok('회원가입에 성공했습니다'); m.hide();
    });
  });
}
function openFindUser() {
  showModal(`<div class="modal-header" style="border-bottom:1px solid black;padding-bottom:0">
      <ul class="nav nav-tabs find-tabs" style="width:290px;border-bottom:none">
        <li class="nav-item"><a class="nav-link active" href="javascript:void(0)" data-t="1">이메일 찾기</a></li>
        <li class="nav-item"><a class="nav-link" href="javascript:void(0)" data-t="2">패스워드 찾기</a></li></ul></div>
    <div data-p="1"><div class="modal-body" style="height:125px">
        <input class="form-control mb-2" placeholder="등록한 핸드폰번호를 입력해주세요"><input class="form-control" placeholder="사용자 닉네임을 입력해주세요."></div>
      <div class="modal-footer"><button class="btn btn-outline-secondary" style="width:285px;margin:0 auto">이메일 찾기</button></div></div>
    <div data-p="2" style="display:none"><div class="modal-body" style="height:70px"><input class="form-control" placeholder="사용자 이메일을 입력해 주세요"></div>
      <div class="modal-footer"><button class="btn btn-outline-secondary" style="width:285px;margin:0 auto">패스워드 찾기</button></div></div>`, m => {
    $$('[data-t]', m.el).forEach(a => a.addEventListener('click', () => {
      $$('[data-t]', m.el).forEach(x => x.classList.toggle('active', x === a));
      $$('[data-p]', m.el).forEach(p => p.style.display = p.dataset.p === a.dataset.t ? '' : 'none');
    }));
  });
}

/* =====================================================================
   Main
   ===================================================================== */
function bookmarkToggle(r) {
  if (!isLogin()) { warn('북마크 기능을 이용하시려면 로그인이 필요합니다.'); return false; }
  const i = r.bookmarkedBy.indexOf(S.userId);
  if (i >= 0) { r.bookmarkedBy.splice(i, 1); ok('북마크 해제 되었습니다.'); }
  else { r.bookmarkedBy.push(S.userId); ok('북마크에 추가되었습니다.'); }
  return true;
}
function cardFoot(r) {
  const w = user(r.writer);
  return `<div class="card-foot"><img src="${avatar(w)}" alt=""><span class="nick">${esc(w.nickname)}</span><span class="views">👀&nbsp;${r.views}</span></div>`;
}
function cardHtml(r) {
  const on = r.bookmarkedBy.includes(S.userId);
  const isC = r.category === 'cokkiri';
  return `<div class="card ct-card">
    <div class="card-body">
      <h6 class="card-subtitle mb-3 text-muted"><div class="studyItem_badgeWrapper__3AW7k keep-kotra"><div class="badge_badge__ZfNyB"><div class="badge_study__39LDm">${isC ? '💻 코끼리 - 프로젝트' : '✏️ 맘모스 - 스터디'}</div></div></div>
        <div class="bookmark-pos" data-bm="${r.recruitNo}">${bookmarkSvg(on)}</div></h6>
      <div class="card-title ${isC ? 'mb-2' : 'mb-3'} text-muted css-a6vgi6 keep-kotra"><a href="#/${isC ? 'cokkiri' : 'mammoth'}-detail/${r.recruitNo}" ${isC ? `data-tip="${r.recruitNo}"` : ''}><b>${esc(r.title)}</b></a></div>
      <div class="studyItem_schedule__3oAnA"><p>${isC ? `목표기간 | ${r.project.objectWeek}주` : `모임 위치 | ${esc(r.location.fullLocation)}`}</p></div>
      <ul class="main_project_part_list_ul keep-kotra">${isC
      ? r.project.projectParts.filter(p => p.partNo !== 1).map(p => `<li class="main_project_part_list_li">${esc(p.partName)}</li>`).join('')
      : `<li class="main_project_part_list_li" style="color:coral">${r.link ? '오픈톡' : 'DM'}</li>`}</ul>
    </div>${cardFoot(r)}</div>`;
}
function bindBookmarks(root) {
  $$('[data-bm]', root).forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const r = RECRUITS.find(x => x.recruitNo == b.dataset.bm);
    if (bookmarkToggle(r)) b.innerHTML = bookmarkSvg(r.bookmarkedBy.includes(S.userId));
  }));
}
function pageMain() {
  const tabs = [['1', '전체'], ['2', '코끼리'], ['3', '맘모스']];
  const filter = { '1': () => true, '2': r => r.category === 'cokkiri', '3': r => r.category === 'mammoth' }[S.mainTab];
  const list = RECRUITS.filter(r => !r.status && filter(r)).sort((a, b) => b.firstRegDate.localeCompare(a.firstRegDate)).slice(0, 20);
  app().innerHTML = `<div class="main-wrap">
    <ul class="nav nav-pills custom-nav">${tabs.map(([k, t]) => `<li><a class="nav-link ${S.mainTab === k ? 'active' : ''}" href="javascript:void(0)" data-tab="${k}">${t}</a></li>`).join('')}</ul>
    <div class="card-grid">${list.map(cardHtml).join('')}</div></div>`;
  $$('[data-tab]').forEach(a => a.addEventListener('click', () => { S.mainTab = a.dataset.tab; pageMain(); }));
  bindBookmarks(app());
  /* 코끼리/맘모스 모두 카드 전체 클릭으로 상세 진입 (북마크 클릭 제외) */
  $$('.ct-card').forEach((c, i) => {
    c.addEventListener('click', e => {
      if (e.target.closest('[data-bm]') || e.target.closest('a')) return;
      go(`/${list[i].category}-detail/${list[i].recruitNo}`);
    });
  });
}

/* =====================================================================
   코끼리 / 맘모스 목록
   ===================================================================== */
function pageRecruitList(kind) {
  const st = S.lists[kind] || (S.lists[kind] = { page: 1, keyword: '' });
  const all = RECRUITS.filter(r => r.category === kind && !r.status && (!st.keyword || r.title.includes(st.keyword)))
    .sort((a, b) => b.recruitNo - a.recruitNo);
  const { rows, pageInfo } = paginate(all, st.page, st.size || PAGE_SIZE);
  const isC = kind === 'cokkiri';
  const heading = isC
    ? `<div class="list-heading" style="width:165px"><h1 style="width:30px"><b>코</b></h1><span style="width:65px">딩하는 사람</span><h1 style="width:60px;margin:30px 10px 30px 0"><b>끼리</b></h1></div>`
    : `<div class="list-heading" style="width:180px"><h1 style="width:30px"><b>맘</b></h1><span style="width:60px">맞는 사람</span><h1 style="width:30px;margin:30px -5px 30px 0"><b>모</b></h1><span style="width:30px">여서</span><h1 style="width:30px;margin:30px -5px 30px 0"><b>스</b></h1><span style="width:35px">터디</span></div>`;
  app().innerHTML = `<div class="page-list">${heading}
    <div class="list-bar"><span class="list-count">${all.length}개</span><div class="list-bar-right">${searchGroupHtml(st.keyword)}</div></div>
    <div class="table-area" style="${tableMinHeight(st.size || PAGE_SIZE)}"><table class="table t-list"><thead><tr><th>No</th><th>제목</th><th>작성자</th><th>작성일자</th><th>인기${BM_ICON}</th><th>조회👀</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td>${r.recruitNo}</td><td><a href="#/${kind}-detail/${r.recruitNo}" ${isC ? `data-tip="${r.recruitNo}"` : ''}>${esc(r.title)}</a></td>
        <td>${esc(user(r.writer).nickname)}</td><td>${ymd(r.firstRegDate)}</td><td>${r.bookmarkedBy.length}</td><td>${r.views}</td></tr>`).join('')}</tbody></table></div>
    <div class="write-btn"><button class="btn btn-secondary" data-write>글쓰기</button></div>
    <div class="pager">${pagerHtml(all.length, pageInfo)}</div></div>`;
  bindSearch(app(), kw => { st.keyword = kw; st.page = 1; pageRecruitList(kind); });
  bindPager(app(), pageInfo, p => { st.page = p; pageRecruitList(kind); });
  fitListRows(st, () => pageRecruitList(kind));
  $('[data-write]').addEventListener('click', () => isLogin() ? go(`/${kind}-write`) : warn('글을 작성하기 위해서는 로그인을 해주세요.'));
}

/* =====================================================================
   상세 (공통 헤더)
   ===================================================================== */
function deletedHtml() {
  return `<div class="deleted-wrap"><div><h1><b>삭제된 게시글입니다.</b></h1><div id="trashLottie" style="width:300px;height:300px"></div></div></div>`;
}
function detailTitleHtml(title, writerEmail, date, views) {
  const w = user(writerEmail);
  return `<div class="detail-title"><div>
    <h5 class="detail-subject"><b>${esc(title)}</b></h5>
    <div class="detail-author">
      <img class="avatar-40" src="${avatar(w)}" alt="">
      <div class="detail-meta"><div class="nick">${esc(w.nickname)}</div><div class="sub">${ymd(date)}<span class="dot">·</span>조회수 ${views}</div></div>
      ${S.userId === writerEmail ? `<div class="update-delete-btn-gruop"><button class="btn btn-secondary" data-edit>수정</button><button class="btn btn-danger" data-del>삭제</button></div>` : ''}
    </div>
  </div></div>`;
}
function openLink(link, emptyMsg) {
  if (!link) return warn(emptyMsg);
  window.open(link.startsWith('h') ? link : 'http://' + link, '_blank');
}

/* ---------- 코끼리 상세 ---------- */
function pageCokkiriDetail(no) {
  const r = RECRUITS.find(x => x.recruitNo == no && x.category === 'cokkiri');
  if (!r) return pageNotFound();
  if (r.status) { app().innerHTML = `<div class="page-detail">${deletedHtml()}</div>`; return lottieInto($('#trashLottie'), 'trash-can2.json'); }
  r.views++;
  const p = r.project;
  const taked = CHAT_ROOMS.filter(c => c.cokkiriNo === r.recruitNo && c.isRoomMaker).map(c => c.projectPartNo);
  const options = p.projectParts.filter(x => x.partNo !== 1 && !taked.includes(x.projectPartNo));
  const canDm = isLogin() && S.userId !== r.writer;
  app().innerHTML = `<div class="page-detail">
    <div class="detail-head"><div><h1><b>코끼리</b></h1><h6>코딩하는 사람 끼리</h6></div></div>
    ${detailTitleHtml(r.title, r.writer, r.firstRegDate, r.views)}
    <div style="display:flex;width:1250px;margin:0 auto">
      <div style="width:725px;margin:0 25px;min-height:450px"><div class="toastui-editor-contents detail-body">${r.content}</div></div>
      <div style="width:475px;min-height:498px;margin-top:40px">
        <div class="info-box" style="width:475px;min-height:300px"><form style="width:420px;margin:30px" onsubmit="return false"><div class="row mb-3">
          <div class="col-11 mb-2"><label class="col-form-label">프로젝트 상세 주제</label><input class="form-control" readonly value="${esc(p.subject)}"></div>
          <div class="col-7 mb-2"><label class="col-form-label">팀 이름</label><input class="form-control" readonly value="${esc(p.teamName)}"></div>
          <div class="col-4 mb-2"><label class="col-form-label">목표 기간(주)</label><input class="form-control" type="number" readonly value="${p.objectWeek}"></div>
          <div class="col-11 mb-2"><label class="col-form-label">링크</label><input class="form-control link-input" readonly value="${esc(r.link)}" data-link style="cursor:pointer"></div></div>
          <div class="row mb-3"><label class="col-form-label" style="margin-left:55px">파트별 현황</label>
            <div style="width:300px;margin-left:65px">${partsTable(p.projectParts, true)}</div></div></form></div>
        <div class="dm-request" style="visibility:${canDm ? 'visible' : 'hidden'}">
          <select class="form-select d-inline-block" style="width:150px" data-part>${options.map(o => `<option value="${o.projectPartNo}">${esc(o.partName)}</option>`).join('')}</select>&nbsp;&nbsp;
          <button class="btn btn-primary" data-dm-req ${options.length ? '' : 'disabled'}>프로젝트 참여 DM 요청</button></div>
      </div></div>
    <div class="stats-row"><div><span data-bm="${r.recruitNo}">${bookmarkSvg(r.bookmarkedBy.includes(S.userId))}</span>&nbsp;<span data-bmc>${r.bookmarkedBy.length}</span></div><div>👀&nbsp;${r.views}</div></div>
  </div>`;
  $('[data-link]').addEventListener('click', () => openLink(r.link, '링크가 비어있습니다.'));
  $('[data-bm]').addEventListener('click', e => { if (bookmarkToggle(r)) { e.currentTarget.innerHTML = bookmarkSvg(r.bookmarkedBy.includes(S.userId)); $('[data-bmc]').textContent = r.bookmarkedBy.length; } });
  const sel = $('[data-part]');
  sel.addEventListener('change', () => {
    const pp = p.projectParts.find(x => x.projectPartNo == sel.value);
    if (pp && pp.recruitCount - pp.currentCount <= 0) warn('선택하신 파트는 현재 남은자리가 없습니다.');
  });
  $('[data-dm-req]').addEventListener('click', () => confirmBox('파트 신청 확인', '신청하신 파트에 대한 프로젝트 참가 요청 채팅방이 생성됩니다 진행하시겠습니까?', () => {
    const pp = p.projectParts.find(x => x.projectPartNo == sel.value);
    CHAT_ROOMS.unshift({
      chatRoomNo: 'room-' + Date.now(), cokkiriNo: r.recruitNo, isRoomMaker: true, isConfirm: false, friend: r.writer, friendConnected: false,
      newMsgCount: 0, projectPartNo: pp.projectPartNo, partName: pp.partName, projectTitle: r.title, messages: [], createdAt: nowIso(),
    });
    ok('채팅방 생성 완료 채팅방을 확인해주세요');
    renderMessenger(); pageCokkiriDetail(no);
  }));
  bindEditDelete('cokkiri', r, '코끼리');
}
function bindEditDelete(kind, r, label) {
  const e = $('[data-edit]'), d = $('[data-del]');
  if (e) e.addEventListener('click', () => go(`/${kind}-edit/${r.recruitNo || r.coggleNo}`));
  if (d) d.addEventListener('click', () => confirmBox(`${label} 삭제 확인`, '삭제 하시겠습니까?', () => { r.status = true; go('/' + kind); }));
}

/* ---------- 맘모스 상세 ---------- */
function pageMammothDetail(no) {
  const r = RECRUITS.find(x => x.recruitNo == no && x.category === 'mammoth');
  if (!r) return pageNotFound();
  if (r.status) { app().innerHTML = `<div class="page-detail">${deletedHtml()}</div>`; return lottieInto($('#trashLottie'), 'trash-can2.json'); }
  r.views++;
  app().innerHTML = `<div class="page-detail">
    <div class="detail-head"><div><h1><b>맘모스</b></h1><h6>맘맞는사람 모여 스터디</h6></div></div>
    ${detailTitleHtml(r.title, r.writer, r.firstRegDate, r.views)}
    <div style="display:flex;width:1200px;min-height:575px;margin:0 auto">
      <div style="width:725px;min-height:450px;font-size:16px"><div class="toastui-editor-contents detail-body">${r.content}</div></div>
      <div style="width:475px;min-height:450px;margin-top:40px"><div class="info-box" style="width:475px"><form style="width:410px;margin:40px auto" onsubmit="return false"><div class="row mb-3">
        <div class="col-12 mb-2"><label class="col-form-label">모임 위치</label><input class="form-control" readonly value="${esc(r.location.fullLocation)}"></div>
        <div class="col-12"><label class="col-form-label">오픈톡</label><input class="form-control link-input" readonly value="${esc(r.link)}" data-link style="cursor:pointer"></div>
      </div></form></div></div></div>
    <div class="stats-row"><div><span data-bm="${r.recruitNo}">${bookmarkSvg(r.bookmarkedBy.includes(S.userId))}</span>&nbsp;<span data-bmc>${r.bookmarkedBy.length}</span></div><div>👀&nbsp;${r.views}</div></div>
  </div>`;
  $('[data-link]').addEventListener('click', () => openLink(r.link, '링크가 비어있습니다. 이동할 수 없습니다.'));
  $('[data-bm]').addEventListener('click', e => { if (bookmarkToggle(r)) { e.currentTarget.innerHTML = bookmarkSvg(r.bookmarkedBy.includes(S.userId)); $('[data-bmc]').textContent = r.bookmarkedBy.length; } });
  bindEditDelete('mammoth', r, '맘모스');
}

/* =====================================================================
   코끼리 작성/수정
   ===================================================================== */
function requireLogin(back) { if (!isLogin()) { go(back); return false; } return true; }
function pageCokkiriWrite(editNo) {
  if (!requireLogin('/cokkiri')) return;
  const r = editNo ? RECRUITS.find(x => x.recruitNo == editNo) : null;
  if (editNo && !r) return pageNotFound();
  let parts = r ? r.project.projectParts.map(p => ({ ...p })) : [];
  app().innerHTML = `<div class="page-write" style="width:950px">
    <div class="write-head"><h1><b>코끼리</b></h1><div>${r ? '글수정' : '글쓰기'}</div></div>
    <div class="form-card" style="width:900px"><form style="width:825px;margin:30px auto" onsubmit="return false">
      <div class="row mb-3">
        <div class="col-12 mb-2"><label class="col-form-label"><span class="req">*</span>제목</label><input class="form-control" name="title" value="${esc(r ? r.title : '')}"></div>
        <div class="col-6 mb-2"><label class="col-form-label"><span class="req">*</span>프로젝트 상세 주제</label><input class="form-control" name="subject" placeholder="ex)~커뮤니티 플랫폼 / ~쇼핑몰 서비스" value="${esc(r ? r.project.subject : '')}"></div>
        <div class="col-4 mb-2"><label class="col-form-label"><span class="req">*</span>팀 이름</label><input class="form-control" name="team" value="${esc(r ? r.project.teamName : '')}"></div>
        <div class="col-2 mb-2"><label class="col-form-label"><span class="req">*</span>목표 기간</label><input class="form-control" type="number" min="1" name="week" placeholder="주 단위 입력" value="${r ? r.project.objectWeek : ''}"></div>
        <div class="col-6"><label class="col-form-label">링크</label><input class="form-control" name="link" placeholder="카카오톡 / 디스코드 / 구글폼 등 (생략 가능)" value="${esc(r ? r.link : '')}"></div>
        <div class="col-3"><label class="col-form-label"><span class="req">*</span>파트 추가</label><select class="form-select" name="part">
          <option value="" selected>파트를 선택하세요</option>
          ${[2, 3, 4, 5, 6].map(n => `<option value="${n}">${PART_NAMES[n]}</option>`).join('')}</select></div>
        <div class="col-3"><label class="col-form-label col-12"><span class="req">*</span>파트별 모집 인원</label><div style="display:flex;gap:6px">
          <input class="form-control" type="number" min="1" max="9" name="cnt" placeholder="인원"><button class="btn btn-outline-secondary" style="width:80px;height:38px;flex:none" data-add disabled>추가</button></div></div>
      </div>
      <div class="row mb-3"><div class="col"><label class="col-form-label col-12">추가 파트 미리보기 (최대 5개 중복 불가)</label><div class="chip-tray" id="chips"></div></div></div>
      <div class="row mb-3"><label class="col-form-label col-11">내용 (에디터 교체 예정) </label><div class="col"><div id="editor"></div><br/>
        <div style="float:right"><button class="btn btn-outline-secondary" data-cancel>취소</button>&nbsp;&nbsp;<button class="btn btn-secondary" data-save disabled>저장</button></div></div></div>
    </form></div></div>`;
  const ed = makeEditor($('#editor'), r ? r.content : '');
  const f = n => $(`[name=${n}]`);
  /* 필수값 검사: 추가 버튼(파트 선택 + 인원 1 이상), 저장 버튼(필수 입력 + 모집 파트 1개 이상) */
  const updateState = () => {
    $('[data-add]').disabled = !(f('part').value && +f('cnt').value >= 1);
    const filled = ['title', 'subject', 'team'].every(n => f(n).value.trim()) && +f('week').value >= 1;
    $('[data-save]').disabled = !(filled && parts.some(p => p.partNo !== 1));
  };
  const drawChips = () => {
    $('#chips').innerHTML = parts.map((p, i) => `<div class="part-chip"><span>${esc(p.partName)} ${p.recruitCount}명</span>
      ${p.partNo === 1 ? '' : `<button class="btn btn-secondary btn-sm" data-rm="${i}"> - </button>`}</div>`).join('');
    $$('[data-rm]').forEach(b => b.addEventListener('click', () => { parts.splice(+b.dataset.rm, 1); drawChips(); }));
    /* 이미 추가된 파트는 선택 불가 */
    $$('option', f('part')).forEach(o => { o.disabled = !!o.value && parts.some(p => p.partNo === +o.value); });
    updateState();
  };
  drawChips();
  ['title', 'subject', 'team', 'week', 'cnt'].forEach(n => f(n).addEventListener('input', updateState));
  f('part').addEventListener('change', updateState);
  $('[data-add]').addEventListener('click', () => {
    const cnt = f('cnt').value, partNo = +f('part').value;
    if (!partNo || !cnt) return;
    if (parts.filter(p => p.partNo !== 1).length >= 5) return warn('최대 개수 5개를 초과하였습니다.');
    if (parts.some(p => p.partNo === partNo)) return warn('이미 추가된 파트입니다. 중복으로 추가할 수 없습니다.');
    parts.push({ projectPartNo: Date.now(), partNo, partName: PART_NAMES[partNo], recruitCount: +cnt, currentCount: 0 });
    f('part').value = ''; f('cnt').value = ''; drawChips();
  });
  $('[data-cancel]').addEventListener('click', () => history.back());
  $('[data-save]').addEventListener('click', () => !$('[data-save]').disabled && confirmBox(r ? '코끼리 수정 확인' : '코끼리 저장 확인', r ? '수정 하시겠습니까?' : '저장 하시겠습니까?', () => {
    const leader = parts.find(p => p.partNo === 1) || { projectPartNo: Date.now() - 1, partNo: 1, partName: '팀장', recruitCount: 1, currentCount: 1 };
    const projectParts = [leader].concat(parts.filter(p => p.partNo !== 1));
    const data = { title: f('title').value || '(제목 없음)', link: f('link').value, content: ed.getHTML() };
    const project = { subject: f('subject').value, teamName: f('team').value, objectWeek: +f('week').value || 0, projectParts };
    if (r) { Object.assign(r, data, { lastModDate: nowIso() }); Object.assign(r.project, project); go('/cokkiri-detail/' + r.recruitNo); }
    else {
      const no = Math.max(...RECRUITS.map(x => x.recruitNo)) + 1;
      RECRUITS.push({ recruitNo: no, category: 'cokkiri', writer: S.userId, views: 0, bookmarkedBy: [], firstRegDate: nowIso(), lastModDate: null, status: false, ...data, project: { projectNo: no, ...project } });
      go('/cokkiri');
    }
  }));
}

/* =====================================================================
   맘모스 작성/수정 (MUI Accordion + Radio 지역 선택)
   ===================================================================== */
function pageMammothWrite(editNo) {
  if (!requireLogin('/mammoth')) return;
  const r = editNo ? RECRUITS.find(x => x.recruitNo == editNo) : null;
  if (editNo && !r) return pageNotFound();
  const loc = r ? { ...r.location } : { sido: '', sigungu: '', dong: '' };
  let open = false;
  app().innerHTML = `<div class="page-write" style="width:1090px">
    <div class="write-head"><h1><b>맘모스</b></h1><div>${r ? '글수정' : '글쓰기'}</div></div>
    <div class="form-card" style="width:1090px"><form style="width:1015px;margin:30px auto" onsubmit="return false">
      <div class="row mb-3"><div class="col-12"><label class="col-form-label">제목</label><input class="form-control" name="title" value="${esc(r ? r.title : '')}"></div></div>
      <div class="row mb-3"><div class="col-12"><label class="col-form-label">오픈톡</label><input class="form-control" name="link" value="${esc(r ? r.link : '')}"></div></div>
      <div class="row mb-3"><div class="col"><label class="col-form-label">${r ? '모임 장소' : '모임 위치'}</label>
        <div class="mui-acc" id="locAcc"><div class="mui-acc-sum"><input class="form-control" disabled style="width:750px" id="locInput"><i class="bi bi-chevron-down"></i></div>
          <div class="mui-acc-det"><div class="mui-acc-inner"><div class="mui-acc-pad" id="locDet" style="padding:8px 0 16px 16px"></div></div></div></div></div></div>
      <div class="row mb-3"><label class="col-form-label col-11">내용 (에디터 교체 예정) </label><div class="col"><div id="editor"></div><br/>
        <div style="float:right"><button class="btn btn-outline-secondary" data-cancel>취소</button>&nbsp;&nbsp;<button class="btn btn-secondary" data-save>저장</button></div></div></div>
    </form></div></div>`;
  const ed = makeEditor($('#editor'), r ? r.content : '');
  const full = () => [loc.sido, loc.sigungu, loc.dong].filter(Boolean).join(' ');
  const radios = (name, items, cur) => `<div class="loc-radio-group">${['전체'].concat(items).map(v => `<label class="mui-radio"><input type="radio" name="${name}" value="${v === '전체' ? '' : esc(v)}" ${(cur || '') === (v === '전체' ? '' : v) ? 'checked' : ''}>${esc(v)}</label>`).join('')}</div>`;
  const draw = () => {
    const inp = $('#locInput');
    inp.value = full();
    inp.placeholder = open ? '지역을 선택하세요' : '우측 화살표를 누른 후 펼쳐진 영역에서 지역을 선택하세요';
    $('#locAcc').classList.toggle('open', open);
    const seconds = loc.sido ? Object.keys(ADDRESS[loc.sido] || {}) : null;
    const thirds = loc.sido && loc.sigungu ? (ADDRESS[loc.sido][loc.sigungu] || []) : null;
    $('#locDet').innerHTML = `
      <div class="loc-block"><b class="lbl">도/특별시</b>${radios('first', Object.keys(ADDRESS), loc.sido)}</div>
      <div class="loc-block"><b class="lbl">시/군/구</b>${seconds ? radios('second', seconds, loc.sigungu) : '<div class="py-2"><span>도/특별시 를 선택해주세요</span></div>'}</div>
      <div class="loc-block"><b class="lbl">동/읍/면/리</b>${thirds ? radios('third', thirds, loc.dong) : '<div class="py-2"><span>시/군/구 를 선택해주세요</span></div>'}</div>`;
    $$('#locDet input[type=radio]').forEach(i => i.addEventListener('change', () => {
      if (i.name === 'first') { loc.sido = i.value; loc.sigungu = ''; loc.dong = ''; }
      if (i.name === 'second') { loc.sigungu = i.value; loc.dong = ''; }
      if (i.name === 'third') loc.dong = i.value;
      draw();
    }));
  };
  $('#locAcc .mui-acc-sum').addEventListener('click', () => { open = !open; draw(); });
  draw();
  const f = n => $(`[name=${n}]`);
  $('[data-cancel]').addEventListener('click', () => history.back());
  $('[data-save]').addEventListener('click', () => confirmBox(r ? '맘모스 수정 확인' : '맘모스 저장 확인', r ? '수정 하시겠습니까?' : '저장 하시겠습니까?', () => {
    const data = { title: f('title').value || '(제목 없음)', link: f('link').value, content: ed.getHTML(), location: { ...loc, fullLocation: full() } };
    if (r) { Object.assign(r, data, { lastModDate: nowIso() }); go('/mammoth-detail/' + r.recruitNo); }
    else {
      const no = Math.max(...RECRUITS.map(x => x.recruitNo)) + 1;
      RECRUITS.push({ recruitNo: no, category: 'mammoth', writer: S.userId, views: 0, bookmarkedBy: [], firstRegDate: nowIso(), lastModDate: null, status: false, ...data });
      go('/mammoth');
    }
  }));
}

/* =====================================================================
   코글 목록 / 상세 / 작성
   ===================================================================== */
function pageCoggleList() {
  const st = S.lists.coggle || (S.lists.coggle = { page: 1, keyword: '', category: '' });
  const catLabel = { '': '전체', T: '기술질문', C: '커리어', D: '개발일상' }[st.category];
  const all = COGGLES.filter(c => !c.status && (!st.category || c.category === st.category) && (!st.keyword || c.title.includes(st.keyword)))
    .sort((a, b) => b.coggleNo - a.coggleNo);
  const { rows, pageInfo } = paginate(all, st.page, st.size || PAGE_SIZE);
  app().innerHTML = `<div class="page-list">
    <div class="list-heading" style="justify-content:center"><h1><b>코글: ${catLabel}</b></h1></div>
    <div class="list-bar"><span class="list-count">${all.length}개</span>
      <div class="list-bar-right"><select class="form-select" style="width:130px" data-cat>
        ${[['', '전체'], ['T', 'TechQue'], ['C', 'Carrier'], ['D', 'DevLife']].map(([v, t]) => `<option value="${v}" ${st.category === v ? 'selected' : ''}>${t}</option>`).join('')}</select>${searchGroupHtml(st.keyword)}</div></div>
    <div class="table-area" style="${tableMinHeight(st.size || PAGE_SIZE)}"><table class="table t-list"><thead><tr><th>No</th><th>제목</th><th>작성자</th><th>작성일자</th><th>인기💞</th><th>조회👀</th></tr></thead>
      <tbody>${rows.map(c => `<tr><td>${c.coggleNo}</td><td><a href="#/coggle-detail/${c.coggleNo}">${esc(c.title)}</a></td><td>${esc(user(c.writer).nickname)}</td>
        <td>${ymd(c.firstRegDate)}</td><td>${c.likedBy.length}</td><td>${c.views}</td></tr>`).join('')}</tbody></table></div>
    <div class="write-btn"><button class="btn btn-secondary" data-write>글쓰기</button></div>
    <div class="pager">${pagerHtml(all.length, pageInfo)}</div></div>`;
  $('[data-cat]').addEventListener('change', e => { st.category = e.target.value; st.page = 1; pageCoggleList(); });
  bindSearch(app(), kw => { st.keyword = kw; st.page = 1; pageCoggleList(); });
  bindPager(app(), pageInfo, p => { st.page = p; pageCoggleList(); });
  fitListRows(st, () => pageCoggleList());
  $('[data-write]').addEventListener('click', () => isLogin() ? go('/coggle-write') : warn('글을 작성하기 위해서는 로그인을 해주세요.'));
}

function pageCoggleDetail(no, keepViews) {
  const c = COGGLES.find(x => x.coggleNo == no);
  if (!c) return pageNotFound();
  if (c.status) { app().innerHTML = `<div class="page-detail">${deletedHtml()}</div>`; return lottieInto($('#trashLottie'), 'trash-can2.json'); }
  if (!keepViews) c.views++;
  const parents = COMMENTS.filter(x => x.coggleNo === c.coggleNo && !x.parentNo);
  const total = COMMENTS.filter(x => x.coggleNo === c.coggleNo).length;
  app().innerHTML = `<div class="page-detail">
    <div class="detail-head"><div><h1><b>코글</b></h1><h6>${catText(c.category)}</h6></div></div>
    ${detailTitleHtml(c.title, c.writer, c.firstRegDate, c.views)}
    <div style="width:1000px;margin:0 auto;min-height:535px"><div class="toastui-editor-contents detail-body" style="margin:0 10px">${c.content}</div></div>
    <div class="stats-row"><div><span data-like-wrap>${heartSvg(c.likedBy.includes(S.userId))}</span>&nbsp;<span data-likec>${c.likedBy.length}</span></div>
      <div>👀&nbsp;${c.views}</div><div><i class="bi bi-chat-text" style="font-size:20px"></i>&nbsp;${total}</div></div>
    <div class="comment-section">
      ${parents.map(p => commentHtml(p, c)).join('')}
      <div class="comment-box"><textarea placeholder="댓글 내용을 입력하세요" data-new></textarea>
        <div class="btns"><button class="btn btn-outline-secondary btn-sm" data-new-cancel>취소</button> <button class="btn btn-outline-secondary btn-sm" data-new-save>저장</button></div></div>
    </div></div>`;
  const rerender = () => pageCoggleDetail(no, true);
  $('[data-like-wrap]').addEventListener('click', () => {
    if (!isLogin()) return warn('좋아요 기능을 이용하시려면 로그인이 필요합니다.');
    const i = c.likedBy.indexOf(S.userId);
    if (i >= 0) { c.likedBy.splice(i, 1); ok('좋아요 해제 되었습니다.'); } else { c.likedBy.push(S.userId); ok('좋아요 목록에 추가되었습니다.'); }
    $('[data-like-wrap]').innerHTML = heartSvg(c.likedBy.includes(S.userId)); $('[data-likec]').textContent = c.likedBy.length;
  });
  bindEditDelete('coggle', c, '코글');
  $$('textarea').forEach(autoGrow);
  const nt = $('[data-new]');
  $('[data-new-cancel]').addEventListener('click', () => { nt.value = ''; nt.style.height = '55px'; });
  $('[data-new-save]').addEventListener('click', () => {
    if (!isLogin()) return warn('댓글을 작성하기 위해서는 로그인을 해주세요.');
    if (!nt.value.trim()) return warn('입력란이 비어있습니다. \n 댓글을 저장하기 위해서는 내용을 입력하셔야만 합니다.');
    addComment(c.coggleNo, S.userId, nt.value);
    COMMENTS[COMMENTS.length - 1].firstRegDate = nowIso();
    rerender();
  });
  $$('[data-cmt]').forEach(el => bindComment(el, c, rerender));
  if (S.focusComment) {
    const t = document.getElementById('c' + S.focusComment);
    S.focusComment = null;
    if (t) setTimeout(() => { t.scrollIntoView({ behavior: 'smooth', block: 'center' }); t.classList.add('blinking'); }, 300);
  }
}
function autoGrow(ta) { ta.addEventListener('input', () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 'px'; }); }
function commentHtml(p, coggle) {
  const children = COMMENTS.filter(x => x.parentNo === p.commentNo);
  return `<div class="comment-div" id="c${p.commentNo}">${oneComment(p, coggle, false)}</div>` +
    children.map(ch => `<div><div class="comment-div" id="c${ch.commentNo}">${oneComment(ch, coggle, true)}</div></div>`).join('');
}
function oneComment(cm, coggle, child) {
  if (cm.status) return `<div class="comment-inner ${child ? 'child' : ''}">' 댓글이 삭제/블라인드 처리 되었습니다 '</div>`;
  const w = user(cm.writer);
  const mine = S.userId === cm.writer;
  return `<div class="comment-inner ${child ? 'child' : ''}" data-cmt="${cm.commentNo}">
    <img class="avatar-40" src="${avatar(w)}" alt="">
    <div data-view>
      <div>${cm.writer === coggle.writer ? '<span class="gray">[작성자] </span>' : ''}<span>${esc(w.nickname)} </span><span class="gray">${fullDate(cm.firstRegDate)}</span></div>
      <div class="comment-body">
        <div>${child && cm.mention ? `<span class="gray">@${esc(user(cm.mention).nickname)} </span>` : ''}${nl2br(cm.content)}</div>
        <div class="comment-actions" data-actions><b><span data-reply>댓글</span>${mine ? '<span data-edit-c>수정</span><span data-del-c>지우기</span>' : ''}</b></div>
      </div>
      <div class="comment-box inner" data-reply-box style="display:none"><textarea placeholder="댓글 내용을 입력하세요"></textarea>
        <div class="btns"><button class="btn btn-outline-secondary btn-sm" data-r-cancel>취소</button> <button class="btn btn-outline-secondary btn-sm" data-r-save>저장</button></div></div>
    </div>
    <div class="comment-box inner" data-edit-box style="display:none;margin-left:50px;width:auto"><textarea>${esc(cm.content)}</textarea>
      <div class="btns"><button class="btn btn-outline-secondary btn-sm" data-e-cancel>취소</button> <button class="btn btn-outline-secondary btn-sm" data-e-save>수정</button></div></div>
  </div>`;
}
function bindComment(el, coggle, rerender) {
  const cm = COMMENTS.find(x => x.commentNo == el.dataset.cmt);
  const q = s => $(s, el);
  const rb = q('[data-reply-box]'), eb = q('[data-edit-box]'), acts = q('[data-actions]'), view = q('[data-view]');
  q('[data-reply]').addEventListener('click', () => {
    if (!isLogin()) return warn('댓글을 작성하기 위해서는 로그인을 해주세요.');
    rb.style.display = 'block'; acts.style.display = 'none';
  });
  q('[data-r-cancel]').addEventListener('click', () => { rb.style.display = 'none'; acts.style.display = ''; $('textarea', rb).value = ''; });
  q('[data-r-save]').addEventListener('click', () => {
    const v = $('textarea', rb).value;
    if (!v.trim()) return warn('입력란이 비어있습니다. \n 댓글을 저장하기 위해서는 내용을 입력하셔야만 합니다.');
    const c = addComment(coggle.coggleNo, S.userId, v, cm.parentNo || cm.commentNo, cm.writer);
    c.firstRegDate = nowIso();
    rerender();
  });
  const ed = q('[data-edit-c]'), del = q('[data-del-c]');
  if (ed) ed.addEventListener('click', () => { view.style.display = 'none'; eb.style.display = 'block'; });
  q('[data-e-cancel]').addEventListener('click', () => { view.style.display = ''; eb.style.display = 'none'; $('textarea', eb).value = cm.content; });
  q('[data-e-save]').addEventListener('click', () => {
    const v = $('textarea', eb).value;
    if (!v.trim()) return warn('입력란이 비어있습니다. \n 댓글을 수정하기 위해서는 내용을 입력하셔야만 합니다.');
    cm.content = v; rerender();
  });
  if (del) del.addEventListener('click', () => { cm.status = true; rerender(); });
}

function pageCoggleWrite(editNo) {
  if (!requireLogin('/coggle')) return;
  const c = editNo ? COGGLES.find(x => x.coggleNo == editNo) : null;
  if (editNo && !c) return pageNotFound();
  app().innerHTML = `<div class="page-write" style="width:950px">
    <div class="write-head"><h1><b>코글</b></h1><div>${c ? '글수정' : '글쓰기'}</div></div>
    <div class="form-card" style="width:900px"><form style="width:824px;margin:30px auto" onsubmit="return false">
      <div class="row mb-3">
        <div class="col-auto"><label class="col-form-label d-block">카테고리</label>
          <select class="form-select" style="width:150px" name="category">${[['T', 'TechQue'], ['C', 'Carrier'], ['D', 'DevLife']].map(([v, t]) => `<option value="${v}" ${c && c.category === v ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
        <div class="col"><label class="col-form-label d-block">제목</label><input class="form-control" name="title" value="${esc(c ? c.title : '')}"></div>
      </div>
      <div class="row mb-3"><label class="col-form-label col-11">내용 (에디터 교체 예정) </label><div class="col"><div id="editor"></div><br/>
        <div style="float:right"><button class="btn btn-outline-secondary" data-cancel>취소</button>&nbsp;&nbsp;<button class="btn btn-secondary" data-save>저장</button></div></div></div>
    </form></div></div>`;
  const ed = makeEditor($('#editor'), c ? c.content : '');
  $('[data-cancel]').addEventListener('click', () => history.back());
  $('[data-save]').addEventListener('click', () => confirmBox(c ? '코글 수정 확인' : '코글 저장 확인', c ? '수정 하시겠습니까?' : '저장 하시겠습니까?', () => {
    const data = { category: $('[name=category]').value, title: $('[name=title]').value || '(제목 없음)', content: ed.getHTML() };
    if (c) { Object.assign(c, data, { lastModDate: nowIso() }); go('/coggle-detail/' + c.coggleNo); }
    else {
      COGGLES.push({ coggleNo: Math.max(...COGGLES.map(x => x.coggleNo)) + 1, writer: S.userId, views: 0, likedBy: [], firstRegDate: nowIso(), lastModDate: null, status: false, ...data });
      go('/coggle');
    }
  }));
}

/* =====================================================================
   마이페이지
   ===================================================================== */
function pageMyPage() {
  if (!isLogin()) { go('/'); openLogin(); return; }
  const tabs = [['1', '프로필'], ['2', '프로젝트'], ['3', '게시글'], ['4', '북마크']];
  app().innerHTML = `<div class="mypage"><div><h1><b> My Page</b></h1><br/></div>
    <ul class="nav nav-tabs mypage-tabs">${tabs.map(([k, t]) => `<li class="nav-item"><a class="nav-link ${S.mypageTab === k ? 'active' : ''}" href="javascript:void(0)" data-mt="${k}">${t}</a></li>`).join('')}</ul>
    <div class="tab-content" id="mypane"></div></div>`;
  $$('[data-mt]').forEach(a => a.addEventListener('click', () => { S.mypageTab = a.dataset.mt; store.set('activeTab', a.dataset.mt); closePms(); pageMyPage(); }));
  $('#mypane').classList.toggle('center', S.mypageTab === '1'); /* 프로필 탭만 세로 가운데 정렬 */
  ({ '1': myInfoEdit, '2': myProject, '3': () => myPost('myPost'), '4': () => myPost('myBookMark') })[S.mypageTab]();
  watchMyPageFit();
}
/* 마이페이지: 푸터 구분선이 스크롤 직전 브라우저 끝선에 오도록 본문 비율 축소(zoom, 최소 0.6)
   배율은 가장 긴 프로필 탭 기준 → 네 탭 모두 같은 크기로 보인다 */
function fitMyPage() {
  const mp = $('.mypage');
  if (!mp || fitMyPage.busy) return;
  fitMyPage.busy = true; /* 동기 재진입 방지 (관찰 대상 크기는 최종 상태가 같으면 다시 통지되지 않음) */
  mp.style.zoom = ''; mp.style.marginTop = '';
  const top = mp.getBoundingClientRect().top + window.scrollY;
  const bottom = myPageBottom(mp);
  /* 넘치면 디자인 비율을 유지한 채 본문 전체를 같은 비율로 축소 (브라우저 배율과 무관하게 같은 모양) */
  if (bottom > window.innerHeight + 1) {
    const apply = s => {
      mp.style.zoom = s;
      /* zoom 은 margin 도 줄이므로 헤더 아래 시작 위치(top)를 그대로 유지하도록 보정 */
      mp.style.marginTop = (top / zoomFactor() / s) + 'px';
    };
    let s = Math.max(0.6, (window.innerHeight - top) / (bottom - top));
    apply(s);
    /* 2차 보정: 반올림·여백 오차로 남은 몇 px 까지 맞춘다 */
    const b2 = myPageBottom(mp);
    if (b2 > window.innerHeight + 0.5) apply(Math.max(0.6, s * (window.innerHeight - top) / (b2 - top)));
  }
  fitMyPage.busy = false;
}
/* 프로필 탭이 열려 있다고 가정한 '내용 높이' 기준 하단 위치 (flex 로 늘어난 높이 제외)
   다른 탭이면 보이지 않는 프로필 폼을 잠시 넣어 높이 차이만큼 더한다 */
function myPageBottom(mp) {
  mp.style.flex = '0 0 auto';
  let bottom = mp.getBoundingClientRect().bottom + window.scrollY;
  const pane = $('#mypane');
  if (S.mypageTab !== '1' && pane) {
    const probe = document.createElement('div');
    probe.style.cssText = `position:absolute; visibility:hidden; display:flow-root; left:0; top:0; width:${pane.clientWidth}px`;
    probe.innerHTML = profileFormHtml(me()).replace(/ id="[^"]*"/g, '');
    mp.appendChild(probe);
    const extra = probe.getBoundingClientRect().height - pane.getBoundingClientRect().height;
    probe.remove();
    if (extra > 0) bottom += extra;
  }
  mp.style.flex = '';
  return bottom;
}
function watchMyPageFit() {
  const pane = $('#mypane');
  if (!pane) return;
  const schedule = () => fitMyPage();
  if (watchMyPageFit.mo) watchMyPageFit.mo.disconnect();
  if (watchMyPageFit.ro) watchMyPageFit.ro.disconnect();
  /* 탭 안에서 검색·페이지 이동으로 다시 그려질 때, 폰트 로드 등으로 높이가 바뀔 때 다시 맞춘다 */
  watchMyPageFit.mo = new MutationObserver(schedule);
  watchMyPageFit.mo.observe(pane, { childList: true });
  if (window.ResizeObserver) {
    watchMyPageFit.ro = new ResizeObserver(schedule);
    watchMyPageFit.ro.observe($('.mypage > div:first-child'));
    if (pane.firstElementChild) watchMyPageFit.ro.observe(pane.firstElementChild);
  }
  if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(schedule);
  fitMyPage();
}
function profileFormHtml(u) {
  return `<form class="info-form" onsubmit="return false">
    <div class="profile-edit-wrap"><input type="file" accept="image/*" style="display:none" id="fileInp">
      <img class="profile" id="profImg" src="${avatar(u)}" style="cursor:pointer" alt=""><img src="assets/free-icon-pencil.png" class="profile-pencil" alt=""></div>
    <div class="mb-3"><label class="lbl">닉&nbsp;&nbsp;네&nbsp;&nbsp;임</label>
      <span class="vmsg bad" data-v="nreg">❌ 닉네임 양식 오류</span><span class="vmsg bad" data-v="nex">❌ 이미 사용중 입니다</span><span class="vmsg ok" data-v="nok">✔ 사용가능</span>
      <input class="form-control" name="nick" value="${esc(u.nickname)}" placeholder="첫글자 한or영문자 & 특수문자를 제외한 10자리 "></div>
    <div class="mb-3"><label class="lbl" style="width:auto">패스워드 변경</label>
      <span class="vmsg ok" data-v="pok">✔ 사용가능</span><span class="vmsg bad" data-v="pbad">❌ 패스워드 사용불가</span>
      <input class="form-control" type="password" name="pw" placeholder="특수문자/대문자 각각 1자 이상 & 최소 10자리"></div>
    <div class="mb-3"><label class="lbl" style="width:auto">패스워드 확인</label>
      <span class="vmsg ok" data-v="cok">✔ 패스워드 일치</span><span class="vmsg bad" data-v="cbad">❌ 패스워드 불일치</span>
      <input class="form-control" type="password" name="pw2" placeholder="재입력"></div>
    <div class="mb-3"><label class="lbl" style="width:auto">기존 패스워드</label><input class="form-control" type="password" name="orig" placeholder="정보 변경시 본인확인 필수입력"></div>
    <div class="row mb-3"><div class="col-6"><button class="btn btn-outline-primary w-100" data-reset>초기화</button></div><div class="col-6"><button class="btn btn-secondary w-100" data-save>저장</button></div></div>
    <div class="mb-3"><button class="btn btn-outline-danger w-100" data-withdraw>회원탈퇴</button></div>
  </form>`;
}
function myInfoEdit() {
  const u = me();
  let newImg = null;
  $('#mypane').innerHTML = profileFormHtml(u);
  const f = n => $(`[name=${n}]`), v = (k, on) => $(`[data-v=${k}]`).classList.toggle('on', on);
  const nReg = /^[a-zA-Z가-힣][a-zA-Z가-힣0-9]{0,9}$/;
  const pReg = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-])(?=.*[A-Z]).{9,}$/;
  $('#profImg').addEventListener('click', () => $('#fileInp').click());
  $('#fileInp').addEventListener('change', e => {
    const file = e.target.files[0]; if (!file) return;
    const rd = new FileReader(); rd.onload = () => { newImg = rd.result; $('#profImg').src = newImg; }; rd.readAsDataURL(file);
  });
  f('nick').addEventListener('input', () => {
    ['nreg', 'nex', 'nok'].forEach(k => v(k, false));
    const val = f('nick').value;
    if (val === u.nickname) return;
    if (!val || !nReg.test(val)) return v('nreg', true);
    v(USERS.some(x => x.nickname === val) ? 'nex' : 'nok', true);
  });
  const chk2 = () => { v('cok', false); v('cbad', false); if (f('pw2').value) v(f('pw2').value === f('pw').value ? 'cok' : 'cbad', true); };
  f('pw').addEventListener('input', () => { v('pok', false); v('pbad', false); if (f('pw').value) v(pReg.test(f('pw').value) ? 'pok' : 'pbad', true); chk2(); });
  f('pw2').addEventListener('input', chk2);
  $('[data-save]').addEventListener('click', () => {
    const nick = f('nick').value, pw = f('pw').value, pw2 = f('pw2').value;
    if (!f('orig').value) return warn('회원정보 수정시 본인확인을 위해 기존 패스워드를 필수로 입력하셔야 합니다.');
    if (nick === u.nickname && !pw && !newImg) return warn('수정된 내역이 없습니다.');
    if (!nReg.test(nick)) return warn('닉네임 양식을 맞춰주세요.');
    if (pw && !pReg.test(pw)) return warn('패스워드 조건에 맞지 않습니다. \n 입력란 문구를 확인해주세요.');
    if (pw && !pw2) return warn('패스워드 수정시 패스워드 확인은 필수입력 입니다.');
    if (pw && pw !== pw2) return warn('패스워드 변경값과 확인값이 일치하지 않습니다.');
    if (u.password && f('orig').value !== u.password) return warn('기존 패스워드가 일치하지 않으므로 수정에 실패하였습니다.');
    u.nickname = nick; if (pw) u.password = pw; if (newImg) u.profileUrl = newImg;
    ok('회원의 정보가 성공적으로 수정되었습니다!');
    renderHeader(); myInfoEdit();
  });
  $('[data-withdraw]').addEventListener('click', () => {
    if (!f('orig').value) return warn('회원 탈퇴시 본인 확인을 위해 기존 패스워드를 필수로 입력하셔야 합니다.');
    confirmBox('회원 탈퇴 확인', '탈퇴시 개인정보 및 관련 코끼리/맘모스/코글/댓글/채팅방이 삭제되며 복구할수 없게 됩니다.  \n 정말 탈퇴 하시겠습니까?', () => {
      const joined = MY_PROJECTS.filter(p => ['RECRUIT', 'RUN'].includes(p.projectStatus)).length;
      if (joined > 0) return warn('참여 프로젝트가 모집/진행중이라면 탈퇴가 불가능합니다.');
      ok('회원 탈퇴 완료');
    });
  });
}

function myPost(tabType) {
  const st = S.lists[tabType] || (S.lists[tabType] = { page: 1, keyword: '', type: 'Cokkiri' });
  const kw = st.keyword;
  let list;
  if (st.type === 'Coggle') {
    list = COGGLES.filter(c => !c.status && (tabType === 'myPost' ? c.writer === S.userId : c.likedBy.includes(S.userId)) && (!kw || c.title.includes(kw)));
  } else {
    const cat = st.type.toLowerCase();
    list = RECRUITS.filter(r => r.category === cat && !r.status && (tabType === 'myPost' ? r.writer === S.userId : r.bookmarkedBy.includes(S.userId)) && (!kw || r.title.includes(kw)));
  }
  const { rows, pageInfo } = paginate(list, st.page);
  const table = st.type === 'Coggle'
    ? `<table class="table t-mypost-c"><thead><tr><th>No</th><th>카테고리</th><th>제목</th><th>최초 작성일자</th><th>최종 수정일자</th><th>인기💞</th><th>조회👀</th></tr></thead><tbody>
        ${rows.map(c => `<tr><td>${c.coggleNo}</td><td>${catText(c.category)}</td><td><a href="#/coggle-detail/${c.coggleNo}">${esc(c.title)}</a></td>
          <td>${ymd(c.firstRegDate)}</td><td>${ymd(c.lastModDate || c.firstRegDate)}</td><td>${c.likedBy.length}</td><td>${c.views}</td></tr>`).join('')}</tbody></table>`
    : `<table class="table t-list"><thead><tr><th>No</th><th>제목</th><th>최초 작성일자</th><th>최종 수정일자</th><th>인기${BM_ICON}</th><th>조회👀</th></tr></thead><tbody>
        ${rows.map(r => `<tr><td>${r.recruitNo}</td><td><a href="#/${r.category}-detail/${r.recruitNo}" ${r.category === 'cokkiri' ? `data-tip="${r.recruitNo}"` : ''}>${esc(r.title)}</a></td>
          <td>${ymd(r.firstRegDate)}</td><td>${ymd(r.lastModDate || r.firstRegDate)}</td><td>${r.bookmarkedBy.length}</td><td>${r.views}</td></tr>`).join('')}</tbody></table>`;
  $('#mypane').innerHTML = `<div class="mypost-wrap">
    <div class="list-bar" style="margin-top:20px"><span class="list-count">${list.length}개</span>
      <div class="list-bar-right"><select class="form-select" style="width:110px" data-type>
        ${[['Cokkiri', '코끼리'], ['Mammoth', '맘모스'], ['Coggle', '코글']].map(([v, t]) => `<option value="${v}" ${st.type === v ? 'selected' : ''}>${t}</option>`).join('')}</select>${searchGroupHtml(kw)}</div></div>
    ${st.type === 'Coggle' ? '<div class="coggle-checks"><label><input type="checkbox"> TechQue</label><label><input type="checkbox"> Carrier</label><label><input type="checkbox"> Devlife</label></div>' : ''}
    <div class="table-area" style="margin:20px auto">${table}</div>
    <div class="pager">${pagerHtml(list.length, pageInfo)}</div></div>`;
  $('[data-type]').addEventListener('change', e => { st.type = e.target.value; st.page = 1; myPost(tabType); });
  bindSearch($('#mypane'), k => { st.keyword = k; st.page = 1; myPost(tabType); });
  bindPager($('#mypane'), pageInfo, p => { st.page = p; myPost(tabType); });
}

const STATUS_OPT = [['RECRUIT', '모집'], ['RUN', '진행'], ['FAIL', '무산'], ['CLOSED', '완료']];
function myProject() {
  const st = S.lists.myProject || (S.lists.myProject = { page: 1, keyword: '' });
  const list = MY_PROJECTS.filter(p => !st.keyword || p.teamName.includes(st.keyword));
  const { rows, pageInfo } = paginate(list, st.page);
  $('#mypane').innerHTML = `<div class="mypost-wrap">
    <div class="list-bar" style="margin-top:20px"><div class="list-title"><h1 style="font-size:2rem;margin:0"><b>프로젝트</b></h1><span class="list-count">${list.length}개</span></div>
      <div class="list-bar-right">${searchGroupHtml(st.keyword)}</div></div>
    <div class="table-area" style="margin:20px auto"><table class="table t-project"><thead><tr><th>No</th><th>담당파트</th><th>프로젝트(팀)명</th><th>목표 기간(주)</th><th>최초 시작 일자</th>
      <th>종료 예정 일자</th><th>전체 상태</th><th>개인 상태</th><th>인원 현황</th><th>최종 종료 일자</th></tr></thead><tbody>
      ${rows.map(p => {
    const myPart = p.parts.find(x => x.partNo === p.myPartNo);
    const count = p.parts.reduce((a, x) => a + x.users.filter(u => u.personalStatus === 'JOIN').length, 0);
    return `<tr><td>${p.projectNo}</td><td>${esc(myPart.partName)}</td><td>${esc(p.teamName)}</td><td>${p.objectWeek}</td>
          <td>${p.startDate ? ymd(p.startDate) : '모집중'}</td><td>${p.startDate ? ymd(p.expectedEndDate) : '모집중'}</td>
          <td>${p.myPartNo === 1 ? `<div class="dropdown status-dd"><button type="button" class="status-select" data-bs-toggle="dropdown" data-bs-display="static">${STATUS_OPT.find(s => s[0] === p.projectStatus)[1]}</button><div class="dropdown-menu status-menu">${STATUS_OPT.map(([v, t]) => `<button type="button" class="dropdown-item ${p.projectStatus === v ? 'active' : ''}" data-status="${p.projectNo}" data-value="${v}">${t}</button>`).join('')}</div></div>` : STATUS_OPT.find(s => s[0] === p.projectStatus)[1]}</td>
          <td>${count}</td><td style="padding:0.5em"><button class="btn btn-secondary btn-sm" style="width:70px" data-pms="${p.projectNo}"><span style="font-size:13px">상세보기</span></button></td>
          <td>${p.projectStatus === 'CLOSED' ? ymd(p.lastClosingDate) : '미완료'}</td></tr>`;
  }).join('')}</tbody></table></div>
    <div class="pager">${pagerHtml(list.length, pageInfo)}</div></div>`;
  bindSearch($('#mypane'), k => { st.keyword = k; st.page = 1; myProject(); });
  bindPager($('#mypane'), pageInfo, p => { st.page = p; myProject(); });
  $$('[data-status]').forEach(s => s.addEventListener('click', () => {
    const p = MY_PROJECTS.find(x => x.projectNo == s.dataset.status);
    if (p.projectStatus === s.dataset.value) return;
    p.projectStatus = s.dataset.value;
    if (s.dataset.value === 'RUN' && !p.startDate) { p.startDate = nowIso(); const d = new Date(); d.setDate(d.getDate() + p.objectWeek * 7); p.expectedEndDate = d.toISOString(); }
    if (s.dataset.value === 'CLOSED') p.lastClosingDate = nowIso();
    myProject();
  }));
  $$('[data-pms]').forEach(b => b.addEventListener('click', () => {
    const cur = $('.pms-window');
    if (cur && cur.dataset.no === b.dataset.pms) return closePms();
    openPms(MY_PROJECTS.find(x => x.projectNo == b.dataset.pms));
  }));
}

/* ---------- PMS 플로팅 창 ---------- */
function closePms() { const w = $('.pms-window'); w && w.remove(); }
function openPms(p, tab = 0, sideIdx = 0) {
  closePms();
  const w = document.createElement('div');
  w.className = 'pms-window';
  w.dataset.no = p.projectNo;
  w.innerHTML = `<div class="pms-title">&nbsp;${esc(p.teamName)}<span class="pms-close" data-close><i class="bi bi-x"></i></span></div>
    <div class="pms-body"><div class="mui-tabs"><button class="mui-tab" data-tt="0"><h5 style="margin:0">전체 현황</h5></button><button class="mui-tab" data-tt="1"><h5 style="margin:0">파트별 현황</h5></button></div>
      <div class="slide-view"><div class="slide-track" id="pmsTrack"><div class="slide"><div class="pms-panel" id="pmsAll"></div></div><div class="slide"><div id="pmsSide"></div></div></div></div></div>`;
  document.body.appendChild(w);
  const setTab = i => { $$('[data-tt]', w).forEach(b => b.classList.toggle('active', +b.dataset.tt === i)); $('#pmsTrack').style.transform = `translateX(-${i * 100}%)`; tab = i; };
  $$('[data-tt]', w).forEach(b => b.addEventListener('click', () => setTab(+b.dataset.tt)));
  $('[data-close]', w).addEventListener('click', closePms);
  const redraw = () => { drawPmsAll(p, redraw); drawPmsSide(p, sideIdx, i => { sideIdx = i; }, redraw); };
  redraw();
  setTab(tab);
  /* drag */
  let sx, sy, ox = 0, oy = 0, dragging = false;
  w.addEventListener('mousedown', e => {
    if (e.target.closest('button, select, input, .mui-acc-sum, [data-close], table')) return;
    dragging = true; sx = e.clientX - ox; sy = e.clientY - oy; w.classList.add('dragging');
  });
  const mv = e => { if (!dragging) return; ox = e.clientX - sx; oy = e.clientY - sy; const z = zoomFactor(); w.style.transform = `translate(${ox / z}px, ${oy / z}px)`; };
  const up = () => { dragging = false; w.classList.remove('dragging'); };
  document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
}
const statusText = s => s === 'JOIN' ? '참여' : s === 'END' ? '종료' : '하차';
function actionBtn(p, u) {
  if (u.personalStatus !== 'JOIN') return '';
  if (p.myPartNo === 1 && u.email !== S.userId) return `<button class="btn btn-outline-danger btn-sm mini-btn" data-quit="${u.userProjectNo}">추방</button>`;
  if (p.myPartNo !== 1 && u.email === S.userId) return `<button class="btn btn-outline-secondary btn-sm mini-btn" data-quit="${u.userProjectNo}">하차</button>`;
  return '';
}
function userCell(u) { const x = user(u.email); return `<img class="mini-avatar" src="${avatar(x)}" alt=""><span style="font-size:15px">${esc(x.nickname)}</span>`; }
function accordion(id, title, body, open) {
  return `<div class="mui-acc ${open ? 'open' : ''}" data-acc="${id}"><div class="mui-acc-sum"><h4>${title}</h4><i class="bi bi-chevron-down"></i></div><div class="mui-acc-det"><div class="mui-acc-inner"><div class="mui-acc-pad">${body}</div></div></div></div>`;
}
function bindAccordions(root) {
  $$('.mui-acc', root).forEach(a => $('.mui-acc-sum', a).addEventListener('click', () => {
    const was = a.classList.contains('open');
    $$('.mui-acc', root).forEach(x => x.classList.remove('open'));
    if (!was) a.classList.add('open');
  }));
}
function bindQuit(root, p, redraw) {
  $$('[data-quit]', root).forEach(b => b.addEventListener('click', () => {
    let target, part;
    p.parts.forEach(pt => pt.users.forEach(u => { if (u.userProjectNo == b.dataset.quit) { target = u; part = pt; } }));
    const word = target.email === S.userId ? '하차' : '추방';
    confirmBox(`프로젝트 ${word} 확인`, `${word} 하시면 다시 참여할 수 없습니다. 정말 ${word} 하시겠습니까?`, () => {
      target.personalStatus = 'QUIT'; part.currentCount = Math.max(0, part.currentCount - 1);
      ok(`${word} 완료!`); redraw();
    });
  }));
}
function drawPmsAll(p, redraw) {
  const leader = p.parts.find(x => x.partNo === 1);
  const others = p.parts.filter(x => x.partNo !== 1);
  const members = others.flatMap(pt => pt.users.map(u => ({ pt, u })));
  const el = $('#pmsAll');
  el.innerHTML = `<h4>팀장</h4><table class="table table-bordered"><tbody>${leader.users.map(u => `<tr><td style="padding:0.4rem">${userCell(u)}</td></tr>`).join('')}</tbody></table>
    ${accordion('a1', '전체 인원 현황', `<table class="table table-bordered"><thead><tr><th>파트</th><th>모집인원</th><th>지원인원</th><th>남은자리</th></tr></thead><tbody>
      ${others.map(x => `<tr><td>${esc(x.partName)}</td><td>${x.recruitCount}</td><td>${x.currentCount}</td><td>${x.recruitCount - x.currentCount}</td></tr>`).join('')}</tbody></table>`, true)}
    ${accordion('a2', '참여자 전체 리스트', `<table class="table table-bordered"><thead><tr style="text-align:center"><th>파트</th><th>참여자</th><th style="width:85px">상태</th></tr></thead><tbody>
      ${members.length === 0 ? '<tr><td colspan="3">참여자가 없습니다.</td></tr>' : members.map(({ pt, u }) => `<tr><td style="text-align:center">${esc(pt.partName)}</td>
        <td style="padding:0.3rem 0.4rem">${userCell(u)}</td><td style="padding:0.3rem;text-align:center"><span>${statusText(u.personalStatus)}</span>${actionBtn(p, u)}</td></tr>`).join('')}</tbody></table>`, false)}`;
  bindAccordions(el); bindQuit(el, p, redraw);
}
function drawPmsSide(p, idx, setIdx, redraw) {
  const others = p.parts.filter(x => x.partNo !== 1);
  const el = $('#pmsSide');
  const pt = others[idx] || others[0];
  el.innerHTML = `<div class="side-tabs-wrap"><div class="side-tabs-panel">${pt ? `
      ${accordion('s1', '인원 현황', `<table class="table table-bordered"><thead><tr><th>모집인원</th><th>지원인원</th><th>지원가능</th></tr></thead>
        <tbody><tr><td>${pt.recruitCount}</td><td>${pt.currentCount}</td><td>${pt.recruitCount - pt.currentCount}</td></tr></tbody></table>`, true)}
      ${accordion('s2', '참여자 리스트', `<table class="table table-bordered"><thead><tr><th>참여자</th><th style="width:85px;text-align:center">상태</th></tr></thead><tbody>
        ${pt.users.length === 0 ? '<tr><td colspan="2">참여자가 없습니다.</td></tr>' : pt.users.map(u => `<tr><td>${userCell(u)}</td><td style="text-align:center">${statusText(u.personalStatus)}${actionBtn(p, u)}</td></tr>`).join('')}</tbody></table>`, false)}` : ''}</div>
    <div class="side-tabs">${others.map((x, i) => `<button class="side-tab ${x === pt ? 'active' : ''}" data-si="${i}"><h4>${esc(x.partName)}</h4></button>`).join('')}</div></div>`;
  bindAccordions($('.side-tabs-panel', el)); bindQuit(el, p, redraw);
  $$('[data-si]', el).forEach(b => b.addEventListener('click', () => { setIdx(+b.dataset.si); drawPmsSide(p, +b.dataset.si, setIdx, redraw); }));
}

/* =====================================================================
   폰트 미리보기 (헤더 아래 select)
   ===================================================================== */
const FONTS = [
  { key: 'pretendard', label: 'Pretendard', family: 'Pretendard', css: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css' },
  { key: 'suit', label: 'SUIT', family: 'SUIT', css: 'https://cdn.jsdelivr.net/gh/sun-typeface/SUIT@2/fonts/static/woff2/SUIT.css' },
  { key: 'wanted', label: 'Wanted Sans', family: 'Wanted Sans', css: 'https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/static/split/WantedSans.min.css' },
  { key: 'spoqa', label: 'Spoqa Han Sans Neo', family: 'Spoqa Han Sans Neo', css: 'https://spoqa.github.io/spoqa-han-sans/css/SpoqaHanSansNeo.css' },
  { key: 'plex', label: 'IBM Plex Sans KR', family: 'IBM Plex Sans KR', css: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;600&display=swap' },
  { key: 'noto', label: 'Noto Sans KR', family: 'Noto Sans KR', css: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600&display=swap' },
  { key: 'nanumsquare', label: 'NanumSquare Neo', family: 'NanumSquareNeo', css: 'https://hangeul.pstatic.net/hangeul_static/css/nanum-square-neo.css' },
  // { key: '', label: '초기기획' }, /* 일단 숨김: 다시 쓰려면 주석 해제 */
];
function applyFont(key) {
  const f = FONTS.find(x => x.key === key) || FONTS[0]; /* 목록에 없는 값(예: 숨긴 초기기획)은 Pretendard */
  if (f.css && !document.querySelector(`link[data-font="${f.key}"]`)) {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = f.css; l.dataset.font = f.key;
    document.head.appendChild(l);
  }
  document.body.classList.toggle('font-mode', !!f.family);
  document.body.style.setProperty('--preview-font', f.family ? `'${f.family}'` : '');
  store.set('ct_font', f.key);
}
function initFontSwitch() {
  const sel = $('#fontSwitch');
  if (!sel) return;
  const cur = store.get('ct_font', 'pretendard'); /* 기본: Pretendard */
  sel.innerHTML = FONTS.map(f => `<option value="${f.key}" ${f.key === cur ? 'selected' : ''}>${f.label}</option>`).join('');
  sel.addEventListener('change', () => applyFont(sel.value));
  applyFont(cur);
}

/* =====================================================================
   Router
   ===================================================================== */
function pageNotFound() {
  app().innerHTML = `<div class="page-detail" style="text-align:center;min-height:500px;padding-top:200px"><h1><b>페이지를 찾을 수 없습니다.</b></h1><br/><a href="#/" class="btn btn-secondary">메인으로</a></div>`;
}
function route() {
  clearTips();
  const path = (location.hash.replace(/^#/, '') || '/').split('?')[0];
  const [seg, arg] = path.split('/').filter(Boolean);
  if (seg !== 'mypage') closePms();
  const table = {
    undefined: pageMain,
    cokkiri: () => pageRecruitList('cokkiri'),
    mammoth: () => pageRecruitList('mammoth'),
    coggle: pageCoggleList,
    'cokkiri-detail': () => pageCokkiriDetail(arg),
    'mammoth-detail': () => pageMammothDetail(arg),
    'coggle-detail': () => pageCoggleDetail(arg),
    'cokkiri-write': () => pageCokkiriWrite(),
    'cokkiri-edit': () => pageCokkiriWrite(arg),
    'mammoth-write': () => pageMammothWrite(),
    'mammoth-edit': () => pageMammothWrite(arg),
    'coggle-write': () => pageCoggleWrite(),
    'coggle-edit': () => pageCoggleWrite(arg),
    mypage: pageMyPage,
  };
  (table[seg] || pageNotFound)();
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
/* 창 크기가 바뀌면 목록 줄 수를 다시 맞춘다 */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if ($('.page-list')) { const y = window.scrollY; route(); window.scrollTo(0, y); }
    else if ($('.mypage')) fitMyPage();
  }, 200);
});
document.addEventListener('DOMContentLoaded', () => {
  /* ?demo 로 접속하면 데모 계정으로 바로 로그인 상태 */
  if (/[?&]demo\b/.test(location.search)) { S.userId = DEMO_USER; store.set('ct_user', DEMO_USER); }
  initFontSwitch();
  renderHeader(); renderFooter(); renderMessenger();
  lottieInto($('#sideAnimation'), 'love-you-coffee.json');
  route();
});
