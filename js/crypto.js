function renderCrypto(crypto) {
  const container = document.getElementById("crypto-cards");
  container.innerHTML = "";

  crypto.forEach(c => {
    const card = `
      <div class="card">
        <h3>${c.symbol}</h3>
        <p>R$ ${c.priceBRL.toLocaleString()}</p>
        <span style="color:${c.change24h >= 0 ? "lime" : "red"}">
          ${c.change24h.toFixed(2)}%
        </span>
      </div>
    `;
    container.innerHTML += card;
  });
}
