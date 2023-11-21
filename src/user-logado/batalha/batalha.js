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
    console.log(data)
    const seuTokenJWT = data.token.token;
    const userName = data.token.userName;
    const idUser = data.token.idUser;

    localStorage.setItem('token', seuTokenJWT);
    localStorage.setItem('idUser', idUser);
    profile.textContent = userName;
    profileDrop.textContent = userName;

  })

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

// Obtém o valor do campo de entrada oculto "userPokemon" enviado no formulário
const selectedUserPokemon = JSON.parse(localStorage.getItem('pokemonUserSelect'));
const selectedPokemonWild = JSON.parse(localStorage.getItem('pokemon'));
const idUsuario = JSON.parse(localStorage.getItem('idUser'))
console.log("ID USER",idUsuario)
pokemonOponent(selectedPokemonWild)
pokemonUser(selectedUserPokemon)

function pokemonUser(pkmnUser) {
  console.log(pkmnUser)
  const form = document.getElementById('formPkmn')

  const userPoke = document.createElement('div');
  userPoke.id = "userPoke";
  form.appendChild(userPoke);

  const pokemon = document.createElement('div');
  pokemon.className = "pokemon";
  userPoke.appendChild(pokemon);

  const img = document.createElement('img');
  img.src = pkmnUser.imagemUrl
  img.alt = pkmnUser.nome;
  img.title = pkmnUser.nome;
  pokemon.appendChild(img)

  const userText = document.createElement('br');
  pokemon.appendChild(userText)
  const userSpan = document.createElement('span');
  userSpan.className = "smallcaps";
  userSpan.textContent = '"Seu" ' + pkmnUser.nome;
  pokemon.appendChild(userSpan)
  const userText2 = document.createElement('br');
  pokemon.appendChild(userText2)

  const typeIcon = document.createElement('i');
  typeIcon.className = `tbtn tbtn-${pkmnUser.tipo}`;
  pokemon.appendChild(typeIcon)

  if (pkmnUser.tipo_secundario) {
    const iTipoSecundario = document.createElement('i');
    iTipoSecundario.className = `tbtn tbtn-${pkmnUser.tipo_secundario}`;
    pokemon.appendChild(iTipoSecundario);
  }

  const divHp = document.createElement('div');
  divHp.className = "hp";
  divHp.textContent = `HP: ${pkmnUser.vida}/${pkmnUser.vida}`
  pokemon.appendChild(divHp);

  const divProgBar = document.createElement('div');
  divProgBar.className = "prog-bar";
  pokemon.appendChild(divProgBar);

  const divGood = document.createElement('div');
  divGood.className = "good";
  divGood.style.width = '100%';
  divProgBar.appendChild(divGood);

  const attacklist = document.createElement('div');
  attacklist.className = "attacklist";
  userPoke.appendChild(attacklist);

  const ul = document.createElement('ul');
  ul.style.marginTop = "40px"; // Define o estilo desejado
  attacklist.appendChild(ul);

  //captura os tipos de movimentos
  pkmnUser.moves.forEach((attack, index) => {
    const li = document.createElement('li');
    const inputLi = document.createElement('input')
    inputLi.type = "radio"
    inputLi.value = index
    inputLi.name = 'selected'
    inputLi.id = `attackRadio${index}`

    const attackType = pkmnUser.moves_types[index];
    li.className = `typeclr-${attackType}`;
    li.textContent = attack;

    const attackTypeIcon = document.createElement('i');
    attackTypeIcon.className = `tbtn tbtn-${attackType}`;

    li.appendChild(document.createElement('br')); // Quebra de linha
    li.appendChild(inputLi)
    li.appendChild(attackTypeIcon);

    ul.appendChild(li);

    inputLi.addEventListener('click', function () {
      const selectMovePkmn = {
        move: attack.trim(),
        move_type: attackType
      }
      console.log("USER PKMN MOVE", selectMovePkmn)
      localStorage.setItem('moveUserSelect', JSON.stringify(selectMovePkmn))
    })

  })

  const clear = document.createElement('div');
  clear.className = "clear";
  userPoke.appendChild(clear);

  const btn = document.createElement('div');
  btn.className = "buttoncenter";
  userPoke.appendChild(btn);

  const btnAction = document.createElement('input');
  btnAction.type = "submit"
  btnAction.className = "btn-battle-action"
  btnAction.value = "Atacar"
  btn.appendChild(btnAction);

}

//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

