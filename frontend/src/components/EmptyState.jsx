import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import './EmptyState.css';

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="empty-state">
      <div className="empty-state-icon">📚</div>
      <h2 className="empty-state-title">Brak zestawów</h2>
      <p className="empty-state-description">
        Utwórz swój pierwszy zestaw fiszek, aby rozpocząć naukę!
      </p>
      <Button size="large" onClick={() => navigate('/create')}>
        Utwórz pierwszy zestaw
      </Button>
    </div>
  );
};

export default EmptyState;