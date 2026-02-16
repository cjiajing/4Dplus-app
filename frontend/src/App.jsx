import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LocalDataProvider } from './contexts/LocalDataContext';
import MobileLayout from './components/MobileLayout';
import Welcome from './pages/Welcome';
import Profiles from './pages/Profiles';
import Dashboard from './pages/Dashboard';
import LiveDraw from './pages/LiveDraw';
import Predictions from './pages/Predictions';
import ProfileEdit from './pages/ProfileEdit';
import Settings from './pages/Settings';

function App() {
  return (
    <LocalDataProvider>
      <Router>
        <MobileLayout>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/profile/edit/:id" element={<ProfileEdit />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live-draw" element={<LiveDraw />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </MobileLayout>
      </Router>
    </LocalDataProvider>
  );
}

export default App;
