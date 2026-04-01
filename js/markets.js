// ===============================
// MERCADOS GLOBAIS - PRONUXFIN
// ===============================

let MARKETS_STATE = {
  all: [],
  filtered: []
};

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const tableContainer = document.querySelector('#markets-table');
  const filterInput = document.querySelector('#markets-filter-input');
  const refreshButton = document.querySelector('#markets-refresh-btn');

  if (!tableContainer || !window.api) {
    return;
  }

  loadMarkets(tableContainer);

  if (filterInput) {
    filterInput.addEventListener('input', () => {
      applyMarketsFilter(filterInput.value, tableContainer);
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      loadMarkets(tableContainer, true);
    });
  }
});

// ===============================
// CARREGAR MERCADOS
// ===============================
async function loadMarkets(container, forceReload = false) {
  try {
    setLoading(container, 'Atualizando mercados globais...');

    const response = await window.api.getGlobalMarkets();
    const rows = response.items || response.data || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      setEmpty(container, 'Nenhum dado global encontrado.');
      return;
    }

    MARKETS_STATE.all = rows;
    MARKETS_STATE.filtered = rows;

    renderMarketsTable(container, rows);
  } catch (error) {
    console.error('[MARKETS ERROR]', error);
    setError(container, 'Erro ao carregar mercados globais.');
  }
}

// ===============================
// FILTRO
// ===============================
function applyMarketsFilter(term, container) {
  const value = term.toLowerCase().trim();

  if (!value) {
    MARKETS_STATE.filtered = MARKETS_STATE.all;
  } else {
    MARKETS_STATE.filtered = MARKETS_STATE.all.filter((item) => {
      const symbol = (item.symbol || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      const category = (item.category || '').toLowerCase();

      return (
        symbol.includes(value) ||
        name.includes(value) ||
        category.includes(value)
      );
    });
  }

  renderMarketsTable(container, MARKETS_STATE.filtered);
}

// ===============================
// RENDER TABELA
// ===============================
function renderMarketsTable(container, rows) {
  renderTable(
    container,
    [
      {
        label: 'Ativo',
        key: 'symbol',
        render: (row) => row.symbol || '--'
      },
      {
        label: 'Nome',
        key: 'name',
        render: (row) => row.name || '--'
      },
      {
        label: 'Categoria',
        key: 'category',
        render: (row) => row.category || '--'
      },
      {
        label: 'Preço',
        key: 'price',
        render: (row) => {
          const currency = row.currency || 'USD';
          return formatCurrency(row.price, currency);
        }
      },
      {
        label: 'Variação',
        key: 'changePercent',
        render: (row) => formatDeltaHTML(row.changePercent)
      },
      {
        label: 'Última atualização',
        key: 'updatedAt',
        render: (row) => row.updatedAt || row.lastUpdate || '--'
      }
    ],
    rows
  );
}
