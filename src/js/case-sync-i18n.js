// 專案內頁（work-sync-management）i18n——邏輯與首頁 i18n.js／about-i18n.js 一致，只是換一份文案來源
// 有 [data-k] 屬性的元素，內容整包用對應語言的 innerHTML 覆蓋。

import caseSyncCopy from '../i18n/case-sync.json';
import homepageCopy from '../i18n/homepage.json';
import { getStoredLang, setStoredLang, resumeHrefFor } from './lang-store.js';

let lang = getStoredLang();
let solutionAfter = false; // 優化成果：false=顯示優化前、true=顯示優化後

// tooltip 與 aria-label 同時取決於「目前狀態」與「語言」，無法只靠 data-k（那是靜態），故獨立更新
function updateSolutionState() {
  const toggle = document.getElementById('solutionToggle');
  if (!toggle) return;
  const dict = caseSyncCopy[lang];
  const tip = toggle.querySelector('.sol-tip');
  // 顯示優化前時，提示「點擊查看優化後」；反之亦然
  const tipKey = solutionAfter ? 'solTipToBefore' : 'solTipToAfter';
  const ariaKey = solutionAfter ? 'solAriaAfter' : 'solAriaBefore';
  if (tip && dict[tipKey] !== undefined) tip.textContent = dict[tipKey];
  if (dict[ariaKey] !== undefined) toggle.setAttribute('aria-label', dict[ariaKey]);
}

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
  // 狀態導向文案：放在 data-* 迴圈之後覆蓋，才能依當前 toggle 狀態顯示正確提示
  updateSolutionState();
}

// 優化成果：點擊在「優化前 / 優化後」間切換。<button> 原生支援 Enter/Space 鍵盤操作
function initSolutionToggle() {
  const toggle = document.getElementById('solutionToggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    solutionAfter = !solutionAfter;
    toggle.classList.toggle('is-after', solutionAfter);
    updateSolutionState();
  });
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
  initSolutionToggle();
  apply();
}
