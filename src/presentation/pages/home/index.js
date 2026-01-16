// @ts-check

import { HOME_CONFIG, HOME_MESSAGES } from './constants.js';
import { createMoodFormSection, createNavigationSection } from './sections.js';
import { createMoodFormSubmitHandler, createNavigationClickHandler } from './handlers.js';
import { attachFormHandler, attachNavigationHandlers, initializeFormDefaults, showSuccessMessage } from './utils.js';

/**
 * @param {{ root: HTMLElement, params: {}, deps: any }} params
 * @returns {void}
 */
export function renderHomePage({ root, params, deps }) {
  const nav = createNavigationSection();
  const formSection = createMoodFormSection({ moodOptions: HOME_CONFIG.moodOptions });

  root.appendChild(nav);
  root.appendChild(formSection);

  initializeFormDefaults();

  const formSubmitHandler = createMoodFormSubmitHandler({
    moodsUseCase: deps.moodsUseCase,
    onSuccess: () => {
      // Réinitialiser les champs date et time à la date/heure actuelle
      initializeFormDefaults();
      // Désélectionner le mood radio
      const moodRadios = document.querySelectorAll('input[name="mood"]');
      moodRadios.forEach(radio => {
        /** @type {HTMLInputElement} */ (radio).checked = false;
      });
      showSuccessMessage({ message: HOME_MESSAGES.success });
    }
  });

  attachFormHandler({ onSubmitHandler: formSubmitHandler });

  attachNavigationHandlers({
    onNavigate: (path) => {
      const router = /** @type {any} */ (window).router;
      if (router) {
        router.navigate(path);
      }
    }
  });
}
