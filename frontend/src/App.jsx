import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import CreateSetPage from './pages/CreateSetPage/CreateSetPage.jsx';
import SetDetailsPage from './pages/SetDetailsPage/SetDetailsPage.jsx';
import EditSetPage from './pages/EditSetPage/EditSetPage.jsx';
import FlashcardsPage from './pages/FlashcardsPage/FlashcardsPage.jsx';
import StudyPage from './pages/StudyPage/StudyPage.jsx';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateSetPage />} />
          <Route path="/sets/:id" element={<SetDetailsPage />} />
          <Route path="/sets/:id/edit" element={<EditSetPage />} />
          <Route path="/sets/:id/flashcards" element={<FlashcardsPage />} />
          <Route path="/sets/:id/study" element={<StudyPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;