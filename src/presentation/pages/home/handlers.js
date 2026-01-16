// @ts-check

/**
 * @param {{ moodsUseCase: any, onSuccess: () => void }} params
 * @returns {(e: Event) => Promise<void>}
 */
export function createMoodFormSubmitHandler({ moodsUseCase, onSuccess }) {
  return async (e) => {
    e.preventDefault();
    const form = /** @type {HTMLFormElement} */ (e.target);
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
 * @param {{ onNavigate: (path: string) => void }} params
 * @returns {(e: Event) => void}
 */
export function createNavigationClickHandler({ onNavigate }) {
  return (e) => {
    e.preventDefault();
    const link = /** @type {HTMLAnchorElement} */ (e.target);
    const path = link.textContent === 'Accueil' ? '/' : 
                 link.textContent === 'Mes Moods' ? '/list' : 
                 link.textContent === 'Bilans' ? '/bilans' : '/';
    onNavigate(path);
  };
}
