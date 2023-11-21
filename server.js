const express = require('express');
const sql = require('mssql');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;
const blacklistedTokens = [];
let globalToken = null;

const config = {
  server: 'localhost',
  user: 'sa',
  password: 'Yuri2305',
  database: 'pokemon',
  options: {
    encrypt: false, // Configuração depende do seu ambiente
  },
};

// Configure o servidor para servir arquivos estáticos
app.use(express.static(__dirname));

//COnfiguração do Body Parser para capturar dados do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROTAS ANTES DO USUARIO SER AUTENTICADO!

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/user-deslogado/Home/index.html');
});

// Rota para a página de login
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/src/user-deslogado/Login/login.html');
});

//Rota para página de registro
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/src/user-deslogado/Register/register.html');
});

//Rota para página de registro validado
app.get('/register/validate', (req, res) => {
  res.sendFile(__dirname + '/src/user-deslogado/Register/validate.html');
});

//Rota para página de FAQ
app.get('/faq', (req, res) => {
  res.sendFile(__dirname + '/src/user-deslogado/Faq/index.html');
});

//Rota para página de sobre
app.get('/sobre', (req, res) => {
  res.sendFile(__dirname + '/src/user-deslogado/About/index.html');
});

//Rota para página de ajuda
app.get('/ajuda', (req, res) => {
  res.sendFile(__dirname + '/src/user-deslogado/Ajuda/index.html');
});


// ================================= ROTAS DEPOIS DO USUARIO SER AUTENTICADO! ======================================== //

//Rota para página de mapas
app.get('/maps', (req, res) => {
  res.sendFile(__dirname + '/src/user-logado/Maps/maps.html');
});

//Rota para página de mapa1
app.get('/maps/mundo1', (req, res) => {
  res.sendFile(__dirname + '/src/user-logado/main/mapa1/index.html');
});

//Rota para página de mapa2
app.get('/maps/mundo2', (req, res) => {
  res.sendFile(__dirname + '/src/user-logado/main/mapa2/index.html');
});

//Rota para página de Captura
app.post('/captura/:nomePokemon', (req, res) => {
  res.sendFile(__dirname + '/src/user-logado/captura/captura.html');
});

//Rota para página de Captura
app.get('/pokemon', (req, res) => {
  res.sendFile(__dirname + '/src/user-logado/menus/menu-pokemon.html');
});

//Rota para página de Captura
app.post('/batalha/:nomePokemon', (req, res) => {
  res.sendFile(__dirname + '/src/user-logado/batalha/batalha.html');
});

//Verifica o token
function verificarToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  jwt.verify(token, 'seuSegredoJWT', (err, decoded) => {
    if (err) {
      return res.status(401).json({ mensagem: 'Token inválido' });
    }

    req.userId = decoded.userId;
    next();
  });
}
// Inicie o servidor
app.listen(port, () => {
  console.log(`Servidor está ouvindo em http://localhost:${port}`);
});


// Conexão com o banco
sql.connect(config, (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQL Server:', err);
  } else {
    console.log('Conexão bem-sucedida ao SQL Server');
  }
});

//Queries

//Envio do Registro
app.post('/registro', async (req, res) => {
  const { username, email, pass } = req.body;
  try {
    const sha256 = crypto.createHash('sha256');
    sha256.update(pass);
    const hashedPassword = sha256.digest('base64');

    const query = `INSERT INTO usuario (usuario, email, senha) VALUES ('${username}', '${email}', '${hashedPassword}')`;

    sql.query(query, (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados no SQL Server:', err);
        res.status(500).send('Erro ao registrar');
      } else {
        console.log('Dados registrados com sucesso');
        res.redirect('/register/validate');
      }
    });
  } catch (error) {
    console.error('Erro ao criar hash da senha:', error);
    res.status(500).send('Erro ao registrar');
  }
});

// Rota para verificar a disponibilidade do nome de usuário
app.post('/verificar-usuario', (req, res) => {
  const { username } = req.body;
  // Consulta o banco de dados para verificar se o nome de usuário já existe
  const query = `SELECT COUNT(*) AS count FROM usuario WHERE usuario = '${username}'`;

  sql.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao verificar nome de usuário no SQL Server:', err);
      res.status(500).json({ disponivel: false, mensagem: 'Erro ao verificar nome de usuário.' });
    } else {
      const existe = result.recordset[0].count > 0;
      res.json({ disponivel: !existe });
    }
  });
});

