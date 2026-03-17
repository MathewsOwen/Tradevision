let newsRenderInProgress = false;

async function renderNews() {
  if (newsRenderInProgress) return;
  newsRenderInProgress = true;

  const newsFeed = document.getElementById("newsFeed");
  const homeNewsFeed = document.getElementById("homeNewsFeed");
  const featuredNews = document.getElementById("featuredNews");
  const secondaryNews = document.getElementById("secondaryNews");

  const fallbackNews = [
    {
      title: "Mercado reage a sinais de política monetária",
      summary:
        "Investidores acompanham movimentos de juros e recalibram expectativas para os próximos meses.",
      tag: "MACRO",
      url: "#"
    },
    {
      title: "Bitcoin mantém atenção após nova onda de demanda",
      summary:
        "O mercado cripto segue no radar com fluxo forte e maior apetite por ativos digitais.",
      tag: "CRIPTO",
      url: "#"
    },
    {
      title: "Bolsa brasileira ganha força em sessão positiva",
      summary:
        "Papéis de peso ajudam o índice local a sustentar desempenho mais consistente.",
      tag: "BOLSA",
      url: "#"
    },
    {
      title: "Fluxo institucional mantém ativos no radar",
      summary:
        "Setores com maior liquidez e relevância continuam recebendo atenção estratégica.",
      tag: "FLUXO",
      url: "#"
    }
  ];

  function isValidExternalUrl(url) {
    if (!url || url === "#") return false;

    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  function getNewsTag(article) {
    const source = String(article?.source?.name || "").toLowerCase();
    const title = String(article?.title || "").toLowerCase();
    const description = String(article?.description || "").toLowerCase();
    const content = `${source} ${title} ${description}`;

    if (
      content.includes("bitcoin") ||
      content.includes("ethereum") ||
      content.includes("cripto") ||
      content.includes("crypto") ||
      content.includes("blockchain")
    ) {
      return "CRIPTO";
    }

    if (
      content.includes("juros") ||
      content.includes("inflação") ||
      content.includes("inflacao") ||
      content.includes("banco central") ||
      content.includes("fed") ||
      content.includes("copom") ||
      content.includes("payroll")
    ) {
      return "MACRO";
    }

    if (
      content.includes("ibovespa") ||
      content.includes("bolsa") ||
      content.includes("ações") ||
      content.includes("acoes") ||
      content.includes("b3")
    ) {
      return "BOLSA";
    }

    if (
      content.includes("dólar") ||
      content.includes("dolar") ||
      content.includes("câmbio") ||
      content.includes("cambio")
    ) {
      return "CÂMBIO";
    }

    return "MERCADO";
  }

  function createNewsLink(url, label) {
    if (!isValidExternalUrl(url)) return "";
    return `<a class="news-link" href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  }

  function createNewsCard(item, variant = "default") {
    const title = escapeHtml(item.title || "Sem título");
    const summary = escapeHtml(item.summary || "Sem descrição disponível.");
    const tag = escapeHtml(item.tag || "MERCADO");
    const linkLabel = variant === "compact" ? "Abrir" : "Ler notícia";

    return {
      title,
      summary,
      tag,
      link: createNewsLink(item.url, linkLabel)
    };
  }

  function renderLoadingState() {
    if (featuredNews) {
      featuredNews.innerHTML = `
        <span class="news-meta">ATUALIZANDO</span>
        <h2>Carregando notícias do mercado...</h2>
        <p>A Pronuxfin está buscando as leituras mais recentes para você.</p>
      `;
    }

    if (secondaryNews) {
      secondaryNews.innerHTML = `
        <article class="news-side-card">
          <span class="news-meta">ATUALIZANDO</span>
          <h3>Carregando cobertura...</h3>
          <p>Buscando destaques secundários do mercado.</p>
        </article>
        <article class="news-side-card">
          <span class="news-meta">ATUALIZANDO</span>
          <h3>Preparando leitura...</h3>
          <p>Organizando os sinais mais relevantes para a plataforma.</p>
        </article>
      `;
    }

    if (newsFeed) {
      newsFeed.innerHTML = `
        <article class="news-item-advanced">
          <span class="news-meta">ATUALIZANDO</span>
          <h3>Carregando notícias...</h3>
          <p>Buscando conteúdo de mercado para a central de inteligência.</p>
        </article>
      `;
    }

    if (homeNewsFeed) {
      homeNewsFeed.innerHTML = `
        <article class="news-item">
          <span class="news-meta">ATUALIZANDO</span>
          <h3>Carregando notícias...</h3>
          <p>Buscando destaques para a home da Pronuxfin.</p>
        </article>
      `;
    }
  }

  function renderAll(news) {
    if (featuredNews && news.length > 0) {
      const main = createNewsCard(news[0], "main");
      featuredNews.innerHTML = `
        <span class="news-meta">${main.tag}</span>
        <h2>${main.title}</h2>
        <p>${main.summary}</p>
        ${main.link}
      `;
    }

    if (secondaryNews) {
      secondaryNews.innerHTML = news
        .slice(1, 3)
        .map((item) => {
          const card = createNewsCard(item, "compact");

          return `
            <article class="news-side-card">
              <span class="news-meta">${card.tag}</span>
              <h3>${card.title}</h3>
              <p>${card.summary}</p>
              ${card.link}
            </article>
          `;
        })
        .join("");
    }

    if (newsFeed) {
      newsFeed.innerHTML = news
        .map((item) => {
          const card = createNewsCard(item, "default");

          return `
            <article class="news-item-advanced">
              <span class="news-meta">${card.tag}</span>
              <h3>${card.title}</h3>
              <p>${card.summary}</p>
              ${card.link}
            </article>
          `;
        })
        .join("");
    }

    if (homeNewsFeed) {
      homeNewsFeed.innerHTML = news
        .slice(0, 3)
        .map((item) => {
          const card = createNewsCard(item, "compact");

          return `
            <article class="news-item">
              <span class="news-meta">${card.tag}</span>
              <h3>${card.title}</h3>
              <p>${card.summary}</p>
              ${card.link}
            </article>
          `;
        })
        .join("");
    }
  }

  try {
    renderLoadingState();

    const response = await fetchMarketNews();

    const articles = (response?.articles || [])
      .filter((article) => article && (article.title || article.description))
      .map((article) => ({
        title: article.title || "Sem título",
        summary: article.description || "Sem descrição disponível.",
        tag: getNewsTag(article),
        url: article.url || "#"
      }))
      .slice(0, 8);

    if (articles.length > 0) {
      renderAll(articles);
    } else {
      renderAll(fallbackNews);
    }
  } catch (error) {
    console.error("[Pronuxfin] Erro em renderNews:", error);
    renderAll(fallbackNews);
  } finally {
    newsRenderInProgress = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderNews();

  setInterval(() => {
    renderNews();
  }, REFRESH_INTERVALS.news);
});
