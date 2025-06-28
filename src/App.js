import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CompanyRegisterPage from './components/Company/CompanyRegisterPage';
import SuccessPage from './components/Company/SuccessPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CompanyRegisterPage />} />
        <Route path="/success" element={<SuccessPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
