import { initHeaderScrollSpy } from './header.js';
import { injectIcons } from './icons.js';
import { initI18n, currentLangCopy } from './i18n.js';
import { initToast } from './toast.js';
import { initReveal } from './reveal.js';
import { initBgWave } from './bg-wave.js';
import { initContact } from './contact.js';
import { initBottomBar } from './bottom-bar.js';

initHeaderScrollSpy();
injectIcons();
initI18n();
initToast(currentLangCopy);
initReveal();
initBgWave();
initContact();
initBottomBar();
