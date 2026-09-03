// 聯絡表單 —— 右下角浮動按鈕 + 彈窗，四頁共用。
// 依 handoff/prototype/Contact Section (standalone).html 重製：
// 設計檔是 React 寫的，這裡用原生 JS 還原同樣的結構、樣式與互動，不引入框架。
//
// 送出流程：POST 到 Apps Script Web App → 寫進 Google Sheet + 寄通知信。
// body 用 URLSearchParams（會帶 application/x-www-form-urlencoded），
// 屬於瀏覽器認定的「簡單請求」不會觸發跨域預檢，Apps Script 端用 e.parameter 接。

import contactCopy from '../i18n/contact.json';
import bearSvg from '../icons/peach-bearbear.svg?raw';
import envClosedSvg from '../icons/env-closed.svg?raw';
import envOpenSvg from '../icons/env-open.svg?raw';
import envSolidSvg from '../icons/env-solid.svg?raw';
import { getStoredLang } from './lang-store.js';

const ENDPOINT =
  'https://script.google.com/macros/s/AKfycby0aCGwmGviBGmioYkeH_9qLC2egG3neJYgzj4NZeWzNkfWA5e-UpiEMIpF7pdtGKs/exec';

// 送進 Sheet 的 topic 固定用中文，不隨介面語言變動，
// 這樣英文版訪客選的主題不會在 Sheet 裡變成另一組值、方便篩選統計。
const TOPIC_VALUES = ['網站設計', '社群合作', '聊聊想法'];
const MAX_LINKS = 2;
const OPEN_MS = 400; // 與 components.css 卡片展開的 --duration-slow 一致
const CLOSE_MS = 380;
// 桌機成功畫面停留多久後自動關閉彈窗。
// 桌機的送出回饋就是這個成功畫面，沒有信封動畫要等
//（信封只存在於手機的底部 bar，桌機是 display:none，送出時也不會跑那條時間軸），
// 所以縮到 1.7s 不會切斷任何動畫。手機維持原本的「收進信封」600ms，不受影響。
const DONE_AUTOCLOSE_MS = 1700;

