let marketsRenderInProgress = false;
let marketChartInitialized = false;

const MARKET_OVERVIEW_DATA = [
  { symbol: "IBOVESPA", price: "128.450", change: "+0,84%" },
  { symbol: "S&P 500", price: "5.210", change: "+0,42%" },
  { symbol: "NASDAQ", price: "18.200", change: "+0,67%" },
  { symbol: "USD/BRL", price: "5,02", change: "-0,11%" },
  { symbol: "OURO", price: "2.150", change: "+0,23%" },
  { symbol: "PETRÓLEO", price: "78,40", change: "+0,31%" }
];

const FOREX_DATA = [
  { pair: "USD/BRL", price: "5,02", change: "-0,11%" },
  { pair: "EUR/USD", price: "1,09", change: "+0,08%" },
  { pair: "GBP/USD", price: "1,27", change: "+0,05%" },
  { pair: "USD/JPY", price: "148,20", change: "-0,14%" }
];

const COMMODITIES_DATA = [
  { asset: "OURO", price: "2.150", change: "+0,23%" },
  { asset: "PRATA", price: "24,80", change: "+0,18%" },
  { asset: "PETRÓLEO WTI", price: "78,40", change: "+0,31%" },
  { asset: "GÁS NATURAL", price: "2,10", change: "-0,26%" }
];

function getDirectionLabel(change) {
  const normalized = normalizeChangeValue(change);

  if (normalized === "+") return "Alta";
  if (normalized === "-") return "Baixa";
  return "Neutro";
}

function renderMarketOverviewRows(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return createEmptyRow(4, "Nenhum dado de mercado disponível.");
  }

  return list
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.symbol)}</td>
          <td>${escapeHtml(item.price)}</td>
          <td class="${getChangeClass(item.change)}">${escapeHtml(item.change)}</td>
          <td>
            <span class="status">
              <span class="dot ${getDotClassByChange(item.change)}"></span>
              ${getDirectionLabel(item.change)}
            </span>
          </td>
        </tr>
      `
    )
    .join("");
}

function renderSimpleRows(list, nameKey) {
  if (!Array.isArray(list) || list.length === 0) {
    return createEmptyRow(3, "Nenhum dado disponível.");
  }

  return list
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item[nameKey])}</td>
          <td>${escapeHtml(item.price)}</td>
          <td class="${getChangeClass(item.change)}">${escapeHtml(item.change)}</td>
        </tr>
      `
    )
    .join("");
}

function renderMarketTicker(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return `
      <span class="ticker-item">
        <strong>Mercados</strong>
        <span>Sem dados no momento</span>
      </span>
    `;
  }

  const tickerItems = list
    .map(
      (item) => `
        <span class="ticker-item">
          <strong>${escapeHtml(item.symbol)}</strong>
          <span>${escapeHtml(item.price)}</span>
          <span class="${getChangeClass(item.change)}">${escapeHtml(item.change)}</span>
        </span>
      `
    )
    .join("");

  return tickerItems + tickerItems;
}

async function renderMarkets() {
  if (marketsRenderInProgress) return;
  marketsRenderInProgress = true;

  const marketTable = document.getElementById("marketTable");
  const tickerTrack = document.getElementById("tickerTrack");
  const forexTable = document.getElementById("forexTable");
  const commoditiesTable = document.getElementById("commoditiesTable");
  const marketChart = document.getElementById("tradingview_market");

  try {
    if (marketTable) {
      marketTable.innerHTML = renderMarketOverviewRows(MARKET_OVERVIEW_DATA);
    }

    if (tickerTrack) {
      tickerTrack.innerHTML = renderMarketTicker(MARKET_OVERVIEW_DATA);
    }

    if (forexTable) {
      forexTable.innerHTML = renderSimpleRows(FOREX_DATA, "pair");
    }

    if (commoditiesTable) {
      commoditiesTable.innerHTML = renderSimpleRows(COMMODITIES_DATA, "asset");
    }

    safeSetText("statIbov", "128.450");
    safeSetText("statUsd", "5,02");
    safeSetText("statSp500", "5.210");
    safeSetText("statBtc", "--");

    if (marketChart && !marketChartInitialized) {
      createAdvancedChart("tradingview_market", "BMFBOVESPA:IBOV");
      marketChartInitialized = true;
    }
  } catch (error) {
    if (marketTable) {
      marketTable.innerHTML = createEmptyRow(
        4,
        "Não foi possível carregar os dados do mercado."
      );
    }

    if (forexTable) {
      forexTable.innerHTML = createEmptyRow(
        3,
        "Não foi possível carregar o câmbio."
      );
    }

    if (commoditiesTable) {
      commoditiesTable.innerHTML = createEmptyRow(
        3,
        "Não foi possível carregar as commodities."
      );
    }

    if (tickerTrack) {
      tickerTrack.innerHTML = `
        <span class="ticker-item">
          <strong>Mercados</strong>
          <span>Falha na atualização</span>
        </span>
      `;
    }

    safeSetText("statIbov", "--");
    safeSetText("statUsd", "--");
    safeSetText("statSp500", "--");
    safeSetText("statBtc", "--");

    console.error("[Pronuxfin] Erro em renderMarkets:", error);
  } finally {
    marketsRenderInProgress = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderMarkets();

  setInterval(() => {
    renderMarkets();
  }, REFRESH_INTERVALS.markets);
});
