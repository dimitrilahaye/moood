// @ts-check

/**
 * @typedef {import('../../../../core/entities/Mood.js').Mood} Mood
 */

/**
 * @param {{ moods: Mood[], moodOptions: Array<{ value: number, label: string, emoji: string, color: string }>, period: string, date: Date, startDate?: Date, endDate?: Date }} params
 * @returns {string}
 */
export function formatBilanText({ moods, moodOptions, period, date, startDate, endDate }) {
  if (moods.length === 0) {
    return 'Aucune donnée disponible pour cette période.';
  }

  let periodLabel;
  if (period === 'day') {
    const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    periodLabel = `Jour - ${dateStr}`;
  } else if (period === 'week' && startDate && endDate) {
    const startStr = startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const endStr = endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    periodLabel = `Semaine - du ${startStr} au ${endStr}`;
  } else if (period === 'month' && startDate && endDate) {
    const startStr = startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const endStr = endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    periodLabel = `Mois - du ${startStr} au ${endStr}`;
  } else {
    const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    periodLabel = period === 'week' ? `Semaine - ${dateStr}` : `Mois - ${dateStr}`;
  }

  let text = `Bilan ${periodLabel}\n`;
  text += '='.repeat(50) + '\n\n';

  // Compter les moods par note
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  moods.forEach(mood => {
    counts[mood.note] = (counts[mood.note] || 0) + 1;
  });

  // Afficher chaque note avec son nombre d'occurrences
  moodOptions
    .sort((a, b) => b.value - a.value)
    .forEach(option => {
      const count = counts[option.value] || 0;
      text += `${option.emoji} ${option.value} - ${option.label} | Sélectionné ${count} fois\n`;
    });

  text += '\n' + '='.repeat(50) + '\n';
  text += `Total : ${moods.length} mood${moods.length > 1 ? 's' : ''}\n`;

  const avg = moods.reduce((sum, m) => sum + m.note, 0) / moods.length;
  text += `Moyenne : ${avg.toFixed(2)}/5\n`;

  return text;
}

/**
 * @param {{ moods: Mood[], moodOptions: Array<{ value: number, label: string, emoji: string, color: string }>, period: string, date: Date, startDate?: Date, endDate?: Date }} params
 * @returns {void}
 */
export function renderBilanContent({ moods, moodOptions, period, date, startDate, endDate }) {
  const container = document.getElementById('bilan-content');
  if (!container) {
    return;
  }

  container.innerHTML = '';

  if (moods.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'Aucune donnée disponible pour cette période';
    container.appendChild(emptyMessage);
    return;
  }

  let periodLabel;
  if (period === 'day') {
    const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    periodLabel = `Jour - ${dateStr}`;
  } else if (period === 'week' && startDate && endDate) {
    const startStr = startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const endStr = endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    periodLabel = `Semaine - du ${startStr} au ${endStr}`;
  } else if (period === 'month' && startDate && endDate) {
    const startStr = startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const endStr = endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    periodLabel = `Mois - du ${startStr} au ${endStr}`;
  } else {
    const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    periodLabel = period === 'week' ? `Semaine - ${dateStr}` : `Mois - ${dateStr}`;
  }

  const title = document.createElement('h2');
  title.textContent = `Bilan ${periodLabel}`;
  container.appendChild(title);

  const stats = document.createElement('div');
  stats.className = 'bilan-stats';

  const total = document.createElement('div');
  total.className = 'stat-item';
  total.innerHTML = `<strong>Total :</strong> ${moods.length} mood${moods.length > 1 ? 's' : ''}`;

  const avg = moods.reduce((sum, m) => sum + m.note, 0) / moods.length;
  const average = document.createElement('div');
  average.className = 'stat-item';
  average.innerHTML = `<strong>Moyenne :</strong> ${avg.toFixed(2)}/5`;

  stats.appendChild(total);
  stats.appendChild(average);
  container.appendChild(stats);

  const chartContainer = createPieChart({ moods, moodOptions });
  container.appendChild(chartContainer);

  const list = document.createElement('div');
  list.className = 'bilan-list';

  moods.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  moods.forEach(mood => {
    const moodOption = moodOptions.find(opt => opt.value === mood.note);
    const emoji = moodOption ? moodOption.emoji : '❓';
    const label = moodOption ? moodOption.label : '';
    const color = moodOption ? moodOption.color : '#ccc';
    const datetime = new Date(mood.datetime);
    const dateFormatted = datetime.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeFormatted = datetime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const item = document.createElement('div');
    item.className = 'bilan-item';
    item.style.borderLeftColor = color;

    const moodDisplay = document.createElement('div');
    moodDisplay.className = 'bilan-mood';
    moodDisplay.innerHTML = `${emoji} ${mood.note} - ${label}`;

    const datetimeDisplay = document.createElement('div');
    datetimeDisplay.className = 'bilan-datetime';
    datetimeDisplay.textContent = `${dateFormatted} à ${timeFormatted}`;

    item.appendChild(moodDisplay);
    item.appendChild(datetimeDisplay);
    list.appendChild(item);
  });

  container.appendChild(list);
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
 * @returns {void}
 */
export function initializeDateInput() {
  const dateInput = /** @type {HTMLInputElement} */ (document.getElementById('bilan-date'));
  if (dateInput) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
  }
}

