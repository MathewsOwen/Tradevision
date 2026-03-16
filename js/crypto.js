document.addEventListener("DOMContentLoaded", async () => {
  const cryptoTable = document.getElementById("cryptoTable");
  if (!cryptoTable) return;

  cryptoTable.innerHTML = `
    <tr>
      <td colspan="3" class="empty-state">Carregando dados de criptomoedas...</td>
    </tr>
  `;

  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error("Falha na resposta da API");
    }

    const data = await response.json();

    const cryptos = [
      { name: "Bitcoin", price: data?.bitcoin?.usd, status: "Monitorando" },
      { name: "Ethereum", price: data?.ethereum?.usd, status: "Monitorando" },
      { name: "Solana", price: data?.solana?.usd, status: "Monitorando" }
    ];

    cryptoTable.innerHTML = cryptos
      .map((crypto) => `
        <tr>
          <td>${crypto.name}</td>
          <td>$${crypto.price ?? "--"}</td>
          <td>
            <span class="status">
              <span class="dot blue"></span>
              ${crypto.status}
            </span>
          </td>
        </tr>
      `)
      .join("");
  } catch (error) {
    cryptoTable.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">Não foi possível carregar os dados agora.</td>
      </tr>
    `;
  }
});
