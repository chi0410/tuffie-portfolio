// About 頁 i18n（中英雙語）— 邏輯與首頁 i18n.js 一致，只是換一份文案來源
// 有 [data-k] 屬性的元素，內容整包用對應語言的 innerHTML 覆蓋。

import aboutCopy from '../i18n/about.json';
import { getStoredLang, setStoredLang } from './lang-store.js';

let lang = getStoredLang();

function apply() {
  const dict = aboutCopy[lang];
  document.querySelectorAll('[data-k]').forEach((el) => {
    const value = dict[el.dataset.k];
    if (value !== undefined) el.innerHTML = value;
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中';
}

export function initAboutI18n() {
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

// 供階段 8 toast 訊息（Resume stub）取用目前語言的文案
export function currentAboutLangCopy() {
  return aboutCopy[lang];
}
