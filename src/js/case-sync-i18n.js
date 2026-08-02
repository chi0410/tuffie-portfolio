// 專案內頁（work-sync-management）i18n——邏輯與首頁 i18n.js／about-i18n.js 一致，只是換一份文案來源
// 有 [data-k] 屬性的元素，內容整包用對應語言的 innerHTML 覆蓋。

import caseSyncCopy from '../i18n/case-sync.json';
import homepageCopy from '../i18n/homepage.json';
import { getStoredLang, setStoredLang, resumeHrefFor } from './lang-store.js';

let lang = getStoredLang();

// 優化成果四區塊：區塊 1、3 可點擊切換。tooltip／aria 同時取決於「目前狀態」與「語言」，
// 故獨立更新；每個 toggle 用 data 屬性帶自己的 i18n key（區塊 1、3 文案不同）。
function updateToggle(btn) {
  const dict = caseSyncCopy[lang];
  const after = btn.classList.contains('is-after');
  const tip = btn.querySelector('.sol-tip');
  const tipKey = after ? btn.dataset.tipAfter : btn.dataset.tipBefore;
  const ariaKey = after ? btn.dataset.ariaAfter : btn.dataset.ariaBefore;
  if (tip && dict[tipKey] !== undefined) tip.textContent = dict[tipKey];
  if (ariaKey && dict[ariaKey] !== undefined) btn.setAttribute('aria-label', dict[ariaKey]);
}
function updateSolutionStates() {
  document.querySelectorAll('[data-sol-toggle]').forEach(updateToggle);
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
  // 狀態導向文案：放在 data-* 迴圈之後覆蓋，才能依當前各 toggle 狀態顯示正確提示
  updateSolutionStates();
}

// 優化成果區塊 1、3：點擊切換 before/after（硬切）。<button> 原生支援 Enter/Space 鍵盤操作
function initSolutionToggles() {
  document.querySelectorAll('[data-sol-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('is-after');
      updateToggle(btn);
    });
  });
}

// web 版 tooltip：
//   a) 捲動進場：區塊進入視窗時先自動顯示一次（鼠標不用動），停 2 秒漸消，之後回到 b)
//   b) 滑鼠移到區塊上 → tooltip 跟隨鼠標並漸顯；停滯 2 秒漸消；再移動再漸顯；移出消失
// rwd（≤760，觸控）不套用——tooltip 由 CSS 常駐定位。
function initTooltipFollow() {
  const web = () => window.matchMedia('(min-width: 761px)').matches;
  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-sol-toggle]').forEach((btn) => {
    const tip = btn.querySelector('.sol-tip');
    if (!tip) return;
    let idle;
    const hide = () => { tip.style.opacity = '0'; };
    btn.addEventListener('mousemove', (e) => {
      if (!web()) return;
      const r = btn.getBoundingClientRect();
      tip.style.left = `${e.clientX - r.left + 14}px`;
      tip.style.top = `${e.clientY - r.top + 14}px`;
      tip.style.right = 'auto';
      tip.style.opacity = '1';
      clearTimeout(idle);
      idle = setTimeout(hide, 2000); // 停滯 2 秒漸消
    });
    btn.addEventListener('mouseleave', () => {
      clearTimeout(idle);
      if (web()) hide();
    });

    // 捲動進場：只在第一次進入視窗時觸發，顯示於 CSS 預設位置（右上），2 秒後淡出
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect(); // 只顯示一次，之後交還給滑鼠邏輯
          if (!web()) return;
          // 不設 left/top，維持 CSS 的預設右上定位；reduced-motion 時 CSS 已關 transition（直接顯示/隱藏）
          tip.style.opacity = '1';
          clearTimeout(idle);
          idle = setTimeout(hide, 2000);
        });
      }, { threshold: 0.35 });
      io.observe(btn);
    }
  });
  // 切到 rwd 時清掉 web 留下的 inline 樣式，讓 CSS 常駐/定位接手
  window.addEventListener('resize', () => {
    if (!web()) document.querySelectorAll('[data-sol-toggle] .sol-tip').forEach((t) => { t.style.cssText = ''; });
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
  initSolutionToggles();
  initTooltipFollow();
  apply();
}
