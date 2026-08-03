// rwd（≤768）header 固定貼在視窗底部。捲到最底時 footer 會進入視窗，
// 此時讓 bar 滑出畫面讓位，避免遮住 footer——不用加大底部留白，footer 高度與頁面結構維持原樣。
// 樣式只在 ≤768 的 media query 內生效，桌機加了 class 也不會有變化。

export function initBottomBar() {
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  if (!header || !footer || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        header.classList.toggle('is-tucked', entry.isIntersecting);
      });
    },
    { threshold: 0 },
  );
  io.observe(footer);
}
