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

  // Créer le conteneur du titre avec la date (AVANT le check moods.length === 0)
  const titleContainer = document.createElement('div');
  titleContainer.className = 'bilan-title-container';

  // Titre principal
  let periodTypeLabel;
  if (period === 'day') {
    periodTypeLabel = 'Jour';
  } else if (period === 'week') {
    periodTypeLabel = 'Semaine';
  } else {
    periodTypeLabel = 'Mois';
  }

  const title = document.createElement('h2');
  title.className = 'bilan-title';
  title.textContent = `Bilan ${periodTypeLabel}`;
  titleContainer.appendChild(title);

  // Date en dessous (indication complémentaire)
  let dateLabel;
  if (period === 'day') {
    const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    dateLabel = dateStr;
  } else if (period === 'week' && startDate && endDate) {
    const startStr = startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const endStr = endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    dateLabel = `du ${startStr} au ${endStr}`;
  } else if (period === 'month' && startDate && endDate) {
    const startStr = startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const endStr = endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    dateLabel = `du ${startStr} au ${endStr}`;
  } else {
    const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    dateLabel = period === 'week' ? dateStr : dateStr;
  }

  const dateElement = document.createElement('div');
  dateElement.className = 'bilan-date';
  dateElement.textContent = dateLabel;
  titleContainer.appendChild(dateElement);

  container.appendChild(titleContainer);

  // Désactiver les boutons de la toolbar s'il n'y a pas de données
  const copyButton = /** @type {HTMLButtonElement | null} */ (document.getElementById('copy-button'));
  const pdfButton = /** @type {HTMLButtonElement | null} */ (document.getElementById('pdf-button'));
  
  if (copyButton && pdfButton) {
    if (moods.length === 0) {
      copyButton.disabled = true;
      pdfButton.disabled = true;
      copyButton.style.opacity = '0.5';
      pdfButton.style.opacity = '0.5';
      copyButton.style.cursor = 'not-allowed';
      pdfButton.style.cursor = 'not-allowed';
    } else {
      copyButton.disabled = false;
      pdfButton.disabled = false;
      copyButton.style.opacity = '1';
      pdfButton.style.opacity = '1';
      copyButton.style.cursor = 'pointer';
      pdfButton.style.cursor = 'pointer';
    }
  }

  if (moods.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'Aucune donnée disponible pour cette période';
    container.appendChild(emptyMessage);
    return;
  }

  // Dashboard cards layout
  const dashboardGrid = document.createElement('div');
  dashboardGrid.className = 'dashboard-grid';

  // Stats cards
  const statsContainer = document.createElement('div');
  statsContainer.className = 'stats-cards';

  const totalCard = document.createElement('div');
  totalCard.className = 'stat-card stat-card-total';
  const totalIcon = document.createElement('div');
  totalIcon.className = 'stat-icon';
  totalIcon.textContent = '❤️';
  const totalValue = document.createElement('div');
  totalValue.className = 'stat-value';
  totalValue.textContent = String(moods.length);
  const totalLabel = document.createElement('div');
  totalLabel.className = 'stat-label';
  totalLabel.textContent = `mood${moods.length > 1 ? 's' : ''}`;
  totalCard.appendChild(totalIcon);
  totalCard.appendChild(totalValue);
  totalCard.appendChild(totalLabel);

  const avg = moods.reduce((sum, m) => sum + m.note, 0) / moods.length;
  const avgCard = document.createElement('div');
  avgCard.className = 'stat-card stat-card-avg';
  const avgIcon = document.createElement('div');
  avgIcon.className = 'stat-icon';
  avgIcon.textContent = '⭐';
  const avgValue = document.createElement('div');
  avgValue.className = 'stat-value';
  avgValue.textContent = avg.toFixed(2);
  const avgLabel = document.createElement('div');
  avgLabel.className = 'stat-label';
  avgLabel.textContent = '/ 5 moyenne';
  avgCard.appendChild(avgIcon);
  avgCard.appendChild(avgValue);
  avgCard.appendChild(avgLabel);

  statsContainer.appendChild(totalCard);
  statsContainer.appendChild(avgCard);
  dashboardGrid.appendChild(statsContainer);

  // Main chart section
  const chartSection = document.createElement('div');
  chartSection.className = 'dashboard-chart-section';
  const chartContainer = createPieChart({ moods, moodOptions });
  chartSection.appendChild(chartContainer);
  dashboardGrid.appendChild(chartSection);

  container.appendChild(dashboardGrid);

  const progressionChart = createProgressionChart({ moods, period, date, startDate, endDate, moodOptions });
  container.appendChild(progressionChart);

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
      const linkElement = /** @type {HTMLAnchorElement} */ (e.target.closest('.nav-link') || e.target);
      const isCta = linkElement.classList.contains('nav-link-cta');
      const path = isCta ? '/' : 
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
 * Crée et gère le bouton "retour en haut"
 * @returns {void}
 */
