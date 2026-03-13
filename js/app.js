/**
 * AlphaMarketCap Engine V4.1 - Asset Integration
 * Recuperando ativos da base de dados Alpha
 */

const AlphaCore = {
    // OS 20 MAIORES BANCOS (Para o Ticker superior)
    banks: [
        "J.P. MORGAN", "GOLDMAN SACHS", "MORGAN STANLEY", "CITIGROUP", "HSBC", 
        "BOFA", "BARCLAYS", "UBS", "DEUTSCHE BANK", "WELLS FARGO", 
        "BNP PARIBAS", "SANTANDER", "NOMURA", "MIZUHO", "CREDIT AGRICOLE", 
        "SOCIETE GENERALE", "UBS GROUP", "RBC", "TD BANK", "MITSUBISHI"
    ],

    // ATIVOS DA NOSSA PLANILHA (Para o Painel Lateral)
    gainers: ["PETR4", "VALE3", "ITUB4", "NVDA", "TSLA", "AAPL"],
    losers: ["MGLU3", "AMER3", "AZUL4", "INTC", "PYPL", "BABA"],

    init() {
        this.buildTicker();
        this.buildChart();
        this.buildMovers();
        this.launchLoops();
        console.log("AlphaCore: Ativos da planilha carregados com sucesso.");
    },

    buildTicker() {
        const container = document.getElementById('bankTicker');
        if (!container) return;
        // Duplicando para o efeito infinito de Senior
        [...this.banks, ...this.banks].forEach(b => {
            const div = document.createElement('div');
            div.className = 'bank-unit';
            const pts = (Math.random() * 1000 + 500).toFixed(2);
            div.innerHTML = `${b} <span>${pts} PTS</span>`;
            container.appendChild(div);
        });
    },

    buildChart() {
        const chart = document.getElementById('mainChart');
        if (!chart) return;
        for(let i=0; i < 35; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${Math.random() * 70 + 20}%`;
            chart.appendChild(bar);
        }
    },

    buildMovers() {
        const gContainer = document.getElementById('gainers');
        const lContainer = document.getElementById('losers');
        
        if (!gContainer || !lContainer) return;

        gContainer.innerHTML = ''; 
        lContainer.innerHTML = '';

        this.gainers.forEach(s => {
            const val = (Math.random() * 5 + 1).toFixed(2);
            gContainer.innerHTML += `
                <div class="mover-row" onclick="alert('Iniciando análise profunda de ${s}')">
                    <span>${s}</span>
                    <span class="up">+${val}%</span>
                </div>`;
        });

        this.losers.forEach(s => {
            const val = (Math.random() * 5 + 1).toFixed(2);
            lContainer.innerHTML += `
                <div class="mover-row" onclick="alert('Alerta de queda: Monitorando ${s}')">
                    <span>${s}</span>
                    <span class="down">-${val}%</span>
                </div>`;
        });
    },

    launchLoops() {
        setInterval(() => {
            // Atualiza relógio
            const clock = document.getElementById('clock');
            if (clock) clock.innerText = new Date().toLocaleTimeString();
            
            // Movimenta gráfico
            document.querySelectorAll('.bar').forEach(b => {
                let h = parseFloat(b.style.height);
                b.style.height = `${Math.max(15, Math.min(95, h + (Math.random() * 10 - 5)))}%`;
            });
        }, 1000);
    }
};

document.addEventListener('DOMContentLoaded', () => AlphaCore.init());
