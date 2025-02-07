export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Player {
  position: number;
  color: string;
  name: string;
}

export interface SnakeLadder {
  start: number;
  end: number;
  type: 'snake' | 'ladder';
}