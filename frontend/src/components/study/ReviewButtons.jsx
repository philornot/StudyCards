import './ReviewButtons.css';

const ReviewButtons = ({ onReview, disabled = false, intervals = null }) => {
  const buttons = [
    {
      quality: 'again',
      label: 'Nie pamiętam',
      keys: ['1', 'Z'],
      className: 'review-button-again',
      title: 'Zupełnie nie pamiętam - zacznij od nowa'
    },
    {
      quality: 'hard',
      label: 'Trudne',
      keys: ['2', 'X'],
      className: 'review-button-hard',
      title: 'Trudne - pamiętam z trudem'
    },
    {
      quality: 'good',
      label: 'Dobrze',
      keys: ['3', 'C'],
      className: 'review-button-good',
      title: 'Dobrze - pamiętam po chwili zastanowienia'
    },
    {
      quality: 'easy',
      label: 'Łatwo',
      keys: ['4', 'V'],
      className: 'review-button-easy',
      title: 'Łatwo - pamiętam od razu'
    }
  ];

  const formatInterval = (quality) => {
    if (!intervals || !intervals[quality]) {
      // Default intervals for display
      const defaults = {
        again: '<10m',
        hard: '1 dzień',
        good: '4 dni',
        easy: '1 tydzień'
      };
      return defaults[quality];
    }

    const days = intervals[quality];
    if (days === 0) return '<10m';
    if (days === 1) return '1 dzień';
    if (days < 7) return `${days} dni`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? '1 tydzień' : `${weeks} tygodni`;
    }
    const months = Math.floor(days / 30);
    return months === 1 ? '1 miesiąc' : `${months} miesięcy`;
  };

  return (
    <div className="review-buttons">
      {buttons.map((button) => (
        <button
          key={button.quality}
          className={`review-button ${button.className}`}
          onClick={() => onReview(button.quality)}
          disabled={disabled}
          title={button.title}
          aria-label={`${button.label} - ${button.title}`}
        >
          <span className="review-button-label">{button.label}</span>
          <span className="review-button-interval">
            {formatInterval(button.quality)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ReviewButtons;