const LOGO = `<svg width="30" height="30" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M17.1175 13.8899C17.3637 14.1118 17.8175 13.9525 17.8167 13.5904C17.8142 12.1772 16.8748 10.8123 15.8662 9.91634C15.8445 9.89716 15.8219 9.88131 15.8069 9.85544C15.8027 9.84793 15.7986 9.83792 15.8027 9.82958C15.8052 9.82541 15.8094 9.82291 15.8144 9.8204C15.8344 9.81039 15.8553 9.80789 15.8762 9.80122C16.1139 9.72697 16.3617 9.67608 16.6095 9.64521C16.8631 9.61351 17.1192 9.6035 17.3745 9.61684C17.6298 9.63019 17.8726 9.66356 18.1162 9.71862C18.3598 9.77369 18.5925 9.8471 18.8211 9.9397C19.0497 10.0323 19.2666 10.1424 19.476 10.2692C19.6854 10.396 19.8815 10.5395 20.0667 10.698C20.2519 10.8566 20.4229 11.0292 20.5797 11.2145C20.7366 11.3997 20.8776 11.5991 21.001 11.8093C21.1245 12.0195 21.2313 12.2423 21.3164 12.4709C21.4015 12.6994 21.4691 12.9447 21.5124 13.19C21.5558 13.4353 21.5783 13.6989 21.575 13.9558C21.5717 14.2128 21.5475 14.4522 21.5024 14.6967C21.0653 17.0701 17.6448 19.225 15.5016 19.9008C14.674 20.1619 14.1976 19.8599 13.4526 19.5329C10.4743 18.2273 6.74266 15.4834 8.84917 11.7926C10.7897 8.39298 15.9746 9.17385 16.8689 12.9522C16.929 13.2075 16.9332 13.7231 17.1184 13.8899H17.1175Z" fill="#F4E1D5"/><path d="M20.5064 6.00524C20.0776 5.95852 19.6888 6.20713 19.3309 6.40819C18.9488 6.62343 18.5267 6.76608 18.1087 6.89623C17.2303 7.16987 16.3167 7.33005 15.3974 7.37176C14.6474 7.40596 13.9099 7.33589 13.1599 7.41681C12.4016 7.49857 11.6515 7.65541 10.9232 7.88066C10.7005 7.9499 10.4802 8.02916 10.2617 8.11091C10.1799 8.14178 9.65266 8.40457 9.59926 8.3662C9.12457 8.01915 8.70744 7.91903 8.15933 7.68127C6.52751 6.97215 4.55949 7.25663 3.26054 8.49467C3.12956 8.61981 2.99441 8.72326 3.02945 8.92933C3.05448 9.07532 3.60259 9.48578 3.75109 9.58756C4.18073 9.88122 4.68713 10.1348 5.19937 10.2458C5.22022 10.3434 5.18602 10.3125 5.14597 10.3392C3.7052 11.2694 2.82255 12.6451 3.02945 14.4388C3.07951 14.8693 3.68685 14.8109 4.01221 14.7942C5.76583 14.7058 7.10399 13.5244 7.76305 11.9961C7.82812 11.8459 7.89653 11.6974 7.96912 11.5514C8.33703 10.8139 8.80838 10.2333 9.4224 9.78778C9.72607 9.56754 10.0648 9.37983 10.4435 9.22299C10.7722 9.08617 11.1109 8.97438 11.4555 8.88344C12.3373 8.64985 13.3192 8.71158 14.1702 9.04195C14.2127 9.05864 14.2519 9.00941 14.2261 8.97104C14.1218 8.81169 14.196 8.58728 14.3779 8.52805C14.4764 8.49551 14.5915 8.50802 14.6941 8.50719C15.6285 8.49634 16.5637 8.41375 17.4772 8.21269C18.1046 8.07504 18.7294 7.88733 19.3359 7.68127C19.6997 7.5578 20.0768 7.47521 20.4397 7.34923C20.7584 7.23828 21.1588 7.10396 21.198 6.71186C21.2464 6.31558 20.856 6.04445 20.5047 6.00607L20.5064 6.00524Z" fill="#F4E1D5"/></svg>`;

// 手機底部 bar 的聯絡入口。三張信封疊在一起，靠切換透明度換狀態：
//   閉合（線條）＝ 平常 ／ 打開（線條）＝ 開著表單 ／ 實心 ＝ 送出成功變綠
// 三張都是 left:0 bottom:0 齊底、同寬（見 components.css），
// 所以切換時盒身停在原位，只有蓋子在動。
// 原檔的 fill 已改成 currentColor，顏色才能交給 CSS 控制（送出時變綠）。
const ENVELOPE =
  `<span class="ct-navmail-env ct-navmail-closed">${envClosedSvg}</span>` +
  `<span class="ct-navmail-env ct-navmail-closed-green">${envClosedSvg}</span>` +
  `<span class="ct-navmail-env ct-navmail-open">${envOpenSvg}</span>` +
  `<span class="ct-navmail-env ct-navmail-solid">${envSolidSvg}</span>`;

// 送出成功最後出現的大勾勾——是「取代信封」，不是疊在信封上。
// 用 stroke-dasharray 讓它畫出來。
const CHECK_ICON =
  '<svg class="ct-navmail-chk" viewBox="0 0 24 24" aria-hidden="true">' +
  '<path d="M4 12.5 l5 5 L20 6"/></svg>';

// 收進信封的時間軸，依 handoff/prototype/form-genie-final.html
const GENIE_MS = 600; // 表單被「吸進」信封的時間

