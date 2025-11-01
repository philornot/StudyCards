import './Textarea.css';

const Textarea = ({
  label,
  error,
  className = '',
  rows = 4,
  ...props
}) => {
  return (
    <div className={`textarea-wrapper ${className}`}>
      {label && <label className="textarea-label">{label}</label>}
      <textarea
        className={`textarea ${error ? 'textarea-error' : ''}`}
        rows={rows}
        {...props}
      />
      {error && <span className="textarea-error-message">{error}</span>}
    </div>
  );
};

export default Textarea;