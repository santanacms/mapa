    // theme-switcher.js
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle'); // ID padronizado para o botão
  const htmlElement = document.documentElement;

  const applyTheme = (theme) => {
    htmlElement.setAttribute('data-bs-theme', theme);
    if (themeToggle) {
      if (theme === 'dark') {
        themeToggle.innerHTML = '<i class="fas fa-sun me-1"></i> Modo Claro';
      } else {
        themeToggle.innerHTML = '<i class="fas fa-moon me-1"></i> Modo Escuro';
      }
    }

    // Dispara um evento personalizado para que páginas específicas (como as com mapas) possam reagir
    const event = new CustomEvent('themeChanged', { detail: { theme: theme } });
    document.dispatchEvent(event);
  };

  const toggleTheme = () => {
    const currentTheme = htmlElement.getAttribute('data-bs-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // Aplica o tema salvo ou o padrão ao carregar a página
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Tenta detectar preferência do sistema, senão usa 'light'
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  } else {
    // Tenta encontrar outros botões com IDs comuns se 'themeToggle' não existir
    const commonThemeButtonIds = ['toggleDarkMode', 'darkModeToggle'];
    let foundButton = null;
    for (const id of commonThemeButtonIds) {
        foundButton = document.getElementById(id);
        if (foundButton) {
            console.warn(`Botão de tema encontrado com ID '${id}'. Padronize para 'themeToggle'.`);
            foundButton.addEventListener('click', toggleTheme);
            // Atualiza o texto do botão encontrado
            if (htmlElement.getAttribute('data-bs-theme') === 'dark') {
                foundButton.innerHTML = '<i class="fas fa-sun me-1"></i> Modo Claro';
            } else {
                foundButton.innerHTML = '<i class="fas fa-moon me-1"></i> Modo Escuro';
            }
            break;
        }
    }
    if (!foundButton) {
        console.warn("Botão de alternância de tema ('themeToggle') não encontrado.");
    }
  }
});