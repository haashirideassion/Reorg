import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing/Landing';
import Contact from './pages/Contact/Contact';

import Assessment from './pages/Assessment/Assessment';

import { ScrollToTop } from './components/ScrollToTop';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/assessment" element={<Assessment />} />
                {/* Fallback to landing */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
