// ===============================
// HOME - PRONUXFIN
// ===============================
document.addEventListener('DOMContentLoaded', async () => {
  const overviewStrip = document.querySelector('#overview-strip');
  const homeStocks = document.querySelector('#home-stocks');
  const homeRanking = document.querySelector('#home-ranking');
  const homeNews = document.querySelector('#home-news');

  await Promise.allSettled([
    loadOverview(overviewStrip),
    loadHomeStocks(homeStocks),
    loadHomeRanking(homeRanking),
    loadHomeNews(homeNews)
  ]);
});

// ===============================
// VISÃO GERAL DO MERCADO
// ===============================
async function loadOverview(container) {
  if (!container || !window.api) {
    return;
  }

  try {
    const response = await window.api.getOverview();
    const items = response.items || response.data || [];

    if (!Array.isArray(items) || items.length === 0) {
      setEmpty(container, 'Nenhum dado disponível para visão geral.');
      return;
    }

    container.innerHTML = items
      .slice(0, 4)
      .map((item) => {
        const name = item.name || item.symbol || 'Ativo';
        const price = item.price ?? item.value ?? 0;
        const changePercent = item.changePercent ?? item.variation ?? 0;

        return `
          <div class="quote-item">
            <h4>${name}</h4>
            <div class="value">${formatNumber(price, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</div>
            <p class="delta ${getDeltaClass(changePercent)}">
              ${formatPercent(changePercent)}
            </p>
          </div>
        `;
      })
      .join('');
  } catch (error) {
    console.error('[HOME OVERVIEW ERROR]', error);
    setError(container, 'Não foi possível carregar a visão geral do mercado.');
  }
}

// ===============================
// DESTAQUES DA B3
// ===============================
async function loadHomeStocks(container) {
  if (!container || !window.api) {
    return;
  }

  try {
    setLoading(container, 'Carregando destaques da B3...');

    const response = await window.api.getStocks();
    const rows = response.items || response.data || [];

    renderTable(
      container,
      [
        {
          label: 'Ticker',
          key: 'symbol',
          render: (row) => createAssetRowLink(row.symbol, 'stock')
        },
        {
          label: 'Nome',
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
        }
      ],
      rows
    );
  } catch (error) {
    console.error('[HOME STOCKS ERROR]', error);
    setError(container, 'Não foi possível carregar os destaques da B3.');
  }
}

// ===============================
// RANKING DA HOME
// ===============================
async function loadHomeRanking(container) {
  if (!container || !window.api) {
    return;
  }

  try {
    container.innerHTML = '<div class="loading">Carregando ranking...</div>';

    const response = await window.api.getRanking(6);
    const items = response.items || response.data || [];

    if (!Array.isArray(items) || items.length === 0) {
      setEmpty(container, 'Nenhum ranking disponível no momento.');
      return;
    }

    container.innerHTML = items
      .map((item, index) => {
        const symbol = item.symbol || '--';
        const type = item.type || 'stock';
        const name = item.name || 'Ativo monitorado';
        const changePercent = item.changePercent ?? 0;

        return `
          <div class="asset-list-item">
            <small>Posição ${index + 1}</small>
            <strong>${createAssetRowLink(symbol, type)}</strong>
            <span class="card-subtitle">
              ${name} • 
              <span class="delta ${getDeltaClass(changePercent)}">
                ${formatPercent(changePercent)}
              </span>
            </span>
          </div>
        `;
      })
      .join('');
  } catch (error) {
    console.error('[HOME RANKING ERROR]', error);
    setError(container, 'Falha ao carregar ranking.');
  }
}

// ===============================
// NOTÍCIAS DA HOME
// ===============================
async function loadHomeNews(container) {
  if (!container || !window.api) {
    return;
  }

  try {
    container.innerHTML = '<div class="loading">Carregando notícias...</div>';

    const response = await window.api.getNews(6);
    const items = response.items || response.data || [];

    if (!Array.isArray(items) || items.length === 0) {
      setEmpty(container, 'Nenhuma notícia disponível no momento.');
      return;
    }

    container.innerHTML = items
      .slice(0, 6)
      .map((item) => createNewsItem(item))
      .join('');
  } catch (error) {
    console.error('[HOME NEWS ERROR]', error);
    setError(container, 'Não foi possível carregar as notícias.');
  }
}
