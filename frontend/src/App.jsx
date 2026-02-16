// Force redeploy - fixed dependencies
// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import MobileLayout from './components/MobileLayout';
import Welcome from './pages/Welcome';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import LiveDraw from './pages/LiveDraw';

function App() {
  return (
    <UserProvider>
      <Router>
        <MobileLayout>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/live-draw" element={<LiveDraw />} />
          </Routes>
        </MobileLayout>
      </Router>
    </UserProvider>
  );
}

export default App;
