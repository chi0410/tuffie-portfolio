// 背景垂直線波浪 —— 取代原本 .knit 的橫向流動（crawl）。
// 水平線仍由既有的 .knit SVG pattern 靜態渲染，這裡只負責「會波動的垂直線」。
//
// 為什麼用 canvas：全站 fixed 背景、線數上百，
//   - prototype 的「一線一節點各自 CSS 動畫」→ 上百個節點動畫，手機與捲動時吃緊
//   - 「SVG pattern 內 path 動畫」→ 瀏覽器支援差（交辦已排除）
//   - 「N 層 repeating-gradient + mask + translate」→ 合成很省 CPU，但每層都是滿版合成貼圖
//     （手機 DPR3 單層約 12MB，多層逼近百 MB），且波長會被層數量化
//   canvas 只有 1 個節點、1 張貼圖，每幀成本是約 120 次 stroke（亞毫秒），波長也能自由設定。
//   虛線交給 setLineDash 由瀏覽器原生切段，不必自己迴圈畫上千個小方塊。

const GAP = 16; // 線間距，對齊既有 knit pattern 的 16×16 格
const DASH = [4, 5]; // 虛線疏密，比照水平線的 stroke-dasharray="4 5"（4 實 5 空）
const AMP = 8; // 左右擺幅（px）——擺幅是波浪感的主要來源，16px 間距下 8 已相當明顯
const PERIOD = 4500; // 一次擺動週期（ms）
const WAVELENGTH = 520; // 波長（px）：相鄰線的相位差由此換算，越大波越平緩
const MAX_DPR = 2; // 細淡線不需要 3x，設上限省記憶體與填充率
const FPS = 30; // 節流：5 秒週期的緩慢動態，30fps 已足夠平順，CPU／電力減半

const LINE_TOP = 'rgba(250, 240, 234, 0.03)';
const LINE_MID = 'rgba(250, 240, 234, 0.28)';

export function initBgWave() {
  const canvas = document.createElement('canvas');
  canvas.className = 'knit-wave';
  canvas.setAttribute('aria-hidden', 'true');
  const knit = document.querySelector('.knit');
  if (knit && knit.parentNode) knit.parentNode.insertBefore(canvas, knit.nextSibling);
  else document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  if (!ctx) return; // 極舊瀏覽器：直接放棄波浪，水平線仍在，不影響版面
  const canDash = typeof ctx.setLineDash === 'function'; // 沒有就退回實線，不會壞版

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let w = 0;
  let h = 0;
  let gradient = null;
  let rafId = 0;
  let lastFrame = 0;
  let resizeTimer = 0;

  function measure() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // 垂直漸層只建立一次（resize 才重建），所有線共用 → 上下淡、中間濃
    gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, LINE_TOP);
    gradient.addColorStop(0.5, LINE_MID);
    gradient.addColorStop(1, LINE_TOP);
  }

  // animate=false 時畫靜止畫面（reduced-motion 用）
  function draw(time, animate = true) {
    ctx.clearRect(0, 0, w, h);
    // 每幀重設：canvas.width 一改動會清掉全部 ctx 狀態（含 lineDash）
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    if (canDash) ctx.setLineDash(DASH);
    const phase = animate ? ((time % PERIOD) / PERIOD) * Math.PI * 2 : 0;
    // 從 -GAP 起畫：擺幅變大後，最左那條線向左盪出畫面時邊緣才不會空一條
    for (let x = -GAP; x <= w + GAP; x += GAP) {
      // 同一時刻不同 x 的相位不同 → 相鄰線有相位差，整體成為流動的波
      const s = animate ? Math.sin(phase + (x / WAVELENGTH) * Math.PI * 2) : 0;
      const px = x + AMP * s; // 刻意不做 .5 像素對齊，維持與原本 fillRect 相同的柔邊
      ctx.globalAlpha = 0.75 + 0.25 * s; // 隨擺動微微明暗，呼應 prototype 的脈動
      // 逐線 stroke（而非合併成單一 path）才能讓每條線有自己的 alpha
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function loop(time) {
    rafId = requestAnimationFrame(loop);
    if (time - lastFrame < 1000 / FPS) return; // 節流到 FPS
    lastFrame = time;
    draw(time);
  }

  function start() {
    if (rafId || reduceMotion.matches || document.hidden) return;
    lastFrame = 0;
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function refresh() {
    measure();
    if (reduceMotion.matches) {
      stop();
      draw(0, false); // 關動態：只畫一張靜止的垂直線
    } else {
      draw(performance.now());
      start();
    }
  }

  refresh();

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refresh, 150); // 去抖動，避免拖曳視窗時反覆重建
  });
  // 背景分頁不空轉
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });
  // 使用者中途切換系統的「減少動態」設定也即時反應
  const onMotionChange = () => refresh();
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onMotionChange);
  else if (reduceMotion.addListener) reduceMotion.addListener(onMotionChange);
}
