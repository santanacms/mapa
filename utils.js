// utils.js

/**
 * Exibe um alerta na página.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} [type='success'] - O tipo de alerta (success, danger, warning, info).
 * @param {string} [placeholderId='alertPlaceholder'] - O ID do elemento onde o alerta será inserido.
 */
function showAlert(message, type = 'success', placeholderId = 'alertPlaceholder') {
  const alertPlaceholder = document.getElementById(placeholderId);
  if (alertPlaceholder) {
    // Remove alertas existentes para evitar acúmulo
    alertPlaceholder.innerHTML = '';

    const wrapper = document.createElement('div');
    const iconClass = type === 'danger' ? 'fa-exclamation-triangle' :
                      type === 'success' ? 'fa-check-circle' :
                      type === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle';

    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <i class="fas ${iconClass} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    alertPlaceholder.appendChild(wrapper);
  } else {
    console.warn(`Elemento com ID '${placeholderId}' não encontrado para exibir alerta.`);
    // Fallback para alert nativo se o placeholder não existir
    alert(`${type.toUpperCase()}: ${message}`);
  }
}

/**
 * Corrige URLs de PDF que podem não ter o prefixo /media/.
 * @param {string} url - A URL do PDF.
 * @returns {string} A URL corrigida ou a original se não precisar de correção.
 */
function fixPdfUrl(url) {
  if (url && typeof url === 'string' && !url.includes('/media/')) {
    return url.replace('/sapl/public/', '/media/sapl/public/');
  }
  return url;
}

// Adicione outras funções utilitárias comuns aqui, por exemplo:
/**
 * Verifica se um usuário está autenticado e redireciona para o login se não estiver.
 * @param {object} authInstance - A instância do Firebase Auth.
 * @param {string} [loginPage='index.html'] - A página de login para redirecionar.
 */
function ensureAuthenticated(authInstance, loginPage = 'index.html') {
  if (!authInstance) {
    console.error("Instância do Firebase Auth não fornecida para ensureAuthenticated.");
    return;
  }
  authInstance.onAuthStateChanged(user => {
    if (!user) {
      console.log("Usuário não autenticado. Redirecionando para o login.");
      window.location.href = loginPage;
    } else {
      console.log("Usuário autenticado:", user.email);
    }
  });
}

/**
 * Configura o botão de logout.
 * @param {object} authInstance - A instância do Firebase Auth.
 * @param {string} buttonId - O ID do botão de logout.
 * @param {string} [loginPage='index.html'] - A página para redirecionar após o logout.
 */
function setupLogoutButton(authInstance, buttonId, loginPage = 'index.html') {
    const btnLogout = document.getElementById(buttonId);
    if (btnLogout && authInstance) {
        btnLogout.addEventListener('click', () => {
            authInstance.signOut()
                .then(() => {
                    showAlert('Você foi desconectado com sucesso.', 'success');
                    // Atraso para o usuário ver a mensagem antes de redirecionar
                    setTimeout(() => {
                        window.location.href = loginPage;
                    }, 1500);
                })
                .catch(error => {
                    console.error('Erro ao fazer logout:', error);
                    showAlert('Erro ao fazer logout: ' + error.message, 'danger');
                });
        });
    } else if (!btnLogout) {
        console.warn(`Botão de logout com ID '${buttonId}' não encontrado.`);
    } else {
        console.warn("Instância do Firebase Auth não fornecida para setupLogoutButton.");
    }
}