/**
 * Crée un graphique en camembert SVG
 * @param {{ moods: Mood[], moodOptions: Array<{ value: number, label: string, emotion: string, emoji: string, color: string }> }} params
 * @returns {HTMLElement}
 */
function createPieChart({ moods, moodOptions }) {
  const container = document.createElement('div');
  container.className = 'pie-chart-container';

  if (moods.length === 0) {
    return container;
  }

  // Compter les moods par note
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  moods.forEach(mood => {
    counts[mood.note] = (counts[mood.note] || 0) + 1;
  });

  // Filtrer les notes qui ont au moins un mood
  const data = moodOptions
    .filter(opt => counts[opt.value] > 0)
    .map(opt => ({
      value: opt.value,
      label: opt.label,
      emoji: opt.emoji,
      color: opt.color,
      count: counts[opt.value],
      percentage: (counts[opt.value] / moods.length) * 100
    }));

  if (data.length === 0) {
    return container;
  }

  const title = document.createElement('h3');
  title.textContent = 'Répartition des moods';
  title.className = 'chart-title';
  container.appendChild(title);

  const chartWrapper = document.createElement('div');
  chartWrapper.className = 'pie-chart-wrapper';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.setAttribute('width', '200');
  svg.setAttribute('height', '200');
  svg.setAttribute('class', 'pie-chart');

  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  let currentAngle = -90; // Commencer en haut

  data.forEach((item, index) => {
    const angle = (item.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', item.color);
    path.setAttribute('stroke', 'white');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('class', 'pie-segment');
    path.setAttribute('data-value', String(item.value));
    svg.appendChild(path);

    currentAngle += angle;
  });

  chartWrapper.appendChild(svg);

  // Légende
  const legend = document.createElement('div');
  legend.className = 'pie-chart-legend';

  data.forEach(item => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';

    const colorBox = document.createElement('div');
    colorBox.className = 'legend-color';
    colorBox.style.backgroundColor = item.color;

    const legendText = document.createElement('div');
    legendText.className = 'legend-text';
    legendText.innerHTML = `${item.emoji} <strong>${item.label}</strong> (${item.count}) - ${item.percentage.toFixed(1)}%`;

    legendItem.appendChild(colorBox);
    legendItem.appendChild(legendText);
    legend.appendChild(legendItem);
  });

  chartWrapper.appendChild(legend);
  container.appendChild(chartWrapper);

  return container;
}

/**
 * @param {{ message: string }} params
 * @returns {void}
 */
export function showCopyMessage({ message }) {
  const existing = document.querySelector('.copy-message');
  if (existing) {
    existing.remove();
  }

  const messageDiv = document.createElement('div');
  messageDiv.className = 'copy-message';
  messageDiv.textContent = message;

  const copyButton = document.getElementById('copy-button');
  if (copyButton) {
    copyButton.parentElement?.insertBefore(messageDiv, copyButton);
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
}
