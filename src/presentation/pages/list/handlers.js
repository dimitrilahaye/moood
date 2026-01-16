// @ts-check

/**
 * @param {{ moodsUseCase: any, onRefresh: () => Promise<void> }} params
 * @returns {(e: Event) => Promise<void>}
 */
export function createEditFormSubmitHandler({ moodsUseCase, onRefresh }) {
  return async (e) => {
    e.preventDefault();
    const form = /** @type {HTMLFormElement} */ (e.target);
    const formData = new FormData(form);
    const moodId = form.dataset.moodId;

    if (!moodId) {
      return;
    }

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
      await moodsUseCase.update({ id: moodId, note, datetime });
      const modal = document.getElementById('edit-modal');
      if (modal) {
        modal.style.display = 'none';
      }
      await onRefresh();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mood:', error);
    }
  };
}

/**
 * @param {{ moodsUseCase: any, onRefresh: () => Promise<void> }} params
 * @returns {(id: string) => Promise<void>}
 */
export function createDeleteHandler({ moodsUseCase, onRefresh }) {
  return async (id) => {
    try {
      await moodsUseCase.delete({ id });
      await onRefresh();
    } catch (error) {
      console.error('Erreur lors de la suppression du mood:', error);
    }
  };
}

/**
 * @param {{ moods: any[], moodOptions: any[] }} params
 * @returns {(id: string) => void}
 */
export function createEditHandler({ moods, moodOptions }) {
  return (id) => {
    const mood = moods.find(m => m.id === id);
    if (!mood) {
      return;
    }

    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('edit-mood-form');
    const dateInput = /** @type {HTMLInputElement} */ (document.getElementById('edit-date'));
    const timeInput = /** @type {HTMLInputElement} */ (document.getElementById('edit-time'));
    const moodSelect = /** @type {HTMLSelectElement} */ (document.getElementById('edit-mood'));

    if (!modal || !form || !dateInput || !timeInput || !moodSelect) {
      return;
    }

    const datetime = new Date(mood.datetime);
    const year = datetime.getFullYear();
    const month = String(datetime.getMonth() + 1).padStart(2, '0');
    const day = String(datetime.getDate()).padStart(2, '0');
    const hours = String(datetime.getHours()).padStart(2, '0');
    const minutes = String(datetime.getMinutes()).padStart(2, '0');

    dateInput.value = `${year}-${month}-${day}`;
    timeInput.value = `${hours}:${minutes}`;
    moodSelect.value = String(mood.note);
    form.dataset.moodId = id;

    modal.style.display = 'flex';
  };
}

/**
 * @param {{ onFilterChange: (filter: string) => void }} params
 * @returns {(e: Event) => void}
 */
export function createFilterButtonHandler({ onFilterChange }) {
  return (e) => {
    const button = /** @type {HTMLButtonElement} */ (e.target);
    const filter = button.dataset.filter;

    if (!filter) {
      return;
    }

    document.querySelectorAll('.filter-button').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    const dateSelector = document.getElementById('list-date-selector');
    if (dateSelector) {
      dateSelector.style.display = filter === 'all' ? 'none' : 'flex';
    }

    onFilterChange(filter);
  };
}

/**
 * @param {{ onDateChange: (date: Date) => void }} params
 * @returns {(e: Event) => void}
 */
export function createListDateChangeHandler({ onDateChange }) {
  return (e) => {
    const input = /** @type {HTMLInputElement} */ (e.target);
    const dateStr = input.value;

    if (!dateStr) {
      return;
    }

    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    onDateChange(date);
  };
}
