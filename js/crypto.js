async function loadCrypto(){

const url="https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd"

const res=await fetch(url)
const data=await res.json()

const container=document.getElementById("cryptoTable")

container.innerHTML=`Bitcoin: $${data.bitcoin.usd}<br>
Ethereum: $${data.ethereum.usd}<br>
Solana: $${data.solana.usd}`
}

loadCrypto()

