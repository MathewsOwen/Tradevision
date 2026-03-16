const NEWS_API_KEY = "36f6190c46284b89876d032af65ecbf8";

async function fetchJson(url) {
  const response = await fetch(url, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar dados");
  }

  return response.json();
}

/* =======================
CRYPTO API
======================= */

async function fetchCryptoPrices() {

  const url =
  "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd";

  return fetchJson(url);
}

/* =======================
AÇÕES BRASIL
======================= */

async function fetchStocks() {

  const url =
  "https://brapi.dev/api/quote/PETR4,VALE3,ITUB4,WEGE3,BBAS3,BBDC4,MGLU3,ELET3";

  const data = await fetchJson(url);

  return data.results || [];
}

/* =======================
NEWS API
======================= */

async function fetchMarketNews() {

  const query = "bolsa OR bitcoin OR mercado financeiro OR ibovespa";

  const url =
  `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=pt&sortBy=publishedAt&pageSize=8&apiKey=${NEWS_API_KEY}`;

  return fetchJson(url);
}
