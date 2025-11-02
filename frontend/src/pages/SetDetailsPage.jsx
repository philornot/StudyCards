import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';
import CardListItem from '../components/CardListItem';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Toast from '../components/ui/Toast';
import { setsApi } from '../services/api';
import './SetDetailsPage.css';

const SetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [set, setSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSet();
  }, [id]);

  const fetchSet = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await setsApi.getById(id);
      setSet(response.data);
    } catch (err) {
      console.error('Error fetching set:', err);
      if (err.response?.status === 404) {
        setError('Zestaw nie został znaleziony.');
      } else {
        setError('Nie udało się załadować zestawu. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await setsApi.delete(id);
      setShowDeleteModal(false);
      setToast({ type: 'success', message: 'Zestaw został pomyślnie usunięty' });
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Error deleting set:', err);
      setShowDeleteModal(false);
      setToast({
        type: 'error',
        message: 'Nie udało się usunąć zestawu. Spróbuj ponownie.'
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!set) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="set-details-page">
        <div className="container">
          <Button
            variant="outline"
            size="small"
            onClick={() => navigate('/')}
            className="back-button"
          >
            ← Powrót
          </Button>

          <div className="set-header">
            <div className="set-info">
              <h1 className="set-title">{set.title}</h1>
              {set.description && (
                <p className="set-description">{set.description}</p>
              )}
              <div className="set-meta">
                <span className="meta-item">
                  📚 {set.cards.length} {set.cards.length === 1 ? 'fiszka' : 'fiszek'}
                </span>
                <span className="meta-item">
                  📅 Utworzono: {formatDate(set.created_at)}
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <Button
                size="large"
                onClick={() => navigate(`/sets/${id}/flashcards`)}
              >
                🎴 Ucz się (Fiszki)
              </Button>
              <Button
                size="large"
                disabled
                title="Dostępne wkrótce"
              >
                🧠 Ucz się (Spaced Repetition)
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/sets/${id}/edit`)}
              >
                ✏️ Edytuj
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
              >
                🗑️ Usuń
              </Button>
            </div>
          </div>

          <div className="cards-section">
            <h2 className="section-title">Fiszki w zestawie</h2>
            <div className="cards-list">
              {set.cards.map((card, index) => (
                <CardListItem
                  key={card.id}
                  card={card}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={set.title}
        loading={deleting}
      />

      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </>
  );
};

export default SetDetailsPage;