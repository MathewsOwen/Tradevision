document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const symbol = (params.get("symbol") || "PETR4").toUpperCase();

  const elements = {
    title: document.getElementById("assetTitle"),
    subtitle: document.getElementById("assetSubtitle"),
    symbol: document.getElementById("assetSymbol"),
    price: document.getElementById("assetPrice"),
    change: document.getElementById("assetChange"),
    status: document.getElementById("assetStatus"),
    summary: document.getElementById("assetSummary"),
    category: document.getElementById("assetCategory"),
    market: document.getElementById("assetMarket"),
    direction: document.getElementById("assetDirection"),
    infoTable: document.getElementById("assetInfoTable")
  };

  const cryptoMap = {
    BTC: {
      id: "bitcoin",
      name: "Bitcoin",
      tv: "BINANCE:BTCUSDT",
      market: "Criptomoedas",
      category: "Criptoativo"
    },
    ETH: {
      id: "ethereum",
      name: "Ethereum",
      tv: "BINANCE:ETHUSDT",
      market: "Criptomoedas",
      category: "Criptoativo"
    },
    SOL: {
      id: "solana",
      name: "Solana",
      tv: "BINANCE:SOLUSDT",
      market: "Criptomoedas",
      category: "Criptoativo"
    },
    BNB: {
      id: "binancecoin",
      name: "BNB",
      tv: "BINANCE:BNBUSDT",
      market: "Criptomoedas",
      category: "Criptoativo"
    },
    XRP: {
      id: "ripple",
      name: "XRP",
      tv: "BINANCE:XRPUSDT",
      market: "Criptomoedas",
      category: "Criptoativo"
    }
  };

  const stockMap = {
    PETR4: {
      name: "Petrobras PN",
      tv: "BMFBOVESPA:PETR4",
      market: "Bolsa do Brasil",
      category: "Ação"
    },
    VALE3: {
      name: "Vale ON",
      tv: "BMFBOVESPA:VALE3",
      market: "Bolsa do Brasil",
      category: "Ação"
    },
    ITUB4: {
      name: "Itaú Unibanco PN",
      tv: "BMFBOVESPA:ITUB4",
      market: "Bolsa do Brasil",
      category: "Ação"
    },
    WEGE3: {
      name: "WEG ON",
      tv: "BMFBOVESPA:WEGE3",
      market: "Bolsa do Brasil",
      category: "Ação"
    },
    BBAS3: {
      name: "Banco do Brasil ON",
      tv: "BMFBOVESPA:BBAS3",
      market: "Bolsa do Brasil",
      category: "Ação"
    }
  };

  const isCrypto = Boolean(cryptoMap[symbol]);
  const assetMeta = isCrypto ? cryptoMap[symbol] : stockMap[symbol] || stockMap.PETR4;

  function setBasicMeta(displayName, market, category) {
    elements.title.textContent = `${displayName} (${symbol})`;
    elements.subtitle.textContent = `Monitoramento completo de ${displayName} com leitura estratégica da Pronuxfin.`;
    elements.symbol.textContent = symbol;
    elements.market.textContent = market;
    elements.category.textContent = category;
    document.title = `${displayName} (${symbol}) | Pronuxfin`;
  }

  function setDirectionByChange(changeValue) {
    if (typeof changeValue !== "number") {
      elements.direction.textContent = "Monitorando";
      elements.change.textContent = "--";
      elements.change.className = "stat-value";
      return;
    }

    const formatted = `${changeValue >= 0 ? "+" : ""}${changeValue.toFixed(2)}%`;
    elements.change.textContent = formatted;
    elements.change.className = `stat-value ${changeValue >= 0 ? "positive" : "negative"}`;
    elements.direction.textContent = changeValue >= 0 ? "Alta" : "Baixa";
  }

  function renderInfoRows(rows) {
    elements.infoTable.innerHTML = rows
      .map(
        (row) => `
        <tr>
          <td>${row.label}</td>
          <td>${row.value}</td>
        </tr>
      `
      )
      .join("");
  }

  try {
    if (isCrypto) {
      setBasicMeta(assetMeta.name, assetMeta.market, assetMeta.category);

      const data = await fetchCryptoPrices();
      const rawPrice = data?.[assetMeta.id]?.usd;

      elements.price.textContent = typeof rawPrice === "number" ? `$${formatUsd(rawPrice)}` : "--";
      elements.status.textContent = "Monitorando";
      elements.summary.textContent =
        `${assetMeta.name} está no radar da Pronuxfin como um dos criptoativos mais relevantes do mercado.`;

      setDirectionByChange(null);

      renderInfoRows([
        { label: "Símbolo", value: symbol },
        { label: "Nome", value: assetMeta.name },
        { label: "Mercado", value: assetMeta.market },
        { label: "Categoria", value: assetMeta.category },
        { label: "Preço atual", value: typeof rawPrice === "number" ? `$${formatUsd(rawPrice)}` : "--" }
      ]);

      createAdvancedChart("asset_chart", assetMeta.tv);
      return;
    }

    setBasicMeta(assetMeta.name, assetMeta.market, assetMeta.category);

    const stocks = await fetchStocks();
    const stock = stocks.find((item) => item.symbol === symbol) || stocks[0];

    const rawPrice = stock?.regularMarketPrice;
    const rawChange = stock?.regularMarketChangePercent;

    elements.price.textContent =
      typeof rawPrice === "number" ? rawPrice.toLocaleString("pt-BR") : "--";
    elements.status.textContent = "Monitorando";
    elements.summary.textContent =
      `${assetMeta.name} está no radar da Pronuxfin como um dos ativos relevantes da bolsa brasileira.`;

    setDirectionByChange(rawChange);

    renderInfoRows([
      { label: "Símbolo", value: stock?.symbol || symbol },
      { label: "Nome", value: assetMeta.name },
      { label: "Mercado", value: assetMeta.market },
      { label: "Categoria", value: assetMeta.category },
      {
        label: "Preço atual",
        value: typeof rawPrice === "number" ? rawPrice.toLocaleString("pt-BR") : "--"
      },
      {
        label: "Variação",
        value:
          typeof rawChange === "number"
            ? `${rawChange >= 0 ? "+" : ""}${rawChange.toFixed(2)}%`
            : "--"
      }
    ]);

    createAdvancedChart("asset_chart", assetMeta.tv);
  } catch (error) {
    elements.price.textContent = "Indisponível";
    elements.change.textContent = "--";
    elements.direction.textContent = "Indisponível";
    elements.summary.textContent = "Não foi possível carregar os dados do ativo neste momento.";
    renderInfoRows([{ label: "Status", value: "Erro ao carregar dados" }]);
  }
});
