// 專案二內頁（work-brand-narrative）i18n——邏輯與首頁 i18n.js／case-sync-i18n.js 一致，只是換一份文案來源
// 有 [data-k] 屬性的元素，內容整包用對應語言的 innerHTML 覆蓋。

import caseBrandCopy from '../i18n/case-brand.json';
import homepageCopy from '../i18n/homepage.json';
import { getStoredLang, setStoredLang, resumeHrefFor } from './lang-store.js';

let lang = getStoredLang();

function apply() {
  const dict = caseBrandCopy[lang];
  // Next Project 卡片沿用首頁專案卡資料（SSOT：homepage.json），本頁字典找不到的 key 回退到首頁字典
  const home = homepageCopy[lang];
  document.querySelectorAll('[data-k]').forEach((el) => {
    const value = dict[el.dataset.k] ?? home[el.dataset.k];
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll('[data-resume-link]').forEach((el) => {
    el.href = resumeHrefFor(lang);
  });
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中';
}

export function initCaseBrandI18n() {
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
