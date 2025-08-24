"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("plantCart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("plantCart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (plant) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === plant.id)
      if (existingItem) {
        return prevItems.map((item) => (item.id === plant.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prevItems, { ...plant, quantity: 1 }]
    })
  }

  const removeFromCart = (plantId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== plantId))
  }

  const updateQuantity = (plantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(plantId)
      return
    }
    setCartItems((prevItems) => prevItems.map((item) => (item.id === plantId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
