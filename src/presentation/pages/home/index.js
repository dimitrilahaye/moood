// @ts-check

import { HOME_CONFIG, HOME_MESSAGES } from './constants.js';
import { createMoodFormSection, createNavigationSection } from './sections.js';
import { createAddMoodHandler, setupMoodRadioHandlers } from './handlers.js';
import { attachNavigationHandlers, initializeFormDefaults, showSuccessMessage } from './utils.js';
import { createHeader } from '../../components/header.js';

/**
 * @param {{ root: HTMLElement, params: {}, deps: any }} params
 * @returns {void}
 */
export function renderHomePage({ root, params, deps }) {
  const header = createHeader();
  const nav = createNavigationSection();
  const formSection = createMoodFormSection({ moodOptions: HOME_CONFIG.moodOptions });

  root.appendChild(header);
  root.appendChild(nav);
  root.appendChild(formSection);

  initializeFormDefaults();

  const resetForm = () => {
    initializeFormDefaults();
    const moodRadios = document.querySelectorAll('input[name="mood"]');
    moodRadios.forEach(radio => {
      /** @type {HTMLInputElement} */ (radio).checked = false;
    });
    // Supprimer les boutons d'action s'ils existent
    const actionButtons = document.querySelector('.mood-action-buttons');
    if (actionButtons && actionButtons.parentElement) {
      actionButtons.parentElement.removeChild(actionButtons);
    }
  };

  const addMoodHandler = createAddMoodHandler({
    moodsUseCase: deps.moodsUseCase,
    onSuccess: () => {
      resetForm();
      showSuccessMessage({ message: HOME_MESSAGES.success });
    }
  });

  const cancelMoodHandler = () => {
    // Ne rien faire de spécial, les boutons sont déjà supprimés dans setupMoodRadioHandlers
  };

  setupMoodRadioHandlers({
    onCancel: cancelMoodHandler,
    onAdd: async () => {
      await addMoodHandler();
    }
  });

  attachNavigationHandlers({
    onNavigate: (path) => {
      const router = /** @type {any} */ (window).router;
      if (router) {
        router.navigate(path);
      }
    }
  });
}
