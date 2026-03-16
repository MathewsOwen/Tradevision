function getChangeClass(change) {
  if (String(change).startsWith("+")) return "positive";
  if (String(change).startsWith("-")) return "negative";
  return "neutral";
}

function getDotClassByChange(change) {
  if (String(change).startsWith("+")) return "green";
  if (String(change).startsWith("-")) return "red";
  return "blue";
}

function createEmptyRow(colspan, message) {
  return `
    <tr>
      <td colspan="${colspan}" class="empty-state">${message}</td>
    </tr>
  `;
}

function formatUsd(value) {
  if (typeof value !== "number") return "--";
  return value.toLocaleString("en-US");
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof TradingView !== "undefined" && document.getElementById("tradingview_chart")) {
    new TradingView.widget({
      autosize: true,
      symbol: "BMFBOVESPA:IBOV",
      interval: "D",
      timezone: "America/Sao_Paulo",
      theme: "dark",
      style: "1",
      locale: "br",
      toolbar_bg: "#0f172a",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: "tradingview_chart"
    });
  }
});
