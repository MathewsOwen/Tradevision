// ===============================
// FORMATADORES GLOBAIS
// ===============================
function formatNumber(value, options = {}) {
  const number = Number(value);

  if (value === null || value === undefined || Number.isNaN(number)) {
    return '--';
  }

  return new Intl.NumberFormat('pt-BR', options).format(number);
}

function formatCurrency(value, currency = 'BRL') {
  const number = Number(value);

  if (value === null || value === undefined || Number.isNaN(number)) {
    return '--';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
}

function formatPercent(value) {
  const number = Number(value);

  if (value === null || value === undefined || Number.isNaN(number)) {
    return '--';
  }

  return `${number >= 0 ? '+' : ''}${number.toFixed(2)}%`;
}

function formatCompact(value) {
  const number = Number(value);

  if (value === null || value === undefined || Number.isNaN(number)) {
    return '--';
  }

  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    maximumFractionDigits: 2
  }).format(number);
}

// ===============================
// HELPERS DE VARIAÇÃO
// ===============================
function getDeltaClass(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 'flat';
  }

  if (number > 0) {
    return 'up';
  }

  if (number < 0) {
    return 'down';
  }

  return 'flat';
}

function formatDeltaHTML(value) {
  return `<span class="delta ${getDeltaClass(value)}">${formatPercent(value)}</span>`;
}

// ===============================
// ESTADOS DE TELA
// ===============================
function setState(element, type, message) {
  if (!element) {
    return;
  }

  element.innerHTML = `<div class="${type}">${message}</div>`;
}

function setLoading(element, message = 'Carregando dados...') {
  setState(element, 'loading', message);
}

function setError(element, message = 'Não foi possível carregar os dados.') {
  setState(element, 'error', message);
}

function setEmpty(element, message = 'Nenhum dado disponível.') {
  setState(element, 'empty-state', message);
}

// ===============================
// RENDER DE TABELAS
// ===============================
function renderTable(container, columns, rows) {
  if (!container) {
    return;
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    setEmpty(container, 'Nenhum dado disponível no momento.');
    return;
  }

  const thead = columns
    .map((column) => `<th>${column.label}</th>`)
    .join('');

  const tbody = rows
    .map((row) => {
      const cells = columns
        .map((column) => {
          const value = typeof column.render === 'function'
            ? column.render(row)
            : (row[column.key] ?? '--');

          return `<td>${value}</td>`;
        })
        .join('');

      return `<tr>${cells}</tr>`;
    })
    .join('');

  container.innerHTML = `
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>${thead}</tr>
        </thead>
        <tbody>
          ${tbody}
        </tbody>
      </table>
    </div>
  `;
}

// ===============================
// COMPONENTES REUTILIZÁVEIS
// ===============================
function createNewsItem(item) {
  const source = item.source || item.site || 'Mercado';
  const date = item.publishedAt || item.date || item.time || 'Agora';
  const title = item.title || 'Sem título';
  const description = item.summary || item.description || 'Clique para ler a matéria completa.';
  const url = item.url || '#';

  return `
    <a class="news-item" href="${url}" target="_blank" rel="noopener noreferrer">
      <small>${source} • ${date}</small>
      <strong>${title}</strong>
      <span class="card-subtitle">${description}</span>
    </a>
  `;
}

function createEventItem(item) {
  const date = item.date || '--';
  const country = item.country || '--';
  const title = item.title || item.event || 'Evento';
  const impact = item.impact || 'Moderado';
  const actual = item.actual ? ` • Atual: ${item.actual}` : '';
  const forecast = item.forecast ? ` • Projeção: ${item.forecast}` : '';

  return `
    <div class="event-item">
      <small>${date} • ${country}</small>
      <strong>${title}</strong>
      <span class="card-subtitle">Impacto: ${impact}${actual}${forecast}</span>
    </div>
  `;
}

function createStatCard(item) {
  const title = item.title || item.name || item.label || 'Indicador';
  const value = item.value ?? item.price ?? '--';
  const delta = item.changePercent ?? item.variation ?? 0;
  const subtitle = item.subtitle || item.symbol || 'Atualização em tempo real';

  return `
    <div class="stat-card">
      <span class="stat-label">${title}</span>
      <strong class="stat-value">${value}</strong>
      <span class="delta ${getDeltaClass(delta)}">${formatPercent(delta)}</span>
      <small class="stat-subtitle">${subtitle}</small>
    </div>
  `;
}

// ===============================
// LINKS DE ATIVOS
// ===============================
function getAssetHref(symbol, type = 'stock') {
  const isInsideAssetsFolder = window.location.pathname.includes('/ativos/');
  const basePath = isInsideAssetsFolder ? '../ativos/ativo.html' : 'ativos/ativo.html';

  return `${basePath}?symbol=${encodeURIComponent(symbol)}&type=${encodeURIComponent(type)}`;
}

function createAssetRowLink(symbol, type = 'stock') {
  if (!symbol) {
    return '--';
  }

  return `<a href="${getAssetHref(symbol, type)}" class="asset-link"><strong>${symbol}</strong></a>`;
}

// ===============================
// BUSCA GLOBAL
// ===============================
async function initSearch() {
  const form = document.querySelector('[data-search-form]');
  const input = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');

  if (!form || !input || !results || !window.api) {
    return;
  }

  const closeResults = () => {
    results.classList.remove('show');
  };

  const openResults = () => {
    results.classList.add('show');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const term = input.value.trim();

    if (!term) {
      results.innerHTML = '';
      closeResults();
      return;
    }

    try {
      results.innerHTML = '<div class="loading">Buscando ativos...</div>';
      openResults();

      const response = await window.api.search(term);
      const items = response.items || response.results || response.data || [];

      if (!items.length) {
        results.innerHTML = '<div class="empty-state">Nenhum ativo encontrado.</div>';
        return;
      }

      results.innerHTML = items
        .slice(0, 8)
        .map((item) => {
          const symbol = item.symbol || '--';
          const type = item.type || 'stock';
          const name = item.name || item.description || 'Ativo monitorado';

          return `
            <a class="search-item" href="${getAssetHref(symbol, type)}">
              <div>
                <strong>${symbol}</strong>
                <div class="card-subtitle">${name}</div>
              </div>
              <span class="badge">${type.toUpperCase()}</span>
            </a>
          `;
        })
        .join('');
    } catch (error) {
      results.innerHTML = '<div class="error">Não foi possível buscar agora.</div>';
    }
  });

  input.addEventListener('input', () => {
    if (!input.value.trim()) {
      results.innerHTML = '';
      closeResults();
    }
  });

  document.addEventListener('click', (event) => {
    if (!form.contains(event.target) && !results.contains(event.target)) {
      closeResults();
    }
  });
}

// ===============================
// MENU ATIVO
// ===============================
function markActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href');

    if (!href) {
      return;
    }

    const normalizedHref = href.split('/').pop();

    if (normalizedHref === currentPage) {
      link.classList.add('active');
    }
  });
}

// ===============================
// ANO AUTOMÁTICO NO FOOTER
// ===============================
function setCurrentYear() {
  const yearElements = document.querySelectorAll('[data-current-year]');
  const currentYear = new Date().getFullYear();

  yearElements.forEach((element) => {
    element.textContent = currentYear;
  });
}

// ===============================
// INIT GLOBAL
// ===============================
function boot() {
  markActiveNav();
  setCurrentYear();
  initSearch();
}

document.addEventListener('DOMContentLoaded', boot);
