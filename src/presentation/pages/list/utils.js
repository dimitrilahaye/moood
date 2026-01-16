// @ts-check

/**
 * @typedef {import('../../../../core/entities/Mood.js').Mood} Mood
 */

/**
 * @param {{ mood: Mood, moodOptions: Array<{ value: number, label: string, emoji: string, color: string }>, onEdit: (id: string) => void, onDelete: (id: string) => Promise<void> }} params
 * @returns {HTMLElement}
 */
export function createMoodCard({ mood, moodOptions, onEdit, onDelete }) {
  const card = document.createElement('div');
  card.className = 'mood-card';

  const moodOption = moodOptions.find(opt => opt.value === mood.note);
  const emoji = moodOption ? moodOption.emoji : '❓';
  const label = moodOption ? moodOption.label : '';
  const color = moodOption ? moodOption.color : '#ccc';

  const datetime = new Date(mood.datetime);
  const dateStr = datetime.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = datetime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const moodDisplay = document.createElement('div');
  moodDisplay.className = 'mood-display';
  moodDisplay.style.backgroundColor = color;

  const emojiSpan = document.createElement('span');
  emojiSpan.className = 'mood-emoji';
  emojiSpan.textContent = emoji;

  const textSpan = document.createElement('span');
  textSpan.className = 'mood-text';
  textSpan.textContent = `${mood.note} - ${label}`;

  moodDisplay.appendChild(emojiSpan);
  moodDisplay.appendChild(textSpan);

  const datetimeDisplay = document.createElement('div');
  datetimeDisplay.className = 'mood-datetime';
  datetimeDisplay.textContent = `${dateStr} à ${timeStr}`;

  const actions = document.createElement('div');
  actions.className = 'mood-actions';

  const editButton = document.createElement('button');
  editButton.className = 'edit-button';
  editButton.textContent = 'Modifier';
  editButton.addEventListener('click', () => onEdit(mood.id));

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Supprimer';
  deleteButton.addEventListener('click', async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce mood ?')) {
      await onDelete(mood.id);
    }
  });

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  card.appendChild(moodDisplay);
  card.appendChild(datetimeDisplay);
  card.appendChild(actions);

  return card;
}

/**
 * @param {{ moods: Mood[], moodOptions: Array<{ value: number, label: string, emoji: string, color: string }>, onEdit: (id: string) => void, onDelete: (id: string) => Promise<void> }} params
 * @returns {void}
 */
export function renderMoodsList({ moods, moodOptions, onEdit, onDelete }) {
  const container = document.getElementById('moods-list-container');
  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (moods.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'Aucun mood enregistré';
    container.appendChild(emptyMessage);
    return;
  }

  moods.sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  moods.forEach(mood => {
    const card = createMoodCard({ mood, moodOptions, onEdit, onDelete });
    container.appendChild(card);
  });
}

/**
 * @returns {void}
 */
export function initializeListDateInput() {
  const dateInput = /** @type {HTMLInputElement} */ (document.getElementById('list-date'));
  if (dateInput) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
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
 * @returns {HTMLElement}
 */
export function createEditModal() {
  const modal = document.createElement('div');
  modal.className = 'edit-modal';
  modal.id = 'edit-modal';
  modal.style.display = 'none';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const closeButton = document.createElement('span');
  closeButton.className = 'close-button';
  closeButton.textContent = '×';
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  const form = document.createElement('form');
  form.id = 'edit-mood-form';
  form.className = 'edit-mood-form';

  const dateLabel = document.createElement('label');
  dateLabel.textContent = 'Date';
  dateLabel.htmlFor = 'edit-date';

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.id = 'edit-date';
  dateInput.name = 'date';
  dateInput.required = true;

  const timeLabel = document.createElement('label');
  timeLabel.textContent = 'Heure';
  timeLabel.htmlFor = 'edit-time';

  const timeInput = document.createElement('input');
  timeInput.type = 'time';
  timeInput.id = 'edit-time';
  timeInput.name = 'time';
  timeInput.required = true;

  const moodLabel = document.createElement('label');
  moodLabel.textContent = 'Mood';

  const moodSelect = document.createElement('select');
  moodSelect.id = 'edit-mood';
  moodSelect.name = 'mood';
  moodSelect.required = true;

  const options = [
    { value: '5', label: '5 - Génial 🟢' },
    { value: '4', label: '4 - Bien 🟢' },
    { value: '3', label: '3 - Neutre 🟡' },
    { value: '2', label: '2 - Bof 🟠' },
    { value: '1', label: '1 - Mauvais 🔴' }
  ];

  options.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    moodSelect.appendChild(option);
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Enregistrer';

  form.appendChild(dateLabel);
  form.appendChild(dateInput);
  form.appendChild(timeLabel);
  form.appendChild(timeInput);
  form.appendChild(moodLabel);
  form.appendChild(moodSelect);
  form.appendChild(submitButton);

  modalContent.appendChild(closeButton);
  modalContent.appendChild(form);
  modal.appendChild(modalContent);

  return modal;
}
