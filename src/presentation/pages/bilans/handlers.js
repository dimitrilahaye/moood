// @ts-check

/**
 * @param {{ onPeriodChange: (period: string) => void }} params
 * @returns {(e: Event) => void}
 */
export function createPeriodButtonHandler({ onPeriodChange }) {
  return (e) => {
    const button = /** @type {HTMLButtonElement} */ (e.target);
    const period = button.dataset.period;

    if (!period) {
      return;
    }

    document.querySelectorAll('.period-button').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    onPeriodChange(period);
  };
}

/**
 * @param {{ onDateChange: (date: Date) => void }} params
 * @returns {(e: Event) => void}
 */
export function createDateChangeHandler({ onDateChange }) {
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

/**
 * @param {{ onCopy: () => void }} params
 * @returns {(e: Event) => void}
 */
export function createCopyButtonHandler({ onCopy }) {
  return (e) => {
    e.preventDefault();
    onCopy();
  };
}

/**
 * @returns {(e: Event) => void}
 */
export function createPdfButtonHandler() {
  return (e) => {
    e.preventDefault();
    window.print();
  };
}
