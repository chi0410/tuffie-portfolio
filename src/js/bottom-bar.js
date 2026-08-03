// rwd（≤768）header 固定貼在視窗底部，且「永遠顯示」。
// 捲到最底 footer 進入畫面時，bar 不隱藏，改停在 footer 上緣繼續顯示（不與 footer 重疊）。
// 作法：bottom 取「預設 16px」與「footer 上緣往上 16px」的較大值——footer 還沒進畫面時等於 16px，
// 進畫面後隨捲動被往上推，視覺上就是頂在 footer 上方。桌機（>768）清掉 inline 樣式交還 CSS。

const GAP = 16; // bar 與視窗底部／footer 上緣的距離

export function initBottomBar() {
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  if (!header || !footer) return;
  const isRwd = () => window.matchMedia('(max-width: 768px)').matches;
  let ticking = false;

  const update = () => {
    ticking = false;
    if (!isRwd()) {
      header.style.bottom = '';
      return;
    }
    const footerTop = footer.getBoundingClientRect().top;
    // footer 未進畫面：footerTop >= innerHeight → 算出來 <= GAP，取 GAP（貼視窗底）
    header.style.bottom = `${Math.max(GAP, window.innerHeight - footerTop + GAP)}px`;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
