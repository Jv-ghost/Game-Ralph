const state = {
	view: {
		squares: document.querySelectorAll(".square"),
		timeLeft: document.querySelector("#time-left"),
		score: document.querySelector("#score"),
		lives: document.querySelector(".menu-lives"),
	},
	values: {
		timerId: null,
		gameVelocity: 1000,
		hitPosition: null,
		result: 0,
		timeLeft: 60, // Tempo inicial em segundos
		lives: 3,
	},
};

// Função para adicionar IDs aos quadrados, se não estiverem presentes
function assignIdsToSquares() {
	state.view.squares.forEach((square, index) => {
		square.id = `square${index + 1}`;
	});
	console.log("IDs dos quadrados:", state.view.squares);
}

// Função para resetar o tabuleiro, removendo a classe "enemy"
function clearBoard() {
	state.view.squares.forEach((square) => {
		square.classList.remove("enemy");
	});
}

// Escolhe um quadrado aleatório para ser o inimigo
function randomSquare() {
	clearBoard(); // Limpa qualquer "enemy" anterior

	const randomNumber = Math.floor(Math.random() * state.view.squares.length);
	const randomSquare = state.view.squares[randomNumber];

	randomSquare.classList.add("enemy");
	state.values.hitPosition = randomSquare.id; // Define a posição a ser atingida
	console.log("Inimigo no quadrado:", state.values.hitPosition);
}

// Função para mover o inimigo em intervalos regulares
function moveEnemy() {
	// Se houver um timer ativo, cancelá-lo antes de iniciar um novo
	if (state.values.timerId) {
		clearInterval(state.values.timerId);
	}

	state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

// Listener para verificar o clique do jogador
function addListenerHitBox() {
	state.view.squares.forEach((square) => {
		square.addEventListener("mousedown", () => {
			console.log("Clique detectado no quadrado:", square.id);
			console.log("Posição correta a ser atingida:", state.values.hitPosition);

			// Verifica se o quadrado clicado é o correto
			if (square.id === state.values.hitPosition) {
				console.log("Acertou o inimigo!");

				state.values.result++; // Incrementa o resultado
				state.view.score.textContent = state.values.result; // Atualiza a pontuação visualmente
				playSound();

				// Aumenta a dificuldade diminuindo o intervalo de tempo após 5 acertos
				if (state.values.result % 5 === 0 && state.values.gameVelocity > 500) {
					state.values.gameVelocity -= 100; // Aumenta a velocidade
					moveEnemy(); // Reinicia o movimento com nova velocidade
				}

				state.values.hitPosition = null; // Reseta a posição a ser atingida
			} else {
				console.log("Errou o inimigo.");

				// Reduz o número de vidas
				state.values.lives--;
				state.view.lives.textContent = `x${state.values.lives}`;

				// Verificar se o jogador perdeu todas as vidas
				if (state.values.lives === 0) {
					alert("Fim de jogo! Você perdeu todas as vidas.");
					resetGame();
				}
			}
		});
	});
}

// Função para controlar o temporizador do jogo
function countdown() {
	state.view.timeLeft.textContent = state.values.timeLeft;

	const timerInterval = setInterval(() => {
		state.values.timeLeft--;
		state.view.timeLeft.textContent = state.values.timeLeft;

		// Verifica se o tempo acabou
		if (state.values.timeLeft === 0) {
			clearInterval(timerInterval);
			clearInterval(state.values.timerId); // Para o movimento do inimigo

			alert("Fim de jogo! Sua pontuação final é: " + state.values.result);
			resetGame(); // Reinicia o jogo
		}
	}, 1000);
}

function playSound() {
	let audio = new Audio("./src/audios/hit.m4a");
	audio.volume = 0.2;
	audio.play();
}

// Função para resetar o jogo
function resetGame() {
	clearBoard(); // Limpa o tabuleiro
	state.values.result = 0;
	state.view.score.textContent = state.values.result;
	state.values.gameVelocity = 1000;
	state.values.timeLeft = 60;
	state.view.timeLeft.textContent = state.values.timeLeft;

	// Reinicia as vidas
	state.values.lives = 3;
	state.view.lives.textContent = `x${state.values.lives}`;

	moveEnemy(); // Reinicia o movimento do inimigo
}
// Função de inicialização do jogo
function initialize() {
	assignIdsToSquares(); // Garante que os quadrados tenham IDs únicos
	moveEnemy(); // Inicia o movimento do inimigo
	addListenerHitBox(); // Adiciona o evento de clique
	countdown(); // Inicia o temporizador
}

// Inicializa o jogo ao carregar a página
initialize();
