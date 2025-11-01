import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SetCard from '../components/SetCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/ui/Button';
import { setsApi } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                <SetCard key={set.id} set={set} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;