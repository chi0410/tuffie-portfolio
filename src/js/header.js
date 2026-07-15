// Header 行為：scroll spy（捲動時高亮目前所在區塊對應的導覽項目）
// 依 prototype 邏輯重製。Works／My Edge 區塊要到階段 4 才會建立於首頁，
// 這裡先做容錯（找不到對應區塊就跳過該項目），區塊補上後自動生效。

const SPY_TARGETS = ['works', 'edge'];

export function initHeaderScrollSpy() {
  const spySections = SPY_TARGETS
    .map((id) => [id, document.getElementById(id)])
    .filter(([, el]) => el);

  if (spySections.length === 0) return;

  const spyLinks = document.querySelectorAll('[data-spy]');

  const onScroll = () => {
    let current = null;
    spySections.forEach(([key, el]) => {
      if (scrollY + innerHeight * 0.4 >= el.offsetTop) current = key;
    });
    spyLinks.forEach((a) => a.classList.toggle('active', a.dataset.spy === current));
  };

  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
