import React, { useState, useCallback } from 'react';
import { Dice1 as DiceFive } from 'lucide-react';
import Board from './components/Board';
import QuestionModal from './components/QuestionModal';
import { questions } from './data/questions';
import { snakesAndLadders } from './data/board';
import type { Player, Question } from './types';

function App() {
  const [players, setPlayers] = useState<Player[]>([
    { position: 1, color: '#FF6B6B', name: 'Player 1' },
    { position: 1, color: '#4ECDC4', name: 'Player 2' }
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const movePlayer = useCallback((steps: number) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      let newPosition = newPlayers[currentPlayer].position + steps;

      // Check for snakes and ladders
      const snakeOrLadder = snakesAndLadders.find(item => item.start === newPosition);
      if (snakeOrLadder) {
        newPosition = snakeOrLadder.end;
      }

      // Ensure position doesn't exceed 100
      if (newPosition > 100) {
        newPosition = 100;
      }

      newPlayers[currentPlayer] = {
        ...newPlayers[currentPlayer],
        position: newPosition
      };

      // Check for win condition
      if (newPosition === 100) {
        setGameOver(true);
      }

      return newPlayers;
    });

    setCurrentPlayer(prev => (prev + 1) % players.length);
  }, [currentPlayer, players.length]);

  const handleRollDice = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setCurrentQuestion(null);
    if (isCorrect) {
      const steps = Math.floor(Math.random() * 6) + 1;
      movePlayer(steps);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Snake and Ladder: Critical Thinking Edition
          </h1>
          <p className="text-gray-600">
            Answer questions correctly to roll the dice!
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <Board players={players} />
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-4">
              {players.map((player, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 p-2 rounded ${
                    currentPlayer === idx ? 'bg-blue-50' : ''
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: player.color }}
                  />
                  <span className="font-medium">
                    {player.name} (Position: {player.position})
                  </span>
                </div>
              ))}
            </div>

            {!gameOver && (
              <button
                onClick={handleRollDice}
                disabled={!!currentQuestion}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <DiceFive className="w-5 h-5" />
                Roll Dice
              </button>
            )}
          </div>

          {gameOver && (
            <div className="mt-4 text-center p-4 bg-green-100 rounded-lg">
              <h2 className="text-xl font-bold text-green-800">
                🎉 {players[currentPlayer === 0 ? players.length - 1 : currentPlayer - 1].name} Wins! 🎉
              </h2>
            </div>
          )}
        </div>
      </div>

      {currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}

export default App;