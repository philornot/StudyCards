import { useState } from 'react';
import CardProgressBadge from './CardProgressBadge.jsx';
import CardProgressDetails from './CardProgressDetails.jsx';
import './CardListItem.css';

const CardListItem = ({ card, index, showProgress = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProgressDetails, setShowProgressDetails] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleProgressDetails = () => {
    setShowProgressDetails(!showProgressDetails);
  };

  const needsExpansion = card.definition.length > 150;

  // Determine card status based on progress
  const getCardStatus = () => {
    if (!card.progress) return 'new';
    if (card.progress.repetitions === 0) return 'new';
    if (card.progress.repetitions < 3 || card.progress.ease_factor < 2.0) return 'learning';
    return 'mature';
  };

  const status = showProgress ? getCardStatus() : null;

  return (
    <div className="card-list-item">
      <div className="card-list-item-header">
        <span className="card-number">{index + 1}</span>
        <div className="card-content">
          <div className="card-term">
            <strong>{card.term}</strong>
            {showProgress && status && (
              <span style={{ marginLeft: 'var(--spacing-sm)' }}>
                <CardProgressBadge status={status} />
              </span>
            )}
          </div>
          <div className={`card-definition ${isExpanded ? 'expanded' : ''}`}>
            {isExpanded || !needsExpansion
              ? card.definition
              : `${card.definition.substring(0, 150)}...`}
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
            {needsExpansion && (
              <button
                className="expand-button"
                onClick={toggleExpanded}
              >
                {isExpanded ? 'Pokaż mniej' : 'Pokaż więcej'}
              </button>
            )}
            {showProgress && (
              <button
                className="expand-button"
                onClick={toggleProgressDetails}
              >
                {showProgressDetails ? 'Ukryj postęp' : 'Pokaż postęp'}
              </button>
            )}
          </div>
          {showProgress && showProgressDetails && (
            <CardProgressDetails progress={card.progress} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardListItem;