  document.addEventListener('DOMContentLoaded', () => {
      const loginSection = document.getElementById('loginSection');
      const toolsSection = document.getElementById('toolsSection');
      const loginForm = document.getElementById('loginForm');
      const userDisplayName = document.getElementById('userDisplayName');

      if (!auth) {
        showAlert("Erro crítico: Firebase Auth não foi inicializado. Verifique o console.", "danger");
        return;
      }
      
      // O link do mapa foi alterado para 'index.html'
      // O link do painel de edição continua para 'painel_edicao.html'
      // O link de atualização de dados continua para 'update.html'
      
      // Configura o botão de logout
      setupLogoutButton(auth, 'btnLogout', 'index.html');

      function toggleMenu(isLoggedIn, user = null) {
        if (isLoggedIn) {
          loginSection.style.display = 'none';
          toolsSection.style.display = 'block';
          if (user && userDisplayName) {
            userDisplayName.textContent = user.displayName || (user.email ? user.email.split('@')[0] : 'Usuário');
          }
        } else {
          loginSection.style.display = 'block';
          toolsSection.style.display = 'none';
        }
      }

      // Função showComingSoon não é mais necessária, já que as ferramentas foram removidas
      // window.showComingSoon = function() {
      //   showAlert('Esta ferramenta estará disponível em breve!', 'info');
      // }

      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();

          const emailInput = document.getElementById('email');
          const passwordInput = document.getElementById('password');
          const email = emailInput.value;
          const password = passwordInput.value;

          auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
              toggleMenu(true, userCredential.user);
              showAlert('Login realizado com sucesso!', 'success');
            })
            .catch((error) => {
              let errorMessage = 'Erro ao fazer login.';
              switch(error.code) {
                case 'auth/invalid-email':
                case 'auth/invalid-credential':
                  errorMessage = 'E-mail ou senha inválidos.';
                  break;
                case 'auth/user-disabled':
                  errorMessage = 'Usuário desativado.';
                  break;
                case 'auth/user-not-found':
                  errorMessage = 'Usuário não encontrado.';
                  break;
                case 'auth/wrong-password':
                  errorMessage = 'Senha incorreta.';
                  break;
                default:
                  errorMessage = `Erro: ${error.message}`;
              }
              showAlert(errorMessage, 'danger');
            });
        });
      }

      auth.onAuthStateChanged((user) => {
        if (user) {
          toggleMenu(true, user);
        } else {
          toggleMenu(false);
        }
      });
    });