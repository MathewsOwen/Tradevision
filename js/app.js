const AlphaCore = {
    banks: ["J.P. MORGAN", "GOLDMAN SACHS", "MORGAN STANLEY", "CITIGROUP", "HSBC", "BOFA", "BARCLAYS", "UBS", "DEUTSCHE BANK", "WELLS FARGO", "BNP PARIBAS", "SANTANDER", "NOMURA", "MIZUHO", "CREDIT AGRICOLE", "SOCIETE GENERALE", "UBS GROUP", "RBC", "TD BANK", "MITSUBISHI"],

    init() {
        this.buildTicker();
        this.buildChart();
        this.buildMovers();
        this.launchLoops();
    },

    buildTicker() {
        const container = document.getElementById('bankTicker');
        [...this.banks, ...this.banks].forEach(b => {
            const div = document.createElement('div');
            div.className = 'bank-unit';
            div.innerHTML = `${b} <span>+${(Math.random()*5).toFixed(2)}%</span>`;
            container.appendChild(div);
        });
    },

    buildChart() {
        const chart = document.getElementById('mainChart');
        for(let i=0; i < 35; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${Math.random() * 70 + 20}%`;
            bar.onclick = () => alert("SISTEMA: Analisando volatilidade do bloco...");
            chart.appendChild(bar);
        }
    },

    buildMovers() {
        const gainers = ["PETR4", "VALE3", "ITUB4", "BBDC4", "RENT3"];
        const losers = ["MGLU3", "AMER3", "VIIA3", "AZUL4", "CVCB3"];

        const render = (list, id, isUp) => {
            const el = document.getElementById(id);
            list.forEach(s => {
                el.innerHTML += `
                <div class="mover-row" onclick="alert('Trade em ${s} disponível.')">
                    <span>${s}</span>
                    <span class="${isUp ? 'up' : 'down'}">${isUp ? '+' : '-'}${(Math.random()*6).toFixed(2)}%</span>
                </div>`;
            });
        };
        render(gainers, 'gainers', true);
        render(losers, 'losers', false);
    },

    launchLoops() {
        setInterval(() => {
            document.getElementById('clock').innerText = new Date().toLocaleTimeString();
            document.querySelectorAll('.bar').forEach(b => {
                let h = parseFloat(b.style.height);
                b.style.height = `${Math.max(15, Math.min(95, h + (Math.random() * 12 - 6)))}%`;
            });
        }, 1000);
    }
};

document.addEventListener('DOMContentLoaded', () => AlphaCore.init());
