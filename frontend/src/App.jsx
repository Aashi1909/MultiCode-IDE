// App.jsx
import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import EditorPage from './pages/EditorPage';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true"); // ensure it's a string
    setIsLoggedIn(true);
  };


  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/editor/:id" element={isLoggedIn ? <EditorPage /> : <Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
