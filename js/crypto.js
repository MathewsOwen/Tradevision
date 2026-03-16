document.addEventListener("DOMContentLoaded", async () => {
  const cryptoTable = document.getElementById("cryptoTable");
  const homeCryptoTable = document.getElementById("homeCryptoTable");
  const statBtc = document.getElementById("statBtc");

  const loading = createEmptyRow(3, "Carregando dados de criptomoedas...");

  if (cryptoTable) cryptoTable.innerHTML = loading;
  if (homeCryptoTable) homeCryptoTable.innerHTML = loading;

  try {
    const data = await fetchCryptoPrices();

    const cryptos = [
      { name: "Bitcoin", price: data?.bitcoin?.usd, status: "Monitorando" },
      { name: "Ethereum", price: data?.ethereum?.usd, status: "Monitorando" },
      { name: "Solana", price: data?.solana?.usd, status: "Monitorando" },
      { name: "BNB", price: data?.binancecoin?.usd, status: "Monitorando" },
      { name: "XRP", price: data?.ripple?.usd, status: "Monitorando" }
    ];

    const renderRows = (list) =>
      list
        .map((crypto) => `
          <tr>
            <td>${crypto.name}</td>
            <td>$${formatUsd(crypto.price)}</td>
            <td>
              <span class="status">
                <span class="dot blue"></span>
                ${crypto.status}
              </span>
            </td>
          </tr>
        `)
        .join("");

    if (cryptoTable) {
      cryptoTable.innerHTML = renderRows(cryptos);
    }

    if (homeCryptoTable) {
      homeCryptoTable.innerHTML = renderRows(cryptos.slice(0, 5));
    }

    if (statBtc && typeof data?.bitcoin?.usd === "number") {
      statBtc.textContent = `$${formatUsd(data.bitcoin.usd)}`;
    }
  } catch (error) {
    const fail = createEmptyRow(3, "Não foi possível carregar os dados agora.");
    if (cryptoTable) cryptoTable.innerHTML = fail;
    if (homeCryptoTable) homeCryptoTable.innerHTML = fail;
    if (statBtc) statBtc.textContent = "Indisponível";
  }
});
