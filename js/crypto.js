// ===============================
// CRIPTO - PRONUXFIN
// ===============================

let CRYPTO_STATE = {
  all: [],
  filtered: []
};

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const tableContainer = document.querySelector('#crypto-table');
  const filterInput = document.querySelector('#crypto-filter-input');
  const refreshButton = document.querySelector('#crypto-refresh-btn');

  if (!tableContainer || !window.api) {
    return;
  }

  loadCryptos(tableContainer);

  if (filterInput) {
    filterInput.addEventListener('input', () => {
      applyCryptoFilter(filterInput.value, tableContainer);
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      loadCryptos(tableContainer, true);
    });
  }
});

// ===============================
// CARREGAR CRIPTOS
// ===============================
async function loadCryptos(container, forceReload = false) {
  try {
    setLoading(container, 'Atualizando mercado cripto...');

    const response = await window.api.getCryptos(50);
    const rows = response.items || response.data || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      setEmpty(container, 'Nenhuma criptomoeda encontrada.');
      return;
    }

    CRYPTO_STATE.all = rows;
    CRYPTO_STATE.filtered = rows;

    renderCryptoTable(container, rows);
  } catch (error) {
    console.error('[CRYPTO ERROR]', error);
    setError(container, 'Erro ao carregar criptomoedas.');
  }
}

// ===============================
// FILTRO
// ===============================
function applyCryptoFilter(term, container) {
  const value = term.toLowerCase().trim();

  if (!value) {
    CRYPTO_STATE.filtered = CRYPTO_STATE.all;
  } else {
    CRYPTO_STATE.filtered = CRYPTO_STATE.all.filter((item) => {
      const symbol = (item.symbol || '').toLowerCase();
      const name = (item.name || '').toLowerCase();

      return symbol.includes(value) || name.includes(value);
    });
  }

  renderCryptoTable(container, CRYPTO_STATE.filtered);
}

// ===============================
// RENDER TABELA
// ===============================
function renderCryptoTable(container, rows) {
  renderTable(
    container,
    [
      {
        label: 'Ativo',
        key: 'symbol',
        render: (row) => createAssetRowLink(row.symbol, 'crypto')
      },
      {
        label: 'Nome',
        key: 'name',
        render: (row) => row.name || '--'
      },
      {
        label: 'Preço',
        key: 'price',
        render: (row) => formatCurrency(row.price, 'USD')
      },
      {
        label: 'Variação 24h',
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
