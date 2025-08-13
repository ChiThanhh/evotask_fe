import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import './App.css';
function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem("token")); 
  return (
    <Router>
      <div className='h-screen bg-background'>
        <Routes>
          <Route path="/auth" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />
          <Route
            path="/dashboard"
            element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" />}
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
