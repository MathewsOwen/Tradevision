window.addEventListener('load', () => {
    // Garante que o splash apareça por pelo menos 3 segundos
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const main = document.getElementById('main-content');

        splash.style.transition = 'opacity 1s';
        splash.style.opacity = '0';
        
        setTimeout(() => {
            splash.style.display = 'none';
            main.style.display = 'block';
            document.body.style.overflow = 'auto';
        }, 1000);
    }, 3000);
});

// Ação do botão de login
document.getElementById('loginBtn').addEventListener('click', () => {
    alert('Conectando ao servidor Alpha... O sistema de usuários será implementado via Firebase.');
});
