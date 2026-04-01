// ===============================
// HEATMAP - PRONUXFIN
// ===============================

let HEATMAP_STATE = {
  all: [],
  filtered: []
};

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.querySelector('#heatmap-grid');
  const filterInput = document.querySelector('#heatmap-filter-input');
  const refreshButton = document.querySelector('#heatmap-refresh-btn');

  if (!gridContainer || !window.api) {
    return;
  }

  loadHeatmap(gridContainer);

  if (filterInput) {
    filterInput.addEventListener('input', () => {
      applyHeatmapFilter(filterInput.value, gridContainer);
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      loadHeatmap(gridContainer, true);
    });
  }
});

// ===============================
// CARREGAR HEATMAP
// ===============================
async function loadHeatmap(container, forceReload = false) {
  try {
    container.innerHTML = '<div class="loading">Atualizando heatmap...</div>';

    const response = await window.api.getHeatmap();
    const items = response.items || response.data || [];

    if (!Array.isArray(items) || items.length === 0) {
      setEmpty(container, 'Nenhum dado de heatmap encontrado.');
      return;
    }

    HEATMAP_STATE.all = items;
    HEATMAP_STATE.filtered = items;

    renderHeatmap(container, items);
  } catch (error) {
    console.error('[HEATMAP ERROR]', error);
    setError(container, 'Erro ao carregar heatmap.');
  }
}

// ===============================
// FILTRO
// ===============================
function applyHeatmapFilter(term, container) {
  const value = term.toLowerCase().trim();

  if (!value) {
    HEATMAP_STATE.filtered = HEATMAP_STATE.all;
  } else {
    HEATMAP_STATE.filtered = HEATMAP_STATE.all.filter((item) => {
      const symbol = (item.symbol || '').toLowerCase();
      const name = (item.name || '').toLowerCase();

      return symbol.includes(value) || name.includes(value);
    });
  }

  renderHeatmap(container, HEATMAP_STATE.filtered);
}

// ===============================
// RENDER HEATMAP
// ===============================
function renderHeatmap(container, items) {
  if (!Array.isArray(items) || items.length === 0) {
    setEmpty(container, 'Nenhum ativo encontrado para esse filtro.');
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const symbol = item.symbol || '--';
      const name = item.name || 'Ativo';
      const price = item.price ?? '--';
      const changePercent = item.changePercent ?? 0;
      const size = getHeatmapSizeClass(item.marketCap || item.volume || 0);
      const deltaClass = getDeltaClass(changePercent);

      return `
        <a href="${getAssetHref(symbol, 'stock')}" class="heatmap-card ${deltaClass} ${size}">
          <small>${name}</small>
          <strong>${symbol}</strong>
          <span>${typeof price === 'number' ? formatCurrency(price, 'BRL') : price}</span>
          <b>${formatPercent(changePercent)}</b>
        </a>
      `;
    })
    .join('');
}

// ===============================
// TAMANHO DO BLOCO
// ===============================
function getHeatmapSizeClass(value) {
  const number = Number(value);

  if (Number.isNaN(number) || number <= 0) {
    return 'size-md';
  }

  if (number >= 1000000000000) return 'size-xl';
  if (number >= 100000000000) return 'size-lg';
  if (number >= 10000000000) return 'size-md';
  return 'size-sm';
}
