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

// ---------------------------------------- FIM FUNÇÃO DA PAGINA LOGADA ---------------------------------------- //
// Simulação de dados do jogo
let playerX = 212; // Coordenadas Iniciais do player
let playerY = 204; // Ajuste as coordenadas conforme necessário

// Atualiza a contagem de usuários e Pokeballs na página
function updateGameInfo() {
  document.getElementById('userCount').textContent = '30';
  document.getElementById('pokeballs').textContent = '30';
}

// Função para atualizar a posição do jogador
function updatePlayerPosition() {
  const player = document.getElementById('player');
  const map = document.getElementById('map');

  // Limita as coordenadas do jogador às dimensões do mapa
  playerX = Math.min(Math.max(playerX, 0), map.offsetWidth - player.offsetWidth);
  playerY = Math.min(Math.max(playerY, 0), map.offsetHeight - player.offsetHeight);

  player.style.left = playerX + 'px';
  player.style.top = playerY + 'px';

  // Retorna as coordenadas atualizadas
  return {
    x: playerX + player.offsetWidth / 2,
    y: playerY + player.offsetHeight / 2,
  };
}

function getRandomPokemon(tipo) {
  console.log(tipo)
  let infoPoke = [];
  // Gerar um número aleatório entre 0 e 1 (inclusive)
  const randomProbability = Math.random();
  // Definir a probabilidade desejada (por exemplo, 85%)
  const probabilityThreshold = 0.85;
  if (randomProbability <= probabilityThreshold) {
    if (tipo == 'grama'){
      $.get('/get-random-pokemon-grama', function (data) {
        console.log("DATA",data)
        const background = document.getElementById('showpoke')
        const pokeEncontrado = document.getElementById('pokeEncontrado')
        pokeEncontrado.style.display = 'block'
        const catchForm = document.querySelector('form');
        catchForm.style.display = 'block';
        const encontrado = document.getElementById('pokeEncounter')
        encontrado.style.display = 'none';
        const pokemonImg = document.getElementById('pokemonimg');
        const showPoke = document.getElementById('capturadoImg')
        const dexyLink = document.getElementById('dexy');
        const levelText = document.getElementById('hp').querySelector('b:first-child');
        const hpText = document.getElementById('hp').querySelector('b:nth-child(2)');
        const typeIcon = document.querySelector('.tbtn');
        const typeContainer = document.querySelector('.type-container');
        background.style.backgroundColor = '#AEFFC0';
        document.getElementById('catchForm').addEventListener('submit', function (e) {
          var form = e.target
          var pokemonName = dexyLink;
          form.action = '/captura/' + pokemonName;
        })
        if (data.raridade == 'comum') {
          let nivel = Math.floor(Math.random() * 13) + 1
          levelText.textContent = 'Level: ' + nivel; // Defina o nível desejado
          hpText.textContent = 'HP: ' + nivel * 4; // Defina o HP desejado
        } else if (data.raridade == 'incomum') {
          let nivel = Math.floor(Math.random() * (35 - 16 + 1)) + 16;
          levelText.textContent = 'Level: ' + nivel; // Defina o nível desejado
          hpText.textContent = 'HP: ' + nivel * 4; // Defina o HP desejado
        }
        pokemonImg.src = data.imagemUrl;
        showPoke.src = "https://i.dstatic.com/images/pokeball-n.png"
        dexyLink.href = `/pokedex/info/${data.nome.toLowerCase()}`;
        dexyLink.textContent = ` ${data.nome}`;
        const tipo_primario = data.tipo
        const tipo_secundario = data.tipo_secundario
        typeContainer.innerHTML = '';
        if (tipo_secundario) {
          const typeIconSecundario = document.createElement('i');
          typeIconSecundario.className = `tbtn tbtn-${tipo_secundario}`;
          console.log(typeIconSecundario)
          typeContainer.appendChild(typeIconSecundario);
          typeIcon.className = `tbtn tbtn-${tipo_primario}`;
          typeContainer.appendChild(typeIcon);
        } else {
            typeIcon.className = `tbtn tbtn-${tipo_primario}`;
            typeContainer.appendChild(typeIcon);
        }
      });
    } else if (tipo == 'agua') {
      infoPoke = [];
      $.get('/get-random-pokemon-agua', function (data) {
        console.log("DATA",data)
        const background = document.getElementById('showpoke')
        const pokeEncontrado = document.getElementById('pokeEncontrado')
        pokeEncontrado.style.display = 'block'
        const catchForm = document.querySelector('form');
        catchForm.style.display = 'block';
        const encontrado = document.getElementById('pokeEncounter')
        encontrado.style.display = 'none';
        const pokemonImg = document.getElementById('pokemonimg');
        const showPoke = document.getElementById('capturadoImg')
        const dexyLink = document.getElementById('dexy');
        const levelText = document.getElementById('hp').querySelector('b:first-child');
        const hpText = document.getElementById('hp').querySelector('b:nth-child(2)');
        const typeIcon = document.querySelector('.tbtn');
        const typeContainer = document.querySelector('.type-container');
        let nivel = Math.floor(Math.random() * 13) + 1
        console.log("BACK",background)
        background.style.backgroundColor = '#97def8';
        document.getElementById('catchForm').addEventListener('submit', function (e) {
          var form = e.target
          var pokemonName = data.nome;
          form.action = '/captura/' + encodeURIComponent(pokemonName);
        })
        if (data.raridade == 'comum') {
          levelText.textContent = 'Level: ' + nivel; // Defina o nível desejado
          hpText.textContent = 'HP: ' + nivel * 4; // Defina o HP desejado
        } else if (data.raridade == 'incomum') {
          let nivel = Math.floor(Math.random() * (35 - 16 + 1)) + 16;
          levelText.textContent = 'Level: ' + nivel; // Defina o nível desejado
          hpText.textContent = 'HP: ' + nivel * 4; // Defina o HP desejado
        }
        pokemonImg.src = data.imagemUrl;
        showPoke.src = "https://i.dstatic.com/images/pokeball-n.png"
        dexyLink.href = `/pokedex/info/${data.nome.toLowerCase()}`;
        dexyLink.textContent = ` ${data.nome}`;
        const tipo_primario = data.tipo
        const tipo_secundario = data.tipo_secundario
        typeContainer.innerHTML = '';
        if (tipo_secundario) {
          const typeIconSecundario = document.createElement('i');
          typeIconSecundario.className = `tbtn tbtn-${tipo_secundario}`;
          console.log(typeIconSecundario)
          typeContainer.appendChild(typeIconSecundario);
          typeIcon.className = `tbtn tbtn-${tipo_primario}`;
          typeContainer.appendChild(typeIcon);
        } else {
            typeIcon.className = `tbtn tbtn-${tipo_primario}`;
            typeContainer.appendChild(typeIcon);
        }
        infoPoke = {
          nome: data.nome,
          tipo: data.tipo,
          tipo_secundario: data.tipo_secundario,
          imagemUrl: data.imagemUrl,
          level: nivel,
          vida: nivel * 4,

        }
        localStorage.setItem('pokemon' ,JSON.stringify(infoPoke))
      });
    } else if (tipo == 'chao') {
      $.get('/get-random-pokemon-chao', function (data) {
        const background = document.getElementById('showpoke')
        const pokeEncontrado = document.getElementById('pokeEncontrado')
        pokeEncontrado.style.display = 'block'
        const catchForm = document.querySelector('form');
        catchForm.style.display = 'block';
        const encontrado = document.getElementById('pokeEncounter')
        encontrado.style.display = 'none';
        const pokemonImg = document.getElementById('pokemonimg');
        const showPoke = document.getElementById('capturadoImg')
        const dexyLink = document.getElementById('dexy');
        const levelText = document.getElementById('hp').querySelector('b:first-child');
        const hpText = document.getElementById('hp').querySelector('b:nth-child(2)');
        const typeIcon = document.querySelector('.tbtn');
        const typeContainer = document.querySelector('.type-container');
        background.style.backgroundColor = '#C9FF9F';
        if (data.raridade == 'comum') {
          let nivel = Math.floor(Math.random() * 13) + 1
          levelText.textContent = 'Level: ' + nivel; // Defina o nível desejado
          hpText.textContent = 'HP: ' + nivel * 4; // Defina o HP desejado
        } else if (data.raridade == 'incomum') {
          let nivel = Math.floor(Math.random() * (35 - 16 + 1)) + 16;
          levelText.textContent = 'Level: ' + nivel; // Defina o nível desejado
          hpText.textContent = 'HP: ' + nivel * 4; // Defina o HP desejado
        }
        pokemonImg.src = data.imagemUrl;
        showPoke.src = "https://i.dstatic.com/images/pokeball-n.png"
        dexyLink.href = `/pokedex/info/${data.nome.toLowerCase()}`;
        dexyLink.textContent = ` ${data.nome}`;
        const tipo_primario = data.tipo
        const tipo_secundario = data.tipo_secundario
        typeContainer.innerHTML = '';
        if (tipo_secundario) {
          const typeIconSecundario = document.createElement('i');
          typeIconSecundario.className = `tbtn tbtn-${tipo_secundario}`;
          console.log(typeIconSecundario)
          typeContainer.appendChild(typeIconSecundario);
          typeIcon.className = `tbtn tbtn-${tipo_primario}`;
          typeContainer.appendChild(typeIcon);
        } else {
            typeIcon.className = `tbtn tbtn-${tipo_primario}`;
            typeContainer.appendChild(typeIcon);
        }
      });

    } else {
      console.log("Encontrei nada")
    }
  } else {
    const encontrado = document.getElementById('pokeEncounter')
    encontrado.style.display = 'block';
    const pokeEncontrado = document.getElementById('pokeEncontrado')
    pokeEncontrado.style.display = 'none'
    const catchForm = document.querySelector('form');
    catchForm.style.display = 'none';
  }
}


