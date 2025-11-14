import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import TourGuidePage from './components/TourGuidePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <TourGuidePage user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;