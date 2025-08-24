"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext.jsx"
import { useCart } from "../contexts/CartContext.jsx"

const Header = () => {
  const { user, logout } = useAuth()
  const { getCartItemsCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user) return null

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/plants" className="text-2xl font-bold text-green-600">
              🌱 PlantShop
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/plants" className="text-gray-700 hover:text-green-600 transition-colors">
                Plants
              </Link>
              <Link to="/orders" className="text-gray-700 hover:text-green-600 transition-colors">
                My Orders
              </Link>
              {user.type === "admin" && (
                <Link to="/admin" className="text-gray-700 hover:text-green-600 transition-colors">
                  Admin
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-green-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9"
                />
              </svg>
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {user.name} ({user.type})
              </span>
              <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