// Função para carregar o mapa e verificar o tipo da área
async function loadMapAndCheckAreaType() {
  const response = await fetch('/Maps/testeMapa.json');
  if (!response.ok) {
    console.error('Erro ao carregar o arquivo JSON do mapa.');
    return;
  }
  const mapData = await response.json();
  
  // Obtém as coordenadas do jogador (já que você já tem essa parte do código)
  updatePlayerPosition();
  const player = document.getElementById('player');
  const playerRect = player.getBoundingClientRect();
  const { x: playerXCenter, y: playerYCenter } = updatePlayerPosition();
  
  // Calcula as coordenadas do jogador no mapa
  const tileWidth = mapData.tilewidth;
  const tileHeight = mapData.tileheight;
  const tileX = Math.floor(playerXCenter / tileWidth);
  const tileY = Math.floor(playerYCenter / tileHeight);

  // Obtém o índice do tile na camada de tipo
  const tileIndex = tileY * mapData.width + tileX;
  console.log(tileIndex)
  // Verifica se o índice do tile está dentro dos limites do array
  if (tileIndex >= 0 && tileIndex < mapData.layers[0].data.length) {
    let tipo
    const tileId = mapData.layers[0].data[tileIndex] -1;
    console.log(tileId)
    // Encontra o tile correspondente no tileset
    const tileProperties = mapData.tilesets[0].tiles
    tileProperties.forEach(tiles =>{
      if (tiles.id == tileId){
        tipo = tiles
      }
    })
    console.log(mapData)
    if (tileProperties) {
      console.log(tipo)
      const areaTipo = tipo.properties[0].value || 'desconhecido';
      // Impede o movimento na direção da árvore
      if (areaTipo === 'arvore') {
        // Você pode adicionar aqui a lógica para impedir o movimento na direção da árvore
        // Por exemplo, se o jogador pressionar a tecla para a esquerda, você não atualiza
        // playerX para mover o jogador para a esquerda.
        // Isso vai depender da lógica usada para movimentar o jogador.
        // Suponhamos que 'LEFT' seja a tecla para mover para a esquerda:
        if (playerX > playerXCenter) {
          return;
        }
      }
      // Executa a ação com base no tipo
      switch (areaTipo) {
        case 'grama':
          console.log('Você está na grama.');
          getRandomPokemon(areaTipo);
          break;
        case 'agua':
          console.log('Você está na água.');
          getRandomPokemon(areaTipo);
          // Execute ação específica para a água
          break;
        case 'chao':
          console.log('Você está no chão.');
          getRandomPokemon(areaTipo);
          break;
        case 'arvore':
          console.log('Você está perto de uma árvore.');
          // Execute ação específica para a árvore
          break;
        // Adicione mais casos para outros tipos, se necessário
        default:
          console.log('Você está em um tipo desconhecido.');
          break;
      }
    } else {
      console.log('Propriedades do tile não encontradas.');
    }
  } else {
    console.log('Coordenadas do jogador estão fora dos limites do mapa.');
  }
}


