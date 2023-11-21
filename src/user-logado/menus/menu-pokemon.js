// ---------------------------------------- FUNÇÃO DA PAGINA LOGADA ---------------------------------------- //
// Faça uma solicitação para obter o token JWT e o nome do usuário do servidor
const profile = document.getElementById('userNameLink');
const profileDrop = document.getElementById('uname');
let infoPokeUser = [];

fetch('/obter-token', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const seuTokenJWT = data.token.token;
    const userName = data.token.userName;
    const idUser = data.token.idUser;

    localStorage.setItem('token', seuTokenJWT);
    profile.textContent = userName;
    profileDrop.textContent = userName;

    // Nova solicitação para obter os Pokémons do usuário
    return fetch(`/pokemon-usuario?usuarioId=${idUser}`, {
      method: 'GET',
    });
  })
  .then(response => response.json())
  .then(data => {
    console.log('Pokémons do usuário:', data);
    populatePokemonDetails(data)
  })
  .catch((error) => {
    console.error('Erro ao obter dados:', error);
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


// ---------------------------------------- FUNCOES NA TELA DE POKEMONS ---------------------------------------- //
function populatePokemonDetails(pokemons) {
  const container = document.getElementById('pokemonContainer');
  if (pokemons) {
    const msgPoke = document.getElementById('noPoke')
    msgPoke.style.display = 'none';
    pokemons.forEach(pokemon => {
      const pokemonRow = document.createElement('div');
      pokemonRow.classList.add('row');

      const imgDiv = document.createElement('div');
      imgDiv.classList.add('name');
      const img = document.createElement('img');
      img.src = pokemon.PokemonImageUrl;
      img.alt = pokemon.PokemonNome;
      img.title = pokemon.PokemonNome;
      imgDiv.appendChild(img);
      const name = document.createElement('h4');
      name.textContent = pokemon.PokemonNome;
      imgDiv.appendChild(name);
      pokemonRow.appendChild(imgDiv);

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('info');
      const level = document.createElement('div');
      level.innerHTML = `<b>Level:</b> ${pokemon.Level}`;
      infoDiv.appendChild(level);
      const exp = document.createElement('div');
      let xp = pokemon.Experience
      let xp_formatado = Number(xp).toLocaleString('en-US')
      console.log(xp_formatado)
      exp.innerHTML = `<b>Exp:</b> ${xp_formatado}`;
      infoDiv.appendChild(exp);
      const typeDiv = document.createElement('div');
      typeDiv.classList.add('itype');
      const primaryTypeIcon = document.createElement('i');
      primaryTypeIcon.className = 'tbtn tbtn-' + pokemon.PrimaryType;
      typeDiv.appendChild(primaryTypeIcon);
      if (pokemon.SecondaryType) {
        const secondaryTypeIcon = document.createElement('i');
        secondaryTypeIcon.className = 'tbtn tbtn-' + pokemon.SecondaryType;
        typeDiv.appendChild(secondaryTypeIcon);
      }
      infoDiv.appendChild(typeDiv);
      pokemonRow.appendChild(infoDiv);

      const movesDiv = document.createElement('div');
      movesDiv.classList.add('attk');
      const movesArray = pokemon.Moves.split(', ');
      movesArray.forEach(move => {
        const moveDiv = document.createElement('div');
        moveDiv.textContent = move;
        // Aqui você pode adicionar lógica para definir a classe baseada no tipo de movimento, se necessário.
        movesDiv.appendChild(moveDiv);
      });
      pokemonRow.appendChild(movesDiv);

      container.appendChild(pokemonRow);
    });
  } else {
    const msgPoke = document.getElementById('noPoke')
    msgPoke.style.display = 'block';
  }
}