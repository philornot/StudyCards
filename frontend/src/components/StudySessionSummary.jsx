import Button from './ui/Button';
import './StudySessionSummary.css';

const StudySessionSummary = ({
  reviewedCount,
  qualityBreakdown,
  duration,
  onContinue,
  onExit
}) => {
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds} sekund`;
    const minutes = Math.floor(seconds / 60);
    return minutes === 1 ? '1 minuta' : `${minutes} minut`;
  };

  const getMotivationalMessage = () => {
    const accuracy = qualityBreakdown.good + qualityBreakdown.easy;
    const total = reviewedCount;
    const percentage = total > 0 ? (accuracy / total) * 100 : 0;

    if (percentage >= 80) {
      return "Świetna robota! Twoja wiedza jest imponująca! 🌟";
    } else if (percentage >= 60) {
      return "Dobra praca! Robisz stałe postępy! 💪";
    } else if (percentage >= 40) {
      return "Nieźle! Kontynuuj naukę, a będzie jeszcze lepiej! 📚";
    } else {
      return "Nie poddawaj się! Każda sesja nauki przybliża Cię do celu! 🎯";
    }
  };

  return (
    <div className="study-summary">
      <div className="summary-icon">🎉</div>
      <h1 className="summary-title">Sesja zakończona!</h1>
      <p className="summary-message">
        Świetnie Ci idzie! Przejrzałeś {reviewedCount} {reviewedCount === 1 ? 'fiszkę' : 'fiszek'}.
      </p>

      <div className="motivational-message">
        {getMotivationalMessage()}
      </div>

      <div className="summary-stats">
        <div className="summary-stat-row">
          <span className="stat-label">Przejrzane fiszki</span>
          <span className="stat-value">{reviewedCount}</span>
        </div>
        {duration && (
          <div className="summary-stat-row">
            <span className="stat-label">Czas trwania</span>
            <span className="stat-value">{formatDuration(duration)}</span>
          </div>
        )}

        <div className="quality-breakdown">
          <div className="quality-item quality-again">
            <span className="quality-count">{qualityBreakdown.again}</span>
            <span className="quality-label">Again</span>
          </div>
          <div className="quality-item quality-hard">
            <span className="quality-count">{qualityBreakdown.hard}</span>
            <span className="quality-label">Hard</span>
          </div>
          <div className="quality-item quality-good">
            <span className="quality-count">{qualityBreakdown.good}</span>
            <span className="quality-label">Good</span>
          </div>
          <div className="quality-item quality-easy">
            <span className="quality-count">{qualityBreakdown.easy}</span>
            <span className="quality-label">Easy</span>
          </div>
        </div>
      </div>

      <div className="summary-actions">
        <Button size="large" onClick={onContinue}>
          Kontynuuj naukę
        </Button>
        <Button variant="secondary" size="large" onClick={onExit}>
          Wróć do zestawu
        </Button>
      </div>
    </div>
  );
};

export default StudySessionSummary;