import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import './CardEditor.css';

const CardEditor = ({ card, index, onUpdate, onRemove, canRemove, error }) => {
  return (
    <div className={`card-editor ${error ? 'card-editor-error' : ''}`}>
      <div className="card-editor-header">
        <span className="card-editor-number">{index + 1}</span>
        {canRemove && (
          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={() => onRemove(card.id)}
          >
            Usuń
          </Button>
        )}
      </div>

      <div className="card-editor-content">
        <Input
          label="Pojęcie *"
          placeholder="Wprowadź pojęcie..."
          value={card.term}
          onChange={(e) => onUpdate(card.id, 'term', e.target.value)}
        />
        <Textarea
          label="Definicja *"
          placeholder="Wprowadź definicję..."
          value={card.definition}
          onChange={(e) => onUpdate(card.id, 'definition', e.target.value)}
          rows={3}
        />
      </div>

      {error && (
        <div className="card-editor-error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default CardEditor;