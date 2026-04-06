<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Ranking de Ativos | Pronuxfin</title>
  <meta
    name="description"
    content="Veja o ranking de ativos da Pronuxfin com melhor desempenho, variação, categoria e visão rápida de mercado."
  />

  <link rel="stylesheet" href="css/style.css" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
<body>

  <header class="header">
    <div class="container header-content">
      <div class="logo">
        PRONUX<span>FIN</span>
      </div>

      <nav class="nav">
        <a href="index.html" data-nav-link>Home</a>
        <a href="acoes.html" data-nav-link>Ações</a>
        <a href="cripto.html" data-nav-link>Cripto</a>
        <a href="mercados.html" data-nav-link>Mercados</a>
        <a href="noticias.html" data-nav-link>Notícias</a>
        <a href="ranking.html" data-nav-link>Ranking</a>
        <a href="heatmap.html" data-nav-link>Heatmap</a>
        <a href="radar.html" data-nav-link>Radar</a>
        <a href="calendario.html" data-nav-link>Calendário</a>
      </nav>

      <form class="search" data-search-form>
        <input type="text" placeholder="Buscar ativo..." data-search-input />
        <div class="search-results" data-search-results></div>
      </form>
    </div>
  </header>

  <main class="section">
    <div class="container">

      <div class="page-title">
        <h1>Ranking de Ativos</h1>
        <p>
          Visualize rapidamente os ativos com melhor desempenho, compare categorias
          e identifique movimentos relevantes do mercado.
        </p>
      </div>

      <div class="filters-bar">
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <input
            type="text"
            id="ranking-filter-input"
            placeholder="Filtrar por ativo, nome ou categoria..."
          />
          <button type="button" id="ranking-refresh-btn">Atualizar</button>
        </div>
      </div>

      <section class="panel">
        <div class="section-header">
          <h2>Ranking Geral</h2>
          <a href="index.html">Voltar para Home →</a>
        </div>

        <div id="ranking-table">
          <div class="loading">Carregando ranking...</div>
        </div>
      </section>

    </div>
  </main>

  <footer class="footer">
    <div class="container footer-content">
      <div>
        <strong>Pronuxfin</strong>
        <p>Onde entendimento vira vantagem.</p>
      </div>

      <div>
        <small>© <span data-current-year></span> Pronuxfin</small>
      </div>
    </div>
  </footer>

  <script src="js/api.js"></script>
  <script src="js/app.js"></script>
  <script src="js/ranking.js"></script>

</body>
</html>
