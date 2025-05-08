function toggleTheme() {
  document.body.classList.toggle('light-mode');
  
  // Atualizar todos os elementos que podem ter cores específicas
  const themeDependentElements = document.querySelectorAll('[data-theme-dependent]');
  themeDependentElements.forEach(el => {
    el.classList.toggle('light-mode');
  });
  
  // Atualizar texto do botão
  const themeButtons = document.querySelectorAll('.theme-toggle');
  themeButtons.forEach(btn => {
    btn.textContent = document.body.classList.contains('light-mode') ? '🌙 Modo Escuro' : '☀️ Modo Claro';
    btn.setAttribute('aria-pressed', document.body.classList.contains('light-mode'));
  });
  
  // Salvar preferência
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    const themeButtons = document.querySelectorAll('.theme-toggle');
    themeButtons.forEach(btn => {
      btn.textContent = '🌙 Modo Escuro';
      btn.setAttribute('aria-pressed', 'true');
    });
  }
  
  // Garantir que todos os textos tenham contraste adequado
  document.querySelectorAll('body, h1, h2, h3, p, span, div').forEach(el => {
    el.style.color = '';
  });
}

// Carregar tema quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  
  // Adicionar atributos ARIA para acessibilidade
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', 'Alternar tema claro/escuro');
    themeToggle.setAttribute('role', 'button');
  }
});