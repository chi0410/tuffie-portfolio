// 捲動進場動效——.rv 元素進入視窗後加上 .in class，觸發 CSS 的淡入＋位移，只播放一次
// 依 prototype 邏輯重製；不支援 IntersectionObserver 的環境直接顯示，不擋內容

export function initReveal() {
  const targets = document.querySelectorAll('.rv');
  if (targets.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -50px 0px' }
  );

  targets.forEach((el) => io.observe(el));
}
