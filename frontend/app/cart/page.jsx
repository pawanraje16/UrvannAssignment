"use client"

import { useState } from "react"
import { useCart } from "../../components/context/CartContext"
import { useAuth } from "../../components/auth/AuthGuard"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Minus, Plus, Trash2, ShoppingBag, MapPin } from "lucide-react"

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const [showCheckout, setShowCheckout] = useState(false)
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  })

  const handleQuantityChange = (plantId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(plantId, newQuantity)
    }
  }

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckout = () => {
    // Create order object
    const order = {
      id: Date.now(),
      userId: user?.email,
      items: cartItems,
      total: getCartTotal(),
      address: address,
      status: "pending",
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }

    // Save order to localStorage (in real app, this would be API call)
    const existingOrders = JSON.parse(localStorage.getItem("userOrders") || "[]")
    existingOrders.push(order)
    localStorage.setItem("userOrders", JSON.stringify(existingOrders))

    // Clear cart and show success
    clearCart()
    alert("Order placed successfully! Check your orders page for details.")
    setShowCheckout(false)
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-green-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-green-800 mb-4">Your Cart is Empty</h1>
            <p className="text-green-600 mb-8">Add some beautiful plants to get started!</p>
            <Button onClick={() => (window.location.href = "/plants")} className="bg-green-600 hover:bg-green-700">
              Browse Plants
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-green-800">Shopping Cart</h1>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/plants")}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            Continue Shopping
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800">{item.name}</h3>
                      <p className="text-green-600">${item.price}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.categories.map((category, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-800">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 mt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-800">${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Checkout Modal */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <MapPin className="w-5 h-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={address.fullName}
                      onChange={(e) => handleAddressChange("fullName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={address.email}
                      onChange={(e) => handleAddressChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={address.phone}
                      onChange={(e) => handleAddressChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={address.street}
                      onChange={(e) => handleAddressChange("street", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={address.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={address.state}
                      onChange={(e) => handleAddressChange("state", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={address.zipCode}
                      onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={address.notes}
                    onChange={(e) => handleAddressChange("notes", e.target.value)}
                    placeholder="Any special delivery instructions..."
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Total Amount</span>
                    <span className="text-green-800">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleCheckout} className="flex-1 bg-green-600 hover:bg-green-700">
                      Place Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
