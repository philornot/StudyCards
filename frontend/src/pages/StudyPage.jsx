import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';
import ReviewButtons from '../components/ReviewButtons';
import StudySessionSummary from '../components/StudySessionSummary';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { setsApi, studyApi } from '../services/api';
import './StudyPage.css';

const StudyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [setTitle, setSetTitle] = useState('');
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipTrigger, setFlipTrigger] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewStats, setReviewStats] = useState({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0
  });
  const [sessionStartTime, setSessionStartTime] = useState(null);

  useEffect(() => {
    fetchStudySession();
    setSessionStartTime(Date.now());
  }, [id]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (sessionComplete) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (!isFlipped) {
            handleFlip();
          }
          break;
        case '1':
          e.preventDefault();
          if (isFlipped) handleReview('again');
          break;
        case '2':
          e.preventDefault();
          if (isFlipped) handleReview('hard');
          break;
        case '3':
          e.preventDefault();
          if (isFlipped) handleReview('good');
          break;
        case '4':
          e.preventDefault();
          if (isFlipped) handleReview('easy');
          break;
        case 'Escape':
          e.preventDefault();
          handleExit();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, currentIndex, submitting, sessionComplete]);

  const fetchStudySession = async () => {
    try {
      setLoading(true);
      setError(null);

      const setResponse = await setsApi.getById(id);
      setSetTitle(setResponse.data.title);

      const studyResponse = await setsApi.getSpacedRepetitionCards(id);
      setCards(studyResponse.data.cards);
      setStats(studyResponse.data.stats);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionComplete(false);
    } catch (err) {
      console.error('Error fetching study session:', err);
      if (err.response?.status === 404) {
        setError('Zestaw nie został znaleziony.');
      } else {
        setError('Nie udało się załadować sesji nauki. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setFlipTrigger(prev => prev + 1);
  };

  const handleReview = async (quality) => {
    if (!isFlipped || submitting || !cards[currentIndex]) return;

    try {
      setSubmitting(true);
      const currentCard = cards[currentIndex];
      await studyApi.submitReview(currentCard.id, quality);

      // Update stats
      setReviewStats(prev => ({
        ...prev,
        [quality]: prev[quality] + 1
      }));

      // Move to next card with animation
      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setIsFlipped(false);
        } else {
          // Session complete
          setSessionComplete(true);
        }
        setSubmitting(false);
      }, 300);
    } catch (err) {
      console.error('Error submitting review:', err);
      setSubmitting(false);
      alert('Nie udało się zapisać oceny. Spróbuj ponownie.');
    }
  };

  const handleContinue = () => {
    // Reset stats and fetch new session
    setReviewStats({
      again: 0,
      hard: 0,
      good: 0,
      easy: 0
    });
    setSessionStartTime(Date.now());
    fetchStudySession();
  };

  const handleExit = () => {
    navigate(`/sets/${id}`);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner size="large" />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-container">
            <h2>Błąd</h2>
            <p>{error}</p>
            <Button onClick={() => navigate('/')}>Wróć do strony głównej</Button>
          </div>
        </div>
      </>
    );
  }

  if (sessionComplete) {
    const duration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : null;
    const totalReviewed = reviewStats.again + reviewStats.hard + reviewStats.good + reviewStats.easy;

    return (
      <>
        <Navbar />
        <div className="study-page">
          <div className="container">
            <StudySessionSummary
              reviewedCount={totalReviewed}
              qualityBreakdown={reviewStats}
              duration={duration}
              onContinue={handleContinue}
              onExit={handleExit}
            />
          </div>
        </div>
      </>
    );
  }

  if (cards.length === 0) {
    return (
      <>
        <Navbar />
        <div className="study-page">
          <div className="container">
            <div className="no-cards-message">
              <div className="no-cards-icon">🎉</div>
              <h1 className="no-cards-title">Dobra robota!</h1>
              <p className="no-cards-description">
                Nie masz żadnych fiszek do nauki dzisiaj. Wróć jutro, aby kontynuować naukę!
              </p>
              <Button size="large" onClick={handleExit}>
                Wróć do zestawu
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;
  const isNewCard = !currentCard.progress;

  return (
    <>
      <Navbar />
      <div className="study-page">
        <div className="container">
          <div className="study-header">
            <h1 className="study-title">
              Nauka: {setTitle}
            </h1>
            <Button variant="outline" onClick={handleExit}>
              ✕ Zakończ
            </Button>
          </div>

          <div className="study-area">
            <div className="study-progress">
              <div className="progress-stats">
                <div>
                  <span className="progress-label">Postęp</span>
                  <span className="progress-count" style={{ marginLeft: 'var(--spacing-sm)' }}>
                    {currentIndex + 1} / {cards.length}
                  </span>
                </div>
                <div className="progress-badges">
                  {stats.new_cards > 0 && (
                    <span className="progress-badge badge-new">
                      {stats.new_cards} nowych
                    </span>
                  )}
                  {stats.review_cards > 0 && (
                    <span className="progress-badge badge-review">
                      {stats.review_cards} do powtórki
                    </span>
                  )}
                  {stats.overdue_cards > 0 && (
                    <span className="progress-badge badge-overdue">
                      {stats.overdue_cards} zaległych
                    </span>
                  )}
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="card-status">
              <span className={`card-status-badge ${isNewCard ? 'status-new' : 'status-review'}`}>
                {isNewCard ? '✨ Nowa fiszka' : '🔄 Powtórka'}
              </span>
            </div>

            <Flashcard
              card={currentCard}
              key={`${currentCard.id}-${currentIndex}`}
              flipTrigger={flipTrigger}
              onFlipChange={(flipped) => setIsFlipped(flipped)}
            />

            {!isFlipped ? (
              <div className="flip-hint">
                Naciśnij <strong>Spację</strong> lub kliknij fiszkę, aby zobaczyć odpowiedź
              </div>
            ) : (
              <div className="review-section">
                <div className="flip-hint">
                  Oceń jak dobrze pamiętasz tę fiszkę:
                </div>
                <ReviewButtons
                  onReview={handleReview}
                  disabled={submitting}
                />
              </div>
            )}

            <div style={{
              textAlign: 'center',
              marginTop: 'var(--spacing-lg)',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Klawisze: <strong>Spacja</strong> - odwróć | <strong>1-4</strong> - oceń | <strong>Esc</strong> - wyjdź
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyPage;