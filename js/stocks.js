async function renderStocks() {
  const stocksTable = document.getElementById("stocksTable");
  const homeStocksTable = document.getElementById("homeStocksTable");
  const topGainersTable = document.getElementById("topGainersTable");
  const topLosersTable = document.getElementById("topLosersTable");
  const topGainerStat = document.getElementById("topGainerStat");
  const topLoserStat = document.getElementById("topLoserStat");
  const stocksTickerTrack = document.getElementById("stocksTickerTrack");

  try {
    const apiStocks = await fetchStocks();

    const stocks = apiStocks.map((stock) => {
      const percent = Number(stock.regularMarketChangePercent || 0);
      const formattedChange = `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`;

      return {
        ticker: stock.symbol,
        price:
          typeof stock.regularMarketPrice === "number"
            ? stock.regularMarketPrice.toLocaleString("pt-BR")
            : "--",
        change: formattedChange,
        direction: percent >= 0 ? "Alta" : "Baixa"
      };
    });

    const assetUrl = (ticker) => `ativos/ativo.html?symbol=${ticker}`;

    const renderMainRows = (list) =>
      list
        .map((stock) => `
          <tr class="clickable-row" data-url="${assetUrl(stock.ticker)}">
            <td><a class="asset-link" href="${assetUrl(stock.ticker)}">${stock.ticker}</a></td>
            <td>${stock.price}</td>
            <td class="${getChangeClass(stock.change)}">${stock.change}</td>
            <td>
              <span class="status">
                <span class="dot ${getDotClassByChange(stock.change)}"></span>
                ${stock.direction}
              </span>
            </td>
          </tr>
        `)
        .join("");

    const renderMiniRows = (list) =>
      list
        .map((stock) => `
          <tr class="clickable-row" data-url="${assetUrl(stock.ticker)}">
            <td><a class="asset-link" href="${assetUrl(stock.ticker)}">${stock.ticker}</a></td>
            <td>${stock.price}</td>
            <td class="${getChangeClass(stock.change)}">${stock.change}</td>
          </tr>
        `)
        .join("");

    const positiveStocks = stocks.filter((item) => item.change.startsWith("+"));
    const negativeStocks = stocks.filter((item) => item.change.startsWith("-"));

    positiveStocks.sort(
      (a, b) =>
        parseFloat(b.change.replace("%", "").replace(",", ".")) -
        parseFloat(a.change.replace("%", "").replace(",", "."))
    );

    negativeStocks.sort(
      (a, b) =>
        parseFloat(a.change.replace("%", "").replace(",", ".")) -
        parseFloat(b.change.replace("%", "").replace(",", "."))
    );

    if (stocksTable) stocksTable.innerHTML = renderMainRows(stocks);
    if (homeStocksTable) homeStocksTable.innerHTML = renderMainRows(stocks.slice(0, 5));
    if (topGainersTable) topGainersTable.innerHTML = renderMiniRows(positiveStocks.slice(0, 4));
    if (topLosersTable) topLosersTable.innerHTML = renderMiniRows(negativeStocks.slice(0, 4));

    if (topGainerStat && positiveStocks.length > 0) topGainerStat.textContent = positiveStocks[0].ticker;
    if (topLoserStat && negativeStocks.length > 0) topLoserStat.textContent = negativeStocks[0].ticker;

    if (stocksTickerTrack) {
      const tickerItems = stocks
        .map(
          (stock) => `
          <span class="ticker-item">
            <strong>${stock.ticker}</strong>
            <span>${stock.price}</span>
            <span class="${getChangeClass(stock.change)}">${stock.change}</span>
          </span>
        `
        )
        .join("");

      stocksTickerTrack.innerHTML = tickerItems + tickerItems;
    }

    bindClickableRows();
  } catch (error) {
    const failRow = createEmptyRow(4, "Não foi possível carregar os dados das ações.");
    if (stocksTable) stocksTable.innerHTML = failRow;
    if (homeStocksTable) homeStocksTable.innerHTML = failRow;
    if (topGainersTable) topGainersTable.innerHTML = createEmptyRow(3, "Erro ao carregar.");
    if (topLosersTable) topLosersTable.innerHTML = createEmptyRow(3, "Erro ao carregar.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderStocks();
  setInterval(renderStocks, REFRESH_INTERVALS.stocks);
});
