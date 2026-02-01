import { useState } from 'react';

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button 
      className={`square ${isWinning ? 'winning' : ''} ${value ? 'filled' : ''}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares)?.winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  const winner = result?.winner;
  const winningLine = result?.line || [];
  
  let status;
  if (winner) {
    status = `🎉 Winner: ${winner}`;
  } else if (squares.every(square => square !== null)) {
    status = "🤝 It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="board-container">
      <div className={`status ${winner ? 'winner-status' : ''}`}>{status}</div>
      <div className="board">
        {[0, 1, 2].map(row => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map(col => {
              const index = row * 3 + col;
              return (
                <Square 
                  key={index}
                  value={squares[index]} 
                  onSquareClick={() => handleClick(index)}
                  isWinning={winningLine.includes(index)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `Move #${move}` : 'Game start';
    const isCurrent = move === currentMove;
    
    return (
      <li key={move} className={isCurrent ? 'current-move' : ''}>
        <button 
          onClick={() => jumpTo(move)}
          className={isCurrent ? 'active' : ''}
        >
          {description}
          {isCurrent && ' ← You are here'}
        </button>
      </li>
    );
  });

  return (
    <>
      <div className="background-gradient"></div>
      <div className="game">
        <h1>Tic-Tac-Toe</h1>
        <div className="game-container">
          <div className="left-column">
            <div className="game-board">
              <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <button className="reset-button" onClick={resetGame}>
              🔄 New Game
            </button>
          </div>
          <div className="game-info">
            <h3>Move History</h3>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .background-gradient {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          z-index: -2;
        }

        .background-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(102, 126, 234, 0.2) 0%, transparent 50%);
          animation: pulse 8s ease-in-out infinite;
        }

        .background-gradient::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.3;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .game {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          padding: 20px;
          position: relative;
        }

        h1 {
          color: white;
          font-size: 3.5rem;
          margin-bottom: 2.5rem;
          text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
          letter-spacing: -1px;
          font-weight: 700;
          text-align: center;
        }

        .game-container {
          display: flex;
          gap: 2rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 1200px;
        }

        .left-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }

        .board-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          border-radius: 24px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
        }

        .status {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          text-align: center;
          color: #333;
          min-height: 2rem;
          transition: all 0.3s ease;
        }

        .winner-status {
          color: #10b981;
          transform: scale(1.05);
          animation: celebration 0.6s ease-in-out;
        }

        @keyframes celebration {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
        }

        .board {
          display: inline-block;
          background: #f8fafc;
          border-radius: 16px;
          padding: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) inset;
        }

        .board-row {
          display: flex;
        }

        .square {
          width: 100px;
          height: 100px;
          background: white;
          border: none;
          font-size: 2.5rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #1e293b;
          margin: 4px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .square:hover:not(.filled) {
          background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .square.filled {
          cursor: not-allowed;
        }

        .square.winning {
          background: linear-gradient(135deg, #86efac 0%, #6ee7b7 100%);
          animation: winPulse 0.6s ease-in-out;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.5);
        }

        @keyframes winPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }

        .reset-button {
          width: 100%;
          max-width: 400px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .reset-button:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
        }

        .reset-button:active {
          transform: translateY(0);
        }

        .game-info {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          border-radius: 24px;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          min-width: 280px;
          max-width: 320px;
          align-self: center;
        }

        .game-info h3 {
          margin-top: 0;
          color: #1e293b;
          font-size: 1.4rem;
          margin-bottom: 1.2rem;
          font-weight: 700;
        }

        .game-info ol {
          padding-left: 1.5rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .game-info ol::-webkit-scrollbar {
          width: 8px;
        }

        .game-info ol::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .game-info ol::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .game-info ol::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .game-info li {
          margin-bottom: 0.6rem;
        }

        .game-info button {
          padding: 0.7rem 1rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.95rem;
          width: 100%;
          text-align: left;
          font-weight: 500;
          color: #475569;
        }

        .game-info button:hover {
          background: #f1f5f9;
          border-color: #667eea;
          transform: translateX(4px);
        }

        .game-info button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        }

        .current-move {
          font-weight: 600;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
          }

          .game-container {
            gap: 1.5rem;
            flex-direction: column;
          }

          .square {
            width: 85px;
            height: 85px;
            font-size: 2.2rem;
          }

          .board-container,
          .game-info {
            padding: 1.8rem;
          }

          .game-info {
            max-width: 100%;
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 2rem;
          }

          .square {
            width: 75px;
            height: 75px;
            font-size: 2rem;
            margin: 3px;
          }

          .board-container {
            padding: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}