import { useState } from 'react';
import './CardListItem.css';

const CardListItem = ({ card, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const needsExpansion = card.definition.length > 150;

  return (
    <div className="card-list-item">
      <div className="card-list-item-header">
        <span className="card-number">{index + 1}</span>
        <div className="card-content">
          <div className="card-term">
            <strong>{card.term}</strong>
          </div>
          <div className={`card-definition ${isExpanded ? 'expanded' : ''}`}>
            {isExpanded || !needsExpansion
              ? card.definition
              : `${card.definition.substring(0, 150)}...`}
          </div>
          {needsExpansion && (
            <button
              className="expand-button"
              onClick={toggleExpanded}
            >
              {isExpanded ? 'Pokaż mniej' : 'Pokaż więcej'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardListItem;