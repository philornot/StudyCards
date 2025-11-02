import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import SetCard from '../../components/cards/SetCard.jsx';
import EmptyState from '../../components/shared/EmptyState.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import ConfirmDeleteModal from '../../components/shared/ConfirmDeleteModal.jsx';
import Toast from '../../components/ui/Toast.jsx';
import Button from '../../components/ui/Button.jsx';
import { setsApi } from '../../services/api.js';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSets();
  }, []);

  const fetchSets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await setsApi.getAll();
      setSets(response.data);
    } catch (err) {
      setError('Nie udało się załadować zestawów. Spróbuj ponownie.');
      console.error('Error fetching sets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (set) => {
    setSetToDelete(set);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!setToDelete) return;

    try {
      setDeleting(true);
      await setsApi.delete(setToDelete.id);

      // Remove set from list without reloading
      setSets(sets.filter(s => s.id !== setToDelete.id));

      setShowDeleteModal(false);
      setSetToDelete(null);
      setToast({
        type: 'success',
        message: `Zestaw "${setToDelete.title}" został usunięty`
      });
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

  const handleCloseModal = () => {
    if (!deleting) {
      setShowDeleteModal(false);
      setSetToDelete(null);
    }
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
          <div className="error-message">
            <p>{error}</p>
            <Button onClick={fetchSets}>Spróbuj ponownie</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="home-page">
        <div className="container">
          <div className="home-header">
            <div>
              <h1 className="home-title">Moje zestawy</h1>
              <p className="home-subtitle">
                {sets.length === 0
                  ? 'Rozpocznij swoją przygodę z nauką'
                  : `${sets.length} ${sets.length === 1 ? 'zestaw' : 'zestawów'}`}
              </p>
            </div>
            <Button size="large" onClick={() => navigate('/create')}>
              + Utwórz zestaw
            </Button>
          </div>

          {sets.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="sets-grid">
              {sets.map((set) => (
                <SetCard
                  key={set.id}
                  set={set}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {setToDelete && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseModal}
          onConfirm={handleDeleteConfirm}
          itemName={setToDelete.title}
          loading={deleting}
        />
      )}

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

export default HomePage;