document.addEventListener('DOMContentLoaded', async () => {
  const overviewStrip = document.querySelector('#overview-strip');
  const homeStocks = document.querySelector('#home-stocks');
  const homeRanking = document.querySelector('#home-ranking');
  const homeNews = document.querySelector('#home-news');

  try {
    const overview = await api.getOverview();
    const items = overview.items || overview.data || [];
    overviewStrip.innerHTML = items.slice(0, 4).map((item) => `
      <div class="quote-item">
        <h4>${item.name || item.symbol}</h4>
        <div class="value">${formatNumber(item.price, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <p class="delta ${getDeltaClass(item.changePercent)}">${formatPercent(item.changePercent)}</p>
      </div>
    `).join('');
  } catch (error) {
    setState(overviewStrip, 'error', 'Não foi possível carregar a visão geral do mercado.');
  }

  try {
    const stocks = await api.getStocks();
    const rows = stocks.items || stocks.data || [];
    renderTable(homeStocks, [
      { label: 'Ticker', key: 'symbol', render: (row) => createAssetRowLink(row.symbol, 'stock') },
      { label: 'Nome', key: 'name' },
      { label: 'Preço', key: 'price', render: (row) => formatCurrency(row.price, 'BRL') },
      { label: 'Variação', key: 'changePercent', render: (row) => `<span class="delta ${getDeltaClass(row.changePercent)}">${formatPercent(row.changePercent)}</span>` }
    ], rows);
  } catch (error) {
    setState(homeStocks, 'error', 'Não foi possível carregar os destaques da B3.');
  }

  try {
    const ranking = await api.getRanking(6);
    const items = ranking.items || ranking.data || [];
    homeRanking.innerHTML = items.map((item, index) => `
      <div class="asset-list-item">
        <small>Posição ${index + 1}</small>
        <strong>${createAssetRowLink(item.symbol, item.type || 'stock')}</strong>
        <span class="card-subtitle">${item.name || 'Ativo monitorado'} • <span class="delta ${getDeltaClass(item.changePercent)}">${formatPercent(item.changePercent)}</span></span>
      </div>
    `).join('');
  } catch (error) {
    setState(homeRanking, 'error', 'Falha ao carregar ranking.');
