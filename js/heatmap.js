document.addEventListener("DOMContentLoaded", () => {
  const heatmapGrid = document.getElementById("heatmapGrid");
  const topGainer = document.getElementById("heatmapTopGainer");
  const topLoser = document.getElementById("heatmapTopLoser");

  if (!heatmapGrid) return;

  const assets = [
    { symbol: "PETR4", name: "Petrobras", change: 1.82, size: "large" },
    { symbol: "VALE3", name: "Vale", change: -0.95, size: "large" },
    { symbol: "ITUB4", name: "Itaú", change: 0.74, size: "medium" },
    { symbol: "WEGE3", name: "WEG", change: 1.10, size: "medium" },
    { symbol: "BBAS3", name: "Banco do Brasil", change: -0.38, size: "medium" },
    { symbol: "BBDC4", name: "Bradesco", change: 0.28, size: "medium" },
    { symbol: "MGLU3", name: "Magazine Luiza", change: 2.14, size: "small" },
    { symbol: "ELET3", name: "Eletrobras", change: -0.42, size: "small" },
    { symbol: "ABEV3", name: "Ambev", change: 0.19, size: "small" },
    { symbol: "RENT3", name: "Localiza", change: -0.61, size: "small" }
  ];

  const sortedPositive = [...assets].sort((a, b) => b.change - a.change);
  const sortedNegative = [...assets].sort((a, b) => a.change - b.change);

  if (topGainer) topGainer.textContent = sortedPositive[0].symbol;
  if (topLoser) topLoser.textContent = sortedNegative[0].symbol;

  function getHeatColor(change) {
    if (change >= 2) return "heat-strong-green";
    if (change > 0) return "heat-green";
    if (change <= -1) return "heat-strong-red";
    return "heat-red";
  }

  function getAssetUrl(symbol) {
    return `ativos/ativo.html?symbol=${symbol}`;
  }

  heatmapGrid.innerHTML = assets
    .map(
      (asset) => `
        <a href="${getAssetUrl(asset.symbol)}" class="heatmap-card ${asset.size} ${getHeatColor(asset.change)}">
          <span class="heatmap-symbol">${asset.symbol}</span>
          <span class="heatmap-name">${asset.name}</span>
          <span class="heatmap-change">${asset.change >= 0 ? "+" : ""}${asset.change.toFixed(2)}%</span>
        </a>
      `
    )
    .join("");
});
