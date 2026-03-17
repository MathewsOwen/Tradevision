let rankingRenderInProgress = false;

async function renderRankingPage() {
  if (rankingRenderInProgress) return;
  rankingRenderInProgress = true;

  const gainersTable = document.getElementById("rankingGainersTable");
  const losersTable = document.getElementById("rankingLosersTable");
  const stocksTable = document.getElementById("rankingStocksTable");
  const cryptoTable = document.getElementById("rankingCryptoTable");

  const topGainer = document.getElementById("rankingTopGainer");
  const topLoser = document.getElementById("rankingTopLoser");
  const topCrypto = document.getElementById("rankingTopCrypto");

  if (!gainersTable || !losersTable || !stocksTable || !cryptoTable) {
    rankingRenderInProgress = false;
    return;
  }

  gainersTable.innerHTML = createEmptyRow(3, "Carregando ranking...");
  losersTable.innerHTML = createEmptyRow(3, "Carregando ranking...");
  stocksTable.innerHTML = createEmptyRow(4, "Carregando ações...");
  cryptoTable.innerHTML = createEmptyRow(3, "Carregando criptomoedas...");

  try {
    const [stocksApi, cryptoApi] = await Promise.all([
      fetchStocks(),
      fetchCryptoPrices()
    ]);

    const assetBase = getAssetPageBase();

    const stocks = stocksApi
      .filter((stock) => stock && stock.symbol)
      .map((stock) => {
        const percent = Number(stock.regularMarketChangePercent ?? 0);
        const rawPrice = Number(stock.regularMarketPrice);

        return {
          symbol: String(stock.symbol).toUpperCase(),
          price: Number.isFinite(rawPrice)
            ? rawPrice.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : "--",
          change: Number.isFinite(percent) ? percent : 0,
          changeText: `${percent >= 0 ? "+" : ""}${(Number.isFinite(percent) ? percent : 0).toFixed(2)}%`,
          direction: percent > 0 ? "Alta" : percent < 0 ? "Baixa" : "Neutro"
        };
      })
      .sort((a, b) => a.symbol.localeCompare(b.symbol, "pt-BR"));

    const cryptos = [
      { name: "Bitcoin", symbol: "BTC", price: cryptoApi?.bitcoin?.usd ?? null },
      { name: "Ethereum", symbol: "ETH", price: cryptoApi?.ethereum?.usd ?? null },
      { name: "Solana", symbol: "SOL", price: cryptoApi?.solana?.usd ?? null },
      { name: "BNB", symbol: "BNB", price: cryptoApi?.binancecoin?.usd ?? null },
      { name: "XRP", symbol: "XRP", price: cryptoApi?.ripple?.usd ?? null }
    ];

    const positiveStocks = [...stocks]
      .filter((item) => item.change > 0)
      .sort((a, b) => b.change - a.change);

    const negativeStocks = [...stocks]
      .filter((item) => item.change < 0)
      .sort((a, b) => a.change - b.change);

    const assetUrl = (symbol) =>
      `${assetBase}?symbol=${encodeURIComponent(symbol)}`;

    const stockMainRows = (list) =>
      list
        .map(
          (item) => `
            <tr class="clickable-row" data-url="${assetUrl(item.symbol)}">
              <td>
                <a class="asset-link" href="${assetUrl(item.symbol)}">${escapeHtml(item.symbol)}</a>
              </td>
              <td>${item.price}</td>
              <td class="${getChangeClass(item.changeText)}">${item.changeText}</td>
              <td>
                <span class="status">
                  <span class="dot ${getDotClassByChange(item.changeText)}"></span>
                  ${item.direction}
                </span>
              </td>
            </tr>
          `
        )
        .join("");

    const stockMiniRows = (list) =>
      list
        .map(
          (item) => `
            <tr class="clickable-row" data-url="${assetUrl(item.symbol)}">
              <td>
                <a class="asset-link" href="${assetUrl(item.symbol)}">${escapeHtml(item.symbol)}</a>
              </td>
              <td>${item.price}</td>
              <td class="${getChangeClass(item.changeText)}">${item.changeText}</td>
            </tr>
          `
        )
        .join("");

    const cryptoRows = cryptos
      .map(
        (item) => `
          <tr class="clickable-row" data-url="${assetUrl(item.symbol)}">
            <td>
              <a class="asset-link" href="${assetUrl(item.symbol)}">${escapeHtml(item.name)}</a>
            </td>
            <td>${item.price !== null ? formatUsd(item.price) : "--"}</td>
            <td>
              <span class="status">
                <span class="dot blue"></span>
                Monitorando
              </span>
            </td>
          </tr>
        `
      )
      .join("");

    gainersTable.innerHTML =
      positiveStocks.length > 0
        ? stockMiniRows(positiveStocks.slice(0, 5))
        : createEmptyRow(3, "Sem altas disponíveis.");

    losersTable.innerHTML =
      negativeStocks.length > 0
        ? stockMiniRows(negativeStocks.slice(0, 5))
        : createEmptyRow(3, "Sem quedas disponíveis.");

    stocksTable.innerHTML =
      stocks.length > 0
        ? stockMainRows(stocks)
        : createEmptyRow(4, "Sem ações disponíveis.");

    cryptoTable.innerHTML =
      cryptos.length > 0
        ? cryptoRows
        : createEmptyRow(3, "Sem criptomoedas disponíveis.");

    if (topGainer) {
      topGainer.textContent =
        positiveStocks.length > 0 ? positiveStocks[0].symbol : "--";
    }

    if (topLoser) {
      topLoser.textContent =
        negativeStocks.length > 0 ? negativeStocks[0].symbol : "--";
    }

    if (topCrypto) {
      topCrypto.textContent = cryptos.length > 0 ? "BTC" : "--";
    }

    bindClickableRows();
  } catch (error) {
    gainersTable.innerHTML = createEmptyRow(3, "Erro ao carregar ranking.");
    losersTable.innerHTML = createEmptyRow(3, "Erro ao carregar ranking.");
    stocksTable.innerHTML = createEmptyRow(4, "Erro ao carregar ações.");
    cryptoTable.innerHTML = createEmptyRow(3, "Erro ao carregar criptomoedas.");

    if (topGainer) topGainer.textContent = "--";
    if (topLoser) topLoser.textContent = "--";
    if (topCrypto) topCrypto.textContent = "--";

    console.error("[Pronuxfin] Erro em renderRankingPage:", error);
  } finally {
    rankingRenderInProgress = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderRankingPage();

  setInterval(() => {
    renderRankingPage();
  }, REFRESH_INTERVALS.stocks);
});
