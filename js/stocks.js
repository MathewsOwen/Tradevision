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
      const price =
        typeof stock.regularMarketPrice === "number"
          ? stock.regularMarketPrice.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })
          : "--";

      return {
        ticker: stock.symbol,
        price,
        changeValue: percent,
        change: `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`,
        direction: percent >= 0 ? "Alta" : "Baixa"
      };
    });

    const assetUrl = (ticker) => `ativos/ativo.html?symbol=${ticker}`;

    const renderMainRows = (list) =>
      list
        .map(
          (stock) => `
          <tr class="clickable-row" data-url="${assetUrl(stock.ticker)}">
            <td>
              <a class="asset-link" href="${assetUrl(stock.ticker)}">${stock.ticker}</a>
            </td>
            <td>${stock.price}</td>
            <td class="${getChangeClass(stock.change)}">${stock.change}</td>
            <td>
              <span class="status">
                <span class="dot ${getDotClassByChange(stock.change)}"></span>
                ${stock.direction}
              </span>
            </td>
          </tr>
        `
        )
        .join("");

    const renderMiniRows = (list) =>
      list
        .map(
          (stock) => `
          <tr class="clickable-row" data-url="${assetUrl(stock.ticker)}">
            <td>
              <a class="asset-link" href="${assetUrl(stock.ticker)}">${stock.ticker}</a>
            </td>
            <td>${stock.price}</td>
            <td class="${getChangeClass(stock.change)}">${stock.change}</td>
          </tr>
        `
        )
        .join("");

    const positiveStocks = [...stocks]
      .filter((item) => item.changeValue >= 0)
      .sort((a, b) => b.changeValue - a.changeValue);

    const negativeStocks = [...stocks]
      .filter((item) => item.changeValue < 0)
      .sort((a, b) => a.changeValue - b.changeValue);

    if (stocksTable) {
      stocksTable.innerHTML =
        stocks.length > 0
          ? renderMainRows(stocks)
          : createEmptyRow(4, "Nenhuma ação disponível.");
    }

    if (homeStocksTable) {
      homeStocksTable.innerHTML =
        stocks.length > 0
          ? renderMainRows(stocks.slice(0, 4))
          : createEmptyRow(4, "Nenhuma ação disponível.");
    }

    if (topGainersTable) {
      topGainersTable.innerHTML =
        positiveStocks.length > 0
          ? renderMiniRows(positiveStocks.slice(0, 4))
          : createEmptyRow(3, "Sem altas no momento.");
    }

    if (topLosersTable) {
      topLosersTable.innerHTML =
        negativeStocks.length > 0
          ? renderMiniRows(negativeStocks.slice(0, 4))
          : createEmptyRow(3, "Sem quedas no momento.");
    }

    if (topGainerStat) {
      topGainerStat.textContent =
        positiveStocks.length > 0 ? positiveStocks[0].ticker : "--";
    }

    if (topLoserStat) {
      topLoserStat.textContent =
        negativeStocks.length > 0 ? negativeStocks[0].ticker : "--";
    }

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
    if (stocksTable) {
      stocksTable.innerHTML = createEmptyRow(
        4,
        "Não foi possível carregar os dados das ações."
      );
    }

    if (homeStocksTable) {
      homeStocksTable.innerHTML = createEmptyRow(
        4,
        "Não foi possível carregar os dados das ações."
      );
    }

    if (topGainersTable) {
      topGainersTable.innerHTML = createEmptyRow(3, "Erro ao carregar.");
    }

    if (topLosersTable) {
      topLosersTable.innerHTML = createEmptyRow(3, "Erro ao carregar.");
    }

    if (topGainerStat) topGainerStat.textContent = "--";
    if (topLoserStat) topLoserStat.textContent = "--";

    console.error("Erro em renderStocks:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderStocks();
  setInterval(renderStocks, REFRESH_INTERVALS.stocks);
});
