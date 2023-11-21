// Simulação de dados do jogo
let userCount = 50;
let pokeballs = 10;
let playerX = 0; // Ajuste as coordenadas conforme necessário
let playerY = 0; // Ajuste as coordenadas conforme necessário

// Atualiza a contagem de usuários e Pokeballs na página
function updateGameInfo() {
    document.getElementById('userCount').textContent = userCount;
    document.getElementById('pokeballs').textContent = pokeballs;
}

// Função para atualizar a posição do jogador
function updatePlayerPosition() {
    const player = document.getElementById('player');
    player.style.left = playerX + 'px';
    player.style.top = playerY + 'px';
}

// Função para mover o jogador
function movePlayer(direction) {
    const step = 10; // Ajuste a quantidade de movimento conforme necessário

    if (direction === 'ArrowRight') {
        // Move o jogador para a direita
        playerX += step;
    } else if (direction === 'ArrowLeft') {
        // Move o jogador para a esquerda
        playerX -= step;
    }

    updatePlayerPosition();
}

// Adiciona um evento de teclado para mover o jogador
document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        movePlayer(event.key);
    }
});

// Função para capturar um Pokémon (simulação)
function catchPokemon() {
    if (pokeballs > 0) {
        pokeballs--;
        alert('Você capturou um Pokémon!');
        updateGameInfo();
    } else {
        alert('Você não tem Pokeballs suficientes!');
    }
}

// Configura o evento de clique no botão "Capturar Pokémon"
document.getElementById('catchButton').addEventListener('click', catchPokemon);

// Inicializa as informações do jogo na página
updateGameInfo();
updatePlayerPosition();