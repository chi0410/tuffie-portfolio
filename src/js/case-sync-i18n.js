// 專案內頁（work-sync-management）i18n——邏輯與首頁 i18n.js／about-i18n.js 一致，只是換一份文案來源
// 有 [data-k] 屬性的元素，內容整包用對應語言的 innerHTML 覆蓋。

import caseSyncCopy from '../i18n/case-sync.json';
import { getStoredLang, setStoredLang, resumeHrefFor } from './lang-store.js';

let lang = getStoredLang();

function apply() {
  const dict = caseSyncCopy[lang];
  document.querySelectorAll('[data-k]').forEach((el) => {
    const value = dict[el.dataset.k];
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll('[data-resume-link]').forEach((el) => {
    el.href = resumeHrefFor(lang);
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中';
}

export function initCaseSyncI18n() {
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
