async function loadMarkets() {
  const data = await fetchAPI("markets");

  const table = document.getElementById("marketsTable");

  table.innerHTML = data.map(m => `
    <tr>
      <td>${m.name}</td>
      <td>${m.price}</td>
      <td class="${m.change >= 0 ? 'positive' : 'negative'}">
        ${m.change}%
      </td>
    </tr>
  `).join("");
}

loadMarkets();
setInterval(loadMarkets, 60000);
