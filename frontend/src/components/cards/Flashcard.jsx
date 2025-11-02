import { useState, useEffect } from 'react';
import './Flashcard.css';

const Flashcard = ({ card, flipTrigger, onFlipChange }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when card changes
  useEffect(() => {
    setIsFlipped(false);
    if (onFlipChange) {
      onFlipChange(false);
    }
  }, [card.id]);

  // Handle external flip trigger (e.g., from keyboard)
  useEffect(() => {
    if (flipTrigger > 0) {
      handleFlip();
    }
  }, [flipTrigger]);

  const handleFlip = () => {
    const newFlipState = !isFlipped;
    setIsFlipped(newFlipState);
    if (onFlipChange) {
      onFlipChange(newFlipState);
    }
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
            Kliknij lub naciśnij Spację, aby zobaczyć definicję
          </p>
        </div>
        <div className="flashcard-face flashcard-back">
          <span className="flashcard-label">Definicja</span>
          <div className="flashcard-content">
            {card.definition}
          </div>
          <p className="flashcard-hint">
            Kliknij lub naciśnij Spację, aby wrócić
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;