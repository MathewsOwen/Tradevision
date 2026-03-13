const AlphaCore = {
    banks: ["J.P. MORGAN", "GOLDMAN SACHS", "MORGAN STANLEY", "CITIGROUP", "HSBC", "BOFA", "BARCLAYS", "UBS", "DEUTSCHE BANK", "WELLS FARGO", "BNP PARIBAS", "SANTANDER", "NOMURA", "MIZUHO", "CREDIT AGRICOLE", "SOCIETE GENERALE", "UBS GROUP", "RBC", "TD BANK", "MITSUBISHI"],
    
    // Ações da tua planilha
    gainers: ["PETR4", "VALE3", "ITUB4", "NVDA", "TSLA"],
    losers: ["MGLU3", "AMER3", "AZUL4", "INTC", "PYPL"],

    init() {
        this.buildTicker();
        this.buildMovers();
        this.loadTradingView("BMFBOVESPA:IBOV"); // Inicia com o Ibovespa
        this.launchClock();
    },

    loadTradingView(symbol) {
        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "America/Sao_Paulo",
            "theme": "dark",
            "style": "1",
            "locale": "br",
            "toolbar_bg": "#050505",
            "enable_publishing": false,
            "hide_top_toolbar": false,
            "container_id": "tradingview_alpha",
            "backgroundColor": "#080808",
            "gridColor": "#1a1a1a"
        });
    },

    buildTicker() {
        const container = document.getElementById('bankTicker');
        [...this.banks, ...this.banks].forEach(b => {
            const div = document.createElement('div');
            div.className = 'bank-unit';
            div.innerHTML = `${b} <span>+${(Math.random()*2).toFixed(2)}%</span>`;
            container.appendChild(div);
        });
    },

    buildMovers() {
        const gCont = document.getElementById('gainers');
        const lCont = document.getElementById('losers');
        
        const createRow = (s, isUp) => {
            const row = document.createElement('div');
            row.className = 'mover-row';
            row.innerHTML = `<span>${s}</span><span class="${isUp ? 'up' : 'down'}">${isUp ? '+' : '-'}${(Math.random()*5).toFixed(2)}%</span>`;
            // AO CLICAR, O GRÁFICO MUDA!
            row.onclick = () => this.loadTradingView(isUp ? `BMFBOVESPA:${s}` : `BMFBOVESPA:${s}`);
            return row;
        };

        this.gainers.forEach(s => gCont.appendChild(createRow(s, true)));
        this.losers.forEach(s => lCont.appendChild(createRow(s, false)));
    },

    launchClock() {
        setInterval(() => {
            document.getElementById('clock').innerText = new Date().toLocaleTimeString();
        }, 1000);
    }
};

document.addEventListener('DOMContentLoaded', () => AlphaCore.init());
