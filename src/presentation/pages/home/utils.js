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
      const linkElement = /** @type {HTMLAnchorElement} */ (e.target);
      const path = linkElement.textContent === 'Accueil' ? '/' : 
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
 * Affiche un message de succès
 * @param {{ message: string }} params
 * @returns {void}
 */
export function showSuccessMessage({ message }) {
  const existing = document.querySelector('.success-message');
  if (existing) {
    existing.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = 'success-message';
  messageDiv.textContent = message;
  
  const form = document.getElementById('mood-form');
  if (form) {
    form.parentElement?.insertBefore(messageDiv, form);
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
}
