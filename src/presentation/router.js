// @ts-check

/**
 * @typedef {Object} RouteParams
 * @property {string} [page] - Nom de la page
 */

const BASE_PATH = '/moood';

/**
 * Router simple pour gérer la navigation
 * @param {{ deps: ReturnType<import('./compose/compose.js').compose> }} params
 */
export function createRouter({ deps }) {
  /**
   * @param {string} path
   * @returns {void}
   */
  function navigate(path) {
    // S'assurer que le path commence par / et ajouter le base path
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const fullPath = `${BASE_PATH}${normalizedPath}`;
    window.history.pushState({}, '', fullPath);
    handleRoute();
  }

  /**
   * @returns {Promise<void>}
   */
  async function handleRoute() {
    // Extraire le path en retirant le base path
    let fullPath = window.location.pathname;
    
    // Si l'URL ne contient pas le base path, rediriger vers la version avec base path
    if (!fullPath.startsWith(BASE_PATH)) {
      // Rediriger vers /moood + le path actuel (ou /moood/ si racine)
      const targetPath = fullPath === '/' || fullPath === '' ? '/' : fullPath;
      const newFullPath = `${BASE_PATH}${targetPath}`;
      window.history.replaceState({}, '', newFullPath);
      fullPath = newFullPath;
    }
    
    const path = fullPath.replace(BASE_PATH, '') || '/';
    const root = document.getElementById('app');

    if (!root) {
      return;
    }

    root.innerHTML = '';

    if (path === '/' || path === '/home') {
      const { renderHomePage } = await import('./pages/home/index.js');
      renderHomePage({ root, params: {}, deps });
    } else if (path === '/list') {
      const { renderListPage } = await import('./pages/list/index.js');
      renderListPage({ root, params: {}, deps });
    } else if (path === '/bilans') {
      const { renderBilansPage } = await import('./pages/bilans/index.js');
      renderBilansPage({ root, params: {}, deps });
    } else {
      navigate('/');
    }
  }

  window.addEventListener('popstate', handleRoute);
  handleRoute();

  // Expose router globally pour la navigation depuis les pages
  /** @type {any} */ (window).router = { navigate };

  return {
    navigate
  };
}
