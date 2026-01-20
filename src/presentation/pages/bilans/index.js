// @ts-check

import { BILANS_CONFIG, BILANS_MESSAGES } from './constants.js';
import { createNavigationSection, createBilansSection } from './sections.js';
import { createPeriodButtonHandler, createDateChangeHandler, createCopyButtonHandler, createPdfButtonHandler } from './handlers.js';
import { renderBilanContent, attachNavigationHandlers, initializeDateInput, showCopyMessage, formatBilanText } from './utils.js';
import { createHeader } from '../../components/header.js';

/**
 * @param {{ root: HTMLElement, params: {}, deps: any }} params
 * @returns {Promise<void>}
 */
export async function renderBilansPage({ root, params, deps }) {
  root.innerHTML = '';

  const header = createHeader({ currentPage: 'bilans' });
  const nav = createNavigationSection();
  const bilansSection = createBilansSection();

  root.appendChild(header);
  root.appendChild(nav);
  root.appendChild(bilansSection);

  initializeDateInput();

  let currentPeriod = 'day';
  let currentDate = new Date();

  const loadBilan = async () => {
    let moods;
    let startDate;
    let endDate;

    if (currentPeriod === 'day') {
      moods = await deps.moodsUseCase.getByDate({ date: currentDate });
    } else if (currentPeriod === 'week') {
      const weekStart = new Date(currentDate);
      const dayOfWeek = weekStart.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStart.setDate(weekStart.getDate() + diff);
      weekStart.setHours(0, 0, 0, 0);
      startDate = new Date(weekStart);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      endDate = new Date(weekEnd);
      
      moods = await deps.moodsUseCase.getByWeek({ weekStart });
    } else {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);
      startDate = new Date(monthStart);
      
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      endDate = new Date(monthEnd);
      
      moods = await deps.moodsUseCase.getByMonth({ monthStart });
    }

    renderBilanContent({
      moods,
      moodOptions: BILANS_CONFIG.moodOptions,
      period: currentPeriod,
      date: currentDate,
      startDate,
      endDate
    });
  };

  const periodButtons = document.querySelectorAll('.period-button');
  periodButtons.forEach(button => {
    const handler = createPeriodButtonHandler({
      onPeriodChange: (period) => {
        currentPeriod = period;
        loadBilan();
      }
    });
    button.addEventListener('click', handler);
  });

  const dateInput = document.getElementById('bilan-date');
  if (dateInput) {
    const dateHandler = createDateChangeHandler({
      onDateChange: (date) => {
        currentDate = date;
        loadBilan();
      }
    });
    dateInput.addEventListener('change', dateHandler);
  }

  await loadBilan();

  // Boutons de la toolbar
  const copyButton = document.getElementById('copy-button');
  
  const handleCopy = async () => {
    // Recalculer les moods au moment du clic pour avoir les données à jour
    let moodsToCopy;
    let startDateToCopy;
    let endDateToCopy;

    if (currentPeriod === 'day') {
      moodsToCopy = await deps.moodsUseCase.getByDate({ date: currentDate });
    } else if (currentPeriod === 'week') {
      const weekStart = new Date(currentDate);
      const dayOfWeek = weekStart.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStart.setDate(weekStart.getDate() + diff);
      weekStart.setHours(0, 0, 0, 0);
      startDateToCopy = new Date(weekStart);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      endDateToCopy = new Date(weekEnd);
      
      moodsToCopy = await deps.moodsUseCase.getByWeek({ weekStart });
    } else {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      monthStart.setHours(0, 0, 0, 0);
      startDateToCopy = new Date(monthStart);
      
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);
      endDateToCopy = new Date(monthEnd);
      
      moodsToCopy = await deps.moodsUseCase.getByMonth({ monthStart });
    }

    const text = formatBilanText({
      moods: moodsToCopy,
      moodOptions: BILANS_CONFIG.moodOptions,
      period: currentPeriod,
      date: currentDate,
      startDate: startDateToCopy,
      endDate: endDateToCopy
    });

    try {
      await navigator.clipboard.writeText(text);
      showCopyMessage({ message: BILANS_MESSAGES.copySuccess });
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      showCopyMessage({ message: BILANS_MESSAGES.copyError });
    }
  };

  if (copyButton) {
    const copyHandler = createCopyButtonHandler({ onCopy: handleCopy });
    copyButton.addEventListener('click', copyHandler);
  }

  const pdfButton = document.getElementById('pdf-button');
  const pdfHandler = createPdfButtonHandler();
  
  if (pdfButton) {
    pdfButton.addEventListener('click', pdfHandler);
  }

  attachNavigationHandlers({
    onNavigate: (path) => {
      const router = /** @type {any} */ (window).router;
      if (router) {
        router.navigate(path);
      }
    }
  });

  // Gérer la navigation dans le header (tablette+)
  const headerElement = root.querySelector('.app-header');
  if (headerElement) {
    const headerNavLinks = headerElement.querySelectorAll('.header-nav-link');
    headerNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const linkElement = /** @type {HTMLAnchorElement} */ (e.target);
        const path = linkElement.textContent === 'Accueil' ? '/' :
                     linkElement.textContent === 'Mes Moods' ? '/list' :
                     linkElement.textContent === 'Bilans' ? '/bilans' : '/';
        const router = /** @type {any} */ (window).router;
        if (router) {
          router.navigate(path);
        }
      });
    });
  }
}
