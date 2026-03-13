/**
 * AlphaMarketCap Core Engine
 * Versão 3.1 - Profissional
 */

const App = {
    init() {
        this.renderChart();
        this.startPricePulse();
        this.setupEventListeners();
        console.log("AlphaMarketCap: Core Engine Ready.");
    },

    renderChart() {
        const container = document.getElementById('chartContainer');
        const candleCount = 40;

        for (let i = 0; i < candleCount; i++) {
            const candle = document.createElement('div');
            candle.className = 'candle';
            candle.style.height = `${Math.floor(Math.random() * 60) + 20}%`;
            container.appendChild(candle);
        }
    },

    startPricePulse() {
        setInterval(() => {
            const candles = document.querySelectorAll('.candle');
            candles.forEach(c => {
                const currentHeight = parseFloat(c.style.height);
                const volatility = (Math.random() * 10) - 5;
                const newHeight = Math.max(10, Math.min(95, currentHeight + volatility));
                c.style.height = `${newHeight}%`;
            });
        }, 800);
    },

    setupEventListeners() {
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.addEventListener('click', () => {
            this.logActivity("Login Attempt via Secure Gateway");
            alert("SISTEMA CORPORATIVO: Aguardando integração final do Firebase.");
        });
    },

    logActivity(msg) {
        const now = new Date().toLocaleTimeString();
        console.log(`[${now}] ALPHA_LOG: ${msg}`);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
