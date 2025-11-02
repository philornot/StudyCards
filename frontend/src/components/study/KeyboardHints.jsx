import './KeyboardHints.css';

const KeyboardHints = ({ isFlipped = false }) => {
  const hints = isFlipped ? [
    { key: '1', action: 'Again' },
    { key: '2', action: 'Hard' },
    { key: '3', action: 'Good' },
    { key: '4', action: 'Easy' },
    { key: 'Esc', action: 'Wyjdź' }
  ] : [
    { key: 'Space', action: 'Odwróć' },
    { key: 'Esc', action: 'Wyjdź' }
  ];

  return (
    <div className="keyboard-hints">
      {hints.map((hint, index) => (
        <div key={index} className="hint-item">
          <kbd className="hint-key">{hint.key}</kbd>
          <span className="hint-action">{hint.action}</span>
        </div>
      ))}
    </div>
  );
};

export default KeyboardHints;