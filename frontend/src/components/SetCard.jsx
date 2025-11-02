import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import './SetCard.css';

const SetCard = ({ set, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(set);
  };

  const handleCardClick = () => {
    navigate(`/sets/${set.id}`);
  };

  return (
    <Card className="set-card" hover onClick={handleCardClick}>
      <button
        className="set-card-delete-btn"
        onClick={handleDelete}
        aria-label="Usuń zestaw"
        title="Usuń zestaw"
      >
        🗑️
      </button>
      <div className="set-card-header">
        <h3 className="set-card-title">{set.title}</h3>
        <span className="set-card-count">{set.card_count} fiszek</span>
      </div>
      {set.description && (
        <p className="set-card-description">{set.description}</p>
      )}
      <div className="set-card-footer">
        <span className="set-card-date">Utworzono: {formatDate(set.created_at)}</span>
      </div>
    </Card>
  );
};

export default SetCard;