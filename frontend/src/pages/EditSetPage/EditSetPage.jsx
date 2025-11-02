import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import CardEditor from '../../components/cards/CardEditor.jsx';
import LoadingSpinner from '../../components/shared/LoadingSpinner.jsx';
import { setsApi } from '../../services/api.js';
import './EditSetPage.css';

const EditSetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchSet();
  }, [id]);

  const fetchSet = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const response = await setsApi.getById(id);
      const setData = response.data;

      setTitle(setData.title);
      setDescription(setData.description || '');
      setCards(setData.cards.map(card => ({
        id: card.id,
        term: card.term,
        definition: card.definition,
        order: card.order
      })));
    } catch (err) {
      console.error('Error fetching set:', err);
      if (err.response?.status === 404) {
        setFetchError('Zestaw nie został znaleziony.');
      } else {
        setFetchError('Nie udało się załadować zestawu. Spróbuj ponownie.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addCard = () => {
    setCards([
      ...cards,
      { id: Date.now(), term: '', definition: '', order: cards.length }
    ]);
  };

  const updateCard = (cardId, field, value) => {
    setCards(cards.map(card =>
      card.id === cardId ? { ...card, [field]: value } : card
    ));
    // Clear error for this card if it exists
    if (errors[`card-${cardId}`]) {
      setErrors({ ...errors, [`card-${cardId}`]: undefined });
    }
  };

  const removeCard = (cardId) => {
    if (cards.length > 1) {
      setCards(cards.filter(card => card.id !== cardId));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Tytuł jest wymagany';
    }

    cards.forEach(card => {
      if (!card.term.trim() || !card.definition.trim()) {
        newErrors[`card-${card.id}`] = 'Pojęcie i definicja są wymagane';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const setData = {
        title: title.trim(),
        description: description.trim() || null,
        cards: cards.map((card, index) => ({
          term: card.term.trim(),
          definition: card.definition.trim(),
          order: index
        }))
      };

      await setsApi.update(id, setData);
      navigate(`/sets/${id}`);
    } catch (err) {
      console.error('Error updating set:', err);
      setErrors({
        submit: err.response?.data?.detail || 'Nie udało się zaktualizować zestawu. Spróbuj ponownie.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
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

  if (fetchError) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-container">
            <h2>Błąd</h2>
            <p>{fetchError}</p>
            <Button onClick={() => navigate('/')}>Wróć do strony głównej</Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="edit-set-page">
        <div className="container-narrow">
          <div className="edit-set-header">
            <h1 className="edit-set-title">Edytuj zestaw</h1>
            <Button variant="outline" onClick={handleCancel}>
              Anuluj
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="edit-set-form">
            <div className="form-section">
              <h2 className="section-title">Informacje o zestawie</h2>
              <Input
                label="Tytuł zestawu *"
                placeholder="np. Hiszpański - Podstawy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title}
              />
              <Textarea
                label="Opis (opcjonalny)"
                placeholder="Dodaj opis zestawu..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-section">
              <div className="section-header">
                <h2 className="section-title">Fiszki</h2>
                <Button type="button" variant="outline" onClick={addCard}>
                  + Dodaj fiszkę
                </Button>
              </div>

              <div className="cards-list">
                {cards.map((card, index) => (
                  <CardEditor
                    key={card.id}
                    card={card}
                    index={index}
                    onUpdate={updateCard}
                    onRemove={removeCard}
                    canRemove={cards.length > 1}
                    error={errors[`card-${card.id}`]}
                  />
                ))}
              </div>
            </div>

            {errors.submit && (
              <div className="submit-error">
                {errors.submit}
              </div>
            )}

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                size="large"
                disabled={saving}
              >
                {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditSetPage;