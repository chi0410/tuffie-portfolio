// 首頁 i18n（中英雙語）— 依 prototype 邏輯重製
// 文案集中於 homepage.json，語言切換只換資料、不換 DOM 結構：
// 有 [data-k] 屬性的元素，內容整包用對應語言的 innerHTML 覆蓋。

import homepageCopy from '../i18n/homepage.json';
import { getStoredLang, setStoredLang } from './lang-store.js';

let lang = getStoredLang();

function apply() {
  const dict = homepageCopy[lang];
  document.querySelectorAll('[data-k]').forEach((el) => {
    const value = dict[el.dataset.k];
    if (value !== undefined) el.innerHTML = value;
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中';
}

export function initI18n() {
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

// 供階段 8 toast 訊息（Resume／案例內頁 stub）取用目前語言的文案
export function currentLangCopy() {
  return homepageCopy[lang];
}
