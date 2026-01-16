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
  listLink.className = 'nav-link';

  const bilansLink = document.createElement('a');
  bilansLink.href = '#';
  bilansLink.textContent = 'Bilans';
  bilansLink.className = 'nav-link active';

  nav.appendChild(homeLink);
  nav.appendChild(listLink);
  nav.appendChild(bilansLink);

  return nav;
}

/**
 * @returns {HTMLElement}
 */
export function createBilansSection() {
  const section = document.createElement('section');
  section.className = 'bilans-section';

  const title = document.createElement('h1');
  title.textContent = 'Bilans';

  const periodSelector = document.createElement('div');
  periodSelector.className = 'period-selector';

  const dayButton = document.createElement('button');
  dayButton.className = 'period-button active';
  dayButton.textContent = 'Jour';
  dayButton.dataset.period = 'day';

  const weekButton = document.createElement('button');
  weekButton.className = 'period-button';
  weekButton.textContent = 'Semaine';
  weekButton.dataset.period = 'week';

  const monthButton = document.createElement('button');
  monthButton.className = 'period-button';
  monthButton.textContent = 'Mois';
  monthButton.dataset.period = 'month';

  periodSelector.appendChild(dayButton);
  periodSelector.appendChild(weekButton);
  periodSelector.appendChild(monthButton);

  const dateSelector = document.createElement('div');
  dateSelector.className = 'date-selector';

  const dateLabel = document.createElement('label');
  dateLabel.textContent = 'Date';
  dateLabel.htmlFor = 'bilan-date';

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.id = 'bilan-date';
  dateInput.name = 'date';

  dateSelector.appendChild(dateLabel);
  dateSelector.appendChild(dateInput);

  const bilanContent = document.createElement('div');
  bilanContent.className = 'bilan-content';
  bilanContent.id = 'bilan-content';

  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'bilan-actions';

  const copyButton = document.createElement('button');
  copyButton.className = 'copy-button';
  copyButton.textContent = 'Copier dans le presse-papier';
  copyButton.id = 'copy-button';

  const pdfButton = document.createElement('button');
  pdfButton.className = 'pdf-button';
  pdfButton.textContent = 'Télécharger en PDF';
  pdfButton.id = 'pdf-button';

  actionsContainer.appendChild(copyButton);
  actionsContainer.appendChild(pdfButton);

  section.appendChild(title);
  section.appendChild(periodSelector);
  section.appendChild(dateSelector);
  section.appendChild(bilanContent);
  section.appendChild(actionsContainer);

  return section;
}
