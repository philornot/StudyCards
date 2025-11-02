import { useState } from 'react';
import './Flashcard.css';

const Flashcard = ({ card }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcard-container">
      <div
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-face flashcard-front">
          <span className="flashcard-label">Pojęcie</span>
          <div className="flashcard-content">
            {card.term}
          </div>
          <p className="flashcard-hint">
            Kliknij, aby zobaczyć definicję
          </p>
        </div>
        <div className="flashcard-face flashcard-back">
          <span className="flashcard-label">Definicja</span>
          <div className="flashcard-content">
            {card.definition}
          </div>
          <p className="flashcard-hint">
            Kliknij, aby wrócić
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
