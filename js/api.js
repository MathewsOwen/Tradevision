async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }

  return response.json();
}

async function fetchCryptoPrices() {
  return fetchJson(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd"
  );
}

async function fetchStocks() {
  const data = await fetchJson(
    "https://brapi.dev/api/quote/PETR4,VALE3,ITUB4,WEGE3,BBAS3,BBDC4,MGLU3,ELET3"
  );

  return data.results || [];
}
