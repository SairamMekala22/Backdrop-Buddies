import React from 'react';
import { Question } from '../types';

interface QuestionModalProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ question, onAnswer }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">{question.text}</h3>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              className="w-full text-left p-3 rounded border hover:bg-blue-50 transition"
              onClick={() => onAnswer(index === question.correctAnswer)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;