// My Edge 能力卡 icon 內嵌部署
// 依 design-tokens.md「icon 一律 inline SVG 佈署」規則：漸層與動畫（iconFloat）
// 只有在 SVG 直接寫進 DOM 時才會生效，用 <img> 引入會失效。
// 這裡用 Vite 的 ?raw 匯入語法讀原始 SVG 字串，再塞進對應的 [data-icon] 容器。

import aiPrototyping from '../icons/ai-prototyping.svg?raw';
import aiIdeation from '../icons/ai-ideation.svg?raw';
import designClarity from '../icons/design-clarity.svg?raw';
import valueUnderstandFirst from '../icons/value-understand-first.svg?raw';
import valueUntanglingKnots from '../icons/value-untangling-knots.svg?raw';
import valueBlendsIntoLife from '../icons/value-blends-into-life.svg?raw';
import softPositiveResilience from '../icons/soft-positive-resilience.svg?raw';
import softMultiPerspective from '../icons/soft-multi-perspective.svg?raw';
import softProactiveExploration from '../icons/soft-proactive-exploration.svg?raw';
import strategyFlow from '../icons/strategy-flow.svg?raw';
import strategyIntegrate from '../icons/strategy-integrate.svg?raw';
import strategyBackend from '../icons/strategy-backend.svg?raw';
import breakdownAlignGoals from '../icons/breakdown-align-goals.svg?raw';
import breakdownReduceCost from '../icons/breakdown-reduce-cost.svg?raw';
import breakdownDecisionPath from '../icons/breakdown-decision-path.svg?raw';

const ICONS = {
  'ai-prototyping': aiPrototyping,
  'ai-ideation': aiIdeation,
  'design-clarity': designClarity,
  'value-understand-first': valueUnderstandFirst,
  'value-untangling-knots': valueUntanglingKnots,
  'value-blends-into-life': valueBlendsIntoLife,
  'soft-positive-resilience': softPositiveResilience,
  'soft-multi-perspective': softMultiPerspective,
  'soft-proactive-exploration': softProactiveExploration,
  'strategy-flow': strategyFlow,
  'strategy-integrate': strategyIntegrate,
  'strategy-backend': strategyBackend,
  'breakdown-align-goals': breakdownAlignGoals,
  'breakdown-reduce-cost': breakdownReduceCost,
  'breakdown-decision-path': breakdownDecisionPath,
};

export function injectIcons() {
  document.querySelectorAll('[data-icon]').forEach((el) => {
    const svg = ICONS[el.dataset.icon];
    if (svg) el.innerHTML = svg;
  });
}