// Rota de login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const sha256 = crypto.createHash('sha256');
    sha256.update(password);
    const hashedPassword = sha256.digest('base64');
    const query = `SELECT * FROM usuario WHERE usuario = '${username}' AND senha = '${hashedPassword}'`;
    sql.query(query, (err, result) => {
      if (err) {
        console.error('Erro ao verificar as credenciais no SQL Server:', err);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
      }
      const user = result.recordset[0];
      if (!user) {
        return res.status(401).json({ mensagem: 'Credenciais inválidas' });
      }
      // Comparar o hash da senha fornecida com o hash armazenado no banco de dados
      if (hashedPassword !== user.senha) {
        return res.status(402).json({ mensagem: 'Credenciais inválidas' });
      }

      // Crie um token JWT
      const token = jwt.sign({ userId: user.id }, 'seuSegredoJWT', { expiresIn: '3h' });
      globalToken = { token, userName: user.usuario, idUser: user.id };
      res.json({ token, redirectTo: '/maps' })
    });
  } catch (error) {
    console.error('Erro ao processar a solicitação de login:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
});

// Rota para obter o token JWT
app.get('/obter-token', (req, res) => {
  // Envie o token armazenado na variável global como resposta
  res.json({ token: globalToken });
});


// Rota para logout
app.get('/logout', (req, res) => {
  console.log(req.header)
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  // Adicione o token à lista negra (se aplicável)
  blacklistedTokens.push(token);

  // Redirecione o usuário para a página de login ou outra página apropriada
  res.redirect('/login'); // Substitua '/login' pela URL de login
});

// QUERY para obter um Pokémon aleatório
app.get('/get-random-pokemon-agua', (req, res) => {
  const randomProbability = Math.random();
  const probabilityThreshold = 0.70;
  var query
  if (randomProbability <= probabilityThreshold) {
    query = `SELECT TOP 1 nome, tipo, tipo_secundario, imagemUrl, raridade FROM WildPokemon WHERE tipo = 'Agua' OR tipo_secundario = 'Agua' AND raridade = 'comum' ORDER BY NEWID()`;
  } else {
    query = `SELECT TOP 1 nome, tipo, tipo_secundario, imagemUrl, raridade FROM WildPokemon WHERE tipo = 'Agua' OR tipo_secundario = 'Agua' AND raridade = 'incomum' ORDER BY NEWID()`;
  }
  sql.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao consultar Pokémon aleatório no SQL Server:', err);
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum Pokémon encontrado' });
    }

    const pokemon = result.recordset[0];
    res.json(pokemon);
  });
});

// QUERY para obter um Pokémon aleatório
app.get('/get-random-pokemon-grama', (req, res) => {
  const randomProbability = Math.random();
  const probabilityThreshold = 0.70;
  var query
  if (randomProbability <= probabilityThreshold) {
    query = `SELECT TOP 1 nome, tipo, tipo_secundario, imagemUrl, raridade FROM WildPokemon WHERE tipo = 'grama' OR tipo_secundario = 'Grama'  AND raridade = 'comum' ORDER BY NEWID()`;
  } else {
    query = `SELECT TOP 1 nome, tipo, tipo_secundario, imagemUrl, raridade FROM WildPokemon WHERE tipo = 'grama' OR tipo_secundario = 'Grama'  AND raridade = 'incomum' ORDER BY NEWID()`;
  }

  sql.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao consultar Pokémon aleatório no SQL Server:', err);
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum Pokémon encontrado' });
    }

    const pokemon = result.recordset[0];
    res.json(pokemon);
  });
});

