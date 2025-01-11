import React from 'react'
import "./App.css"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
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
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
