import { useState, useEffect } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';
import { setsApi } from '../../services/api.js';
import './ProgressDashboard.css';

const ProgressDashboard = ({ setId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, [setId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await setsApi.getStats(setId);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Nie udało się załadować statystyk');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="progress-dashboard">
        <LoadingSpinner size="medium" />
      </div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  return (
    <div className="progress-dashboard">
      <h2 className="dashboard-title">📊 Statystyki postępów</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📚</span>
          <span className="stat-value">{stats.total_cards}</span>
          <span className="stat-label">Wszystkie fiszki</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">✨</span>
          <span className="stat-value">{stats.new_cards}</span>
          <span className="stat-label">Nowe</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📖</span>
          <span className="stat-value">{stats.learning_cards}</span>
          <span className="stat-label">W nauce</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <span className="stat-value">{stats.mature_cards}</span>
          <span className="stat-label">Opanowane</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📈</span>
          <span className="stat-value">{stats.average_ease_factor}</span>
          <span className="stat-label">Średnia trudność</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">{stats.accuracy}%</span>
          <span className="stat-label">Dokładność</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📅</span>
          <span className="stat-value">{stats.reviews_today}</span>
          <span className="stat-label">Przeglądy dzisiaj</span>
        </div>

        <div className="stat-card">
          <span className="stat-icon">📊</span>
          <span className="stat-value">{stats.reviews_total}</span>
          <span className="stat-label">Wszystkie przeglądy</span>
        </div>
      </div>

      <div className="progress-breakdown">
        <h3 className="breakdown-title">Rozkład postępów</h3>
        <div className="progress-bars">
          <div className="progress-item">
            <div className="progress-item-header">
              <span className="progress-item-label">Nowe fiszki</span>
              <span className="progress-item-value">
                {calculatePercentage(stats.new_cards, stats.total_cards)}%
              </span>
            </div>
            <div className="progress-bar-wrapper">
              <div
                className="progress-bar-inner progress-new"
                style={{
                  width: `${calculatePercentage(stats.new_cards, stats.total_cards)}%`
                }}
              />
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-item-header">
              <span className="progress-item-label">W nauce</span>
              <span className="progress-item-value">
                {calculatePercentage(stats.learning_cards, stats.total_cards)}%
              </span>
            </div>
            <div className="progress-bar-wrapper">
              <div
                className="progress-bar-inner progress-learning"
                style={{
                  width: `${calculatePercentage(stats.learning_cards, stats.total_cards)}%`
                }}
              />
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-item-header">
              <span className="progress-item-label">Opanowane</span>
              <span className="progress-item-value">
                {calculatePercentage(stats.mature_cards, stats.total_cards)}%
              </span>
            </div>
            <div className="progress-bar-wrapper">
              <div
                className="progress-bar-inner progress-mature"
                style={{
                  width: `${calculatePercentage(stats.mature_cards, stats.total_cards)}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {stats.current_streak > 0 && (
        <div className="streak-section">
          <div className="streak-value">
            <span className="streak-icon">🔥</span>
            <span>{stats.current_streak}</span>
          </div>
          <div className="streak-label">
            {stats.current_streak === 1 ? 'dzień pod rząd' : 'dni pod rząd'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;