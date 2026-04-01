// ===============================
// AÇÕES - PRONUXFIN
// ===============================

let STOCKS_STATE = {
  all: [],
  filtered: []
};

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const tableContainer = document.querySelector('#stocks-table');
  const filterInput = document.querySelector('#stocks-filter-input');
  const refreshButton = document.querySelector('#stocks-refresh-btn');

  if (!tableContainer || !window.api) {
    return;
  }

  loadStocks(tableContainer);

  // filtro em tempo real
  if (filterInput) {
    filterInput.addEventListener('input', () => {
      applyFilter(filterInput.value, tableContainer);
    });
  }

  // botão atualizar
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      loadStocks(tableContainer, true);
    });
  }
});

// ===============================
// CARREGAR AÇÕES
// ===============================
async function loadStocks(container, forceReload = false) {
  try {
    setLoading(container, 'Atualizando dados da B3...');

    const response = await window.api.getStocksList(1, 50);

    const rows = response.items || response.data || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      setEmpty(container, 'Nenhuma ação encontrada.');
      return;
    }

    // salvar estado
    STOCKS_STATE.all = rows;
    STOCKS_STATE.filtered = rows;

    renderStocksTable(container, rows);

  } catch (error) {
    console.error('[STOCKS ERROR]', error);
    setError(container, 'Erro ao carregar ações.');
  }
}

// ===============================
// FILTRO
// ===============================
function applyFilter(term, container) {
  const value = term.toLowerCase().trim();

  if (!value) {
    STOCKS_STATE.filtered = STOCKS_STATE.all;
  } else {
    STOCKS_STATE.filtered = STOCKS_STATE.all.filter((item) => {
      const symbol = (item.symbol || '').toLowerCase();
      const name = (item.name || '').toLowerCase();

      return symbol.includes(value) || name.includes(value);
    });
  }

  renderStocksTable(container, STOCKS_STATE.filtered);
}

// ===============================
// RENDER TABELA
// ===============================
function renderStocksTable(container, rows) {
  renderTable(
    container,
    [
      {
        label: 'Ticker',
        key: 'symbol',
        render: (row) => createAssetRowLink(row.symbol, 'stock')
      },
      {
        label: 'Empresa',
        key: 'name',
        render: (row) => row.name || '--'
      },
      {
        label: 'Preço',
        key: 'price',
        render: (row) => formatCurrency(row.price, 'BRL')
      },
      {
        label: 'Variação',
        key: 'changePercent',
        render: (row) => formatDeltaHTML(row.changePercent)
      },
      {
        label: 'Volume',
        key: 'volume',
        render: (row) => formatCompact(row.volume)
      },
      {
        label: 'Market Cap',
        key: 'marketCap',
        render: (row) => formatCompact(row.marketCap)
      }
    ],
    rows
  );
}