// QUERY para obter um Pokémon aleatório
app.get('/get-random-pokemon-chao', (req, res) => {
  const randomProbability = Math.random();
  const probabilityThreshold = 0.70;
  var query
  if (randomProbability <= probabilityThreshold) {
    query = `SELECT TOP 1 nome, tipo, tipo_secundario, imagemUrl, raridade FROM WildPokemon WHERE tipo = 'Normal' OR tipo = 'Fogo' OR tipo = 'Eletrico' OR tipo = 'Gelo' OR tipo = 'Lutador' OR tipo = 'Terra' OR tipo = 'Voador' OR tipo = 'Psiquico' OR tipo = 'Pedra' OR tipo = 'Fantasma' OR tipo = 'Dragao' OR tipo = 'Sombrio' OR tipo = 'Aço' OR tipo = 'Fada' OR tipo_secundario = 'Fogo' OR tipo_secundario = 'Eletrico' OR tipo_secundario = 'Gelo' OR tipo_secundario = 'Lutador' OR tipo_secundario = 'Terra' OR tipo_secundario = 'Voador' OR tipo_secundario = 'Psiquico' OR tipo_secundario = 'Pedra' OR tipo_secundario = 'Fantasma' OR tipo_secundario = 'Dragao' OR tipo_secundario = 'Sombrio' OR tipo_secundario = 'Aço' OR tipo_secundario = 'Fada' AND raridade = 'comum' ORDER BY NEWID()`;
  } else {
    query = `SELECT TOP 1 nome, tipo, tipo_secundario, imagemUrl, raridade FROM WildPokemon WHERE tipo = 'Normal' OR tipo = 'Fogo' OR tipo = 'Eletrico' OR tipo = 'Gelo' OR tipo = 'Lutador' OR tipo = 'Terra' OR tipo = 'Voador' OR tipo = 'Psiquico' OR tipo = 'Pedra' OR tipo = 'Fantasma' OR tipo = 'Dragao' OR tipo = 'Sombrio' OR tipo = 'Aço' OR tipo = 'Fada' OR tipo_secundario = 'Fogo' OR tipo_secundario = 'Eletrico' OR tipo_secundario = 'Gelo' OR tipo_secundario = 'Lutador' OR tipo_secundario = 'Terra' OR tipo_secundario = 'Voador' OR tipo_secundario = 'Psiquico' OR tipo_secundario = 'Pedra' OR tipo_secundario = 'Fantasma' OR tipo_secundario = 'Dragao' OR tipo_secundario = 'Sombrio' OR tipo_secundario = 'Aço' OR tipo_secundario = 'Fada' AND raridade = 'comum' ORDER BY NEWID()`;
  }

  sql.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao consultar Pokémon aleatório no SQL Server:', err);
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum Pokémon encontrado' });
    }

    const pokemon = result.recordset[0];
    res.json(pokemon);
  });
});


// QUERY para obter os pokemons do usuario
app.get('/pokemon-usuario', (req, res) => {
  let usuarioId = req.query.usuarioId;
  let query = `SELECT pu.imagemUrl AS PokemonImageUrl,p.nome AS PokemonNome,pu.nivel AS Level,pu.experiencia AS Experience,p.tipo AS PrimaryType,p.tipo_secundario AS SecondaryType,STRING_AGG(m.nome, ', ') AS Moves,STRING_AGG(m.tipo, ',') AS Moves_Types,pu.vida AS hp FROM PokemonsUsuario pu JOIN Pokedex p ON pu.pokedexId = p.id LEFT JOIN PokemonMovimentos pm ON pu.id = pm.pokemonUsuarioId LEFT JOIN Moves m ON pm.moveId = m.id WHERE pu.usuarioId = ${usuarioId} GROUP BY pu.imagemUrl, p.nome, pu.nivel, pu.vida ,pu.experiencia, p.tipo, p.tipo_secundario`;

  sql.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao consultar Pokémon aleatório no SQL Server:', err);
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum Pokémon encontrado' });
    }

    const pokemon = result.recordset;
    res.json(pokemon);
  });
});

app.get('/move-selected', (req, res) => {
  const moveSelected = req.query.moveName
  if (!moveSelected) {
    return res.status(400).json({ mensagem: 'Nome do movimento é obrigatório' });
  }
  let query = `SELECT dano,precisao FROM moves where nome = '${moveSelected}'`;

  sql.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao consultar Pokémon aleatório no SQL Server:', err);
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum Movimento encontrado' });
    }

    const pokemon = result.recordset;
    res.json(pokemon);
  });
});

app.post('/api/catch-pokemon', (req, res) => {
  const pokemonDetails = req.body;
  let exp = Number(pokemonDetails.level) * 1000
  query = `INSERT INTO PokemonsUsuario(usuarioId,pokedexId,nivel,experiencia,imagemUrl,vida) VALUES(${pokemonDetails.usuarioId},${pokemonDetails.pokedexId},${pokemonDetails.level},${exp},'${pokemonDetails.imagemUrl}', ${pokemonDetails.vida})`
  sql.query(query, (error, results, fields) => {
    if (error) {
      console.error("Erro ao inserir Pokémon:", error);
      return res.status(500).json({ message: 'Erro ao capturar Pokémon' });
    }
    res.json({ message: 'Pokémon capturado com sucesso!' });
  });
});

app.get('/pokedex-number', (req, res) => {
  const pokemonName = req.query.name;
  query = `SELECT id FROM pokedex where nome = '${pokemonName}'`
  sql.query(query, (err, result) => {
    if (err) {
      console.error('Erro ao consultar Pokémon aleatório no SQL Server:', err);
      return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }

    if (result.recordset.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum Movimento encontrado' });
    }

    const pokemon = result.recordset;
    res.json(pokemon);
  });
});
