// @ts-check

/**
 * @param {{ moodsUseCase: any, onSuccess: () => void }} params
 * @returns {() => Promise<void>}
 */
export function createAddMoodHandler({ moodsUseCase, onSuccess }) {
  return async () => {
    const form = /** @type {HTMLFormElement} */ (document.getElementById('mood-form'));
    if (!form) {
      return;
    }

    const formData = new FormData(form);
    const dateStr = formData.get('date');
    const timeStr = formData.get('time');
    const moodStr = formData.get('mood');

    if (!dateStr || !timeStr || !moodStr) {
      return;
    }

    const [year, month, day] = String(dateStr).split('-').map(Number);
    const [hours, minutes] = String(timeStr).split(':').map(Number);
    const datetime = new Date(year, month - 1, day, hours, minutes);
    const note = Number(moodStr);

    try {
      await moodsUseCase.create({ note, datetime });
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création du mood:', error);
    }
  };
}

/**
 * Crée les boutons d'action pour un mood sélectionné
 * @returns {HTMLElement}
 */
function createActionButtons() {
  const container = document.createElement('div');
  container.className = 'mood-action-buttons';
  container.style.display = 'flex';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'cancel-mood-button';
  cancelButton.textContent = 'Annuler';

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'add-mood-button';
  addButton.textContent = 'Ajouter ce mood';

  container.appendChild(cancelButton);
  container.appendChild(addButton);

  return container;
}

/**
 * @param {{ onCancel: () => void, onAdd: () => Promise<void> }} params
 * @returns {void}
 */
export function setupMoodRadioHandlers({ onCancel, onAdd }) {
  const moodRadios = document.querySelectorAll('input[name="mood"]');
  const moodLabels = document.querySelectorAll('label[for^="mood-"]');
  let currentActionButtons = null;
  let selectedRadioValue = '';
  
  // Gérer les clics sur les labels pour détecter le double-clic sur le même mood
  moodLabels.forEach(label => {
    label.addEventListener('mousedown', (e) => {
      const radioId = label.getAttribute('for');
      const radio = /** @type {HTMLInputElement} */ (document.getElementById(radioId));
      
      if (!radio) {
        return;
      }

      // Si le radio est déjà sélectionné, on empêche le comportement par défaut
      // et on le désélectionne manuellement
      if (selectedRadioValue === radio.value && radio.checked) {
        e.preventDefault();
        e.stopPropagation();
        
        // Utiliser setTimeout pour éviter les conflits avec le comportement par défaut
        setTimeout(() => {
          radio.checked = false;
          // Déclencher manuellement l'événement change
          radio.dispatchEvent(new Event('change'));
        }, 0);
        return;
      }
    });
  });

  // Gérer les changements de sélection
  moodRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const optionDiv = radio.closest('.mood-option');
      if (!optionDiv) {
        return;
      }

      // Supprimer les boutons existants
      if (currentActionButtons && currentActionButtons.parentElement) {
        currentActionButtons.parentElement.removeChild(currentActionButtons);
        currentActionButtons = null;
      }

      if (radio.checked) {
        // Nouveau mood sélectionné - créer et insérer les boutons
        const buttons = createActionButtons();
        
        const cancelButton = buttons.querySelector('.cancel-mood-button');
        if (cancelButton) {
          cancelButton.addEventListener('click', () => {
            radio.checked = false;
            if (buttons.parentElement) {
              buttons.parentElement.removeChild(buttons);
            }
            currentActionButtons = null;
            selectedRadioValue = '';
            onCancel();
          });
        }

        const addButton = buttons.querySelector('.add-mood-button');
        if (addButton) {
          addButton.addEventListener('click', async () => {
            await onAdd();
            radio.checked = false;
            if (buttons.parentElement) {
              buttons.parentElement.removeChild(buttons);
            }
            currentActionButtons = null;
            selectedRadioValue = '';
          });
        }

        // Insérer les boutons juste après le mood sélectionné
        optionDiv.parentElement.insertBefore(buttons, optionDiv.nextSibling);
        currentActionButtons = buttons;
        selectedRadioValue = radio.value;
      } else {
        selectedRadioValue = '';
      }
    });
  });
}

/**
 * @param {{ onNavigate: (path: string) => void }} params
 * @returns {(e: Event) => void}
 */
export function createNavigationClickHandler({ onNavigate }) {
  return (e) => {
    e.preventDefault();
    const link = /** @type {HTMLAnchorElement} */ (e.target.closest('.nav-link, .header-nav-link') || e.target);
    const isCta = link.classList.contains('nav-link-cta') || link.classList.contains('header-nav-link-cta');
    const path = isCta ? '/' : 
                 link.textContent === 'Mes Moods' ? '/list' : 
                 link.textContent === 'Bilans' ? '/bilans' : '/';
    onNavigate(path);
  };
}
