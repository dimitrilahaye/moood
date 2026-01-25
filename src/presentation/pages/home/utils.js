// @ts-check

/**
 * @param {{ onSubmitHandler: (e: Event) => Promise<void> }} params
 * @returns {void}
 */
export function attachFormHandler({ onSubmitHandler }) {
  const form = document.getElementById('mood-form');
  if (form) {
    form.addEventListener('submit', onSubmitHandler);
  }
}

/**
 * @param {{ onNavigate: (path: string) => void }} params
 * @returns {void}
 */
export function attachNavigationHandlers({ onNavigate }) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const linkElement = /** @type {HTMLAnchorElement} */ (e.target.closest('.nav-link') || e.target);
      const isCta = linkElement.classList.contains('nav-link-cta');
      const path = isCta ? '/' : 
                   linkElement.textContent === 'Mes Moods' ? '/list' : 
                   linkElement.textContent === 'Bilans' ? '/bilans' : '/';
      onNavigate(path);
    });
  });
}

/**
 * Initialise les valeurs par défaut du formulaire (aujourd'hui, heure actuelle)
 * @returns {void}
 */
export function initializeFormDefaults() {
  const now = new Date();
  const dateInput = /** @type {HTMLInputElement} */ (document.getElementById('mood-date'));
  const timeInput = /** @type {HTMLInputElement} */ (document.getElementById('mood-time'));

  if (dateInput) {
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
  }

  if (timeInput) {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeInput.value = `${hours}:${minutes}`;
  }
}

/**
 * Affiche un message de succès dans une modale
 * @param {{ message: string }} params
 * @returns {void}
 */
export function showSuccessMessage({ message }) {
  const existing = document.querySelector('.success-modal');
  if (existing) {
    existing.remove();
  }

  const modal = document.createElement('div');
  modal.className = 'success-modal';
  modal.style.display = 'flex';

  const modalContent = document.createElement('div');
  modalContent.className = 'success-modal-content';

  const closeButton = document.createElement('span');
  closeButton.className = 'success-modal-close';
  closeButton.textContent = '×';
  closeButton.addEventListener('click', () => {
    modal.remove();
  });

  const messageText = document.createElement('div');
  messageText.className = 'success-modal-message';
  messageText.textContent = message;

  const icon = document.createElement('div');
  icon.className = 'success-modal-icon';
  icon.textContent = '✓';

  modalContent.appendChild(closeButton);
  modalContent.appendChild(icon);
  modalContent.appendChild(messageText);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  // Fermer en cliquant sur le fond
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
