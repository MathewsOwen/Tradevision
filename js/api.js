const NEWS_API_KEY = "36f6190c46284b89876d032af65ecbf8";

const API_ENDPOINTS = {
  crypto:
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd",
  stocks:
    "https://brapi.dev/api/quote/PETR4,VALE3,MGLU3,ITUB4",
  newsQuery: "bolsa OR bitcoin OR mercado financeiro OR ibovespa OR ações"
};

const REQUEST_TIMEOUT = 12000;

function createTimeoutSignal(timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId)
  };
}

async function fetchJson(url, options = {}) {
  const { timeout = REQUEST_TIMEOUT, ...fetchOptions } = options;
  const { signal, clear } = createTimeoutSignal(timeout);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      ...fetchOptions,
      signal
    });

    if (!response.ok) {
      throw new Error(`Falha HTTP ${response.status} em ${url}`);
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error(`Resposta inválida (não JSON) em ${url}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Tempo limite excedido ao carregar ${url}`);
    }

    throw error;
  } finally {
    clear();
  }
}

async function fetchCryptoPrices() {
  try {
    const data = await fetchJson(API_ENDPOINTS.crypto);

    if (!data || typeof data !== "object") {
      throw new Error("Estrutura inválida na resposta de criptomoedas.");
    }

    return data;
  } catch (error) {
    console.error("[Pronuxfin] Erro ao buscar criptomoedas:", error);
    throw new Error("Não foi possível carregar os preços das criptomoedas no momento.");
  }
}

/*
  IMPORTANTE:
  Sem token na brapi, use apenas os papéis liberados:
  PETR4, VALE3, MGLU3, ITUB4
*/
async function fetchStocks() {
  try {
    const data = await fetchJson(API_ENDPOINTS.stocks);

    if (!data || !Array.isArray(data.results)) {
      throw new Error("Estrutura inválida na resposta de ações.");
    }

    return data.results.filter(Boolean);
  } catch (error) {
    console.error("[Pronuxfin] Erro ao buscar ações:", error);
    throw new Error("Não foi possível carregar os dados das ações no momento.");
  }
}

async function fetchMarketNews() {
  const query = encodeURIComponent(API_ENDPOINTS.newsQuery);
  const url =
    `https://newsapi.org/v2/everything?q=${query}` +
    `&language=pt&sortBy=publishedAt&pageSize=8&apiKey=${NEWS_API_KEY}`;

  try {
    const data = await fetchJson(url);

    if (!data || !Array.isArray(data.articles)) {
      throw new Error("Estrutura inválida na resposta de notícias.");
    }

    return data;
  } catch (error) {
    console.error("[Pronuxfin] Erro ao buscar notícias:", error);
    throw new Error("Não foi possível carregar as notícias do mercado no momento.");
  }
}
