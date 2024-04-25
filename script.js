// Chave usada para armazenar e recuperar os dados do localStorage
const databaseKey = "games_database";

// Função para ler os dados do localStorage
function databaseRead() {
  return JSON.parse(localStorage.getItem(databaseKey) || "[]");
}

// Função para escrever os dados no localStorage
function databaseWrite(data) {
  localStorage.setItem(databaseKey, JSON.stringify(data));
}

// Função para redirecionar o usuário para a home
function goHome() {
  window.location.href = "index.html";
}

// Função para remover um jogo do DB
function removeGame(gameID) {
  if (!gameID)
    throw new Error("Você precisa especificar o ID para ser removido!");

  let games = databaseRead().filter((game) => {
    return game.id != gameID;
  });

  databaseWrite(games);
  updateScreen();
}

// Função para editar um jogo
function editgame(gameID) {
  if (!gameID)
    throw new Error("Você precisa especificar o ID para ser editado!");

  window.location.href = "edit.html?id=" + gameID;
}

// Se estiver na Home
if (document.getElementById("game-form")) {
  window.onload = () => {
    updateScreen();
  };
  document.getElementById("game-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Busca os jogos do DB local
    let games = databaseRead();

    // Traz as informaçoes ja criadas do jogo
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;

    // Verifica se todos os campos estão preenchidos para confirmar a criação
    if (!name || !description || !price) {
      alert("Preencha todos os campos para adicinar um jogo à biblioteca!");
      return;
    }

    // Adiciona o novo jogo na lista
    const newGame = {
      id: new Date().valueOf(), // Usamos a timestamp atual como ID (mas poderia ser um INT aleatorio tmb).
      name: name,
      description: description,
      price: price,
    };
    games.push(newGame);

    // Salva as alterações no DB
    databaseWrite(games);

    updateScreen();
  });
}


// Se estiver na página de ediçao
if (document.getElementById("edit-game-form")) {
  const urlParams = new URLSearchParams(window.location.search);
  const gameIDToBeEdited = urlParams.get("id");

  window.onload = () => {
    updateEditForm(gameIDToBeEdited);
  };

  document
    .getElementById("edit-game-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const game = {
        id: gameIDToBeEdited,
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
      };

      const games = databaseRead();

      const gamesEdited = games.map((currentGame) => {
        if (currentGame.id != gameIDToBeEdited) return currentGame;

        return game;
      });

      databaseWrite(gamesEdited);
      goHome();
    });
}

// Função para atualizar o formulário de ediçao com os dados do jogo que vai ser editado
function updateEditForm(gameIDToBeEdited) {
  if (!gameIDToBeEdited) {
    alert("Nada para ser editado!");
    return;
  }

  const games = databaseRead();
  const game = games.find((current) => current.id == gameIDToBeEdited);

  document.querySelector("#name").value = game.name;
  document.querySelector("#description").value = game.description;
  document.querySelector("#price").value = game.price;
}

// Função para atualizar a lista de jogos na tela
function updateScreen() {
  const games = databaseRead();

  // Reseta a lista da tela
  const gamesListNode = document.getElementById("game-library");
  gamesListNode.textContent = "";

  // Atualiza a lista de jogos
  games.forEach((game) => {
    const gameCard = document.createElement("div");
    gameCard.className = "game-card";

    // Verifica se o preço do jogo é zero, se for muda para "gratis"
    let displayPrice = game.price == 0 ? "Grátis" : `R$ ${game.price}`;

    gameCard.innerHTML = `
    <h2>${game.name}</h2>
    <p>${game.description}</p>
    <p class="game-price">${displayPrice}</p>
    <div class="button-container">
        <button onclick="editgame(${game.id})">Editar</button>
        <button onclick="removeGame(${game.id})">Remover</button>
    </div>
`;

    gamesListNode.appendChild(gameCard);
  });
}