export function createBackToTopButton() {
  // Vérifier si le bouton existe déjà
  let backToTopButton = document.getElementById('back-to-top-button');
  
  if (!backToTopButton) {
    backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top-button';
    backToTopButton.className = 'back-to-top-button';
    backToTopButton.setAttribute('aria-label', 'Retour en haut');
    backToTopButton.style.display = 'none';

    // Icône SVG flèche vers le haut
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '2');
    icon.setAttribute('stroke-linecap', 'round');
    icon.setAttribute('stroke-linejoin', 'round');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M18 15l-6-6-6 6');

    icon.appendChild(path);
    backToTopButton.appendChild(icon);

    // Handler pour remonter en haut
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.body.appendChild(backToTopButton);

    // Gérer l'affichage selon le scroll
    const handleScroll = () => {
      const button = document.getElementById('back-to-top-button');
      if (button) {
        if (window.scrollY > 300) {
          button.style.display = 'flex';
          button.style.opacity = '1';
          button.style.transform = 'translateY(0)';
        } else {
          button.style.display = 'none';
          button.style.opacity = '0';
          button.style.transform = 'translateY(20px)';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Initialiser l'état
    handleScroll();
  }
}

/**
 * Supprime le bouton "retour en haut"
 * @returns {void}
 */
export function removeBackToTopButton() {
  const backToTopButton = document.getElementById('back-to-top-button');
  if (backToTopButton) {
    backToTopButton.remove();
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
  svg.setAttribute('viewBox', '0 0 300 300');
  svg.setAttribute('width', '300');
  svg.setAttribute('height', '300');
  svg.setAttribute('class', 'pie-chart-fancy');

  const centerX = 150;
  const centerY = 150;
  const radius = 120;
  let currentAngle = -90; // Commencer en haut

  // Fonction helper pour éclaircir une couleur
  function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  // Fonction helper pour assombrir une couleur
  function darkenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
  }

  // Créer les définitions de gradients pour chaque couleur
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  data.forEach((item, index) => {
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', `gradient-${item.value}`);
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');
    
    // Créer des variantes plus vives pour les gradients
    const lighterColor = lightenColor(item.color, 15);
    const darkerColor = darkenColor(item.color, 10);
    
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', lighterColor);
    stop1.setAttribute('stop-opacity', '1');
    
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', darkerColor);
    stop2.setAttribute('stop-opacity', '1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
  });
  svg.appendChild(defs);

  // Si un seul segment (100%), dessiner un cercle complet
  if (data.length === 1 && data[0].percentage === 100) {
    const item = data[0];
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(centerX));
    circle.setAttribute('cy', String(centerY));
    circle.setAttribute('r', String(radius));
    circle.setAttribute('fill', `url(#gradient-${item.value})`);
    circle.setAttribute('stroke', 'white');
    circle.setAttribute('stroke-width', '4');
    circle.setAttribute('class', 'pie-segment fancy-segment');
    circle.setAttribute('data-value', String(item.value));
    svg.appendChild(circle);
  } else {
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
      path.setAttribute('fill', `url(#gradient-${item.value})`);
      path.setAttribute('stroke', 'white');
      path.setAttribute('stroke-width', '4');
      path.setAttribute('class', 'pie-segment fancy-segment');
      path.setAttribute('data-value', String(item.value));
      path.style.opacity = '0';
      path.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        path.style.opacity = '1';
      }, index * 100);
      svg.appendChild(path);

      currentAngle += angle;
    });
  }


  chartWrapper.appendChild(svg);

  // Légende
  const legend = document.createElement('div');
  legend.className = 'pie-chart-legend';

  data.forEach(item => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';

    const legendText = document.createElement('div');
    legendText.className = 'legend-text';
    legendText.innerHTML = `${item.emoji} <strong>${item.label}</strong> (${item.count}) - ${item.percentage.toFixed(1)}%`;

    legendItem.appendChild(legendText);
    legend.appendChild(legendItem);
  });

  chartWrapper.appendChild(legend);
  container.appendChild(chartWrapper);

  return container;
}

