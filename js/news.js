async function renderNews() {
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

  function renderAll(news) {
    if (featuredNews && news.length > 0) {
      const main = news[0];
      featuredNews.innerHTML = `
        <span class="news-meta">${main.tag}</span>
        <h2>${main.title}</h2>
        <p>${main.summary}</p>
        ${main.url && main.url !== "#" ? `<a class="news-link" href="${main.url}" target="_blank" rel="noopener noreferrer">Ler notícia</a>` : ""}
      `;
    }

    if (secondaryNews) {
      secondaryNews.innerHTML = news
        .slice(1, 3)
        .map(
          (item) => `
          <article class="news-side-card">
            <span class="news-meta">${item.tag}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            ${item.url && item.url !== "#" ? `<a class="news-link" href="${item.url}" target="_blank" rel="noopener noreferrer">Abrir</a>` : ""}
          </article>
        `
        )
        .join("");
    }

    if (newsFeed) {
      newsFeed.innerHTML = news
        .map(
          (item) => `
          <article class="news-item-advanced">
            <span class="news-meta">${item.tag}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            ${item.url && item.url !== "#" ? `<a class="news-link" href="${item.url}" target="_blank" rel="noopener noreferrer">Ler notícia</a>` : ""}
          </article>
        `
        )
        .join("");
    }

    if (homeNewsFeed) {
      homeNewsFeed.innerHTML = news
        .slice(0, 3)
        .map(
          (item) => `
          <article class="news-item">
            <span class="news-meta">${item.tag}</span>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            ${item.url && item.url !== "#" ? `<a class="news-link" href="${item.url}" target="_blank" rel="noopener noreferrer">Abrir</a>` : ""}
          </article>
        `
        )
        .join("");
    }
  }

  try {
    const response = await fetchMarketNews();
    const articles = (response.articles || []).map((article) => ({
      title: article.title || "Sem título",
      summary: article.description || "Sem descrição disponível.",
      tag: "MERCADO",
      url: article.url || "#"
    }));

    if (articles.length > 0) {
      renderAll(articles);
    } else {
      renderAll(fallbackNews);
    }
  } catch (error) {
    renderAll(fallbackNews);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderNews();
  setInterval(renderNews, REFRESH_INTERVALS.news);
});
