function formatNumber(value, options = {}) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--';
  return new Intl.NumberFormat('pt-BR', options).format(Number(value));
}

function formatCurrency(value, currency = 'BRL') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(Number(value));
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--';
  const num = Number(value);
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
}

function getDeltaClass(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return 'flat';
  if (num > 0) return 'up';
  if (num < 0) return 'down';
  return 'flat';
}

function setState(el, type, message) {
  if (!el) return;
  el.innerHTML = `<div class="${type}">${message}</div>`;
}

function renderTable(container, columns, rows) {
  if (!container) return;

  if (!rows || !rows.length) {
    container.innerHTML = '<p class="empty-state">Nenhum dado disponível no momento.</p>';
    return;
  }

  const head = columns.map((col) => `<th>${col.label}</th>`).join('');
  const body = rows.map((row) => `
    <tr>
      ${columns.map((col) => `<td>${col.render ? col.render(row) : row[col.key] ?? '--'}</td>`).join('')}
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="table-wrap">
      <table class="table">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

function createNewsItem(item) {
  const source = item.source || item.site || 'Mercado';
  const date = item.publishedAt || item.date || item.time || 'Agora';
  const link = item.url || '#';
  return `
    <a class="news-item" href="${link}" target="_blank" rel="noopener noreferrer">
      <small>${source} • ${date}</small>
      <strong>${item.title || 'Sem título'}</strong>
      <span class="card-subtitle">${item.summary || item.description || 'Clique para ler a matéria completa.'}</span>
    </a>
  `;
}

function createEventItem(item) {
  return `
    <div class="event-item">
      <small>${item.date || '--'} • ${item.country || '--'}</small>
      <strong>${item.title || item.event || 'Evento'}</strong>
      <span class="card-subtitle">Impacto: ${item.impact || 'Moderado'}${item.actual ? ` • Atual: ${item.actual}` : ''}${item.forecast ? ` • Projeção: ${item.forecast}` : ''}</span>
    </div>
  `;
}

function getAssetHref(symbol, type = 'stock') {
  const isAssetPage = window.location.pathname.includes('/ativos/');
  const base = isAssetPage ? '../ativos/ativo.html' : 'ativos/ativo.html';
  return `${base}?symbol=${encodeURIComponent(symbol)}&type=${encodeURIComponent(type)}`;
}

function createAssetRowLink(symbol, type = 'stock') {
  return `<a href="${getAssetHref(symbol, type)}"><strong>${symbol}</strong></a>`;
}

async function initSearch() {
  const form = document.querySelector('[data-search-form]');
  const input = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');

  if (!form || !input || !results) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const term = input.value.trim();

    if (!term) {
      results.classList.remove('show');
      results.innerHTML = '';
      return;
    }

    try {
      results.innerHTML = '<div class="loading">Buscando ativos...</div>';
      results.classList.add('show');
      const response = await api.search(term);
      const items = response.items || response.results || [];

      if (!items.length) {
        results.innerHTML = '<div class="loading">Nenhum ativo encontrado.</div>';
        return;
      }

      results.innerHTML = items.slice(0, 8).map((item) => `
        <a class="search-item" href="${getAssetHref(item.symbol, item.type || 'stock')}">
          <div>
            <strong>${item.symbol}</strong>
            <div class="card-subtitle">${item.name || item.description || 'Ativo monitorado'}</div>
          </div>
          <span class="badge">${(item.type || 'ativo').toUpperCase()}</span>
        </a>
      `).join('');
    } catch (error) {
      results.innerHTML = '<div class="error">Não foi possível buscar agora.</div>';
    }
  });

  document.addEventListener('click', (event) => {
    if (!form.contains(event.target)) {
      results.classList.remove('show');
    }
  });
}

function markActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === current || href.endsWith(`/${current}`)) {
      link.classList.add('active');
    }
  });
}

function boot() {
  markActiveNav();
  initSearch();
}

document.addEventListener('DOMContentLoaded', boot);
