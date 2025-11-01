import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  onClick,
  className = ''
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;