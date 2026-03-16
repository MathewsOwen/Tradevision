async function renderStocks(){

const table=document.getElementById("stocksTable")

if(!table) return

table.innerHTML=createEmptyRow(4,"Carregando ações...")

try{

const stocks=await fetchStocks()

const assetUrl=s=>`ativos/ativo.html?symbol=${s}`

table.innerHTML=stocks.map(stock=>{

const percent=Number(stock.regularMarketChangePercent||0)

const change=`${percent>=0?"+":""}${percent.toFixed(2)}%`

return`

<tr class="clickable-row" data-url="${assetUrl(stock.symbol)}">

<td>
<a class="asset-link" href="${assetUrl(stock.symbol)}">
${stock.symbol}
</a>
</td>

<td>${stock.regularMarketPrice}</td>

<td class="${getChangeClass(change)}">${change}</td>

<td>
<span class="status">
<span class="dot ${getDotClassByChange(change)}"></span>
${percent>=0?"Alta":"Baixa"}
</span>
</td>

</tr>

`

}).join("")

bindClickableRows()

}catch{

table.innerHTML=createEmptyRow(4,"Erro ao carregar ações")

}

}

document.addEventListener("DOMContentLoaded",()=>{

renderStocks()

setInterval(renderStocks,REFRESH_INTERVALS.stocks)

})
