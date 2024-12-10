function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = isDark ? '☀️' : '☀️';
}

// Verificar preferência de tema do sistema
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.querySelector('.theme-toggle').textContent = '☀️';
}

// Animação suave ao rolar para as seções
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Adicionar funcionalidade ao botão de login
document.querySelector('.login-btn').addEventListener('click', function () {
    openLoginModal();
});

function openLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    // Prevenir scroll do body quando modal estiver aberto
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.remove('active');
    // Restaurar scroll do body
    document.body.style.overflow = 'auto';
}

// Fechar modal quando clicar fora dele
document.getElementById('loginModal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeLoginModal();
    }
});

// Fechar modal com tecla ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.getElementById('loginModal').classList.contains('active')) {
        closeLoginModal();
    }
});
