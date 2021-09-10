import logo from './logo.svg';
import './App.css';
import {Chessboard} from 'react-chessboard';
import Chess from 'chess.js';
import React from 'react';


function App() {
  const [game, setGame] = React.useState(new Chess());

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    alert(possibleMoves[randomIndex])
    safeGameMutate((game) => {
      game.move(possibleMoves[randomIndex]);
    });
  }

  function getMoveFromEngine(){
    fetch('http://89.71.84.37:8080/Chess/GetNextMove?fen=' + game.fen())
    .then(res => res.json())
    .then((data) => safeGameMutate((game) => {
      game.move(data.moveUCI, { sloppy: true })
    }));
  }

  function onDrop(sourceSquare, targetSquare) {
    let move = null;
    safeGameMutate((game) => {
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });
    });
    if (move === null) return; // illegal move
    setTimeout(getMoveFromEngine, 200);
  }

  return (
    <div className="App">
      <header className="App-header">
      <Chessboard position={game.fen()} onPieceDrop={onDrop} boardWidth={getWidth()}/>
      </header>
    </div>
  );
}

function getWidth(){
  if(window.innerHeight < window.innerWidth / 2) return window.innerHeight - 10;
  if(window.innerWidth < 400) return window.innerWidth - 10;
  return window.innerWidth / 2 - 10
}

export default App;
