import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import './ConfirmResetModal.css';

const ConfirmResetModal = ({
  isOpen,
  onClose,
  onConfirm,
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
        {loading ? 'Resetowanie...' : 'Zresetuj postęp'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resetowanie postępu"
      footer={footer}
    >
      <div className="confirm-reset-content">
        <div className="confirm-reset-icon">🔄</div>
        <p className="confirm-reset-message">
          Czy na pewno chcesz zresetować cały postęp nauki dla tego zestawu?
        </p>
        <div className="confirm-reset-warning">
          ⚠️ Ta akcja usunie wszystkie dane o postępach, statystyki i harmonogram powtórek. Nie będzie można tego cofnąć!
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmResetModal;