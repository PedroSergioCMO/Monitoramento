function toggleTheme() {
  document.body.classList.toggle('light-mode');
  
  // Atualizar todos os elementos que podem ter cores específicas
  const themeDependentElements = document.querySelectorAll('[data-theme-dependent]');
  themeDependentElements.forEach(el => {
    el.classList.toggle('light-mode');
  });
  
  // Atualizar texto e ícone do botão - CORREÇÃO AQUI
  const themeButtons = document.querySelectorAll('.theme-toggle');
  themeButtons.forEach(btn => {
    const isLightMode = document.body.classList.contains('light-mode');
    btn.innerHTML = isLightMode ? '<i class="fas fa-moon"></i> Modo Escuro' : '<i class="fas fa-sun"></i> Modo Claro';
    btn.setAttribute('aria-pressed', isLightMode);
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
      btn.innerHTML = '<i class="fas fa-moon"></i> Modo Escuro';
      btn.setAttribute('aria-pressed', 'true');
    });
  } else {
    const themeButtons = document.querySelectorAll('.theme-toggle');
    themeButtons.forEach(btn => {
      btn.innerHTML = '<i class="fas fa-sun"></i> Modo Claro';
      btn.setAttribute('aria-pressed', 'false');
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