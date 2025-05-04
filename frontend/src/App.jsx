import  { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import EditorPage from './pages/EditorPage';
import SharedView from './pages/SharedView';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true"); 
    setIsLoggedIn(true);
  };


  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/editor/:id" element={isLoggedIn ? <EditorPage /> : <Navigate to="/login" />} />
          <Route path="/share/:hash" element= {<SharedView />}/>
          </Routes>
    </BrowserRouter>
  );
};

export default App;
