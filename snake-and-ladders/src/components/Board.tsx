import React from 'react';
import { Player, SnakeLadder } from '../types';
import { snakesAndLadders } from '../data/board';

interface BoardProps {
  players: Player[];
}

const Board: React.FC<BoardProps> = ({ players }) => {
  const cells = Array.from({ length: 100 }, (_, i) => i + 1).reverse();
  const rows = Array.from({ length: 10 }, (_, i) => i);

  const getSnakeOrLadder = (position: number): SnakeLadder | undefined => {
    return snakesAndLadders.find(item => item.start === position);
  };

  return (
    <div className="grid grid-cols-10 gap-0.5 bg-gray-200 p-1 rounded-lg">
      {rows.map(row => (
        cells.slice(row * 10, (row + 1) * 10).map((cell, colIndex) => {
          const snakeOrLadder = getSnakeOrLadder(cell);
          const playersHere = players.filter(p => p.position === cell);
          
          return (
            <div
              key={cell}
              className={`aspect-square flex items-center justify-center relative
                ${row % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                ${snakeOrLadder?.type === 'snake' ? 'bg-red-100' : ''}
                ${snakeOrLadder?.type === 'ladder' ? 'bg-green-100' : ''}
              `}
            >
              <span className="text-xs absolute top-1 left-1">{cell}</span>
              {playersHere.length > 0 && (
                <div className="flex gap-1">
                  {playersHere.map((player, idx) => (
                    <div
                      key={idx}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: player.color }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default Board;