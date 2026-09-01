// 聯絡表單 —— 右下角浮動按鈕 + 彈窗，四頁共用。
// 依 handoff/prototype/Contact Section (standalone).html 重製：
// 設計檔是 React 寫的，這裡用原生 JS 還原同樣的結構、樣式與互動，不引入框架。
//
// 送出流程：POST 到 Apps Script Web App → 寫進 Google Sheet + 寄通知信。
// body 用 URLSearchParams（會帶 application/x-www-form-urlencoded），
// 屬於瀏覽器認定的「簡單請求」不會觸發跨域預檢，Apps Script 端用 e.parameter 接。

import contactCopy from '../i18n/contact.json';
import bearSvg from '../icons/peach-bearbear.svg?raw';
import { getStoredLang } from './lang-store.js';

const ENDPOINT =
  'https://script.google.com/macros/s/AKfycby0aCGwmGviBGmioYkeH_9qLC2egG3neJYgzj4NZeWzNkfWA5e-UpiEMIpF7pdtGKs/exec';

// 送進 Sheet 的 topic 固定用中文，不隨介面語言變動，
// 這樣英文版訪客選的主題不會在 Sheet 裡變成另一組值、方便篩選統計。
const TOPIC_VALUES = ['網站設計', '社群合作', '聊聊想法'];
const MAX_LINKS = 2;
const CLOSE_MS = 380;