// Função para mover o jogador
function movePlayer(direction) {
  const step = 10; // Ajuste a quantidade de movimento conforme necessário
  const map = document.getElementById('map');
  const player = document.getElementById('player');
  player.classList.add('move-animation');

  if (direction === 'ArrowRight' && playerX + step <= map.offsetWidth - player.offsetWidth) {
    // Move o jogador para a direita dentro dos limites do mapa
    player.style.transform = `translateX(${step}px)`;
    playerX += step;
  } else if (direction === 'ArrowLeft' && playerX - step >= 0) {
    // Move o jogador para a esquerda dentro dos limites do mapa
    player.style.transform = `translateX(-${step}px)`;
    playerX -= step;
  } else if (direction === 'ArrowDown' && playerY + step <= map.offsetHeight - player.offsetHeight) {
    // Move o jogador para baixo dentro dos limites do mapa
    player.style.transform = `translateY(${step}px)`;
    playerY += step;
  } else if (direction === 'ArrowUp' && playerY - step >= 0) {
    // Move o jogador para cima dentro dos limites do mapa
    player.style.transform = `translateY(-${step}px)`;
    playerY -= step;
  }

  setTimeout(() => {
    player.style.transform = '';
    player.classList.remove('move-animation');
    updatePlayerPosition();
    loadMapAndCheckAreaType();
  }, 300);
}

// Adiciona um evento de teclado para mover o jogador
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    movePlayer(event.key);
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    // Impede o comportamento padrão das teclas de seta para cima e para baixo
    event.preventDefault();
    movePlayer(event.key);
  }
});

// Inicializa as informações do jogo na página
//updateGameInfo();
updatePlayerPosition();