function pokemonOponent(pkmnOpp) {
  const container = document.getElementById('opponent')

  const attacklist = document.createElement('div');
  attacklist.className = "attacklist";
  container.appendChild(attacklist);

  const ul = document.createElement('ul');
  ul.style.marginTop = "40px"; // Define o estilo desejado
  attacklist.appendChild(ul);
  pkmnOpp.attacks = [
    "Tackle",
    "Tackle",
    "Water Gun",
    "Water Gun"
  ];
  for (const attack of pkmnOpp.attacks) {
    const li = document.createElement('li');
    li.className = "typeclr";
    li.textContent = attack; // Substitua pelo nome do ataque

    // Cria o ícone do tipo do ataque
    const attackTypeIcon = document.createElement('i');
    attackTypeIcon.className = "tbtn " + "tbtn-Normal"; // Substitua pelo tipo correto do ataque

    // Adiciona o ícone do tipo do ataque ao elemento <li>
    li.appendChild(document.createElement('br')); // Quebra de linha
    li.appendChild(attackTypeIcon);

    // Adiciona o elemento <li> à lista <ul>
    ul.appendChild(li);
  }

  const pokemon = document.createElement('div');
  pokemon.className = "pokemon";
  container.appendChild(pokemon);

  const img = document.createElement('img');
  img.src = pkmnOpp.imagemUrl
  img.alt = pkmnOpp.nome;
  img.title = pkmnOpp.nome;
  pokemon.appendChild(img)

  const wildText = document.createElement('br');
  pokemon.appendChild(wildText)
  const wildSpan = document.createElement('span');
  wildSpan.className = "smallcaps";
  wildSpan.textContent = '"Selvagem" ' + pkmnOpp.nome;
  pokemon.appendChild(wildSpan)

  const wildText2 = document.createElement('br');
  pokemon.appendChild(wildText2)

  const typeIcon = document.createElement('i');
  typeIcon.className = `tbtn tbtn-${pkmnOpp.tipo}`;
  pokemon.appendChild(typeIcon)

  if (pkmnOpp.tipo_secundario) {
    const iTipoSecundario = document.createElement('i');
    iTipoSecundario.className = `tbtn tbtn-${pkmnOpp.tipo_secundario}`;
    pokemon.appendChild(iTipoSecundario);
  }

  const divHp = document.createElement('div');
  divHp.className = "hp";
  divHp.textContent = `HP: ${pkmnOpp.vida}/${pkmnOpp.vida}`
  pokemon.appendChild(divHp);

  const divProgBar = document.createElement('div');
  divProgBar.className = "prog-bar";
  pokemon.appendChild(divProgBar);

  const divGood = document.createElement('div');
  divGood.className = "good";
  divGood.style.width = '100%';
  divProgBar.appendChild(divGood);

  const clear = document.createElement('div');
  clear.className = "clear";
  container.appendChild(clear);

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
const formPkmn = document.getElementById('formPkmn');
const vidaAnterior = selectedPokemonWild.vida;
formPkmn.addEventListener('submit', (e) => {
  e.preventDefault();

  const UserMoveSelect = JSON.parse(localStorage.getItem('moveUserSelect'));
  const moveName = UserMoveSelect.move;
  fetch(`/move-selected?moveName=${moveName}`)
    .then(response => response.json())
    .then(data => {
      const moveData = data[0].dano; 
      var nivel = selectedPokemonWild.level
      const damage = getDamage(moveData, nivel);

      
      selectedPokemonWild.vida -= damage;

      if (selectedPokemonWild.vida < 0) {
        selectedPokemonWild.vida = 0;
      }

      updateInterface(selectedPokemonWild, vidaAnterior);

      if (selectedPokemonWild.vida <= 0) {
        alert('O Pokémon adversário foi derrotado!');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar dados do movimento:', error);
    });
});

function getDamage(nivel, poder) {
  let baseDamage = ((2 * nivel / 5 + 2) * poder) / 25 + 2;
  return Math.floor(baseDamage);
}

function updateInterface(pokemon, vida) {
  const divHp = document.querySelector('#opponent .hp');
  const divGood = document.querySelector('#opponent .good');
  divHp.textContent = `HP: ${pokemon.vida}/${vida}`;
  divGood.style.width = `${(pokemon.vida / vida) * 100}%`;
}

// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.getElementById('caputarPoke');

  submitButton.addEventListener('click', function(event) {
      event.preventDefault();
      console.log(selectedPokemonWild)
      let pokedexNumber 
      const pokemonName = {
        name: selectedPokemonWild.nome
    };
      $.ajax({
        type: 'GET',
        url: '/pokedex-number',  // Endereço da sua API que vai tratar a inserção
        data: pokemonName,
        success: function(response) {
            console.log("RESPONSE",response)
            const pokemonDetails = {
              name: selectedPokemonWild.nome,
              level: selectedPokemonWild.level,
              tipo: selectedPokemonWild.tipo,
              tipo_secundario: selectedPokemonWild.tipo_secundario,
              imagemUrl: selectedPokemonWild.imagemUrl,
              vida: selectedPokemonWild.vida,
              moves: selectedPokemonWild.attacks,
              usuarioId: idUsuario,
              pokedexId: response[0].id
          };
    
          $.ajax({
              type: 'POST',
              url: '/api/catch-pokemon',  // Endereço da sua API que vai tratar a inserção
              data: pokemonDetails,
              success: function(response) {
                  alert('O Pokémon foi capturado!');
              },
              error: function(error) {
                  console.error("Erro ao capturar o Pokémon:", error);
                  alert('Ocorreu um erro ao capturar o Pokémon.');
              }
          });
        },
        error: function(error) {
            console.error("Erro ao capturar o Pokémon:", error);
        }
    });
  });
});