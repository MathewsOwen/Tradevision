// ===============================
// NOTÍCIAS - PRONUXFIN
// ===============================

let NEWS_STATE = {
  all: [],
  filtered: []
};

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.querySelector('#news-grid');
  const filterInput = document.querySelector('#news-filter-input');
  const refreshButton = document.querySelector('#news-refresh-btn');

  if (!gridContainer || !window.api) {
    return;
  }

  loadNews(gridContainer);

  if (filterInput) {
    filterInput.addEventListener('input', () => {
      applyNewsFilter(filterInput.value, gridContainer);
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      loadNews(gridContainer, true);
    });
  }
});

// ===============================
// CARREGAR NOTÍCIAS
// ===============================
async function loadNews(container, forceReload = false) {
  try {
    container.innerHTML = '<div class="loading">Atualizando notícias...</div>';

    const response = await window.api.getNews(18);
    const items = response.items || response.data || [];

    if (!Array.isArray(items) || items.length === 0) {
      setEmpty(container, 'Nenhuma notícia encontrada.');
      return;
    }

    NEWS_STATE.all = items;
    NEWS_STATE.filtered = items;

    renderNewsGrid(container, items);
  } catch (error) {
    console.error('[NEWS ERROR]', error);
    setError(container, 'Erro ao carregar notícias.');
  }
}

// ===============================
// FILTRO
// ===============================
function applyNewsFilter(term, container) {
  const value = term.toLowerCase().trim();

  if (!value) {
    NEWS_STATE.filtered = NEWS_STATE.all;
  } else {
    NEWS_STATE.filtered = NEWS_STATE.all.filter((item) => {
      const title = (item.title || '').toLowerCase();
      const source = (item.source || item.site || '').toLowerCase();
      const summary = (item.summary || item.description || '').toLowerCase();

      return (
        title.includes(value) ||
        source.includes(value) ||
        summary.includes(value)
      );
    });
  }

  renderNewsGrid(container, NEWS_STATE.filtered);
}

// ===============================
// RENDER GRID
// ===============================
function renderNewsGrid(container, items) {
  if (!Array.isArray(items) || items.length === 0) {
    setEmpty(container, 'Nenhuma notícia encontrada para esse filtro.');
    return;
  }

  container.innerHTML = items
    .map((item) => createNewsItem(item))
    .join('');
}
