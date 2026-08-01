// 專案二 §7 優化成果流程圖：依各節點實際位置畫直角折線連接。
// 規則：連到「圖片」的線末端加實心箭頭；連到「標籤」的不加箭頭。
// ≤768px（rwd）：b/d/h 改單張點擊切換 before/after、連線變單一直線；桌機維持兩張並排＋分岔線。

import caseBrandCopy from '../i18n/case-brand.json';
import { getStoredLang } from './lang-store.js';

const R = 10; // 轉角圓弧半徑
const IMG_PAD = 43; // PNG 四邊透明留白（native），用來把線/箭頭端點內縮貼齊可見內容
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

function box(flow, node) {
  const el = flow.querySelector(`[data-node="${node}"]`);
  const f = flow.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const img = el.tagName === 'IMG' ? el : el.querySelector('img');
  const inset = img && img.naturalWidth ? IMG_PAD * (r.width / img.naturalWidth) : 0;
  return { cx: r.left - f.left + r.width / 2, top: r.top - f.top + inset, bottom: r.bottom - f.top - inset };
}

function elbow(x1, y1, x2, y2) {
  const my = (y1 + y2) / 2;
  if (Math.abs(x1 - x2) < 1) return `M${x1} ${y1} L${x2} ${y2}`;
  const dx = x2 > x1 ? 1 : -1;
  return `M${x1} ${y1} V${my - R} Q${x1} ${my} ${x1 + R * dx} ${my} H${x2 - R * dx} Q${x2} ${my} ${x2} ${my + R} V${y2}`;
}

function solidArrow(x, y) {
  return `<path class="flow-arrow" d="M${x - 5} ${y - 8} L${x + 5} ${y - 8} L${x} ${y} Z"/>`;
}

// 桌機：before/after 兩張並排 → 標籤分岔兩條線
function segsDesktop(b) {
  const A = b('tagA'), bL = b('bL'), bR = b('bR'), C = b('tagC'), dL = b('dL'), dR = b('dR'),
    f = b('f'), G = b('tagG'), hL = b('hL'), hR = b('hR'), I = b('tagI'), j = b('j');
  return [
    { d: elbow(A.cx, A.bottom, bL.cx, bL.top), arr: [bL.cx, bL.top] },
    { d: elbow(A.cx, A.bottom, bR.cx, bR.top), arr: [bR.cx, bR.top] },
    { d: elbow(bL.cx, bL.bottom, C.cx, C.top), arr: null },
    { d: elbow(bR.cx, bR.bottom, C.cx, C.top), arr: null },
    { d: elbow(C.cx, C.bottom, dL.cx, dL.top), arr: [dL.cx, dL.top] },
    { d: elbow(C.cx, C.bottom, dR.cx, dR.top), arr: [dR.cx, dR.top] },
    { d: elbow(dR.cx, dR.bottom, f.cx, f.top), arr: [f.cx, f.top] },
    { d: elbow(f.cx, f.bottom, G.cx, G.top), arr: null },
    { d: elbow(G.cx, G.bottom, hL.cx, hL.top), arr: [hL.cx, hL.top] },
    { d: elbow(G.cx, G.bottom, hR.cx, hR.top), arr: [hR.cx, hR.top] },
    { d: elbow(hR.cx, hR.bottom, I.cx, I.top), arr: null },
    { d: elbow(I.cx, I.bottom, j.cx, j.top), arr: [j.cx, j.top] },
  ];
}

// ≤768：單張 → 單一直線串起（各節點置中，elbow 在 x 相同時即畫直線）
function segsMobile(b) {
  const A = b('tagA'), B = b('bPair'), C = b('tagC'), D = b('dPair'),
    f = b('f'), G = b('tagG'), H = b('hPair'), I = b('tagI'), j = b('j');
  return [
    { d: elbow(A.cx, A.bottom, B.cx, B.top), arr: [B.cx, B.top] },
    { d: elbow(B.cx, B.bottom, C.cx, C.top), arr: null },
    { d: elbow(C.cx, C.bottom, D.cx, D.top), arr: [D.cx, D.top] },
    { d: elbow(D.cx, D.bottom, f.cx, f.top), arr: [f.cx, f.top] },
    { d: elbow(f.cx, f.bottom, G.cx, G.top), arr: null },
    { d: elbow(G.cx, G.bottom, H.cx, H.top), arr: [H.cx, H.top] },
    { d: elbow(H.cx, H.bottom, I.cx, I.top), arr: null },
    { d: elbow(I.cx, I.bottom, j.cx, j.top), arr: [j.cx, j.top] },
  ];
}

function drawWires() {
  const flow = document.getElementById('flow');
  if (!flow) return;
  const svg = document.getElementById('flowWires');
  const b = (n) => box(flow, n);
  const segs = isMobile() ? segsMobile(b) : segsDesktop(b);
  svg.innerHTML =
    segs.map((s) => `<path class="flow-wire" d="${s.d}"/>`).join('') +
    segs.filter((s) => s.arr).map((s) => solidArrow(s.arr[0], s.arr[1])).join('');
  const fr = flow.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${fr.width} ${fr.height}`);
  svg.style.width = `${fr.width}px`;
  svg.style.height = `${fr.height}px`;
}

// ---- rwd 點擊切換 ----
function updatePairState(pair) {
  const d = caseBrandCopy[getStoredLang()];
  const after = pair.classList.contains('is-after');
  const tip = pair.querySelector('.flow-pair-tip');
  if (tip) tip.textContent = after ? (d.flowTipToBefore || '') : (d.flowTipToAfter || '');
  const aria = after ? d.flowPairAriaAfter : d.flowPairAriaBefore;
  if (aria) pair.setAttribute('aria-label', aria);
}

function togglePair(pair) {
  if (!isMobile()) return;
  pair.classList.toggle('is-after');
  updatePairState(pair);
  if (pair.classList.contains('is-after')) {
    pair.querySelectorAll('video').forEach((v) => { const p = v.play(); if (p && p.catch) p.catch(() => {}); });
  }
  requestAnimationFrame(drawWires);
}

// 依斷點切換互動性：≤768 給 button 語意；桌機移除並還原成 before
function syncPairs() {
  const m = isMobile();
  document.querySelectorAll('#flow [data-pair]').forEach((pair) => {
    if (m) {
      pair.setAttribute('role', 'button');
      pair.setAttribute('tabindex', '0');
      updatePairState(pair);
    } else {
      pair.removeAttribute('role');
      pair.removeAttribute('tabindex');
      pair.removeAttribute('aria-label');
      pair.classList.remove('is-after');
      const tip = pair.querySelector('.flow-pair-tip');
      if (tip) tip.textContent = '';
    }
  });
}

export function initFlow() {
  const flow = document.getElementById('flow');
  if (!flow) return;
  const redraw = () => requestAnimationFrame(drawWires);
  flow.querySelectorAll('[data-pair]').forEach((pair) => {
    pair.addEventListener('click', () => togglePair(pair));
    pair.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && isMobile()) { e.preventDefault(); togglePair(pair); }
    });
  });
  syncPairs();
  redraw();
  flow.querySelectorAll('.flow-img').forEach((img) => {
    img.addEventListener('load', redraw);
    if (img.complete) redraw();
  });
  window.addEventListener('resize', () => { syncPairs(); redraw(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.addEventListener('click', () => { syncPairs(); redraw(); setTimeout(redraw, 120); });
}
