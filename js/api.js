// ===============================
// CONFIGURAÇÃO DA API
// ===============================
const API_CONFIG = {
  baseURL: window.PRONUXFIN_API_BASE || 'http://localhost:3000/api',
  timeout: 10000
};

// ===============================
// FUNÇÃO BASE DE REQUEST
// ===============================
async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  const url = `${API_CONFIG.baseURL}${path}`;

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro ${response.status}: ${text}`);
    }

    return await response.json();

  } catch (error) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      console.error('[API TIMEOUT]', path);
      throw new Error('Tempo de resposta excedido.');
    }

    console.error('[API ERROR]', path, error);
    throw error;
  }
}

// ===============================
// ENDPOINTS CENTRALIZADOS
// ===============================
const api = {

  // 🔍 Busca global
  search(query) {
    return request(`/search?q=${encodeURIComponent(query)}`);
  },

  // 📊 Visão geral
  getOverview() {
    return request('/markets/overview');
  },

  // 🇧🇷 AÇÕES B3
  getStocks(symbols = 'PETR4,VALE3,ITUB4,BBAS3,WEGE3') {
    return request(`/stocks/quote?symbols=${encodeURIComponent(symbols)}`);
  },

  getStocksList(page = 1, limit = 20) {
    return request(`/stocks/list?page=${page}&limit=${limit}`);
  },

  // 🪙 CRIPTO
  getCryptos(limit = 20) {
    return request(`/crypto/markets?limit=${limit}`);
  },

  // 🌎 MERCADOS GLOBAIS
  getGlobalMarkets() {
    return request('/markets/global');
  },

  // 📰 NOTÍCIAS
  getNews(limit = 12) {
    return request(`/news/latest?limit=${limit}`);
  },

  // 🏆 RANKING
  getRanking(limit = 20) {
    return request(`/ranking/assets?limit=${limit}`);
  },

  // 🔥 HEATMAP
  getHeatmap() {
    return request('/heatmap/b3');
  },

  // 🎯 RADAR
  getRadar() {
    return request('/radar/events');
  },

  // 📅 CALENDÁRIO ECONÔMICO
  getCalendar(country = 'BR', limit = 20) {
    return request(`/calendar/economic?country=${encodeURIComponent(country)}&limit=${limit}`);
  },

  // 📈 DETALHE DE ATIVO
  getAssetDetails(symbol, type = 'stock') {
    return request(`/asset/${encodeURIComponent(symbol)}?type=${encodeURIComponent(type)}`);
  }
};

// ===============================
// DISPONIBILIZA GLOBALMENTE
// ===============================
window.api = api;
