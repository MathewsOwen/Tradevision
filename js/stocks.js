document.addEventListener("DOMContentLoaded", () => {
  const stocksTable = document.getElementById("stocksTable");
  const homeStocksTable = document.getElementById("homeStocksTable");

  const stocks = [
    { ticker: "PETR4", price: "38,50", change: "+1,82%", direction: "Alta" },
    { ticker: "VALE3", price: "66,20", change: "-0,95%", direction: "Baixa" },
    { ticker: "ITUB4", price: "31,90", change: "+0,74%", direction: "Alta" },
    { ticker: "WEGE3", price: "45,10", change: "+1,10%", direction: "Alta" },
    { ticker: "BBAS3", price: "28,44", change: "-0,38%", direction: "Baixa" },
    { ticker: "BBDC4", price: "14,82", change: "+0,28%", direction: "Alta" },
    { ticker: "MGLU3", price: "12,30", change: "+2,14%", direction: "Alta" },
    { ticker: "ELET3", price: "40,22", change: "-0,42%", direction: "Baixa" }
  ];

  const renderRows = (list) =>
    list
      .map((stock) => `
        <tr>
          <td>${stock.ticker}</td>
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

  if (stocksTable) {
    stocksTable.innerHTML = renderRows(stocks);
  }

  if (homeStocksTable) {
    homeStocksTable.innerHTML = renderRows(stocks.slice(0, 5));
  }
});
