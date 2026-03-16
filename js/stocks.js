/**
 * PRONUXFIN - Real-Time Stock Engine
 * Simula a volatilidade do pregão B3 com indicadores visuais
 */

const StockEngine = {
    // Dados iniciais (Base)
    data: [
        { symbol: "PETR4", name: "Petrobras", price: 38.50, change: 0 },
        { symbol: "VALE3", name: "Vale ON", price: 66.20, change: 0 },
        { symbol: "ITUB4", name: "Itaú Unibanco", price: 31.90, change: 0 },
        { symbol: "WEGE3", name: "Weg ON", price: 45.10, change: 0 },
        { symbol: "BBDC4", name: "Bradesco PN", price: 14.25, change: 0 },
        { symbol: "MGLU3", name: "Magalu ON", price: 2.15, change: 0 }
    ],

    init() {
        this.render();
        // Inicia a simulação de oscilação a cada 3 segundos
        setInterval(() => this.simulateMarketMove(), 3000);
    },

    simulateMarketMove() {
        this.data = this.data.map(stock => {
            // Gera uma oscilação aleatória entre -0.5% e +0.5%
            const move = (Math.random() * 0.01) - 0.005;
            const newPrice = stock.price * (1 + move);
            
            return {
                ...stock,
                lastPrice: stock.price, // Guarda o preço anterior para comparar
                price: newPrice,
                change: ((newPrice / (stock.price / (1 + (stock.change / 100)))) - 1) * 100
            };
        });
        this.render();
    },

    render() {
        const table = document.getElementById("stocksTable");
        if (!table) return;

        table.innerHTML = this.data.map(s => {
            const isUp = s.price >= (s.lastPrice || s.price);
            const trendClass = isUp ? 'up-pulse' : 'down-pulse';
            
            return `
                <div class="market-row-premium">
                    <div class="stock-info">
                        <span class="stock-symbol">${s.symbol}</span>
                        <small class="stock-name">${s.name}</small>
                    </div>
                    <div class="stock-price-box">
                        <span class="stock-price ${trendClass}">
                            R$ ${s.price.toFixed(2)}
                        </span>
                        <span class="stock-percent ${s.change >= 0 ? 'up' : 'down'}">
                            ${s.change >= 0 ? '+' : ''}${s.change.toFixed(2)}%
                        </span>
                    </div>
                </div>
            `;
        }).join("");
    }
};

document.addEventListener("DOMContentLoaded", () => StockEngine.init());
