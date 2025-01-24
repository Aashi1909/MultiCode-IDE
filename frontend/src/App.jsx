import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import EditorPage from './pages/EditorPage'
const App = () => {
  return (
    <>
    <BrowserRouter>
        <RouteHandler />
  
    </BrowserRouter>
      
    </>
  )
}

const RouteHandler = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn")
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
