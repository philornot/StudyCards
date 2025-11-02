import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import Flashcard from '../../components/cards/Flashcard.jsx';
import Button from '../../components/ui/Button.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import { setsApi } from '../../services/api.js';
import './FlashcardsPage.css';

const FlashcardsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [setTitle, setSetTitle] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipTrigger, setFlipTrigger] = useState(0);

  useEffect(() => {
    fetchCards();
  }, [id]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't handle keys if we're in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Don't handle keys on completion screen
      if (isCompleted) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handleFlip();
          break;
        case 'ArrowRight':
        case 'Enter':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
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
  }, [currentIndex, cards.length, isCompleted]);

  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch set details for title
      const setResponse = await setsApi.getById(id);
      setSetTitle(setResponse.data.title);

      // Fetch randomized cards for study
      const cardsResponse = await setsApi.getStudyCards(id);
      setCards(cardsResponse.data);
      setCurrentIndex(0);
      setIsCompleted(false);
      setIsFlipped(false);
    } catch (err) {
      console.error('Error fetching cards:', err);
      if (err.response?.status === 404) {
        setError('Zestaw nie został znaleziony.');
      } else {
        setError('Nie udało się załadować fiszek. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setFlipTrigger(prev => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = async () => {
    await fetchCards();
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsCompleted(false);
    setIsFlipped(false);
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

  if (cards.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-container">
            <h2>Brak fiszek</h2>
            <p>Ten zestaw nie zawiera żadnych fiszek.</p>
            <Button onClick={() => navigate(`/sets/${id}`)}>Wróć do zestawu</Button>
          </div>
        </div>
      </>
    );
  }

  if (isCompleted) {
    return (
      <>
        <Navbar />
        <div className="flashcards-page">
          <div className="container">
            <div className="completion-screen">
              <div className="completion-icon">🎉</div>
              <h1 className="completion-title">Gratulacje!</h1>
              <p className="completion-message">
                Przejrzałeś wszystkie fiszki w zestawie "{setTitle}"
              </p>
              <div className="completion-stats">
                <div className="stat-item">
                  <strong>Przejrzane fiszki:</strong> {cards.length}
                </div>
              </div>
              <div className="completion-actions">
                <Button size="large" onClick={handleRestart}>
                  🔄 Rozpocznij od nowa
                </Button>
                <Button variant="secondary" size="large" onClick={handleShuffle}>
                  🔀 Losuj kolejność
                </Button>
                <Button variant="outline" size="large" onClick={handleExit}>
                  ← Wróć do zestawu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <>
      <Navbar />
      <div className="flashcards-page">
        <div className="container">
          <div className="flashcards-header">
            <h1 className="flashcards-title">
              Nauka: {setTitle}
            </h1>
            <div className="flashcards-controls">
              <Button variant="outline" onClick={handleShuffle}>
                🔀 Losuj
              </Button>
              <Button variant="outline" onClick={handleExit}>
                ✕ Zakończ
              </Button>
            </div>
          </div>

          <div className="flashcards-study-area">
            <div className="progress-bar-container">
              <div className="progress-info">
                <span className="progress-text">Postęp</span>
                <span className="progress-count">
                  {currentIndex + 1} / {cards.length}
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <Flashcard
              card={currentCard}
              key={`${currentCard.id}-${currentIndex}`}
              flipTrigger={flipTrigger}
              onFlipChange={(flipped) => setIsFlipped(flipped)}
            />

            <div className="side-indicator">
              {isFlipped ? 'Definicja (tył)' : 'Pojęcie (przód)'} • Spacja - odwróć
            </div>

            <div className="navigation-controls">
              <Button
                variant="secondary"
                size="large"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                ← Poprzednia
              </Button>
              <Button
                size="large"
                onClick={handleNext}
              >
                {currentIndex === cards.length - 1 ? 'Zakończ' : 'Następna →'}
              </Button>
            </div>

            <div className="keyboard-hints" style={{
              textAlign: 'center',
              marginTop: 'var(--spacing-lg)',
              color: 'var(--color-text-muted)',
              fontSize: 'var(--font-size-sm)'
            }}>
              Klawisze: <strong>Spacja</strong> - odwróć | <strong>←</strong> poprzednia | <strong>→ / Enter</strong> następna | <strong>Esc</strong> - wyjdź
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlashcardsPage;