/**
 * PRONUXFIN - Market Data Engine
 * Gerencia chamadas de APIs globais com tratamento de erros
 */

const MarketAPI = {
    // Configurações de endpoints
    endpoints: {
        crypto: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true",
        // No futuro, você pode adicionar endpoints de ações aqui
    },

    /**
     * Formata números para o padrão monetário USD
     */
    formatUSD(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    },

    /**
     * Busca e renderiza preços de Criptomoedas
     */
    async loadCrypto() {
        try {
            const response = await fetch(this.endpoints.crypto);
            
            if (!response.ok) throw new Error("Falha na rede");
            
            const data = await response.json();

            // Elementos do DOM
            const btcEl = document.getElementById("btcPrice");
            const ethEl = document.getElementById("ethPrice");

            if (btcEl) {
                btcEl.innerText = this.formatUSD(data.bitcoin.usd);
                this.applyChangeStyle(btcEl, data.bitcoin.usd_24h_change);
            }

            if (ethEl) {
                ethEl.innerText = this.formatUSD(data.ethereum.usd);
                this.applyChangeStyle(ethEl, data.ethereum.usd_24h_change);
            }

            console.log("✅ Dados Cripto atualizados");

        } catch (error) {
            console.error("❌ Erro ao carregar Cripto:", error);
            this.setOfflineStatus(["btcPrice", "ethPrice"]);
        }
    },

    /**
     * Aplica cor baseada na variação (Opcional, caso queira o texto colorido)
     */
    applyChangeStyle(el, change) {
        if (!el) return;
        // Se a variação for positiva, podemos dar um leve brilho
        el.style.transition = "color 0.5s ease";
        if (change > 0) {
            el.style.color = "var(--green, #00f5d4)";
        } else {
            el.style.color = "var(--red, #ff5d8f)";
        }
    },

    /**
     * Mostra status de offline caso a API falhe
     */
    setOfflineStatus(ids) {
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = "Serviço Indisponível";
        });
    },

    /**
     * Inicializa todas as chamadas
     */
    init() {
        this.loadCrypto();
        // Atualiza os preços automaticamente a cada 2 minutos para não travar a API gratuita
        setInterval(() => this.loadCrypto(), 120000);
    }
};

// Inicia o motor de busca quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => MarketAPI.init());