// 信封送出動畫的時間軸，依 handoff/prototype/envelope-anim-final.html（a9）。
// 起點是「表單已經打開、信封是開著的」狀態，所以不需要再播一次打開。
const ENV_CLOSE_AT = 640; // 合起成綠色閉合 + 盒身彈跳；接在表單被吞進去（GENIE_MS 600）之後
const ENV_SOLID_AT = 900; // 換成實心綠。a9 把這段從 1000 提前，合起後接得更緊
const ENV_CHECK_AT = 1420; // 信封退場、換成大綠勾勾
// 勾勾退場、米白信封淡回（300ms 過渡，見 components.css）。
// a9 原本 3300、上一輪改 2600，仍偏久：畫線在 1940ms 就結束，之後都是乾等。
// 2250 讓勾勾共顯示 830ms、畫完仍留約 310ms，看得清楚又不拖。
const ENV_BACK_AT = 2250;

// 一般關閉（沒送出）時，信封「多開著一拍」再闔上。
// 不立刻闔的原因：關閉當下面板正在收合（CLOSE_MS 380），視線被面板帶走，
// 蓋子闔上的動作會被蓋過去。等面板退場到一半再闔，動作才落在乾淨的畫面上。
const ENV_SHUT_DELAY = 200;

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

  // 手機版入口：塞進 header 的 nav（手機時 header 整條會變成底部固定 bar）。
  // 桌機以 CSS 隱藏，維持右下角的浮動按鈕。
  const navMail = el('button', 'ct-navmail', {
    type: 'button',
    'aria-haspopup': 'dialog',
    'aria-expanded': 'false',
  });
  navMail.innerHTML = `<span class="ct-navmail-box">${ENVELOPE}</span>${CHECK_ICON}`;
  document.querySelector('header nav')?.append(navMail);
  const triggers = [fab, navMail];

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
  let lastTrigger = null;
  let envTimers = []; // 信封送出動畫的計時器，重播前要全部清掉
  let doneTimer = 0; // 成功畫面的自動關閉計時器

  // ---- 文案套用 ------------------------------------------------------------
  function applyCopy() {
    const c = t();
    scrim.dataset.lang = lang; // 供 CSS 針對語言微調（成功標題的英文字級）
    fab.setAttribute('aria-label', c.fab);
    navMail.setAttribute('aria-label', c.fab);
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

  // 膠囊的指標處理。兩個狀態各自有明確的清除時機，不會殘留：
  //   gesture       —— 這根手指按下的膠囊，pointerup / pointercancel 必定清掉
  //   suppressClick —— pointerdown 已處理過、待會兒那次 click 要略過，
  //                    下一次 pointerdown 一定清掉
  let gesture = null;
  let suppressClick = null;

  function applyTopic(next) {
    topic = next;
    if (submitted) validate();
    syncTopics();
    renderSubmit();
  }

  const toggleValue = (value) => (topic === value ? '' : value); // 再點一次可取消（依設計檔）

  function buildTopics() {
    topicsBox.innerHTML = '';
    TOPIC_VALUES.forEach((value) => {
      const b = el('button', 'ct-topic', { type: 'button' });
      b.dataset.value = value;
      topicsBox.append(b);
    });
  }

  // 任何新的指標互動都先把上一次的 click 抑制清掉，避免殘留把下一次點擊吃掉。
  // 用捕獲階段，確保比下面的 pointerdown 先跑。
  document.addEventListener('pointerdown', () => { suppressClick = null; }, true);

  // 在 pointerdown 就選取，而不是等 click。
  // 手指按下到 click 派送之間，版面會位移：點膠囊會讓輸入框失焦 → 驗證跑起來
  // → 錯誤提示展開，實測把膠囊往下推 26px（膠囊才 42px 高）；手機上還會再疊一層
  // 鍵盤收起造成的面板變高。等到 click 時膠囊早已不在手指底下 ——
  // 這就是「要按兩下」的成因。
  topicsBox.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.ct-topic');
    if (!b || !e.isPrimary || b.disabled) return;
    gesture = { btn: b, prev: topic, id: e.pointerId };
    applyTopic(toggleValue(b.dataset.value));
  });

  // pointerup 必定跟在 pointerdown 之後，所以手勢狀態一定會在這裡結束。
  // ⚠️ 這裡不做「在按鈕外放開就還原」：那會把「這次手勢被放棄」和
  // 「之後一次無關的互動」混為一談 —— 先前就是因此造成
  // 「選完標籤、去點下一個欄位時標籤被取消」。
  document.addEventListener('pointerup', (e) => {
    if (!gesture || e.pointerId !== gesture.id) return;
    suppressClick = gesture.btn; // 接下來那次 click 是這次手勢的後續，要略過
    gesture = null;
  });

  // 瀏覽器接管手勢（使用者其實是想捲動）才還原，這是唯一可靠的「放棄」訊號
  document.addEventListener('pointercancel', (e) => {
    if (!gesture || e.pointerId !== gesture.id) return;
    applyTopic(gesture.prev);
    gesture = null;
    suppressClick = null;
  });

  topicsBox.addEventListener('click', (e) => {
    const b = e.target.closest('.ct-topic');
    if (!b) return;
    if (suppressClick === b) {
      suppressClick = null;
      return;
    }
    applyTopic(toggleValue(b.dataset.value)); // 鍵盤 Enter／空白鍵走這條
  });

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
        refreshEnterHints();
        renderAddLink();
        syncMask();
      });
      row.append(del);
    }
    wrap.append(row, hint);
    linksBox.append(wrap);
    refreshEnterHints();
    renderAddLink();
    syncMask();
  }
  function renderAddLink() {
    addLinkBtn.hidden = linksBox.children.length >= MAX_LINKS || status !== 'idle';
  }
  addLinkBtn.addEventListener('click', () => {
    addLinkRow();
    // 直接聚焦新出現的那一欄，使用者不必再點一次就能打字。
    // 手機的「置中 + 鍵盤不遮」不必在這裡重寫：聚焦會觸發 scrollBox 的
    // focusin，那邊已經處理好等鍵盤穩定、重算面板高度、平滑捲到畫面中央。
    const rows = linksBox.querySelectorAll('.ct-input');
    rows[rows.length - 1]?.focus();
    syncMask();
  });

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
  // 依填寫順序排出「可打字的欄位」。交流主題是按鈕、不列入。
  const textFields = () => [
    inputs.email,
    inputs.identity,
    inputs.message,
    ...linksBox.querySelectorAll('.ct-input'),
  ];

  // 手機鍵盤右下角的動作鍵：不是最後一欄顯示「下一個」，最後一欄顯示「完成」。
  // textarea 不設，讓它維持換行鍵。
  function refreshEnterHints() {
    const list = textFields();
    list.forEach((el, i) => {
      if (el.tagName === 'TEXTAREA') return;
      el.setAttribute('enterkeyhint', i === list.length - 1 ? 'done' : 'next');
    });
  }

  // Enter 的三種行為：
  // - 單行輸入框：跳到下一個可打字的欄位（跳過去後由 focusin 負責置中）
  // - textarea：不攔，維持換行
  // - 最後一欄：收鍵盤，不送出
  // 一律 preventDefault 也順便擋掉瀏覽器的「隱含送出」——在單行輸入框按 Enter
  // （手機鍵盤的 Go／完成鍵也算）會直接提交表單，是誤觸來源。
  form.addEventListener('keydown', (e) => {
    // ⚠️ 中文輸入法組字中的 Enter 是「確認選字」，不是「換到下一欄」。
    // 之前沒排除，結果是：注音打完按 Enter 選字時，這裡把 Enter 攔下來、
    // 順手把焦點搬到「需求／想法」，輸入法還沒送出的字就落進了那一欄——
    // 使用者看到的就是「身份欄自行輸入的字同時跑進需求欄」。
    // （從選單帶入名稱時沒有組字，所以那條路徑正常，症狀才只出現在自行輸入。）
    // isComposing 是標準判斷；keyCode 229 是部分 Android／舊版輸入法的訊號，一併排除。
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key !== 'Enter' || e.target.tagName !== 'INPUT') return;
    e.preventDefault();
    const list = textFields();
    const next = list[list.indexOf(e.target) + 1];
    if (next) next.focus();
    else e.target.blur();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (status !== 'idle') return;
    submitted = true;
    touched = { email: true, identity: true };
    validate();
    renderSubmit();
    if (incomplete()) return;

    formErr.hidden = true;
    // 桌機先鎖住卡片高度，換成成功畫面時才不會整張跳動（依設計檔）。
    // 手機滿版沒有這個問題，而且鎖了會跟 visualViewport 的高度同步互相覆寫。
    if (!narrow()) card.style.height = card.offsetHeight + 'px';
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
      // 斷網時就別假裝成功了——這是唯一能確定「資料沒送到」的情況。
      // （onLine 為 true 不保證真的連得上，所以只在明確離線時擋。）
      if (navigator.onLine === false) throw new Error('offline');

      // ⚠️ 一定要用 no-cors，不能檢查 res.ok。
      // Apps Script 的 /exec 會 302 轉址到 script.googleusercontent.com，
      // 而那條轉址鏈沒有帶 CORS 標頭，所以 cors 模式下瀏覽器會擋掉「回應」。
      // 實測從 tuffiechang.com 發 cors 請求會得到 TypeError: Failed to fetch，
      // 但請求其實已經送達、資料已經寫進試算表——結果就是
      // 「後端成功、前端誤報失敗」（金絲桃遇到的正是這個）。
      // no-cors 讓請求照樣送出（URLSearchParams 產生的 urlencoded 屬於
      // CORS 安全清單內的 Content-Type，不會觸發預檢），
      // 但回應變成 opaque：status 恆為 0、ok 恆為 false，
      // 所以絕對不能再用 res.ok 判斷成功，否則每次都會誤報失敗。
      //
      // 取捨：讀不到後端的回覆，就無法區分「送達但後端自己出錯」——
      // 那種情況會顯示成功。這是刻意選的：寧可少數情況偏樂觀，
      // 也不要像現在這樣每次都誤報失敗、還讓人重送而寫入重複資料。
      // 真正的失敗（斷網、DNS 解不出來）fetch 仍會 reject，會走到下面的 catch。
      await fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: payload });
      status = 'success';
      renderSubmit();
      if (narrow()) {
        flyIntoEnvelope(); // 手機：表單收進底部信封，不出現整頁成功畫面
      } else {
        q('.ct-form').hidden = true;
        q('.ct-head').hidden = true;
        q('.ct-done').hidden = false;
        // 看完成功訊息就自動收起來，不用再按一次關閉。
        // 手機不走這條（送出時是收進信封、沒有成功畫面）。
        clearTimeout(doneTimer);
        doneTimer = setTimeout(close, DONE_AUTOCLOSE_MS);
      }
    } catch {
      status = 'idle';
      card.style.height = '';
      formErr.hidden = false;
      renderSubmit();
    }
  });

  // ---- 送出成功：手機把表單收進底部的信封 --------------------------------
  // 落點不寫死：動畫當下量信封的真實位置，算出把面板中心移到信封中心
  // 所需的位移與縮放。語言切換讓 bar 變寬、或安全區高度不同，落點都會準。
  function flyIntoEnvelope() {
    const cardRect = card.getBoundingClientRect();
    const mailRect = navMail.getBoundingClientRect();
    scrim.classList.add('is-sending');
    // 立刻解鎖背景：此刻面板還蓋著整個畫面，還原捲動位置看不見；
    // 同時 body 不再有 ct-open，底部 bar 就露出來了，表單才有信封可以收進去。
    unlockScroll();

    // 關動態或量不到信封：不做精靈動畫，直接收起表單並讓信封打勾
    if (prefersReduced.matches || !mailRect.width || !cardRect.width) {
      teardown();
      playEnvelopeSuccess();
      return;
    }

    // 變形結構與 prototype 相同：translate + scaleX + scaleY，origin 在底部中央。
    // prototype 的 translateY(180px) 是示意值；這裡改成「卡片底部中央 → 信封中心」
    // 的實際位移，動作一樣但落點對準真實的 icon。
    const ox = cardRect.left + cardRect.width / 2;
    const oy = cardRect.bottom;
    const dx = mailRect.left + mailRect.width / 2 - ox;
    const dy = mailRect.top + mailRect.height / 2 - oy;
    card.style.transformOrigin = '50% 100%';
    card.classList.add('is-genie');
    void card.offsetWidth; // 先套用起始狀態，下面的變更才會跑 transition
    // 神似 Mac 精靈：往下滑 + 往窄拉 + 收縮 + 模糊淡出，像被吸進信封
    card.style.transform = `translate(${Math.round(dx)}px, ${Math.round(dy)}px) scaleX(0.12) scaleY(0.5)`;
    card.style.opacity = '0';
    card.style.filter = 'blur(2px)';

    playEnvelopeSuccess();
    setTimeout(teardown, GENIE_MS);
  }

  // 信封狀態切換。這些狀態互斥，統一從這裡進出，避免殘留。
  function setEnvelope(state) {
    navMail.classList.remove('is-open', 'is-closing', 'is-solid', 'is-done');
    if (state) navMail.classList.add(state);
    // 回到平常狀態時把彈跳也清掉，下一次才觸發得起來
    else navMail.querySelector('.ct-navmail-box')?.classList.remove('is-pop');
  }

  // 送出成功的信封動畫，時序照 handoff/prototype/envelope-anim-final.html：
  //   開著接收 → 620ms 蓋子闔上 → 1000ms 實心綠 → 1520ms 換大綠勾 → 3500ms 回閉合
  // 進來時信封已經是打開的（開表單時就切過去了），所以這裡直接從「闔上」接下去。
  function playEnvelopeSuccess() {
    envTimers.forEach(clearTimeout);
    envTimers = [];

    // 關動態：不跑長動畫，直接顯示結果再收回
    if (prefersReduced.matches) {
      setEnvelope('is-done');
      envTimers = [setTimeout(() => setEnvelope(null), 1200)];
      return;
    }

    const box = navMail.querySelector('.ct-navmail-box');
    const at = (ms, fn) => envTimers.push(setTimeout(fn, ms));

    at(ENV_CLOSE_AT, () => {
      setEnvelope('is-closing'); // 合起成綠色閉合
      // 重新觸發彈跳：先移除、強制 reflow，再加回去。
      // 少了中間那次 reflow，瀏覽器會把「移除再加上」視為沒變化，動畫不會重播。
      box?.classList.remove('is-pop');
      void box?.offsetWidth;
      box?.classList.add('is-pop');
    });
    at(ENV_SOLID_AT, () => setEnvelope('is-solid')); // 實心綠信封
    at(ENV_CHECK_AT, () => setEnvelope('is-done')); // 勾取代信封
    // 收尾只要清掉狀態：米白信封會依 CSS 的過渡淡回並放大回原尺寸，
    // 同時勾勾淡出（線條維持畫好的樣子，不會瞬間消失），兩者交疊、不留空檔
    at(ENV_BACK_AT, () => setEnvelope(null));
  }

  // 收尾：隱藏彈窗、解鎖背景捲動、清掉行內樣式並重置表單
  // 解除背景捲動鎖並還原捲動位置。抽出來是為了能提早呼叫：
  // 這一步會讓整頁瞬間換位，留到動畫結束才做，會在使用者正盯著信封時
  // 讓背景跳一下、連帶讓信封看起來閃動。
  function unlockScroll() {
    if (!document.body.classList.contains('ct-open')) return;
    document.body.classList.remove('ct-open');
    document.body.style.top = '';
    document.body.style.paddingRight = '';
    window.scrollTo(0, lockedScrollY);
  }

  function teardown() {
    scrim.classList.remove('is-open', 'is-sending');
    triggers.forEach((el) => el.setAttribute('aria-expanded', 'false'));
    unlockScroll();
    scrim.hidden = true;
    card.classList.remove('is-genie');
    card.removeAttribute('style'); // 清掉精靈動畫設的 transform / opacity / filter
    reset();
  }

  // ---- 開關 ---------------------------------------------------------------
  function open() {
    // 關閉動畫結束後才會重置表單。若使用者在動畫跑完前又按開，
    // 這裡先把那次重置補做掉，否則會看到上一次的成功畫面殘留。
    clearTimeout(doneTimer);
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
    syncPanelHeight();
    syncMask();
    triggers.forEach((el) => el.setAttribute('aria-expanded', 'true'));
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
    // 信封跟著打開（蓋子往上掀）。手機把表單開成滿版時 bar 會被藏起來，
    // 所以這個動作當下看不到；它真正露臉是在送出時——表單收進來的那一刻
    // 信封是開著接收的，然後才闔上。
    envTimers.forEach(clearTimeout);
    envTimers = [];
    setEnvelope('is-open');
    // 展開動畫結束後重算一次底部遮罩。ResizeObserver 只在瀏覽器實際
    // 繪製時才送出回呼，分頁在背景（或不渲染）時不會觸發，
    // 這裡用固定時間補一次，確保遮罩狀態一定正確。
    setTimeout(syncMask, OPEN_MS);
    syncMask();
    inputs.email.focus({ preventScroll: true });
  }

  function close() {
    if (scrim.hidden) return;
    clearTimeout(doneTimer); // 使用者自己先關了，就不需要那個自動關閉
    scrim.classList.remove('is-open');
    triggers.forEach((el) => el.setAttribute('aria-expanded', 'false'));
    // 解鎖並還原到原本的捲動位置
    document.body.classList.remove('ct-open');
    document.body.style.top = '';
    document.body.style.paddingRight = '';
    card.style.height = '';
    card.style.top = '';
    // 還原捲動位置。base.css 的 html { scroll-behavior: smooth } 會讓
    // scrollTo 變成動畫——但表單開著時 body 是 position:fixed、文件的捲動位置
    // 其實是 0，於是關閉時就看到「從 0% 平滑滾回原位」這段多餘的滾動。
    // 用行內樣式暫時覆寫掉 smooth，讓這一次還原是瞬間完成的。
    // 只改 web：手機維持現狀（同樣的情形若要處理再另外交辦）。
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    if (!narrow()) root.style.scrollBehavior = 'auto';
    window.scrollTo(0, lockedScrollY);
    if (!narrow()) root.style.scrollBehavior = prevBehavior;
    // 一般關閉（非送出）：信封演出「打開 → 闔上」，單純收起來，
    // 不變綠也不打勾（那是送出才有的）。送出流程的收尾由
    // playEnvelopeSuccess 的時間軸負責，不會走到這裡。
    if (status !== 'success') {
      envTimers.forEach(clearTimeout);
      envTimers = [];
      setEnvelope('is-open'); // 明確定起點，避免前一輪殘留狀態讓闔上沒東西可演
      const wait = prefersReduced.matches ? 0 : ENV_SHUT_DELAY;
      envTimers = [setTimeout(() => setEnvelope(null), wait)];
    }
    closeTimer = setTimeout(() => {
      closeTimer = 0;
      teardown();
    }, CLOSE_MS);
    // 焦點還給實際按下的那個入口：另一個此時是 display:none，
    // 對它聚焦會失敗、焦點就掉回 body 了
    (lastTrigger || fab).focus({ preventScroll: true });
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

  const narrow = () => window.matchMedia('(max-width: 768px)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // 手機滿版的鍵盤處理核心。
  // 鍵盤彈出時「版面視窗」不會變、只有「可見視窗」(visualViewport) 會縮，
  // 所以 100vh / 100dvh 都量不到鍵盤——必須改用 visualViewport 的高度當面板高度。
  // 面板一縮，裡面的送出列（flex 底部）就自然被推到鍵盤上方，不會被蓋住。
  function syncPanelHeight() {
    if (scrim.hidden) return;
    if (!narrow()) {
      card.style.height = '';
      card.style.top = '';
      return;
    }
    const vv = window.visualViewport;
    if (!vv) {
      card.style.height = window.innerHeight + 'px';
      return;
    }
    card.style.height = Math.round(vv.height) + 'px';
    // ⚠️ 只補高度不夠。面板是 position:fixed，對齊的是「版面視窗」；
    // iOS 聚焦畫面下半的欄位時會把「可見視窗」往下推（offsetTop > 0），
    // 版面視窗卻不動。不補這個位移，面板就整個偏上：
    // 標題被推出畫面、送出鈕掉到看不見的地方，
    // 而且使用者看到的位置與元素實際位置錯開 —— 點欄位會命中送出鈕。
    // 用 top 而非 transform：transform 留給滿版的淡入上移動畫，會打架。
    card.style.top = Math.round(vv.offsetTop) + 'px';
    syncMask();
  }

  // 鍵盤開合期間 visualViewport 會連續送出事件，每次都重算版面會卡頓，
  // 用 rAF 節流成每幀最多一次。
  let panelRaf = 0;
  function schedulePanelSync() {
    if (panelRaf) return;
    panelRaf = requestAnimationFrame(() => {
      panelRaf = 0;
      syncPanelHeight();
    });
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', schedulePanelSync);
    window.visualViewport.addEventListener('scroll', schedulePanelSync);
  }
  window.addEventListener('resize', schedulePanelSync);

  // 捲到底就取消底部淡出遮罩（依設計檔）
  const syncMask = () => {
    const atBottom = scrollBox.scrollHeight - scrollBox.scrollTop - scrollBox.clientHeight < 8;
    scrollBox.classList.toggle('is-bottom', atBottom);
  };
  scrollBox.addEventListener('scroll', syncMask);
  // 手機聚焦某個欄位時，等鍵盤與可見視窗穩定後再把它捲進視野，
  // 否則此刻算出來的位置是鍵盤還沒出現前的，會捲錯。
  scrollBox.addEventListener('focusin', (e) => {
    if (!narrow()) return;
    // 等鍵盤與可見視窗穩定（約 300ms）再處理，太早算的是鍵盤出現前的位置。
    // block:'center' 讓正在填的欄位停在畫面中央，不會貼著鍵盤邊緣。
    setTimeout(() => {
      syncPanelHeight(); // 換欄位時 iOS 可能重新推移可見視窗，要重新對齊
      e.target.scrollIntoView({
        block: 'center',
        behavior: prefersReduced.matches ? 'auto' : 'smooth',
      });
    }, 300);
  });
  // 鍵盤收合後可見視窗會復原，但 resize 不一定會補送，這裡主動再對一次
  scrollBox.addEventListener('focusout', () => {
    if (!narrow()) return;
    setTimeout(syncPanelHeight, 300);
  });
  // 卡片展開是 400ms 的動畫，開啟當下算出來的遮罩狀態並不準
  // （那時卡片還收合著、內容當然「捲不到底」），必須在尺寸穩定後重算，
  // 否則底部淡出會一直留著，把最後一個欄位淡到看不見。
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(syncMask).observe(scrollBox);
  }
  window.addEventListener('resize', syncMask);

  triggers.forEach((el) =>
    el.addEventListener('click', () => {
      lastTrigger = el;
      open();
    })
  );
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
