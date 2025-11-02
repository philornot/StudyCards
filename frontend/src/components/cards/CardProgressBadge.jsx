import './CardProgressBadge.css';

const CardProgressBadge = ({ status }) => {
  const badges = {
    new: { label: 'Nowa', icon: '✨', className: 'badge-new' },
    learning: { label: 'W nauce', icon: '📖', className: 'badge-learning' },
    mature: { label: 'Opanowana', icon: '⭐', className: 'badge-mature' }
  };

  const badge = badges[status] || badges.new;

  return (
    <span className={`card-progress-badge ${badge.className}`}>
      <span>{badge.icon}</span>
      <span>{badge.label}</span>
    </span>
  );
};

export default CardProgressBadge;