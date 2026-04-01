const BACKEND_URL = "https://shiny-fortnight-q7rrv67jqqpg35w-3000.app.github.dev";

function formatCurrencyBRL(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatCurrencyUSD(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  const number = Number(value);
  const signal = number > 0 ? "+" : "";
  return `${signal}${number.toFixed(2)}%`;
}

function setVariationColor(element, value) {
  if (!element) return;

  const number = Number(value);

  if (Number.isNaN(number)) {
    element.style.color = "#94a3b8";
    return;
  }

  element.style.color = number >= 0 ? "#22c55e" : "#ef4444";
}

function renderTopCards(crypto, stocks) {
  const bitcoin = crypto.find((item) => item.symbol === "BTC");
  const petr4 = stocks.find((item) => item.symbol === "PETR4");
  const vale3 = stocks.find((item) => item.symbol === "VALE3");

  const btcPrice = document.getElementById("btc-price");
  const btcChange = document.getElementById("btc-change");

  if (bitcoin && btcPrice && btcChange) {
    btcPrice.textContent = formatCurrencyBRL(bitcoin.priceBRL);
    btcChange.textContent = formatPercent(bitcoin.change24h);
    setVariationColor(btcChange, bitcoin.change24h);
  }

  const ibovPrice = document.getElementById("ibov-price");
  const ibovChange = document.getElementById("ibov-change");

  if (petr4 && ibovPrice && ibovChange) {
    ibovPrice.textContent = formatCurrencyBRL(petr4.price);
    ibovChange.textContent = formatPercent(petr4.changePercent);
    setVariationColor(ibovChange, petr4.changePercent);
  }

  const usdbrlPrice = document.getElementById("usdbrl-price");
  const usdbrlChange = document.getElementById("usdbrl-change");

  if (vale3 && usdbrlPrice && usdbrlChange) {
    usdbrlPrice.textContent = formatCurrencyBRL(vale3.price);
    usdbrlChange.textContent = formatPercent(vale3.changePercent);
    setVariationColor(usdbrlChange, vale3.changePercent);
  }

  const sp500Price = document.getElementById("sp500-price");
  const sp500Change = document.getElementById("sp500-change");

  if (sp500Price && sp500Change) {
    sp500Price.textContent = "Em breve";
    sp500Change.textContent = "Integração global";
    sp500Change.style.color = "#94a3b8";
  }
}

function renderCryptoCards(crypto) {
  const container = document.getElementById("crypto-cards");
  if (!container) return;

  container.innerHTML = "";

  crypto.forEach((item) => {
    const card = document.createElement("article");
    card.className = "crypto-card";

    const variationClass = Number(item.change24h) >= 0 ? "positive" : "negative";

    card.innerHTML = `
      <div class="crypto-card-top">
        <strong>${item.symbol}</strong>
        <span>${item.name}</span>
      </div>

      <div class="crypto-card-price">
        ${formatCurrencyBRL(item.priceBRL)}
      </div>

      <div class="crypto-card-usd">
        ${formatCurrencyUSD(item.priceUSD)}
      </div>

      <div class="crypto-card-change ${variationClass}">
        ${formatPercent(item.change24h)}
      </div>
    `;

    container.appendChild(card);
  });
}

function renderStocksTable(stocks) {
  const tbody = document.getElementById("stocks-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  stocks.forEach((stock) => {
    const row = document.createElement("tr");
    const variationClass = Number(stock.changePercent) >= 0 ? "positive" : "negative";

    row.innerHTML = `
      <td>
        <div class="stock-symbol-cell">
          <img src="${stock.logo || ""}" alt="${stock.symbol}" class="stock-logo" />
          <div>
            <strong>${stock.symbol}</strong>
            <span>${stock.shortName || stock.name || "--"}</span>
          </div>
        </div>
      </td>
      <td>${formatCurrencyBRL(stock.price)}</td>
      <td class="${variationClass}">${formatPercent(stock.changePercent)}</td>
      <td>${formatCurrencyBRL(stock.high)}</td>
      <td>${formatCurrencyBRL(stock.low)}</td>
    `;

    tbody.appendChild(row);
  });
}

async function loadDashboard() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/dashboard`);
    const data = await response.json();

    if (!data?.success) {
      throw new Error("Resposta inválida do dashboard");
    }

    const crypto = data.marketSummary?.crypto || [];
    const stocks = data.marketSummary?.stocks || [];

    renderTopCards(crypto, stocks);
    renderCryptoCards(crypto);
    renderStocksTable(stocks);
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
});
