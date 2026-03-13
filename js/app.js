// Aguarda o documento carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    console.log("AlphaMarketCap: Terminal Inicializado com Sucesso.");

    const loginBtn = document.getElementById('loginBtn');

    // Função de clique no botão de acesso
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            // Alerta temporário antes da implementação do Firebase
            alert('SISTEMA ALPHA: Iniciando protocolo de autenticação segura...');
            console.log("Tentativa de login detectada. Aguardando integração Firebase.");
        });
    }
});
