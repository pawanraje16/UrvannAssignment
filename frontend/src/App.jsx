"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext.jsx"
import Header from "./components/Header.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import PlantsPage from "./pages/PlantsPage.jsx"
import CartPage from "./pages/CartPage.jsx"
import OrdersPage from "./pages/OrdersPage.jsx"
import AdminPage from "./pages/AdminPage.jsx"

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/plants" /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/plants" element={user ? <PlantsPage /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
        <Route path="/orders" element={user ? <OrdersPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.type === "admin" ? <AdminPage /> : <Navigate to="/plants" />} />
      </Routes>
    </div>
  )
}

export default App
