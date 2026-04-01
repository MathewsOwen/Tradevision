function renderStocks(stocks) {
  const container = document.getElementById("stocks-table");
  container.innerHTML = "";

  stocks.forEach(s => {
    const row = `
      <tr>
        <td>${s.symbol}</td>
        <td>${s.price.toFixed(2)}</td>
        <td style="color:${s.change >= 0 ? "lime" : "red"}">
          ${s.changePercent.toFixed(2)}%
        </td>
      </tr>
    `;
    container.innerHTML += row;
  });
}
