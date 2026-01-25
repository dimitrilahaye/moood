// @ts-check

import { LIST_CONFIG, LIST_MESSAGES } from './constants.js';
import { createNavigationSection, createMoodsListSection } from './sections.js';
import { createEditFormSubmitHandler, createDeleteHandler, createEditHandler, createFilterButtonHandler, createListDateChangeHandler } from './handlers.js';
import { renderMoodsList, attachNavigationHandlers, createEditModal, initializeListDateInput } from './utils.js';
import { createHeader } from '../../components/header.js';

/**
 * @param {{ root: HTMLElement, params: {}, deps: any }} params
 * @returns {Promise<void>}
 */
export async function renderListPage({ root, params, deps }) {
  root.innerHTML = '';

  const header = createHeader({ currentPage: 'list' });
  const nav = createNavigationSection();
  const listSection = createMoodsListSection();
  const editModal = createEditModal();

  root.appendChild(header);
  root.appendChild(nav);
  root.appendChild(listSection);
  root.appendChild(editModal);

  initializeListDateInput();

  let currentFilter = 'all';
  let currentDate = new Date();

  const loadMoods = async () => {
    let moods;

    if (currentFilter === 'all') {
      moods = await deps.moodsUseCase.getAll();
    } else if (currentFilter === 'day') {
      moods = await deps.moodsUseCase.getByDate({ date: currentDate });
    } else if (currentFilter === 'week') {
      const weekStart = new Date(currentDate);
      const dayOfWeek = weekStart.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStart.setDate(weekStart.getDate() + diff);
      weekStart.setHours(0, 0, 0, 0);
      moods = await deps.moodsUseCase.getByWeek({ weekStart });
    } else if (currentFilter === 'month') {
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      moods = await deps.moodsUseCase.getByMonth({ monthStart });
    } else {
      moods = await deps.moodsUseCase.getAll();
    }

    renderMoodsList({
      moods,
      moodOptions: LIST_CONFIG.moodOptions,
      onEdit: createEditHandler({ moods, moodOptions: LIST_CONFIG.moodOptions }),
      onDelete: createDeleteHandler({ moodsUseCase: deps.moodsUseCase, onRefresh: loadMoods })
    });
  };

  const refresh = async () => {
    await loadMoods();
  };

  await loadMoods();

  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    const handler = createFilterButtonHandler({
      onFilterChange: (filter) => {
        currentFilter = filter;
        loadMoods();
      }
    });
    button.addEventListener('click', handler);
  });

  const dateInput = document.getElementById('list-date');
  if (dateInput) {
    const dateHandler = createListDateChangeHandler({
      onDateChange: (date) => {
        currentDate = date;
        loadMoods();
      }
    });
    dateInput.addEventListener('change', dateHandler);
  }

  const editForm = document.getElementById('edit-mood-form');
  if (editForm) {
    const editFormHandler = createEditFormSubmitHandler({
      moodsUseCase: deps.moodsUseCase,
      onRefresh: refresh
    });
    editForm.addEventListener('submit', editFormHandler);
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
  const headerNavLinks = header.querySelectorAll('.header-nav-link');
  headerNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const linkElement = /** @type {HTMLAnchorElement} */ (e.target.closest('.header-nav-link') || e.target);
      const isCta = linkElement.classList.contains('header-nav-link-cta');
      const path = isCta ? '/' :
                   linkElement.textContent === 'Mes Moods' ? '/list' :
                   linkElement.textContent === 'Bilans' ? '/bilans' : '/';
      const router = /** @type {any} */ (window).router;
      if (router) {
        router.navigate(path);
      }
    });
  });
}
