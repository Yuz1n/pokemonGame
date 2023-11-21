// ---------------------------------------- FUNÇÃO DA PAGINA LOGADA ---------------------------------------- //
// Faça uma solicitação para obter o token JWT e o nome do usuário do servidor
const profile = document.getElementById('userNameLink');
const profileDrop = document.getElementById('uname');
let infoPokeUser = "";

fetch('/obter-token', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
  .then((response) => response.json())
  .then((data) => {
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
    infoPokeUser = data.map(pokemon => ({
      nome: pokemon.PokemonNome,
      tipo: pokemon.PrimaryType,
      tipo_secundario: pokemon.SecondaryType,
      imagemUrl: pokemon.PokemonImageUrl,
      level: pokemon.Level,
      vida: pokemon.hp,
      moves: pokemon.Moves.split(","),
      moves_types: pokemon.Moves_Types.split(",")
    }))
    localStorage.setItem('pokemonUser', JSON.stringify(infoPokeUser))
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

// ---------------------------------------- FIM FUNÇÃO DA PAGINA LOGADA ---------------------------------------- //
const selectedPokemon = JSON.parse(localStorage.getItem('pokemon'));
const selectedPokemonUser = JSON.parse(localStorage.getItem('pokemonUser') || '[]');
console.log("POKE USER",selectedPokemonUser)
teamLeft(selectedPokemon);
teamRight(selectedPokemonUser);

function teamLeft(selectedPokemon) {
  // Criar os elementos
  const container = document.getElementById('teamLeft')

  const h2 = document.createElement('h2');
  h2.textContent = "Time Pokemon Selvagem";
  container.appendChild(h2);

  const divBattlelister = document.createElement('div');
  divBattlelister.className = "battlelister";
  container.appendChild(divBattlelister);

  const divBattlelistitem = document.createElement('div');
  divBattlelistitem.className = "battlelistitem";
  divBattlelister.appendChild(divBattlelistitem);

  const divBattlelistimg = document.createElement('div');
  divBattlelistimg.className = "battlelistimg";
  divBattlelistitem.appendChild(divBattlelistimg);

  const img = document.createElement('img');
  img.src = selectedPokemon.imagemUrl;
  img.alt = selectedPokemon.nome;
  img.title = selectedPokemon.nome;
  divBattlelistimg.appendChild(img);

  const divBatname = document.createElement('div');
  divBatname.className = "batname";
  divBattlelistitem.appendChild(divBatname);

  const spanNome = document.createElement('span');
  spanNome.textContent = selectedPokemon.nome;
  divBatname.appendChild(spanNome);

  // Criar e adicionar o primeiro <br>
  const break1 = document.createElement('br');
  divBatname.appendChild(break1);

  // Criar e adicionar o segundo <br>
  const break2 = document.createElement('br');
  divBatname.appendChild(break2);

  const iTipo = document.createElement('i');
  iTipo.className = `tbtn tbtn-${selectedPokemon.tipo}`;
  divBatname.appendChild(iTipo);

  if (selectedPokemon.tipo_secundario) {
    const iTipoSecundario = document.createElement('i');
    iTipoSecundario.className = `tbtn tbtn-${selectedPokemon.tipo_secundario}`;
    divBatname.appendChild(iTipoSecundario);
  }

  const divProgBar = document.createElement('div');
  divProgBar.className = "prog-bar";
  divBatname.appendChild(divProgBar);

  const divGood = document.createElement('div');
  divGood.className = "good";
  divGood.style.width = '100%'; // Ajuste conforme necessário
  divProgBar.appendChild(divGood);

  const divBattlelistlvlhp = document.createElement('div');
  divBattlelistlvlhp.className = "battlelistlvlhp";
  divBattlelistitem.appendChild(divBattlelistlvlhp);

  const spanLevelHp = document.createElement('span');
  spanLevelHp.innerHTML = `<b>Level:</b> ${selectedPokemon.level}<br><br><b>HP:</b> ${selectedPokemon.vida}`;
  divBattlelistlvlhp.appendChild(spanLevelHp);

  // Adicionar ao DOM (por exemplo, ao body)
  //document.body.appendChild(divTeamLeft);
}

function teamRight(pokemons) {
  const container = document.getElementById('teamRight')

  const h2 = document.createElement('h2');
  h2.textContent = "Seu Time";
  container.appendChild(h2);

  const divBattlelister = document.createElement('div');
  divBattlelister.className = "battlelister";
  container.appendChild(divBattlelister);
  // Itera por cada Pokémon
  pokemons.forEach((pokemon, index) => {
    const divBattlelistitem = document.createElement('div');
    divBattlelistitem.className = "battlelistitem";
    divBattlelister.appendChild(divBattlelistitem);

    const divBattlelistimg = document.createElement('div');
    divBattlelistimg.className = "battlelistimg";
    divBattlelistitem.appendChild(divBattlelistimg);

    const radioButton = document.createElement('input');
    radioButton.type = 'radio';
    radioButton.value = index;
    radioButton.name = 'pokeselect';
    radioButton.id = `pokemonRadio${index}`;
    divBattlelistimg.appendChild(radioButton);

    radioButton.addEventListener('click', function(){
      const selectedUserPokemon = {
        nome:pokemon.nome,
        tipo: pokemon.tipo,
        tipo_secundario: pokemon.tipo_secundario,
        vida: pokemon.vida,
        imagemUrl: pokemon.imagemUrl,
        level: pokemon.level,
        moves: pokemon.moves,
        moves_types: pokemon.moves_types
      }
      console.log("USER PKMN CAPTURA",selectedUserPokemon)
      localStorage.setItem('pokemonUserSelect', JSON.stringify(selectedUserPokemon))
    })

    const img = document.createElement('img');
    img.src = pokemon.imagemUrl;
    img.alt = pokemon.nome;
    img.title = pokemon.nome;
    divBattlelistimg.appendChild(img);

    const divBatname = document.createElement('div');
    divBatname.className = "batname";
    divBattlelistitem.appendChild(divBatname);

    const spanNome = document.createElement('span');
    spanNome.textContent = pokemon.nome;
    divBatname.appendChild(spanNome);

    const break1 = document.createElement('br');
    divBatname.appendChild(break1);

    const break2 = document.createElement('br');
    divBatname.appendChild(break2);

    const iTipo = document.createElement('i');
    iTipo.className = `tbtn tbtn-${pokemon.tipo}`;
    divBatname.appendChild(iTipo);

    if (pokemon.tipo_secundario) {
      const iTipoSecundario = document.createElement('i');
      iTipoSecundario.className = `tbtn tbtn-${pokemon.tipo_secundario}`;
      divBatname.appendChild(iTipoSecundario);
    }

    const divProgBar = document.createElement('div');
    divProgBar.className = "prog-bar";
    divBatname.appendChild(divProgBar);

    const divGood = document.createElement('div');
    divGood.className = "good";
    divGood.style.width = '100%'; // Ajuste conforme necessário
    divProgBar.appendChild(divGood);

    const divBattlelistlvlhp = document.createElement('div');
    divBattlelistlvlhp.className = "battlelistlvlhp";
    divBattlelistitem.appendChild(divBattlelistlvlhp);

    const spanLevelHp = document.createElement('span');
    spanLevelHp.innerHTML = `<b>Level:</b> ${pokemon.level}<br><br><b>HP:</b> ${pokemon.vida}`;
    divBattlelistlvlhp.appendChild(spanLevelHp);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const btnBatalha = document.getElementById('btnBatalha');
  btnBatalha.addEventListener('click', function (e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Obtenha o formulário
    const form = document.getElementById('battleForm');

    // Obtenha o Pokémon selvagem selecionado
    const selectedWildPokemon = selectedPokemon
    const selectedUserPokemon = JSON.parse(localStorage.getItem('pokemonUserSelect'));

    // Atualize a ação do formulário com as informações do Pokémon selvagem
    form.action = `/batalha/${selectedWildPokemon.nome}`;
    // Envie o formulário
    form.submit();
  });
});