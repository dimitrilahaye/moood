// @ts-check

/**
 * Crée le header de l'application avec le logo, le menu et le lien GitHub
 * @param {{ currentPage?: string }} params
 * @returns {HTMLElement}
 */
export function createHeader({ currentPage = 'home' }) {
  const header = document.createElement('header');
  header.className = 'app-header';

  const headerContent = document.createElement('div');
  headerContent.className = 'app-header-content';

  const logoContainer = document.createElement('div');
  logoContainer.className = 'header-logo';

  const logo = document.createElement('span');
  logo.className = 'app-logo';
  logo.textContent = 'moood';

  logoContainer.appendChild(logo);
  headerContent.appendChild(logoContainer);

  // Navigation intégrée dans le header (visible sur tablette+)
  const headerNav = document.createElement('nav');
  headerNav.className = 'header-navigation';

  const listLink = document.createElement('a');
  listLink.href = '#';
  listLink.textContent = 'Mes Moods';
  listLink.className = `header-nav-link ${currentPage === 'list' ? 'active' : ''}`;

  const homeLink = document.createElement('a');
  homeLink.href = '#';
  homeLink.className = `header-nav-link header-nav-link-cta ${currentPage === 'home' ? 'active' : ''}`;
  const plusIcon = document.createElement('span');
  plusIcon.textContent = '+';
  plusIcon.className = 'header-nav-cta-icon';
  homeLink.appendChild(plusIcon);

  const bilansLink = document.createElement('a');
  bilansLink.href = '#';
  bilansLink.textContent = 'Bilans';
  bilansLink.className = `header-nav-link ${currentPage === 'bilans' ? 'active' : ''}`;

  headerNav.appendChild(listLink);
  headerNav.appendChild(homeLink);
  headerNav.appendChild(bilansLink);
  headerContent.appendChild(headerNav);

  const rightSection = document.createElement('div');
  rightSection.className = 'header-right';

  const githubLink = document.createElement('a');
  githubLink.href = 'https://github.com/dimitrilahaye/moood';
  githubLink.target = '_blank';
  githubLink.rel = 'noopener noreferrer';
  githubLink.className = 'github-link';
  githubLink.setAttribute('aria-label', 'Voir le projet sur GitHub');

  const githubIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  githubIcon.setAttribute('width', '24');
  githubIcon.setAttribute('height', '24');
  githubIcon.setAttribute('viewBox', '0 0 24 24');
  githubIcon.setAttribute('fill', 'none');
  githubIcon.setAttribute('stroke', 'currentColor');
  githubIcon.setAttribute('stroke-width', '2');
  githubIcon.setAttribute('stroke-linecap', 'round');
  githubIcon.setAttribute('stroke-linejoin', 'round');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22');

  githubIcon.appendChild(path);
  githubLink.appendChild(githubIcon);
  rightSection.appendChild(githubLink);
  headerContent.appendChild(rightSection);

  header.appendChild(headerContent);

  return header;
}
