// ===============================
// RADAR ESTRATÉGICO - PRONUXFIN
// ===============================

let RADAR_STATE = {
  all: [],
  filtered: []
};

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.querySelector('#radar-grid');
  const filterInput = document.querySelector('#radar-filter-input');
  const refreshButton = document.querySelector('#radar-refresh-btn');

  if (!gridContainer || !window.api) {
    return;
  }

  loadRadar(gridContainer);

  if (filterInput) {
    filterInput.addEventListener('input', () => {
      applyRadarFilter(filterInput.value, gridContainer);
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      loadRadar(gridContainer, true);
    });
  }
});

// ===============================
// CARREGAR RADAR
// ===============================
async function loadRadar(container, forceReload = false) {
  try {
    container.innerHTML = '<div class="loading">Atualizando radar...</div>';

    const response = await window.api.getRadar();
    const items = response.items || response.data || [];

    if (!Array.isArray(items) || items.length === 0) {
      setEmpty(container, 'Nenhum evento encontrado no radar.');
      return;
    }

    RADAR_STATE.all = items;
    RADAR_STATE.filtered = items;

    renderRadarGrid(container, items);
  } catch (error) {
    console.error('[RADAR ERROR]', error);
    setError(container, 'Erro ao carregar radar estratégico.');
  }
}

// ===============================
// FILTRO
// ===============================
function applyRadarFilter(term, container) {
  const value = term.toLowerCase().trim();

  if (!value) {
    RADAR_STATE.filtered = RADAR_STATE.all;
  } else {
    RADAR_STATE.filtered = RADAR_STATE.all.filter((item) => {
      const title = (item.title || item.event || '').toLowerCase();
      const country = (item.country || '').toLowerCase();
      const symbol = (item.symbol || '').toLowerCase();
      const category = (item.category || item.type || '').toLowerCase();

      return (
        title.includes(value) ||
        country.includes(value) ||
        symbol.includes(value) ||
        category.includes(value)
      );
    });
  }

  renderRadarGrid(container, RADAR_STATE.filtered);
}

// ===============================
// RENDER RADAR
// ===============================
function renderRadarGrid(container, items) {
  if (!Array.isArray(items) || items.length === 0) {
    setEmpty(container, 'Nenhum evento encontrado para esse filtro.');
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const title = item.title || item.event || 'Evento monitorado';
      const date = item.date || item.time || '--';
      const country = item.country || 'Global';
      const impact = item.impact || 'Moderado';
      const category = item.category || item.type || 'Mercado';
      const symbol = item.symbol ? ` • ${item.symbol}` : '';
      const description = item.description || item.summary || 'Evento em acompanhamento pela plataforma.';

      return `
        <div class="event-item">
          <small>${date} • ${country} • ${category}${symbol}</small>
          <strong>${title}</strong>
          <span class="card-subtitle">${description}</span>
          <span class="delta ${getImpactClass(impact)}">Impacto: ${impact}</span>
        </div>
      `;
    })
    .join('');
}

// ===============================
// CLASSE VISUAL DE IMPACTO
// ===============================
function getImpactClass(impact) {
  const normalized = String(impact || '').toLowerCase();

  if (normalized.includes('alto')) {
    return 'up';
  }

  if (normalized.includes('baixo')) {
    return 'flat';
  }

  return 'down';
}
