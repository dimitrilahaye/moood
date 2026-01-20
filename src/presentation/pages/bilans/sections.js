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

  // Barre d'outils avec tous les contrôles
  const toolbar = document.createElement('div');
  toolbar.className = 'bilans-toolbar';

  // Sélecteur de période
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

  // Boutons d'action avec icônes
  const actionsGroup = document.createElement('div');
  actionsGroup.className = 'toolbar-actions';

  const copyButton = document.createElement('button');
  copyButton.className = 'toolbar-button copy-button';
  copyButton.id = 'copy-button';
  copyButton.setAttribute('aria-label', 'Copier dans le presse-papier');
  copyButton.title = 'Copier dans le presse-papier';
  
  // Icône SVG pour copier
  const copyIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  copyIcon.setAttribute('width', '20');
  copyIcon.setAttribute('height', '20');
  copyIcon.setAttribute('viewBox', '0 0 24 24');
  copyIcon.setAttribute('fill', 'none');
  copyIcon.setAttribute('stroke', 'currentColor');
  copyIcon.setAttribute('stroke-width', '2');
  copyIcon.setAttribute('stroke-linecap', 'round');
  copyIcon.setAttribute('stroke-linejoin', 'round');
  
  const copyPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  copyPath1.setAttribute('x', '9');
  copyPath1.setAttribute('y', '9');
  copyPath1.setAttribute('width', '13');
  copyPath1.setAttribute('height', '13');
  copyPath1.setAttribute('rx', '2');
  copyPath1.setAttribute('ry', '2');
  
  const copyPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  copyPath2.setAttribute('d', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1');
  
  copyIcon.appendChild(copyPath1);
  copyIcon.appendChild(copyPath2);
  copyButton.appendChild(copyIcon);

  const pdfButton = document.createElement('button');
  pdfButton.className = 'toolbar-button pdf-button';
  pdfButton.id = 'pdf-button';
  pdfButton.setAttribute('aria-label', 'Télécharger en PDF');
  pdfButton.title = 'Télécharger en PDF';
  
  // Icône SVG pour PDF
  const pdfIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  pdfIcon.setAttribute('width', '20');
  pdfIcon.setAttribute('height', '20');
  pdfIcon.setAttribute('viewBox', '0 0 24 24');
  pdfIcon.setAttribute('fill', 'none');
  pdfIcon.setAttribute('stroke', 'currentColor');
  pdfIcon.setAttribute('stroke-width', '2');
  pdfIcon.setAttribute('stroke-linecap', 'round');
  pdfIcon.setAttribute('stroke-linejoin', 'round');
  
  const pdfPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pdfPath1.setAttribute('d', 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z');
  
  const pdfPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  pdfPath2.setAttribute('points', '14 2 14 8 20 8');
  
  const pdfPath3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  pdfPath3.setAttribute('x1', '16');
  pdfPath3.setAttribute('y1', '13');
  pdfPath3.setAttribute('x2', '8');
  pdfPath3.setAttribute('y2', '13');
  
  const pdfPath4 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  pdfPath4.setAttribute('x1', '16');
  pdfPath4.setAttribute('y1', '17');
  pdfPath4.setAttribute('x2', '8');
  pdfPath4.setAttribute('y2', '17');
  
  const pdfPath5 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  pdfPath5.setAttribute('points', '10 9 9 9 8 9');
  
  pdfIcon.appendChild(pdfPath1);
  pdfIcon.appendChild(pdfPath2);
  pdfIcon.appendChild(pdfPath3);
  pdfIcon.appendChild(pdfPath4);
  pdfIcon.appendChild(pdfPath5);
  pdfButton.appendChild(pdfIcon);

  actionsGroup.appendChild(copyButton);
  actionsGroup.appendChild(pdfButton);

  toolbar.appendChild(periodSelector);
  toolbar.appendChild(actionsGroup);

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

  section.appendChild(title);
  section.appendChild(toolbar);
  section.appendChild(dateSelector);
  section.appendChild(bilanContent);

  return section;
}
