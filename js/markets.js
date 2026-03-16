async function renderMarkets() {
  const marketTable = document.getElementById("marketTable");
  const tickerTrack = document.getElementById("tickerTrack");
  const forexTable = document.getElementById("forexTable");
  const commoditiesTable = document.getElementById("commoditiesTable");

  const markets = [
    { symbol: "IBOVESPA", price: "128.450", change: "+0,84%", direction: "Alta" },
    { symbol: "S&P 500", price: "5.210", change: "+0,42%", direction: "Alta" },
    { symbol: "NASDAQ", price: "18.200", change: "+0,67%", direction: "Alta" },
    { symbol: "USD/BRL", price: "5,02", change: "-0,11%", direction: "Baixa" },
    { symbol: "OURO", price: "2.150", change: "+0,23%", direction: "Alta" },
    { symbol: "PETRÓLEO", price: "78,40", change: "+0,31%", direction: "Alta" }
  ];

  const forex = [
    { pair: "USD/BRL", price: "5,02", change: "-0,11%" },
    { pair: "EUR/USD", price: "1,09", change: "+0,08%" },
    { pair: "GBP/USD", price: "1,27", change: "+0,05%" },
    { pair: "USD/JPY", price: "148,20", change: "-0,14%" }
  ];

  const commodities = [
    { asset: "OURO", price: "2.150", change: "+0,23%" },
    { asset: "PRATA", price: "24,80", change: "+0,18%" },
    { asset: "PETRÓLEO WTI", price: "78,40", change: "+0,31%" },
    { asset: "GÁS NATURAL", price: "2,10", change: "-0,26%" }
  ];

  if (marketTable) {
    marketTable.innerHTML = markets
      .map((item) => `
        <tr>
          <td>${item.symbol}</td>
          <td>${item.price}</td>
          <td class="${getChangeClass(item.change)}">${item.change}</td>
          <td>
            <span class="status">
              <span class="dot ${getDotClassByChange(item.change)}"></span>
              ${item.direction}
            </span>
          </td>
        </tr>
      `)
      .join("");
  }

  if (tickerTrack) {
    const tickerItems = markets
      .map((item) => `
        <span class="ticker-item">
          <strong>${item.symbol}</strong>
          <span>${item.price}</span>
          <span class="${getChangeClass(item.change)}">${item.change}</span>
        </span>
      `)
      .join("");

    tickerTrack.innerHTML = tickerItems + tickerItems;
  }

  if (forexTable) {
    forexTable.innerHTML = forex
      .map((item) => `
        <tr>
          <td>${item.pair}</td>
          <td>${item.price}</td>
          <td class="${getChangeClass(item.change)}">${item.change}</td>
        </tr>
      `)
      .join("");
  }

  if (commoditiesTable) {
    commoditiesTable.innerHTML = commodities
      .map((item) => `
        <tr>
          <td>${item.asset}</td>
          <td>${item.price}</td>
          <td class="${getChangeClass(item.change)}">${item.change}</td>
        </tr>
      `)
      .join("");
  }

  safeSetText("statIbov", "128.450");
  safeSetText("statUsd", "5,02");
  safeSetText("statSp500", "5.210");

  if (document.getElementById("tradingview_market")) {
    createAdvancedChart("tradingview_market", "BMFBOVESPA:IBOV");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderMarkets();
  setInterval(renderMarkets, REFRESH_INTERVALS.markets);
});
