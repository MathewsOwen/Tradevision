const REFRESH_INTERVALS = {
  markets: 60_000,
  stocks: 60_000,
  crypto: 60_000,
  news: 300_000
};

const SEARCH_ASSETS = [
  { symbol: "PETR4", name: "Petrobras PN", type: "Ação" },
  { symbol: "VALE3", name: "Vale ON", type: "Ação" },
  { symbol: "ITUB4", name: "Itaú Unibanco PN", type: "Ação" },
  { symbol: "WEGE3", name: "WEG ON", type: "Ação" },
  { symbol: "BBAS3", name: "Banco do Brasil ON", type: "Ação" },
  { symbol: "BBDC4", name: "Bradesco PN", type: "Ação" },
  { symbol: "MGLU3", name: "Magazine Luiza ON", type: "Ação" },
  { symbol: "ELET3", name: "Eletrobras ON", type: "Ação" },
  { symbol: "BTC", name: "Bitcoin", type: "Cripto" },
  { symbol: "ETH", name: "Ethereum", type: "Cripto" },
  { symbol: "SOL", name: "Solana", type: "Cripto" },
  { symbol: "BNB", name: "BNB", type: "Cripto" },
  { symbol: "XRP", name: "XRP", type: "Cripto" }
];

function getAssetPageBase() {
  return window.location.pathname.includes("/ativos/")
    ? "../ativos/ativo.html"
    : "ativos/ativo.html";
}

function getChangeClass(change) {
  if (String(change).startsWith("+")) return "positive";
  if (String(change).startsWith("-")) return "negative";
  return "neutral";
}

function getDotClassByChange(change) {
  if (String(change).startsWith("+")) return "green";
  if (String(change).startsWith("-")) return "red";
  return "blue";
}

function createEmptyRow(colspan, message) {
  return `
    <tr>
      <td colspan="${colspan}" class="empty-state">${message}</td>
    </tr>
  `;
}

function formatUsd(value) {
  if (typeof value !== "number") return "--";
  return value.toLocaleString("en-US");
}

function safeSetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function createAdvancedChart(containerId, symbol) {
  if (typeof TradingView === "undefined") return;
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  new TradingView.widget({
    autosize: true,
    symbol,
    interval: "D",
    timezone: "America/Sao_Paulo",
    theme: "dark",
    style: "1",
    locale: "br",
    toolbar_bg: "#0f172a",
    enable_publishing: false,
    hide_top_toolbar: false,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    container_id: containerId
  });
}

function bindClickableRows() {
  document.querySelectorAll("tr.clickable-row").forEach((row) => {
    if (row.dataset.bound === "true") return;
    row.dataset.bound = "true";

    row.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() === "a") return;
      const url = row.getAttribute("data-url");
      if (url) window.location.href = url;
    });
  });
}

function setupGlobalSearch() {
  const input = document.getElementById("globalSearch");
  const results = document.getElementById("searchResults");

  if (!input || !results) return;

  const assetBase = getAssetPageBase();

  function renderResults(items) {
    if (!items.length) {
      results.innerHTML = `
        <div class="search-result-item">
          <span class="search-result-symbol">Nenhum ativo encontrado</span>
          <span class="search-result-meta">Tente buscar por PETR4, VALE3, BTC, ETH...</span>
        </div>
      `;
      results.classList.add("show");
      return;
    }

    results.innerHTML = items
      .map(
        (item) => `
          <a class="search-result-item" href="${assetBase}?symbol=${item.symbol}">
            <span class="search-result-symbol">${item.symbol}</span>
            <span class="search-result-meta">${item.name} • ${item.type}</span>
          </a>
        `
      )
      .join("");

    results.classList.add("show");
  }

  input.addEventListener("input", () => {
    const term = input.value.trim().toUpperCase();

    if (!term) {
      results.innerHTML = "";
      results.classList.remove("show");
      return;
    }

    const filtered = SEARCH_ASSETS.filter(
      (item) =>
        item.symbol.includes(term) ||
        item.name.toUpperCase().includes(term) ||
        item.type.toUpperCase().includes(term)
    ).slice(0, 6);

    renderResults(filtered);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const term = input.value.trim().toUpperCase();
      const match = SEARCH_ASSETS.find(
        (item) => item.symbol === term || item.name.toUpperCase() === term
      );

      if (match) {
        window.location.href = `${assetBase}?symbol=${match.symbol}`;
      }
    }
  });

  document.addEventListener("click", (event) => {
    if (!results.contains(event.target) && event.target !== input) {
      results.classList.remove("show");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tradingview_chart")) {
    createAdvancedChart("tradingview_chart", "BMFBOVESPA:IBOV");
  }

  setupGlobalSearch();
});