const LOGO = `<svg width="30" height="30" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M17.1175 13.8899C17.3637 14.1118 17.8175 13.9525 17.8167 13.5904C17.8142 12.1772 16.8748 10.8123 15.8662 9.91634C15.8445 9.89716 15.8219 9.88131 15.8069 9.85544C15.8027 9.84793 15.7986 9.83792 15.8027 9.82958C15.8052 9.82541 15.8094 9.82291 15.8144 9.8204C15.8344 9.81039 15.8553 9.80789 15.8762 9.80122C16.1139 9.72697 16.3617 9.67608 16.6095 9.64521C16.8631 9.61351 17.1192 9.6035 17.3745 9.61684C17.6298 9.63019 17.8726 9.66356 18.1162 9.71862C18.3598 9.77369 18.5925 9.8471 18.8211 9.9397C19.0497 10.0323 19.2666 10.1424 19.476 10.2692C19.6854 10.396 19.8815 10.5395 20.0667 10.698C20.2519 10.8566 20.4229 11.0292 20.5797 11.2145C20.7366 11.3997 20.8776 11.5991 21.001 11.8093C21.1245 12.0195 21.2313 12.2423 21.3164 12.4709C21.4015 12.6994 21.4691 12.9447 21.5124 13.19C21.5558 13.4353 21.5783 13.6989 21.575 13.9558C21.5717 14.2128 21.5475 14.4522 21.5024 14.6967C21.0653 17.0701 17.6448 19.225 15.5016 19.9008C14.674 20.1619 14.1976 19.8599 13.4526 19.5329C10.4743 18.2273 6.74266 15.4834 8.84917 11.7926C10.7897 8.39298 15.9746 9.17385 16.8689 12.9522C16.929 13.2075 16.9332 13.7231 17.1184 13.8899H17.1175Z" fill="#F4E1D5"/><path d="M20.5064 6.00524C20.0776 5.95852 19.6888 6.20713 19.3309 6.40819C18.9488 6.62343 18.5267 6.76608 18.1087 6.89623C17.2303 7.16987 16.3167 7.33005 15.3974 7.37176C14.6474 7.40596 13.9099 7.33589 13.1599 7.41681C12.4016 7.49857 11.6515 7.65541 10.9232 7.88066C10.7005 7.9499 10.4802 8.02916 10.2617 8.11091C10.1799 8.14178 9.65266 8.40457 9.59926 8.3662C9.12457 8.01915 8.70744 7.91903 8.15933 7.68127C6.52751 6.97215 4.55949 7.25663 3.26054 8.49467C3.12956 8.61981 2.99441 8.72326 3.02945 8.92933C3.05448 9.07532 3.60259 9.48578 3.75109 9.58756C4.18073 9.88122 4.68713 10.1348 5.19937 10.2458C5.22022 10.3434 5.18602 10.3125 5.14597 10.3392C3.7052 11.2694 2.82255 12.6451 3.02945 14.4388C3.07951 14.8693 3.68685 14.8109 4.01221 14.7942C5.76583 14.7058 7.10399 13.5244 7.76305 11.9961C7.82812 11.8459 7.89653 11.6974 7.96912 11.5514C8.33703 10.8139 8.80838 10.2333 9.4224 9.78778C9.72607 9.56754 10.0648 9.37983 10.4435 9.22299C10.7722 9.08617 11.1109 8.97438 11.4555 8.88344C12.3373 8.64985 13.3192 8.71158 14.1702 9.04195C14.2127 9.05864 14.2519 9.00941 14.2261 8.97104C14.1218 8.81169 14.196 8.58728 14.3779 8.52805C14.4764 8.49551 14.5915 8.50802 14.6941 8.50719C15.6285 8.49634 16.5637 8.41375 17.4772 8.21269C18.1046 8.07504 18.7294 7.88733 19.3359 7.68127C19.6997 7.5578 20.0768 7.47521 20.4397 7.34923C20.7584 7.23828 21.1588 7.10396 21.198 6.71186C21.2464 6.31558 20.856 6.04445 20.5047 6.00607L20.5064 6.00524Z" fill="#F4E1D5"/></svg>`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Link 欄位：https:// 可省略（一般人習慣直接貼 example.com/xxx），
// 但至少要有「網域.後綴」的樣子，純文字不算網址。
const URL_RE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([/?#][^\s]*)?$/i;

export function initContact() {
  if (document.querySelector('.ct-fab')) return; // 保險：同頁只掛一次

  let lang = getStoredLang();
  let t = () => contactCopy[lang];

  // ---- DOM ----------------------------------------------------------------
  const fab = el('button', 'ct-fab', {
    type: 'button',
    'aria-haspopup': 'dialog',
    'aria-expanded': 'false',
  });
  fab.innerHTML =
    `<span class="ct-fab-logo">${LOGO}</span>` +
    '<span class="ct-fab-label"></span>' +
    '<span class="ct-fab-arrow" aria-hidden="true"><span>&rarr;</span></span>';

  const scrim = el('div', 'ct-scrim', { hidden: '' });
  scrim.innerHTML = `
    <div class="ct-card" role="dialog" aria-modal="true" aria-labelledby="ct-title">
      <button type="button" class="ct-close">&#10005;</button>
      <div class="ct-body">
        <div class="ct-head">
          <div class="ct-eyebrow">Contact</div>
          <h3 class="ct-title" id="ct-title"></h3>
        </div>
        <form class="ct-form" novalidate>
          <div class="ct-scroll">
            <div class="ct-field">
              <label class="ct-label" for="ct-email"></label>
              <input class="ct-input" id="ct-email" type="email" name="email" autocomplete="email">
              <p class="ct-err" id="ct-email-err" hidden></p>
            </div>
            <div class="ct-field">
              <div class="ct-label" id="ct-topic-label"></div>
              <div class="ct-topics" role="group" aria-labelledby="ct-topic-label"></div>
              <p class="ct-err" id="ct-topic-err" hidden></p>
            </div>
            <div class="ct-field">
              <label class="ct-label" for="ct-identity"></label>
              <input class="ct-input" id="ct-identity" type="text" name="identity" autocomplete="organization">
              <p class="ct-err" id="ct-identity-err" hidden></p>
            </div>
            <div class="ct-field">
              <label class="ct-label" for="ct-message"></label>
              <textarea class="ct-input ct-textarea" id="ct-message" name="message" rows="2"></textarea>
            </div>
            <div class="ct-field">
              <div class="ct-label">Link</div>
              <div class="ct-links"></div>
              <button type="button" class="ct-addlink">
                <span aria-hidden="true">&#65291;</span><span class="ct-addlink-label"></span>
              </button>
            </div>
          </div>
          <div class="ct-actions">
            <p class="ct-formerr" role="alert" hidden></p>
            <button type="submit" class="ct-submit">
              <span class="ct-spin" aria-hidden="true"></span><span class="ct-submit-label"></span>
            </button>
          </div>
        </form>
        <div class="ct-done" hidden>
          <div class="ct-done-text">
            <div class="ct-done-title"></div>
            <p class="ct-done-body"></p>
          </div>
          <div class="ct-done-art" aria-hidden="true">${bearSvg}</div>
        </div>
      </div>
    </div>`;

  document.body.append(fab, scrim);

  const q = (s) => scrim.querySelector(s);
  const card = q('.ct-card');
  const form = q('.ct-form');
  const topicsBox = q('.ct-topics');
  const scrollBox = q('.ct-scroll');
  const linksBox = q('.ct-links');
  const addLinkBtn = q('.ct-addlink');
  const submitBtn = q('.ct-submit');
  const formErr = q('.ct-formerr');
  const inputs = {
    email: q('#ct-email'),
    identity: q('#ct-identity'),
    message: q('#ct-message'),
  };

  // ---- 狀態 ---------------------------------------------------------------
  let topic = '';        // 存 TOPIC_VALUES 裡的中文值
  let status = 'idle';   // idle | loading | success
  let touched = { email: false, identity: false };
  let submitted = false;
  let closeTimer = 0;
  let lockedScrollY = 0;

  // ---- 文案套用 ------------------------------------------------------------
  function applyCopy() {
    const c = t();
    scrim.dataset.lang = lang; // 供 CSS 針對語言微調（成功標題的英文字級）
    fab.setAttribute('aria-label', c.fab);
    fab.querySelector('.ct-fab-label').textContent = c.fab;
    q('.ct-close').setAttribute('aria-label', c.close);
    q('.ct-title').textContent = c.title;
    q('label[for="ct-email"]').innerHTML = `${c.emailLabel} <span class="ct-req">*</span>`;
    q('#ct-topic-label').innerHTML = `${c.topicLabel} <span class="ct-req">*</span>`;
    q('label[for="ct-identity"]').innerHTML = `${c.identityLabel} <span class="ct-req">*</span>`;
    q('label[for="ct-message"]').textContent = c.messageLabel;
    inputs.email.placeholder = c.emailPh;
    inputs.identity.placeholder = c.identityPh;
    inputs.message.placeholder = c.messagePh;
    q('.ct-addlink-label').textContent = c.addLink;
    q('.ct-done-title').textContent = c.successTitle;
    q('.ct-done-body').textContent = c.successBody;
    q('#ct-email-err').textContent = c.emailErr;
    q('#ct-topic-err').textContent = c.topicErr;
    q('#ct-identity-err').textContent = c.identityErr;
    formErr.textContent = c.errorMsg;
    syncTopics();
    linksBox.querySelectorAll('.ct-input').forEach((i) => (i.placeholder = c.linkPh));
    linksBox.querySelectorAll('.ct-linkdel').forEach((b) => b.setAttribute('aria-label', c.removeLink));
    linksBox.querySelectorAll('.ct-err-soft').forEach((h) => (h.textContent = c.linkErr));
    renderSubmit();
  }

  // 三顆膠囊只建立一次。切換選取時「就地更新」而不是重建 DOM——
  // 若在 click 事件冒泡途中把被點的按鈕移除，它會變成沒有祖先的孤兒節點，
  // 背景關閉判斷的 closest('.ct-card') 就會落空、誤判成點到背景而關掉彈窗。
  function buildTopics() {
    topicsBox.innerHTML = '';
    TOPIC_VALUES.forEach((value) => {
      const b = el('button', 'ct-topic', { type: 'button' });
      b.dataset.value = value;
      b.addEventListener('click', () => {
        topic = topic === value ? '' : value; // 再點一次可取消（依設計檔）
        if (submitted) validate();
        syncTopics();
        renderSubmit();
      });
      topicsBox.append(b);
    });
  }

  function syncTopics() {
    const labels = t().topics;
    [...topicsBox.children].forEach((b, i) => {
      b.textContent = labels[i];
      b.setAttribute('aria-pressed', String(topic === b.dataset.value));
      b.disabled = status !== 'idle';
    });
    topicsBox.classList.toggle('is-bad', !q('#ct-topic-err').hidden);
  }

  // ---- Link 欄位（1~2 個，第二個可移除）--------------------------------------
  function addLinkRow(value = '') {
    const wrap = el('div', 'ct-linkwrap');
    const row = el('div', 'ct-linkrow');
    const input = el('input', 'ct-input', { type: 'url', placeholder: t().linkPh });
    input.value = value;
    // 柔和提示：連結格式不對只是提醒，不擋送出（Link 本來就是選填）
    const hint = el('p', 'ct-err ct-err-soft', { hidden: '' });
    hint.textContent = t().linkErr;
    const check = () => {
      const v = input.value.trim();
      const bad = !!v && !URL_RE.test(v);
      input.classList.toggle('is-soft-bad', bad);
      hint.hidden = !bad;
      syncMask();
    };
    input.addEventListener('input', check);
    input.addEventListener('blur', check);
    row.append(input);
    if (linksBox.children.length > 0) {
      const del = el('button', 'ct-linkdel', { type: 'button', 'aria-label': t().removeLink });
      del.innerHTML = '&minus;';
      del.addEventListener('click', () => {
        wrap.remove();
        renderAddLink();
        syncMask();
      });
      row.append(del);
    }
    wrap.append(row, hint);
    linksBox.append(wrap);
    renderAddLink();
    syncMask();
  }
  function renderAddLink() {
    addLinkBtn.hidden = linksBox.children.length >= MAX_LINKS || status !== 'idle';
  }
  addLinkBtn.addEventListener('click', () => addLinkRow());

  // ---- 驗證 ---------------------------------------------------------------
  const emailBad = () => !EMAIL_RE.test(inputs.email.value.trim());
  const identityBad = () => !inputs.identity.value.trim();
  const topicBad = () => !topic;
  const incomplete = () => emailBad() || topicBad() || identityBad();

  // 依設計檔：欄位 blur 過、或按過送出，才顯示錯誤，不要一開啟就滿江紅
  function validate() {
    setErr('email', (touched.email || submitted) && emailBad());
    setErr('identity', (touched.identity || submitted) && identityBad());
    setErr('topic', submitted && topicBad());
    syncTopics();
  }
  function setErr(key, bad) {
    const err = q(`#ct-${key}-err`);
    err.hidden = !bad;
    if (inputs[key]) inputs[key].classList.toggle('is-bad', !!bad);
  }

  function renderSubmit() {
    const c = t();
    submitBtn.querySelector('.ct-submit-label').textContent =
      status === 'loading' ? c.submitting : status === 'success' ? c.submitted : c.submit;
    submitBtn.disabled = status !== 'idle' || incomplete();
    submitBtn.classList.toggle('is-loading', status === 'loading');
    form.classList.toggle('is-locked', status !== 'idle');
    Object.values(inputs).forEach((i) => (i.disabled = status !== 'idle'));
    linksBox.querySelectorAll('.ct-input').forEach((i) => (i.disabled = status !== 'idle'));
    syncTopics();
    renderAddLink();
  }

  ['email', 'identity'].forEach((key) => {
    inputs[key].addEventListener('input', () => {
      validate();
      renderSubmit();
    });
    inputs[key].addEventListener('blur', () => {
      touched[key] = true;
      validate();
    });
  });

  // ---- 送出 ---------------------------------------------------------------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (status !== 'idle') return;
    submitted = true;
    touched = { email: true, identity: true };
    validate();
    renderSubmit();
    if (incomplete()) return;

    formErr.hidden = true;
    // 先鎖住卡片高度，換成成功畫面時才不會整張跳動（依設計檔）
    card.style.height = card.offsetHeight + 'px';
    status = 'loading';
    renderSubmit();

    const links = [...linksBox.querySelectorAll('.ct-input')].map((i) => i.value.trim());
    const payload = new URLSearchParams({
      email: inputs.email.value.trim(),
      topic,
      identity: inputs.identity.value.trim(),
      message: inputs.message.value.trim(),
      link1: links[0] || '',
      link2: links[1] || '',
    });

    try {
      const res = await fetch(ENDPOINT, { method: 'POST', body: payload });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      status = 'success';
      renderSubmit();
      q('.ct-form').hidden = true;
      q('.ct-head').hidden = true;
      q('.ct-done').hidden = false;
    } catch {
      status = 'idle';
      card.style.height = '';
      formErr.hidden = false;
      renderSubmit();
    }
  });

  // ---- 開關 ---------------------------------------------------------------
  function open() {
    // 關閉動畫結束後才會重置表單。若使用者在動畫跑完前又按開，
    // 這裡先把那次重置補做掉，否則會看到上一次的成功畫面殘留。
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = 0;
      reset();
    }
    // 卡片展開後的尺寸依視窗算，跟設計檔一致（最寬 640、最高 700，各留 80 邊距）；
    // 下限保護：視窗極窄或尚未量到尺寸時，別算出 0 或負值把卡片縮沒
    const w = window.innerWidth || 640;
    const h = window.innerHeight || 700;
    card.style.setProperty('--ct-w', Math.max(280, Math.min(640, w - 80)) + 'px');
    scrim.hidden = false;
    // 卡片高度是內容撐出來的，--ct-h 只是上限。桌機拿掉原本 700px 的硬上限、
    // 直接給到螢幕可用高度：內容放得下就完整顯示、不出現捲軸，放不下才捲動。
    // 手機維持 700px 上限，本來就靠捲動。
    const wide = window.matchMedia('(min-width: 769px)').matches;
    const cap = wide ? h - 80 : Math.min(700, h - 80);
    card.style.setProperty('--ct-h', Math.max(360, cap) + 'px');
    // 捲回頂端必須在「顯示之後」做：隱藏時彈窗是 display:none，
    // 捲動容器沒有版面，scrollTop 讀到的永遠是 0、寫入也無效，
    // 瀏覽器仍記著上次的位置並在重新顯示時還原。
    scrollBox.scrollTop = 0;
    syncMask();
    fab.setAttribute('aria-expanded', 'true');
    // 鎖住背景捲動：記下位置後把 body 固定住（見 components.css 的 body.ct-open）
    lockedScrollY = window.scrollY;
    const barWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.top = `-${lockedScrollY}px`;
    if (barWidth > 0) document.body.style.paddingRight = `${barWidth}px`; // 捲軸消失造成的位移補償
    document.body.classList.add('ct-open');
    // 強制 reflow 讓瀏覽器先套用「收合」狀態，下一行加 class 才會跑 transition。
    // 不用 requestAnimationFrame：分頁在背景時 rAF 會被延後，彈窗會卡在收合狀態。
    void scrim.offsetWidth;
    scrim.classList.add('is-open');
    syncMask();
    inputs.email.focus({ preventScroll: true });
  }

  function close() {
    if (scrim.hidden) return;
    scrim.classList.remove('is-open');
    fab.setAttribute('aria-expanded', 'false');
    // 解鎖並還原到原本的捲動位置
    document.body.classList.remove('ct-open');
    document.body.style.top = '';
    document.body.style.paddingRight = '';
    window.scrollTo(0, lockedScrollY);
    closeTimer = setTimeout(() => {
      closeTimer = 0;
      scrim.hidden = true;
      reset();
    }, CLOSE_MS);
    fab.focus({ preventScroll: true });
  }

  function reset() {
    form.reset();
    form.hidden = false;
    q('.ct-head').hidden = false;
    q('.ct-done').hidden = true;
    card.style.height = '';
    topic = '';
    status = 'idle';
    submitted = false;
    touched = { email: false, identity: false };
    formErr.hidden = true;
    linksBox.innerHTML = '';
    addLinkRow();
    validate();
    renderSubmit();
  }

  // 捲到底就取消底部淡出遮罩（依設計檔）
  const syncMask = () => {
    const atBottom = scrollBox.scrollHeight - scrollBox.scrollTop - scrollBox.clientHeight < 8;
    scrollBox.classList.toggle('is-bottom', atBottom);
  };
  scrollBox.addEventListener('scroll', syncMask);
  window.addEventListener('resize', syncMask);

  fab.addEventListener('click', open);
  q('.ct-close').addEventListener('click', close);
  scrim.addEventListener('click', (e) => {
    if (e.target === scrim) close(); // 只有點在遮罩本身才關；比 closest 更耐脫離 DOM 的節點
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !scrim.hidden) close();
  });

  // 語言切換：header 的 #langBtn 由各頁 i18n 模組管理，這裡不去搶那份狀態，
  // 而是各自從同一個起始值鏡射切換，不依賴兩邊監聽器的先後順序。
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      lang = lang === 'zh' ? 'en' : 'zh';
      applyCopy();
    });
  }

  buildTopics();
  addLinkRow();
  applyCopy();
  renderSubmit();
}

function el(tag, className, attrs) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}
