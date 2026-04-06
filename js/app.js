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

function formatSmartValue(value) {
  const number = Number(
    typeof value === 'string'
      ? value
          .trim()
          .replace(/\.(?=\d{3}(\D|$))/g, '')
          .replace(',', '.')
          .replace(/[^\d.-]/g, '')
      : value
  );

  if (value === null || value === undefined || Number.isNaN(number)) {
    return '--';
  }

  if (Math.abs(number) >= 1000000) {
    return formatCompact(number);
  }

  if (Math.abs(number) >= 1000) {
    return formatNumber(number, {
      maximumFractionDigits: 2
    });
  }

  return formatNumber(number, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
    return 'positive';
  }

  if (number < 0) {
    return 'negative';
  }

  return 'flat';
}

function formatDeltaHTML(value) {
  const deltaClass = getDeltaClass(value);
  return `<span class="delta ${deltaClass}">${formatPercent(value)}</span>`;
}

// ===============================
// ESTADOS DE TELA
// ===============================
function setState(element, type, message) {
  if (!element) {
    return;
  }

  element.innerHTML = `
    <div class="${type}">
      ${escapeHTML(message)}
    </div>
  `;
}

function setLoading(element, message = 'Carregando dados...') {
  setState(element, 'loading', message);
}

function setError(element, message = 'Não foi possível carregar os dados.') {
  setState(element, 'error', message);
}

function setEmpty(element, message = 'Nenhum dado disponível.') {
  setState(element, 'empty', message);
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
    .map((column) => `<th>${escapeHTML(column.label)}</th>`)
    .join('');

  const tbody = rows
    .map((row) => {
      const cells = columns
        .map((column) => {
          const value =
            typeof column.render === 'function'
              ? column.render(row)
              : escapeHTML(row[column.key] ?? '--');

          return `<td>${value}</td>`;
        })
        .join('');

      return `<tr>${cells}</tr>`;
    })
    .join('');

  container.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>${thead}</tr>
        </thead>
        <tbody>${tbody}</tbody>
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
  const description =
    item.summary || item.description || 'Clique para ler a matéria completa.';
  const url = item.url || '#';

  return `
    <a class="news-card" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">
      <small>${escapeHTML(source)} • ${escapeHTML(date)}</small>
      <h3>${escapeHTML(title)}</h3>
      <p>${escapeHTML(description)}</p>
    </a>
  `;
}

function createEventItem(item) {
  const date = item.date || '--';
  const country = item.country || '--';
  const title = item.title || item.event || 'Evento';
  const impact = item.impact || 'Moderado';
  const actual = item.actual ? ` • Atual: ${escapeHTML(item.actual)}` : '';
  const forecast = item.forecast ? ` • Projeção: ${escapeHTML(item.forecast)}` : '';

  return `
    <div class="event-card">
      <strong>${escapeHTML(date)} • ${escapeHTML(country)}</strong>
      <p>${escapeHTML(title)}</p>
      <small>Impacto: ${escapeHTML(impact)}${actual}${forecast}</small>
    </div>
  `;
}

function createStatCard(item) {
  const title = item.title || item.name || item.label || 'Indicador';
  const value = item.value ?? item.price ?? '--';
  const delta = item.changePercent ?? item.variation ?? item.change ?? 0;
  const subtitle = item.subtitle || item.symbol || 'Atualização em tempo real';

  return `
    <div class="quote-item">
      <h4>${escapeHTML(title)}</h4>
      <div class="value">${formatSmartValue(value)}</div>
      <p class="delta ${getDeltaClass(delta)}">${formatPercent(delta)}</p>
      <small>${escapeHTML(subtitle)}</small>
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

  return `<a href="${getAssetHref(symbol, type)}" class="asset-link">${escapeHTML(symbol)}</a>`;
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
      results.innerHTML = `<div class="loading">Buscando ativos...</div>`;
      openResults();

      const response = await window.api.search(term);
      const items = response.items || response.results || response.data || [];

      if (!items.length) {
        results.innerHTML = `<div class="empty">Nenhum ativo encontrado.</div>`;
        return;
      }

      results.innerHTML = items
        .slice(0, 8)
        .map((item) => {
          const symbol = item.symbol || '--';
          const type = item.type || 'stock';
          const name = item.name || item.description || 'Ativo monitorado';

          return `
            <a href="${getAssetHref(symbol, type)}" class="search-result-item">
              <strong>${escapeHTML(symbol)}</strong>
              <span>${escapeHTML(name)}</span>
              <small>${escapeHTML(type.toUpperCase())}</small>
            </a>
          `;
        })
        .join('');
    } catch (error) {
      results.innerHTML = `<div class="error">Não foi possível buscar agora.</div>`;
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
