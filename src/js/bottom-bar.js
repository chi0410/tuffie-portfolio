// rwd（≤768）header 固定貼底時，永遠停在「footer 上方」的高度：
// 距離視窗底部 = footer 高度 + 間距。下方那塊空間平常空著（透出背景），
// 捲到最底時 footer 剛好補進去，bar 完全不動——沒有捲動監聽，也就沒有跳位。
// 這裡只負責把 footer 實際高度寫進 CSS 變數，定位交給 CSS（見 components.css 的 header）。

export function initBottomBar() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  const setFooterHeight = () => {
    document.documentElement.style.setProperty('--footer-h', `${footer.offsetHeight}px`);
  };
  setFooterHeight();
  window.addEventListener('resize', setFooterHeight);
  // 字體載入後 footer 高度可能微調，載入完成再量一次
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setFooterHeight);
}
