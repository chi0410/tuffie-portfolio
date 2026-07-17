import { injectIcons } from './icons.js';
import { initAboutI18n, currentAboutLangCopy } from './about-i18n.js';
import { initToast } from './toast.js';
import { initReveal } from './reveal.js';

injectIcons();
initAboutI18n();
initToast(currentAboutLangCopy);
initReveal();
