document.addEventListener("DOMContentLoaded", async () => {

const stocksTable = document.getElementById("stocksTable")

if (!stocksTable) return

try {

const stocks = await fetchStocks()

stocksTable.innerHTML = stocks.map(stock => `

<tr>

<td>${stock.symbol}</td>

<td>${stock.regularMarketPrice}</td>

<td class="${stock.regularMarketChangePercent >= 0 ? 'positive' : 'negative'}">

${stock.regularMarketChangePercent.toFixed(2)}%

</td>

<td>

<span class="status">

<span class="dot ${stock.regularMarketChangePercent >= 0 ? 'green' : 'red'}"></span>

${stock.regularMarketChangePercent >= 0 ? 'Alta' : 'Baixa'}

</span>

</td>

</tr>

`).join("")

} catch {

stocksTable.innerHTML = `<tr><td colspan="4">Erro ao carregar dados</td></tr>`

}

})
