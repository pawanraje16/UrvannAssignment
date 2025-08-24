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

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (plant) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === plant.id)
      if (existingItem) {
        return prev.map((item) => (item.id === plant.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...plant, quantity: 1 }]
    })
  }

  const removeFromCart = (plantId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== plantId))
  }

  const updateQuantity = (plantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(plantId)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.id === plantId ? { ...item, quantity } : item)))
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
