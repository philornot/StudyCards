import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';
import Button from '../../components/ui/Button.jsx';
import CardEditor from '../../components/cards/CardEditor.jsx';
import { setsApi } from '../../services/api.js';
import './CreateSetPage.css';

const CreateSetPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState([
    { id: Date.now(), term: '', definition: '', order: 0 }
  ]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const addCard = () => {
    setCards([
      ...cards,
      { id: Date.now(), term: '', definition: '', order: cards.length }
    ]);
  };

  const updateCard = (id, field, value) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ));
    // Clear error for this card if it exists
    if (errors[`card-${id}`]) {
      setErrors({ ...errors, [`card-${id}`]: undefined });
    }
  };

  const removeCard = (id) => {
    if (cards.length > 1) {
      setCards(cards.filter(card => card.id !== id));
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
      setLoading(true);
      const setData = {
        title: title.trim(),
        description: description.trim() || null,
        cards: cards.map((card, index) => ({
          term: card.term.trim(),
          definition: card.definition.trim(),
          order: index
        }))
      };

      await setsApi.create(setData);
      navigate('/');
    } catch (err) {
      console.error('Error creating set:', err);
      setErrors({
        submit: err.response?.data?.detail || 'Nie udało się utworzyć zestawu. Spróbuj ponownie.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-set-page">
        <div className="container-narrow">
          <div className="create-set-header">
            <h1 className="create-set-title">Utwórz nowy zestaw</h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              Anuluj
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="create-set-form">
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
                onClick={() => navigate('/')}
              >
                Anuluj
              </Button>
              <Button
                type="submit"
                size="large"
                disabled={loading}
              >
                {loading ? 'Zapisywanie...' : 'Zapisz zestaw'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSetPage;