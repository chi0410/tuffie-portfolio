// 報價頁進入點（比照 work-brand-narrative.js）。
// i18n 要先跑，之後的元件才拿得到已填好的文案（例如手風琴的收合／展開標籤）。

import { initProposalI18n } from './proposal-i18n.js';
import { initTabs, initAccordion } from './proposal.js';
import { initReveal } from './reveal.js';
import { initBgWave } from './bg-wave.js';
import { initContact } from './contact.js';
import { initBottomBar } from './bottom-bar.js';

initProposalI18n();
initTabs();
initAccordion();
initReveal();
initBgWave();
initContact();
initBottomBar();
