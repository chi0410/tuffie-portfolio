// 報價頁（private-services）i18n——邏輯與 case-brand-i18n.js 一致，只是換一份文案來源。
// 有 [data-k] 屬性的元素，內容整包用對應語言的 innerHTML 覆蓋。
//
// ⚠️ 英文文案尚未撰寫：proposal.json 的 en 目前是空的，
//    找不到 key 時自動回退到中文。好處是可以一次補幾個 key、補到哪就生效到哪，
//    不必等整份翻完；代價是中途按 EN 會看到中英混雜——這頁只給特定客戶看，可接受。

import proposalCopy from '../i18n/proposal.json';
import { getStoredLang, setStoredLang } from './lang-store.js';

let lang = getStoredLang();

function apply() {
  const dict = proposalCopy[lang];
  const fallback = proposalCopy.zh;
  const t = (key) => dict[key] ?? fallback[key];

  document.querySelectorAll('[data-k]').forEach((el) => {
    const value = t(el.dataset.k);
    if (value !== undefined) el.innerHTML = value;
  });

  // aria-label：不能用 data-k，否則 innerHTML 會蓋掉元素內容
  document.querySelectorAll('[data-aria-k]').forEach((el) => {
    const value = t(el.dataset.ariaK);
    if (value !== undefined) el.setAttribute('aria-label', value);
  });

  // 手風琴的收合／展開文案：填進 data 屬性給 proposal.js 用
  document.querySelectorAll('[data-label-collapsed-k]').forEach((el) => {
    el.dataset.labelCollapsed = t(el.dataset.labelCollapsedK);
  });
  document.querySelectorAll('[data-label-expanded-k]').forEach((el) => {
    el.dataset.labelExpanded = t(el.dataset.labelExpandedK);
  });

  // .acc-txt 的 data-k 是收合文案，展開狀態下切語言會被蓋成「查看詳情」，
  // 這裡依目前狀態補正回來
  document.querySelectorAll('[data-accordion]').forEach((acc) => {
    const btn = acc.querySelector('.acc-trigger');
    const txt = acc.querySelector('.acc-txt');
    if (!btn || !txt) return;
    const open = btn.getAttribute('aria-expanded') === 'true';
    txt.textContent = open ? btn.dataset.labelExpanded : btn.dataset.labelCollapsed;
  });

  // 英文文案還沒寫完時，畫面上仍是中文字，此時把 <html lang> 標成 en 會讓
  // 螢幕閱讀器用英文語音念中文。以字典是否真的有內容來判斷，補完後自動生效。
  const enReady = proposalCopy.en.h1 !== undefined;
  document.documentElement.lang = lang === 'en' && enReady ? 'en' : 'zh-Hant';
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中';
}

export function initProposalI18n() {
  const btn = document.getElementById('langBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      lang = lang === 'zh' ? 'en' : 'zh';
      setStoredLang(lang);
      apply();
    });
  }
  apply();
}
