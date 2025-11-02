import Modal from './ui/Modal';
import Button from './ui/Button';
import './ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  loading = false
}) => {
  const footer = (
    <>
      <Button
        variant="secondary"
        onClick={onClose}
        disabled={loading}
      >
        Anuluj
      </Button>
      <Button
        variant="danger"
        onClick={onConfirm}
        disabled={loading}
      >
        {loading ? 'Usuwanie...' : 'Usuń'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Potwierdzenie usunięcia"
      footer={footer}
    >
      <div className="confirm-delete-content">
        <div className="confirm-delete-icon">⚠️</div>
        <p className="confirm-delete-message">
          Czy na pewno chcesz usunąć zestaw{' '}
          <span className="confirm-delete-item-name">"{itemName}"</span>?
        </p>
        <div className="confirm-delete-warning">
          ⚠️ Ta akcja jest nieodwracalna! Wszystkie fiszki w tym zestawie zostaną trwale usunięte.
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
