import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreateSetPage from './pages/CreateSetPage';
import SetDetailsPage from './pages/SetDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateSetPage />} />
        <Route path="/sets/:id" element={<SetDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;