// @ts-check

/**
 * @typedef {Object} RouteParams
 * @property {string} [page] - Nom de la page
 */

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
    window.history.pushState({}, '', path);
    handleRoute();
  }

  /**
   * @returns {Promise<void>}
   */
  async function handleRoute() {
    const path = window.location.pathname.replace('/moood', '') || '/';
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
