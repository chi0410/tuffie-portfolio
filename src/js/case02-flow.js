// 專案二 §7 優化成果流程圖：依各節點實際位置畫直角折線連接（轉角圓弧）。
// 規則：連到「圖片」的線末端加實心箭頭；連到「標籤」的不加箭頭。
// 邏輯沿用 handoff prototype（case02-flow-final）的 drawWires。

const R = 10; // 轉角圓弧半徑

// PNG 圖檔四邊有約 43px（native）透明留白（Figma 匯出的陰影出血區）。
// 量測顯示尺寸後把「圖片節點」的上下端點內縮，讓線段/箭頭貼齊可見內容、不留空隙；標籤節點無留白不內縮。
const IMG_PAD = 43;
function box(flow, node) {
  const el = flow.querySelector(`[data-node="${node}"]`);
  const f = flow.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const img = el.tagName === 'IMG' ? el : el.querySelector('img');
  const inset = img && img.naturalWidth ? IMG_PAD * (r.width / img.naturalWidth) : 0;
  return { cx: r.left - f.left + r.width / 2, top: r.top - f.top + inset, bottom: r.bottom - f.top - inset };
}

// 直角折線：從 (x1,y1) 垂下到中線、水平位移、再垂下到 (x2,y2)，轉角用二次貝茲做圓弧
function elbow(x1, y1, x2, y2) {
  const my = (y1 + y2) / 2;
  if (Math.abs(x1 - x2) < 1) return `M${x1} ${y1} L${x2} ${y2}`;
  const dx = x2 > x1 ? 1 : -1;
  return `M${x1} ${y1} V${my - R} Q${x1} ${my} ${x1 + R * dx} ${my} H${x2 - R * dx} Q${x2} ${my} ${x2} ${my + R} V${y2}`;
}

function solidArrow(x, y) {
  return `<path class="flow-arrow" d="M${x - 5} ${y - 8} L${x + 5} ${y - 8} L${x} ${y} Z"/>`;
}

function drawWires() {
  const flow = document.getElementById('flow');
  if (!flow) return;
  const svg = document.getElementById('flowWires');
  const b = (n) => box(flow, n);
  const A = b('tagA'), bL = b('bL'), bR = b('bR'), C = b('tagC'), dL = b('dL'), dR = b('dR'),
    f = b('f'), G = b('tagG'), hL = b('hL'), hR = b('hR'), I = b('tagI'), j = b('j');
  const segs = [
    { d: elbow(A.cx, A.bottom, bL.cx, bL.top), arr: [bL.cx, bL.top] },   // a→b左（圖，箭頭）
    { d: elbow(A.cx, A.bottom, bR.cx, bR.top), arr: [bR.cx, bR.top] },   // a→b右（圖，箭頭）
    { d: elbow(bL.cx, bL.bottom, C.cx, C.top), arr: null },              // b左→c（標籤，無箭頭）
    { d: elbow(bR.cx, bR.bottom, C.cx, C.top), arr: null },              // b右→c（標籤，無箭頭）
    { d: elbow(C.cx, C.bottom, dL.cx, dL.top), arr: [dL.cx, dL.top] },   // c→d左（圖，箭頭）
    { d: elbow(C.cx, C.bottom, dR.cx, dR.top), arr: [dR.cx, dR.top] },   // c→d右（圖，箭頭）
    { d: elbow(dR.cx, dR.bottom, f.cx, f.top), arr: [f.cx, f.top] },     // d右→f（圖，箭頭）
    { d: elbow(f.cx, f.bottom, G.cx, G.top), arr: null },               // f→g（標籤，無箭頭）
    { d: elbow(G.cx, G.bottom, hL.cx, hL.top), arr: [hL.cx, hL.top] },   // g→h左（圖，箭頭）
    { d: elbow(G.cx, G.bottom, hR.cx, hR.top), arr: [hR.cx, hR.top] },   // g→h右（圖，箭頭）
    { d: elbow(hR.cx, hR.bottom, I.cx, I.top), arr: null },              // h右→i（標籤，無箭頭）
    { d: elbow(I.cx, I.bottom, j.cx, j.top), arr: [j.cx, j.top] },       // i→j（圖，箭頭）
  ];
  svg.innerHTML =
    segs.map((s) => `<path class="flow-wire" d="${s.d}"/>`).join('') +
    segs.filter((s) => s.arr).map((s) => solidArrow(s.arr[0], s.arr[1])).join('');
  const fr = flow.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${fr.width} ${fr.height}`);
  svg.style.width = `${fr.width}px`;
  svg.style.height = `${fr.height}px`;
}

export function initFlow() {
  const flow = document.getElementById('flow');
  if (!flow) return;
  const redraw = () => requestAnimationFrame(drawWires);
  redraw();
  // 圖片尺寸決定版面高度：每張載入後重畫（含語言切換換圖後的重載）
  flow.querySelectorAll('.flow-img').forEach((img) => {
    img.addEventListener('load', redraw);
    if (img.complete) redraw();
  });
  window.addEventListener('resize', redraw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
  // 語言切換：標籤寬度變、圖也重載 → 先重畫一次，圖載入完成的 load 事件會再校正
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.addEventListener('click', () => { redraw(); setTimeout(redraw, 120); });
}
