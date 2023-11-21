-- -----------------------------------------------------
-- Schema pokemon
-- -----------------------------------------------------
USE master
IF EXISTS(select * from sys.databases where name='pokemon')
DROP DATABASE pokemon

-- -----------------------------------------------------
-- Schema grd_execucao
-- -----------------------------------------------------
CREATE DATABASE pokemon;
go
USE pokemon;
go


-- -----------------------------------------------------
-- Table usuario
-- -----------------------------------------------------
CREATE TABLE usuario (
	id INT NOT NULL IDENTITY(1,1),
	usuario VARCHAR(255) UNIQUE NOT NULL,
	email VARCHAR(255) NOT NULL,
	senha VARCHAR (200) NOT NULL,
	PRIMARY KEY (id)
);

-- -----------------------------------------------------
-- Table Pokedex
-- -----------------------------------------------------

CREATE TABLE Pokedex (
	id INT NOT NULL IDENTITY(1,1),
	nome NVARCHAR(255),
	tipo NVARCHAR(255),
	tipo_secundario NVARCHAR(25),
	imagemUrl NVARCHAR(MAX), -- Coluna para armazenar a URL da imagem
	raridade NVARCHAR(25),
	PRIMARY KEY(id)
);

-- -----------------------------------------------------
-- Table PokemonsSelvagens
-- -----------------------------------------------------

CREATE TABLE WildPokemon (
	id INT NOT NULL IDENTITY(1,1),
	nome NVARCHAR(255),
	tipo NVARCHAR(255) NOT NULL,
	tipo_secundario NVARCHAR(255),
	imagemUrl NVARCHAR(MAX), -- Coluna para armazenar a URL da imagem
	raridade NVARCHAR(25),
	PRIMARY KEY(id)
);

-- -----------------------------------------------------
-- Table Movimentos (Moves)
-- -----------------------------------------------------
CREATE TABLE Moves (
    id INT NOT NULL IDENTITY(1,1),
    nome NVARCHAR(255) NOT NULL UNIQUE,
	tipo NVARCHAR(25),
	dano INT,
	precisao INT CHECK (precisao BETWEEN 1 AND 100),
	categoria NVARCHAR(25),
	efeitos NVARCHAR(25)
    PRIMARY KEY(id)
);

-- -----------------------------------------------------
-- Table PokemonsUsuario (User's Pokémon)
-- -----------------------------------------------------
CREATE TABLE PokemonsUsuario (
    id INT NOT NULL IDENTITY(1,1),
    usuarioId INT NOT NULL,
    pokedexId INT NOT NULL,
    nivel INT CHECK (nivel BETWEEN 1 AND 100), -- Restrição para o nível ser entre 1 e 100
    experiencia BIGINT NOT NULL DEFAULT 0, -- Usando BIGINT para armazenar a experiência
    imagemUrl NVARCHAR(MAX),
	vida INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(usuarioId) REFERENCES usuario(id),
    FOREIGN KEY(pokedexId) REFERENCES Pokedex(id)
);

-- -----------------------------------------------------
-- Table TimePokemonsUsuario (User's Pokémon)
-- -----------------------------------------------------

CREATE TABLE TimePokemonUsuario (
    id INT NOT NULL IDENTITY(1,1),
    usuarioId INT NOT NULL,
    pokedexId INT NOT NULL,
    nivel INT CHECK (nivel BETWEEN 1 AND 100), -- Restrição para o nível ser entre 1 e 100
    experiencia BIGINT NOT NULL DEFAULT 0, -- Usando BIGINT para armazenar a experiência
    imagemUrl NVARCHAR(MAX),
    vida INT NOT NULL,
    posicao INT CHECK (posicao BETWEEN 1 AND 6),
    PRIMARY KEY(id),
    FOREIGN KEY(usuarioId) REFERENCES usuario(id),
    FOREIGN KEY(pokedexId) REFERENCES Pokedex(id),
    UNIQUE(usuarioId, posicao) -- Garante que cada usuário tenha no máximo 1 Pokémon em cada posição
);

-- -----------------------------------------------------
-- Table PokemonMovimentos (Pokémon's Moves)
-- -----------------------------------------------------
CREATE TABLE PokemonMovimentos (
    pokemonUsuarioId INT NOT NULL,
    moveId INT NOT NULL,
    PRIMARY KEY(pokemonUsuarioId, moveId),
    FOREIGN KEY(pokemonUsuarioId) REFERENCES PokemonsUsuario(id),
    FOREIGN KEY(moveId) REFERENCES Moves(id)
);


SELECT*FROM usuario
SELECT*FROM pokedex
SELECT*FROM Moves
SELECT*FROM PokemonMovimentos
SELECT*FROM PokemonsUsuario
SELECT*FROM WildPokemon

SELECT * FROM usuario WHERE usuario = 'admin'


INSERT INTO Moves (nome,tipo,dano,precisao,categoria,efeitos)
VALUES ('Tackle','Normal',40,100,'Fisico',null)

INSERT INTO Moves (nome,tipo,dano,precisao,categoria,efeitos)
VALUES ('Razor Leaf','Grama',65,95,'Especial',null)

INSERT INTO Moves (nome,tipo,dano,precisao,categoria,efeitos)
VALUES ('Quick Attack','Normal',50,100,'Fisico',null)

INSERT INTO Moves (nome,tipo,dano,precisao,categoria,efeitos)
VALUES ('Absorb','Grama',20,100,'Especial',null)


INSERT INTO PokemonsUsuario(usuarioId,pokedexId,nivel,experiencia,imagemUrl,vida)
VALUES (1,2,10,10000,'https://i.dstatic.com/images/pokemon/front/normal/ivysaur.png',40)

INSERT INTO PokemonMovimentos(pokemonUsuarioId,moveId)
VALUES (3,4)

SELECT dano,precisao FROM moves where nome ='Tackle'

UPDATE Moves
SET nome = 'Razor Leaf'
WHERE id = 2

SELECT id FROM pokedex where nome = 'Seel'

SELECT pu.imagemUrl AS PokemonImageUrl,p.nome AS PokemonNome,pu.nivel AS Level,pu.experiencia AS Experience,p.tipo AS PrimaryType,p.tipo_secundario AS SecondaryType,STRING_AGG(m.nome, ', ') AS Moves,STRING_AGG(m.tipo, ',') AS Moves_Types,pu.vida AS hp 
FROM PokemonsUsuario pu JOIN Pokedex p ON pu.pokedexId = p.id LEFT JOIN PokemonMovimentos pm ON pu.id = pm.pokemonUsuarioId LEFT JOIN Moves m ON pm.moveId = m.id 
WHERE pu.usuarioId = 1 
GROUP BY pu.imagemUrl, p.nome, pu.nivel, pu.vida ,pu.experiencia, p.tipo, p.tipo_secundario;
