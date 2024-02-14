import { useState } from "react";
import GameBoard from "./Components/GameBoard";
import Player from "./Components/Player";
import Log from "./Components/Log";
import GameOver from "./Components/GameOver";
import INITIAL_GAME_BOARD from "./INITIAL_GAME_BOARD";

const PLAYERS = {
  X: "Player 1",
  0: "Player 2",
};

function deriveActivePlayer(gameTurns) {
  let activePlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") activePlayer = "0";

  return activePlayer;
}

function deriveWinner(gameBoard, players) {
  let winner = null;
  let firstDiagonal = gameBoard[0][0];
  let secondDiagonal = gameBoard[2][0];
  let row;
  let col;
  for (let i = 0; i < 3; i++) {
    row = gameBoard[i][0];
    col = gameBoard[0][i];
    for (let j = 1; j < 3; j++) {
      if (gameBoard[i][j] !== row) row = null;
      if (gameBoard[j][i] !== col) col = null;

      if (i === j && firstDiagonal !== gameBoard[i][j]) firstDiagonal = null;
      if (i + j === 2 && secondDiagonal !== gameBoard[i][j])
        secondDiagonal = null;
    }

    if (row || col) break;
  }

  if (row) winner = row;
  else if (col) winner = col;
  else if (firstDiagonal) winner = firstDiagonal;
  else if (secondDiagonal) winner = secondDiagonal;

  return winner ? players[winner] : null;
}

const deriveGameBoard = (gameTurns) => {
  const gameBoard = [...INITIAL_GAME_BOARD.map((row) => [...row])];
  gameTurns.map(({ square: { row, col }, player }) => {
    gameBoard[row][col] = player;
  });

  return gameBoard;
};

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = deriveActivePlayer(gameTurns);

  // Deriving game board
  const gameBoard = deriveGameBoard(gameTurns);

  // Deciding whether someone has won the game or not
  const winner = deriveWinner(gameBoard, players);

  // Checking whether there is draw or not
  const hasDraw = gameTurns.length === 9 && !winner;

  const handleSelectSquare = (rowIndex, colIndex) => {
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        {
          square: { row: rowIndex, col: colIndex },
          player: currentPlayer,
        },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  };

  function handleReset() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS["X"]}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS["0"]}
            symbol="0"
            isActive={activePlayer === "0"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onReset={handleReset} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log logs={gameTurns} />
    </main>
  );
}

export default App;
