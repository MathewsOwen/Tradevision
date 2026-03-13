const AlphaCore = {
    assets: [
        { s: "PETR4", n: "Petrobras", t: "up" },
        { s: "VALE3", n: "Vale SA", t: "up" },
        { s: "ITUB4", n: "Itaú Unibanco", t: "up" },
        { s: "MGLU3", n: "Magaz. Luiza", t: "down" },
        { s: "AMER3", n: "Americanas", t: "down" }
    ],

    init() {
        this.renderTicker();
        this.renderMovers();
        this.initTV("BMFBOVESPA:IBOV");
    },

    initTV(symbol) {
        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "America/Sao_Paulo",
            "theme": "light", // MUDAMOS PARA LIGHT PARA PASSAR MAIS CONFIANÇA
            "style": "1",
            "locale": "br",
            "container_id": "tradingview_alpha",
            "backgroundColor": "#ffffff",
            "gridColor": "#f0f3fa"
        });
    },

    renderTicker() {
        const div = document.getElementById('bankTicker');
        const banks = ["IBOV", "DÓLAR", "S&P 500", "NASDAQ", "BITCOIN"];
        [...banks, ...banks].forEach(b => {
            div.innerHTML += `<div class="ticker-item">${b} <b>+${(Math.random()*2).toFixed(2)}%</b></div>`;
        });
    },

    renderMovers() {
        const list = document.getElementById('moversList');
        this.assets.forEach(a => {
            const row = document.createElement('div');
            row.className = 'mover-row';
            row.innerHTML = `<span>${a.s}</span><span style="color: ${a.t === 'up' ? '#008000' : '#d91a1a'}">${a.t === 'up' ? '▲' : '▼'} ${(Math.random()*4).toFixed(2)}%</span>`;
            row.onclick = () => {
                document.querySelector('.asset-info h1').innerText = a.n;
                document.querySelector('.symbol').innerText = `${a.s} // Ação Ordinária`;
                this.initTV(`BMFBOVESPA:${a.s}`);
            };
            list.appendChild(row);
        });
    }
};

document.addEventListener('DOMContentLoaded', () => AlphaCore.init());