/**
 * Crée un graphique de progression des émotions dans le temps
 * @param {{ moods: Mood[], period: string, date: Date, startDate?: Date, endDate?: Date, moodOptions: Array<{ value: number, label: string, emotion: string, emoji: string, color: string }> }} params
 * @returns {HTMLElement}
 */
function createProgressionChart({ moods, period, date, startDate, endDate, moodOptions }) {
  const container = document.createElement('div');
  container.className = 'progression-chart-container';

  if (moods.length === 0) {
    return container;
  }

  let dataPoints = [];
  let xLabels = [];
  let xAxisLabel = '';

  if (period === 'day') {
    // Moyenne par heure (0-23)
    const hourlyData = {};
    for (let h = 0; h < 24; h++) {
      hourlyData[h] = [];
    }

    moods.forEach(mood => {
      const moodDate = new Date(mood.datetime);
      const hour = moodDate.getHours();
      hourlyData[hour].push(mood.note);
    });

    for (let h = 0; h < 24; h++) {
      const hourMoods = hourlyData[h];
      const avg = hourMoods.length > 0 
        ? hourMoods.reduce((sum, n) => sum + n, 0) / hourMoods.length 
        : null;
      dataPoints.push(avg);
      xLabels.push(`${String(h).padStart(2, '0')}h`);
    }
    xAxisLabel = 'Heures';
  } else if (period === 'week' && startDate) {
    // Moyenne par jour de la semaine (lundi-dimanche)
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const dailyData = {};
    
    for (let d = 0; d < 7; d++) {
      dailyData[d] = [];
    }

    moods.forEach(mood => {
      const moodDate = new Date(mood.datetime);
      const dayOfWeek = moodDate.getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 = lundi
      dailyData[adjustedDay].push(mood.note);
    });

    for (let d = 0; d < 7; d++) {
      const dayMoods = dailyData[d];
      const avg = dayMoods.length > 0 
        ? dayMoods.reduce((sum, n) => sum + n, 0) / dayMoods.length 
        : null;
      dataPoints.push(avg);
      xLabels.push(dayNames[d]);
    }
    xAxisLabel = 'Jours de la semaine';
  } else if (period === 'month' && startDate && endDate) {
    // Moyenne par jour du mois
    const dailyData = {};
    const daysInMonth = endDate.getDate();
    
    for (let d = 1; d <= daysInMonth; d++) {
      dailyData[d] = [];
    }

    moods.forEach(mood => {
      const moodDate = new Date(mood.datetime);
      const day = moodDate.getDate();
      dailyData[day].push(mood.note);
    });

    for (let d = 1; d <= daysInMonth; d++) {
      const dayMoods = dailyData[d];
      const avg = dayMoods.length > 0 
        ? dayMoods.reduce((sum, n) => sum + n, 0) / dayMoods.length 
        : null;
      dataPoints.push(avg);
      xLabels.push(String(d));
    }
    xAxisLabel = 'Jours du mois';
  } else {
    return container;
  }

  const title = document.createElement('h3');
  title.textContent = 'Progression des émotions';
  title.className = 'chart-title';
  container.appendChild(title);

  const chartWrapper = document.createElement('div');
  chartWrapper.className = 'progression-chart-wrapper';

  const width = Math.max(600, xLabels.length * 40);
  const height = 300;
  const padding = { top: 20, right: 20, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', String(height));
  svg.setAttribute('class', 'progression-chart');

  // Y-axis (notes 1-5)
  const yMin = 1;
  const yMax = 5;
  const ySteps = 4;

  // Grille horizontale
  for (let i = 0; i <= ySteps; i++) {
    const y = padding.top + (chartHeight / ySteps) * i;
    const value = yMax - (yMax - yMin) * (i / ySteps);
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', String(padding.left));
    line.setAttribute('y1', String(y));
    line.setAttribute('x2', String(width - padding.right));
    line.setAttribute('y2', String(y));
    line.setAttribute('stroke', '#e2e8f0');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(padding.left - 10));
    text.setAttribute('y', String(y + 5));
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#718096');
    text.textContent = value.toFixed(1);
    svg.appendChild(text);
  }

  // Y-axis label
  const yAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yAxisLabel.setAttribute('x', String(padding.left - 30));
  yAxisLabel.setAttribute('y', String(height / 2));
  yAxisLabel.setAttribute('text-anchor', 'middle');
  yAxisLabel.setAttribute('font-size', '14');
  yAxisLabel.setAttribute('fill', '#4a5568');
  yAxisLabel.setAttribute('transform', `rotate(-90 ${padding.left - 30} ${height / 2})`);
  yAxisLabel.textContent = 'Note moyenne';
  svg.appendChild(yAxisLabel);

  // Données
  const validDataPoints = dataPoints.filter(d => d !== null);
  if (validDataPoints.length === 0) {
    return container;
  }

  const xStep = xLabels.length > 1 ? chartWidth / (xLabels.length - 1) : 0;
  const yScale = chartHeight / (yMax - yMin);

  // Créer un gradient pour la ligne basé sur les valeurs
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'progression-gradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '100%');
  gradient.setAttribute('y2', '0%');

  dataPoints.forEach((value, index) => {
    if (value === null) return;
    const moodOption = moodOptions.find(opt => {
      const rounded = Math.round(value);
      return opt.value === rounded;
    });
    const color = moodOption ? moodOption.color : '#718096';
    const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop.setAttribute('offset', `${(index / Math.max(1, dataPoints.length - 1)) * 100}%`);
    stop.setAttribute('stop-color', color);
    gradient.appendChild(stop);
  });

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.appendChild(gradient);
  svg.appendChild(defs);

  // Ligne de progression avec gradient
  const pathPoints = dataPoints
    .map((value, index) => {
      if (value === null) return null;
      const x = padding.left + index * xStep;
      const y = padding.top + chartHeight - (value - yMin) * yScale;
      return { x, y };
    })
    .filter(p => p !== null);

  if (pathPoints.length > 0) {
    // Créer des courbes harmonieuses avec des courbes de Bézier cubiques
    let pathData = '';
    
    if (pathPoints.length === 1) {
      // Un seul point : juste un move
      pathData = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
    } else if (pathPoints.length === 2) {
      // Deux points : ligne droite
      pathData = `M ${pathPoints[0].x} ${pathPoints[0].y} L ${pathPoints[1].x} ${pathPoints[1].y}`;
    } else {
      // Plusieurs points : courbes de Bézier cubiques
      pathData = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
      
      for (let i = 0; i < pathPoints.length - 1; i++) {
        const p0 = pathPoints[i];
        const p1 = pathPoints[i + 1];
        
        // Calculer les points de contrôle pour une courbe harmonieuse
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        
        // Utiliser le point précédent et suivant pour créer des courbes naturelles
        let cp1x, cp1y, cp2x, cp2y;
        
        if (i === 0) {
          // Premier segment : point de contrôle basé uniquement sur le suivant
          const p2 = pathPoints[i + 2] || p1;
          const dx2 = p2.x - p0.x;
          const dy2 = p2.y - p0.y;
          cp1x = p0.x + dx * 0.5;
          cp1y = p0.y + dy * 0.5;
          cp2x = p1.x - dx2 * 0.3;
          cp2y = p1.y - dy2 * 0.3;
        } else if (i === pathPoints.length - 2) {
          // Dernier segment : point de contrôle basé sur le précédent
          const pPrev = pathPoints[i - 1];
          const dxPrev = p0.x - pPrev.x;
          const dyPrev = p0.y - pPrev.y;
          cp1x = p0.x + dxPrev * 0.3;
          cp1y = p0.y + dyPrev * 0.3;
          cp2x = p1.x - dx * 0.5;
          cp2y = p1.y - dy * 0.5;
        } else {
          // Segment du milieu : courbe harmonieuse entre les points adjacents
          const pPrev = pathPoints[i - 1];
          const pNext = pathPoints[i + 2];
          const dxPrev = p0.x - pPrev.x;
          const dyPrev = p0.y - pPrev.y;
          const dxNext = pNext.x - p1.x;
          const dyNext = pNext.y - p1.y;
          
          cp1x = p0.x + dxPrev * 0.3;
          cp1y = p0.y + dyPrev * 0.3;
          cp2x = p1.x - dxNext * 0.3;
          cp2y = p1.y - dyNext * 0.3;
        }
        
        pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
      }
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'url(#progression-gradient)');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('class', 'progression-line');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(path);
  }

  // Points avec couleurs correspondant aux moods
  dataPoints.forEach((value, index) => {
    if (value === null) return;
    const x = padding.left + index * xStep;
    const y = padding.top + chartHeight - (value - yMin) * yScale;
    
    const moodOption = moodOptions.find(opt => {
      const rounded = Math.round(value);
      return opt.value === rounded;
    });
    const color = moodOption ? moodOption.color : '#718096';
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', '6');
    circle.setAttribute('fill', color);
    circle.setAttribute('stroke', 'white');
    circle.setAttribute('stroke-width', '3');
    circle.setAttribute('class', 'progression-point');
    svg.appendChild(circle);
  });

  // X-axis labels
  xLabels.forEach((label, index) => {
    const x = padding.left + index * xStep;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', String(x));
    text.setAttribute('y', String(height - padding.bottom + 20));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '11');
    text.setAttribute('fill', '#718096');
    text.textContent = label;
    svg.appendChild(text);
  });

  // X-axis label
  const xAxisLabelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xAxisLabelElement.setAttribute('x', String(width / 2));
  xAxisLabelElement.setAttribute('y', String(height - 10));
  xAxisLabelElement.setAttribute('text-anchor', 'middle');
  xAxisLabelElement.setAttribute('font-size', '14');
  xAxisLabelElement.setAttribute('fill', '#4a5568');
  xAxisLabelElement.textContent = xAxisLabel;
  svg.appendChild(xAxisLabelElement);

  chartWrapper.appendChild(svg);
  container.appendChild(chartWrapper);

  return container;
}

/**
 * @param {{ message: string }} params
 * @returns {void}
 */
export function showCopyMessage({ message }) {
  const existing = document.querySelector('.success-modal');
  if (existing) {
    existing.remove();
  }

  const modal = document.createElement('div');
  modal.className = 'success-modal';
  modal.style.display = 'flex';

  const modalContent = document.createElement('div');
  modalContent.className = 'success-modal-content';

  const closeButton = document.createElement('span');
  closeButton.className = 'success-modal-close';
  closeButton.textContent = '×';
  closeButton.addEventListener('click', () => {
    modal.remove();
  });

  const messageText = document.createElement('div');
  messageText.className = 'success-modal-message';
  messageText.textContent = message;

  const icon = document.createElement('div');
  icon.className = 'success-modal-icon';
  icon.textContent = '✓';

  modalContent.appendChild(closeButton);
  modalContent.appendChild(icon);
  modalContent.appendChild(messageText);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  // Fermer en cliquant sur le fond
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
