let cryptoRenderInProgress = false;

async function renderCrypto() {
  if (cryptoRenderInProgress) return;
  cryptoRenderInProgress = true;

  const cryptoTable = document.getElementById("cryptoTable");
  const homeCryptoTable = document.getElementById("homeCryptoTable");
  const cryptoWatchTable = document.getElementById("cryptoWatchTable");
  const cryptoTickerTrack = document.getElementById("cryptoTickerTrack");

  const statBtc = document.getElementById("statBtc");
  const btcMainStat = document.getElementById("btcMainStat");
  const ethMainStat = document.getElementById("ethMainStat");

  const loading = createEmptyRow(3, "Carregando dados de criptomoedas...");

  if (cryptoTable) cryptoTable.innerHTML = loading;
  if (homeCryptoTable) homeCryptoTable.innerHTML = loading;
  if (cryptoWatchTable) cryptoWatchTable.innerHTML = loading;

  try {
    const data = await fetchCryptoPrices();
    const assetBase = getAssetPageBase();

    const cryptos = [
      {
        name: "Bitcoin",
        short: "BTC",
        price: data?.bitcoin?.usd ?? null,
        status: "Monitorando"
      },
      {
        name: "Ethereum",
        short: "ETH",
        price: data?.ethereum?.usd ?? null,
        status: "Monitorando"
      },
      {
        name: "Solana",
        short: "SOL",
        price: data?.solana?.usd ?? null,
        status: "Monitorando"
      },
      {
        name: "BNB",
        short: "BNB",
        price: data?.binancecoin?.usd ?? null,
        status: "Monitorando"
      },
      {
        name: "XRP",
        short: "XRP",
        price: data?.ripple?.usd ?? null,
        status: "Monitorando"
      }
    ];

    const assetUrl = (symbol) =>
      `${assetBase}?symbol=${encodeURIComponent(symbol)}`;

    const formatCryptoPrice = (value) =>
      typeof value === "number" && Number.isFinite(value)
        ? formatUsd(value)
        : "--";

    const renderRows = (list) =>
      list
        .map(
          (crypto) => `
            <tr class="clickable-row" data-url="${assetUrl(crypto.short)}">
              <td>
                <a class="asset-link" href="${assetUrl(crypto.short)}">${escapeHtml(crypto.name)}</a>
              </td>
              <td>${formatCryptoPrice(crypto.price)}</td>
              <td>
                <span class="status">
                  <span class="dot blue"></span>
                  ${escapeHtml(crypto.status)}
                </span>
              </td>
            </tr>
          `
        )
        .join("");

    if (cryptoTable) {
      cryptoTable.innerHTML =
        cryptos.length > 0
          ? renderRows(cryptos)
          : createEmptyRow(3, "Nenhuma criptomoeda disponível.");
    }

    if (homeCryptoTable) {
      homeCryptoTable.innerHTML =
        cryptos.length > 0
          ? renderRows(cryptos.slice(0, 5))
          : createEmptyRow(3, "Nenhuma criptomoeda disponível.");
    }

    if (cryptoWatchTable) {
      cryptoWatchTable.innerHTML =
        cryptos.length > 0
          ? renderRows(cryptos)
          : createEmptyRow(3, "Nenhuma criptomoeda disponível.");
    }

    if (cryptoTickerTrack) {
      if (cryptos.length > 0) {
        const tickerItems = cryptos
          .map(
            (crypto) => `
              <span class="ticker-item">
                <strong>${escapeHtml(crypto.short)}</strong>
                <span>${formatCryptoPrice(crypto.price)}</span>
                <span class="neutral">Monitorando</span>
              </span>
            `
          )
          .join("");

        cryptoTickerTrack.innerHTML = tickerItems + tickerItems;
      } else {
        cryptoTickerTrack.innerHTML = `
          <span class="ticker-item">
            <strong>Cripto</strong>
            <span>Sem dados no momento</span>
          </span>
        `;
      }
    }

    if (statBtc) {
      statBtc.textContent =
        typeof data?.bitcoin?.usd === "number"
          ? formatUsd(data.bitcoin.usd)
          : "--";
    }

    if (btcMainStat) {
      btcMainStat.textContent =
        typeof data?.bitcoin?.usd === "number"
          ? formatUsd(data.bitcoin.usd)
          : "--";
    }

    if (ethMainStat) {
      ethMainStat.textContent =
        typeof data?.ethereum?.usd === "number"
          ? formatUsd(data.ethereum.usd)
          : "--";
    }

    bindClickableRows();
  } catch (error) {
    const fail = createEmptyRow(3, "Não foi possível carregar os dados agora.");

    if (cryptoTable) cryptoTable.innerHTML = fail;
    if (homeCryptoTable) homeCryptoTable.innerHTML = fail;
    if (cryptoWatchTable) cryptoWatchTable.innerHTML = fail;

    if (cryptoTickerTrack) {
      cryptoTickerTrack.innerHTML = `
        <span class="ticker-item">
          <strong>Cripto</strong>
          <span>Falha na atualização</span>
        </span>
      `;
    }

    if (statBtc) statBtc.textContent = "Indisponível";
    if (btcMainStat) btcMainStat.textContent = "Indisponível";
    if (ethMainStat) ethMainStat.textContent = "Indisponível";

    console.error("[Pronuxfin] Erro em renderCrypto:", error);
  } finally {
    cryptoRenderInProgress = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCrypto();

  setInterval(() => {
    renderCrypto();
  }, REFRESH_INTERVALS.crypto);
});
