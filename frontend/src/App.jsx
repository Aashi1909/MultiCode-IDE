import React, { useEffect, useState } from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import EditorPage from './pages/EditorPage'
import { ThemeProvider } from './context/ThemeContext'; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  return (
    <>
    <BrowserRouter>
    <ThemeProvider> 
          <RouteHandler isLoggedIn={isLoggedIn} />
        </ThemeProvider>  
    </BrowserRouter>
      
    </>
  )
}

const RouteHandler = ({isLoggedIn}) => {
  return (
    <>
    <Routes>
      <Route path="/" element={ isLoggedIn ? <Home /> : <Navigate to= {"/login"} />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/editor/:id" element={ isLoggedIn ? <EditorPage /> : <Navigate to= {"/login"} /> } />
    </Routes>
    </>
  )
}

export default App
