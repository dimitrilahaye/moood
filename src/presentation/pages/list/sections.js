// @ts-check

/**
 * @returns {HTMLElement}
 */
export function createNavigationSection() {
  const nav = document.createElement('nav');
  nav.className = 'main-navigation';

  const homeLink = document.createElement('a');
  homeLink.href = '#';
  homeLink.textContent = 'Accueil';
  homeLink.className = 'nav-link';

  const listLink = document.createElement('a');
  listLink.href = '#';
  listLink.textContent = 'Mes Moods';
  listLink.className = 'nav-link active';

  const bilansLink = document.createElement('a');
  bilansLink.href = '#';
  bilansLink.textContent = 'Bilans';
  bilansLink.className = 'nav-link';

  nav.appendChild(homeLink);
  nav.appendChild(listLink);
  nav.appendChild(bilansLink);

  return nav;
}

/**
 * @returns {HTMLElement}
 */
export function createMoodsListSection() {
  const section = document.createElement('section');
  section.className = 'moods-list-section';
  section.id = 'moods-list-section';

  const title = document.createElement('h1');
  title.textContent = 'Mes Moods';
  section.appendChild(title);

  const filterContainer = document.createElement('div');
  filterContainer.className = 'filter-container';

  const filterSelector = document.createElement('div');
  filterSelector.className = 'filter-selector';

  const allButton = document.createElement('button');
  allButton.className = 'filter-button active';
  allButton.textContent = 'Tous';
  allButton.dataset.filter = 'all';

  const dayButton = document.createElement('button');
  dayButton.className = 'filter-button';
  dayButton.textContent = 'Jour';
  dayButton.dataset.filter = 'day';

  const weekButton = document.createElement('button');
  weekButton.className = 'filter-button';
  weekButton.textContent = 'Semaine';
  weekButton.dataset.filter = 'week';

  const monthButton = document.createElement('button');
  monthButton.className = 'filter-button';
  monthButton.textContent = 'Mois';
  monthButton.dataset.filter = 'month';

  filterSelector.appendChild(allButton);
  filterSelector.appendChild(dayButton);
  filterSelector.appendChild(weekButton);
  filterSelector.appendChild(monthButton);

  const dateSelector = document.createElement('div');
  dateSelector.className = 'date-selector';
  dateSelector.id = 'list-date-selector';
  dateSelector.style.display = 'none';
  dateSelector.style.alignItems = 'center';

  const dateLabel = document.createElement('label');
  dateLabel.textContent = 'Date';
  dateLabel.htmlFor = 'list-date';

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.id = 'list-date';
  dateInput.name = 'date';

  dateSelector.appendChild(dateLabel);
  dateSelector.appendChild(dateInput);

  filterContainer.appendChild(filterSelector);
  filterContainer.appendChild(dateSelector);
  section.appendChild(filterContainer);

  const listContainer = document.createElement('div');
  listContainer.className = 'moods-list-container';
  listContainer.id = 'moods-list-container';

  section.appendChild(listContainer);

  return section;
}
