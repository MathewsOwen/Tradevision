document.addEventListener("DOMContentLoaded",async()=>{

const params=new URLSearchParams(window.location.search)

const symbol=params.get("symbol")||"PETR4"

const title=document.getElementById("assetTitle")

if(title) title.textContent=symbol

if(document.getElementById("asset_chart")){

createAdvancedChart("asset_chart",

symbol==="BTC"?"BINANCE:BTCUSDT":
symbol==="ETH"?"BINANCE:ETHUSDT":
`BMFBOVESPA:${symbol}`)

}

})
