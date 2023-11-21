// ---------------------------------------- FUNÇÃO DA PAGINA LOGADA ---------------------------------------- //
// Faça uma solicitação para obter o token JWT e o nome do usuário do servidor
const profile = document.getElementById('userNameLink');
const profileDrop = document.getElementById('uname');

fetch('/obter-token', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // Agora você pode acessar tanto o token quanto o nome do usuário
    const seuTokenJWT = data.token.token;
    const userName = data.token.userName;
    // Insira o token no localStorage
    localStorage.setItem('token', seuTokenJWT);
    profile.textContent = userName;
    profileDrop.textContent = userName;
    // Agora você pode usar 'seuTokenJWT' e 'userName' nas suas solicitações autenticadas
  })
  .catch((error) => {
    console.error('Erro ao obter dados do usuário:', error);
  });

const userTab = document.getElementById('user');
const dropdown = document.getElementById('navprofile-dropdown');

let isExpanded = false; // Variável para controlar se o dropdown está expandido ou não

// Adicione um evento de clique à aba do usuário
userTab.addEventListener('click', (event) => {
  event.stopPropagation(); // Impede a propagação do clique para o documento
  // Alterne o estado do dropdown
  isExpanded = !isExpanded;

  // Adicione ou remova a classe 'expanded' com base no estado
  if (isExpanded) {
    dropdown.style.display = 'block';
  } else {
    dropdown.style.display = 'none';
  }
});

// Adicione um evento de clique ao documento inteiro para fechar o dropdown quando clicar em qualquer outro lugar
document.addEventListener('click', (event) => {
  if (isExpanded && event.target !== userTab) {
    // Fecha o dropdown
    isExpanded = false;
    dropdown.style.display = 'none';
  }
});

// Adicione um evento de clique ao dropdown para evitar o fechamento quando clicado no próprio dropdown
dropdown.addEventListener('click', (event) => {
  event.stopPropagation(); // Impede a propagação do clique para o documento
});

// Opcional: Adicione um evento de clique para fechar o dropdown quando a janela é redimensionada
window.addEventListener('resize', () => {
  if (isExpanded) {
    isExpanded = false;
    dropdown.style.display = 'none';
  }
});

// Função para fazer logout
function logout() {
  // Remova o token do localStorage
  localStorage.removeItem('token');

  // Redirecione o usuário para a página de login
  window.location.href = '/login'; // Substitua '/login' pela URL da sua página de login
}


// ---------------------------------------- FUNCOES NA TELA DE MAPS ---------------------------------------- //