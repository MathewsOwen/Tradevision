document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const requestedSymbol = (params.get("symbol") || "PETR4").toUpperCase();

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
    MGLU3: {
      name: "Magazine Luiza ON",
      tv: "BMFBOVESPA:MGLU3",
      market: "Bolsa do Brasil",
      category: "Ação"
    }
  };

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function formatBrlPrice(value) {
    if (typeof value !== "number" || Number.isNaN(value)) return "--";

    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function setBasicMeta(displayName, symbol, market, category) {
    setText(elements.title, `${displayName} (${symbol})`);
    setText(
      elements.subtitle,
      `Monitoramento completo de ${displayName} com leitura estratégica da Pronuxfin.`
    );
    setText(elements.symbol, symbol);
    setText(elements.market, market);
    setText(elements.category, category);
    document.title = `${displayName} (${symbol}) | Pronuxfin`;
  }

  function setDirectionByChange(changeValue) {
    if (typeof changeValue !== "number" || Number.isNaN(changeValue)) {
      setText(elements.direction, "Monitorando");
      setText(elements.change, "--");

      if (elements.change) {
        elements.change.className = "stat-value";
      }
      return;
    }

    const formatted = `${changeValue >= 0 ? "+" : ""}${changeValue.toFixed(2)}%`;
    setText(elements.change, formatted);

    if (elements.change) {
      elements.change.className = `stat-value ${
        changeValue > 0 ? "positive" : changeValue < 0 ? "negative" : "neutral"
      }`;
    }

    setText(
      elements.direction,
      changeValue > 0 ? "Alta" : changeValue < 0 ? "Baixa" : "Neutro"
    );
  }

  function renderInfoRows(rows) {
    if (!elements.infoTable) return;

    elements.infoTable.innerHTML = rows
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml(row.label)}</td>
            <td>${escapeHtml(row.value)}</td>
          </tr>
        `
      )
      .join("");
  }

  const isCrypto = Boolean(cryptoMap[requestedSymbol]);
  const isStock = Boolean(stockMap[requestedSymbol]);

  const activeSymbol = isCrypto || isStock ? requestedSymbol : "PETR4";
  const assetMeta = cryptoMap[activeSymbol] || stockMap[activeSymbol];
  const assetIsCrypto = Boolean(cryptoMap[activeSymbol]);

  try {
    setBasicMeta(
      assetMeta.name,
      activeSymbol,
      assetMeta.market,
      assetMeta.category
    );

    setText(elements.status, "Monitorando");

    if (assetIsCrypto) {
      const data = await fetchCryptoPrices();
      const rawPrice = data?.[assetMeta.id]?.usd;

      setText(
        elements.price,
        typeof rawPrice === "number" ? formatUsd(rawPrice) : "--"
      );

      setText(
        elements.summary,
        `${assetMeta.name} está no radar da Pronuxfin como um dos criptoativos mais relevantes do mercado.`
      );

      setDirectionByChange(null);

      renderInfoRows([
        { label: "Símbolo", value: activeSymbol },
        { label: "Nome", value: assetMeta.name },
        { label: "Mercado", value: assetMeta.market },
        { label: "Categoria", value: assetMeta.category },
        {
          label: "Preço atual",
          value: typeof rawPrice === "number" ? formatUsd(rawPrice) : "--"
        }
      ]);

      createAdvancedChart("asset_chart", assetMeta.tv);
      return;
    }

    const stocks = await fetchStocks();
    const stock = stocks.find(
      (item) => String(item.symbol).toUpperCase() === activeSymbol
    );

    const rawPrice = Number(stock?.regularMarketPrice);
    const rawChange = Number(stock?.regularMarketChangePercent);

    setText(
      elements.price,
      Number.isFinite(rawPrice) ? formatBrlPrice(rawPrice) : "--"
    );

    setText(
      elements.summary,
      `${assetMeta.name} está no radar da Pronuxfin como um dos ativos relevantes da bolsa brasileira.`
    );

    setDirectionByChange(Number.isFinite(rawChange) ? rawChange : null);

    renderInfoRows([
      { label: "Símbolo", value: activeSymbol },
      { label: "Nome", value: assetMeta.name },
      { label: "Mercado", value: assetMeta.market },
      { label: "Categoria", value: assetMeta.category },
      {
        label: "Preço atual",
        value: Number.isFinite(rawPrice) ? formatBrlPrice(rawPrice) : "--"
      },
      {
        label: "Variação",
        value: Number.isFinite(rawChange)
          ? `${rawChange >= 0 ? "+" : ""}${rawChange.toFixed(2)}%`
          : "--"
      }
    ]);

    createAdvancedChart("asset_chart", assetMeta.tv);
  } catch (error) {
    console.error("[Pronuxfin] Erro em ativo.js:", error);

    setBasicMeta(
      assetMeta?.name || "Ativo",
      activeSymbol,
      assetMeta?.market || "--",
      assetMeta?.category || "--"
    );

    setText(elements.price, "Indisponível");
    setText(elements.change, "--");

    if (elements.change) {
      elements.change.className = "stat-value";
    }

    setText(elements.direction, "Indisponível");
    setText(elements.status, "Indisponível");
    setText(
      elements.summary,
      "Não foi possível carregar os dados do ativo neste momento."
    );

    renderInfoRows([{ label: "Status", value: "Erro ao carregar dados" }]);
  }
});
