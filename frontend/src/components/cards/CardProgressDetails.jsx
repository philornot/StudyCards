import './CardProgressDetails.css';

const CardProgressDetails = ({ progress }) => {
  if (!progress) {
    return (
      <div className="card-progress-details">
        <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
          Ta fiszka nie była jeszcze przeglądana
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderEaseStars = (easeFactor) => {
    const maxStars = 5;
    const filledStars = Math.round((easeFactor / 2.5) * maxStars);

    return (
      <div className="ease-stars">
        {Array.from({ length: maxStars }).map((_, i) => (
          <span key={i} className={`ease-star ${i < filledStars ? '' : 'empty'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="card-progress-details">
      <div className="progress-details-grid">
        <div className="progress-detail-item">
          <span className="detail-label">Trudność</span>
          <div className="detail-value">
            {renderEaseStars(progress.ease_factor)}
          </div>
        </div>

        <div className="progress-detail-item">
          <span className="detail-label">Powtórzenia</span>
          <span className="detail-value">{progress.repetitions}</span>
        </div>

        <div className="progress-detail-item">
          <span className="detail-label">Pomyłki</span>
          <span className="detail-value">{progress.lapses}</span>
        </div>

        <div className="progress-detail-item">
          <span className="detail-label">Ostatnia powtórka</span>
          <span className="detail-value">{formatDate(progress.last_reviewed)}</span>
        </div>

        <div className="progress-detail-item">
          <span className="detail-label">Następna powtórka</span>
          <span className="detail-value">{formatDate(progress.next_review)}</span>
        </div>

        <div className="progress-detail-item">
          <span className="detail-label">Interwał</span>
          <span className="detail-value">
            {progress.interval_days} {progress.interval_days === 1 ? 'dzień' : 'dni'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardProgressDetails;