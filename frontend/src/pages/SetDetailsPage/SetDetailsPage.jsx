import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar.jsx";
import Button from "../../components/ui/Button.jsx";
import CardListItem from "../../components/cards/CardListItem.jsx";
import LoadingSpinner from "../../components/shared/LoadingSpinner.jsx";
import ConfirmDeleteModal from "../../components/shared/ConfirmDeleteModal.jsx";
import Toast from "../../components/ui/Toast.jsx";
import ProgressDashboard from "../../components/stats/ProgressDashboard.jsx";
import { setsApi } from "../../services/api.js";
import "./SetDetailsPage.css";

const SetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [set, setSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [srStats, setSrStats] = useState(null);
  const [loadingSrStats, setLoadingSrStats] = useState(false);

  useEffect(() => {
    fetchSet();
    fetchSrStats();
  }, [id]);

  const fetchSet = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await setsApi.getById(id);
      setSet(response.data);
    } catch (err) {
      console.error("Error fetching set:", err);
      if (err.response?.status === 404) {
        setError("Zestaw nie został znaleziony.");
      } else {
        setError("Nie udało się załadować zestawu. Spróbuj ponownie.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSrStats = async () => {
    try {
      setLoadingSrStats(true);
      const response = await setsApi.getSpacedRepetitionCards(id);
      setSrStats(response.data.stats);
    } catch (err) {
      console.error("Error fetching SR stats:", err);
      setSrStats(null);
    } finally {
      setLoadingSrStats(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await setsApi.delete(id);
      setShowDeleteModal(false);
      setToast({
        type: "success",
        message: "Zestaw został pomyślnie usunięty",
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Error deleting set:", err);
      setShowDeleteModal(false);
      setToast({
        type: "error",
        message: "Nie udało się usunąć zestawu. Spróbuj ponownie.",
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LoadingSpinner size="large" />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="error-container">
            <h2>Błąd</h2>
            <p>{error}</p>
            <Button onClick={() => navigate("/")}>
              Wróć do strony głównej
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (!set) {
    return null;
  }

  const dueCount = srStats ? srStats.total_cards : 0;
  const hasCardsToStudy = !loadingSrStats && (srStats === null || dueCount > 0);

  return (
    <>
      <Navbar />
      <div className="set-details-page">
        <div className="container">
          <Button
            variant="outline"
            size="small"
            onClick={() => navigate("/")}
            className="back-button"
          >
            ← Powrót
          </Button>

          <ProgressDashboard setId={id} />

          <div className="set-header">
            <div className="set-info">
              <h1 className="set-title">{set.title}</h1>
              {set.description && (
                <p className="set-description">{set.description}</p>
              )}
              <div className="set-meta">
                <span className="meta-item">
                  📚 {set.cards.length}{" "}
                  {set.cards.length === 1 ? "fiszka" : "fiszek"}
                </span>
                <span className="meta-item">
                  📅 Utworzono: {formatDate(set.created_at)}
                </span>
              </div>
            </div>

            <div className="action-buttons">
              <Button
                size="large"
                onClick={() => navigate(`/sets/${id}/study`)}
                disabled={loadingSrStats}
                title={
                  loadingSrStats
                    ? "Ładowanie..."
                    : dueCount > 0
                    ? `${dueCount} fiszek do nauki`
                    : "Rozpocznij naukę"
                }
              >
                🧠 Rozpocznij naukę
                {!loadingSrStats && dueCount > 0 && (
                  <span
                    style={{
                      marginLeft: "var(--spacing-xs)",
                      padding: "2px 8px",
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "var(--radius-full)",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: "var(--font-weight-bold)",
                    }}
                  >
                    {dueCount}
                  </span>
                )}
              </Button>
              <Button
                size="large"
                variant="secondary"
                onClick={() => navigate(`/sets/${id}/flashcards`)}
              >
                🎴 Tryb fiszek
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/sets/${id}/edit`)}
              >
                ✏️ Edytuj
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                🗑️ Usuń
              </Button>
            </div>
          </div>

          <div className="cards-section">
            <h2 className="section-title">Fiszki w zestawie</h2>
            <div className="cards-list">
              {set.cards.map((card, index) => (
                <CardListItem
                  key={card.id}
                  card={card}
                  index={index}
                  showProgress={true}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={set.title}
        loading={deleting}
      />

      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </>
  );
};

export default SetDetailsPage;