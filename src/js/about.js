import { injectIcons } from './icons.js';
import { initAboutI18n, currentAboutLangCopy } from './about-i18n.js';
import { initToast } from './toast.js';
import { initReveal } from './reveal.js';
import { initBgWave } from './bg-wave.js';
import { initContact } from './contact.js';

injectIcons();
initAboutI18n();
initToast(currentAboutLangCopy);
initReveal();
initBgWave();
initContact();
