import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateSetPage from './pages/CreateSetPage';
import SetDetailsPage from './pages/SetDetailsPage';
import EditSetPage from './pages/EditSetPage';
import FlashcardsPage from './pages/FlashcardsPage';
import StudyPage from './pages/StudyPage';

function App() {
  return (
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
  );
}

export default App;