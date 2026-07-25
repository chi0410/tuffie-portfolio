// 專案內頁（work-sync-management）i18n——邏輯與首頁 i18n.js／about-i18n.js 一致，只是換一份文案來源
// 有 [data-k] 屬性的元素，內容整包用對應語言的 innerHTML 覆蓋。

import caseSyncCopy from '../i18n/case-sync.json';
import homepageCopy from '../i18n/homepage.json';
import { getStoredLang, setStoredLang, resumeHrefFor } from './lang-store.js';

let lang = getStoredLang();

function apply() {
  const dict = caseSyncCopy[lang];
  // Next Project 卡片沿用首頁專案卡資料（SSOT：homepage.json），本頁字典找不到的 key 回退到首頁字典
  const home = homepageCopy[lang];
  document.querySelectorAll('[data-k]').forEach((el) => {
    const value = dict[el.dataset.k] ?? home[el.dataset.k];
    if (value !== undefined) el.innerHTML = value;
  });
  // 圖片：語言切換時換圖。src 給 <img>，srcset 給 <picture><source>，alt 給替代文字
  document.querySelectorAll('[data-src-k]').forEach((el) => {
    const value = dict[el.dataset.srcK] ?? home[el.dataset.srcK];
    if (value !== undefined) el.src = value;
  });
  document.querySelectorAll('[data-srcset-k]').forEach((el) => {
    const value = dict[el.dataset.srcsetK] ?? home[el.dataset.srcsetK];
    if (value !== undefined) el.srcset = value;
  });
  document.querySelectorAll('[data-alt-k]').forEach((el) => {
    const value = dict[el.dataset.altK] ?? home[el.dataset.altK];
    if (value !== undefined) el.alt = value;
  });
  // aria-label：給 inline SVG icon 用（不能用 data-k，否則 innerHTML 會蓋掉注入的 SVG）
  document.querySelectorAll('[data-aria-k]').forEach((el) => {
    const value = dict[el.dataset.ariaK] ?? home[el.dataset.ariaK];
    if (value !== undefined) el.setAttribute('aria-label', value);
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
