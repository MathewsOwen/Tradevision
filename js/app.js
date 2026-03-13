document.addEventListener('DOMContentLoaded', () => {
    const graphArea = document.getElementById('graphArea');

    // Gera as barras do gráfico dinamicamente
    for (let i = 0; i < 35; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        const height = Math.floor(Math.random() * 200) + 50;
        candle.style.height = `${height}px`;
        graphArea.appendChild(candle);
    }

    // Animação das barras (Simulando Mercado Vivo)
    setInterval(() => {
        const candles = document.querySelectorAll('.candle');
        candles.forEach(c => {
            const change = Math.floor(Math.random() * 20) - 10;
            let currentHeight = parseInt(c.style.height);
            c.style.height = `${Math.max(20, currentHeight + change)}px`;
        });
    }, 1000);

    document.getElementById('loginBtn').addEventListener('click', () => {
        alert('FIREBASE_CONNECTION: Estabelecendo túnel de dados...');
    });
});
