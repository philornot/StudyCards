import './Card.css';

const Card = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;