"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../components/auth/AuthGuard"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Package, Calendar, MapPin, Phone, Mail } from "lucide-react"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    // Load user orders from localStorage
    const userOrders = JSON.parse(localStorage.getItem("userOrders") || "[]")
    const myOrders = userOrders.filter((order) => order.userId === user?.email)
    setOrders(myOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)))
  }, [user])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-green-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-green-800 mb-4">No Orders Yet</h1>
            <p className="text-green-600 mb-8">Start shopping to see your orders here!</p>
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
        <h1 className="text-4xl font-bold text-green-800 mb-8">My Orders</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className={`border-green-200 cursor-pointer transition-all ${
                  selectedOrder?.id === order.id ? "ring-2 ring-green-500" : ""
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-green-800">Order #{order.id}</CardTitle>
                      <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </p>
                      <p className="font-semibold text-green-800">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, index) => (
                        <img
                          key={index}
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-10 h-10 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-xs font-semibold text-green-800">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Details */}
          <div className="lg:sticky lg:top-4">
            {selectedOrder ? (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Order Details #{selectedOrder.id}</CardTitle>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-green-800 mb-3">Items Ordered</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-green-800">{item.name}</p>
                            <p className="text-sm text-green-600">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                          <p className="font-semibold text-green-800">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Delivery Address
                    </h3>
                    <div className="bg-green-50 p-4 rounded-lg space-y-2">
                      <p className="font-medium">{selectedOrder.address.fullName}</p>
                      <p className="text-sm text-green-700">{selectedOrder.address.street}</p>
                      <p className="text-sm text-green-700">
                        {selectedOrder.address.city}, {selectedOrder.address.state} {selectedOrder.address.zipCode}
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {selectedOrder.address.phone}
                        </p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {selectedOrder.address.email}
                        </p>
                      </div>
                      {selectedOrder.address.notes && (
                        <p className="text-sm text-green-600 pt-2 border-t border-green-200">
                          <strong>Notes:</strong> {selectedOrder.address.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold text-green-800 mb-3">Order Summary</h3>
                    <div className="bg-green-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Order Date</span>
                        <span>{formatDate(selectedOrder.orderDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Delivery</span>
                        <span>{formatDate(selectedOrder.estimatedDelivery)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-green-200">
                        <span>Total Amount</span>
                        <span className="text-green-800">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-green-200">
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 text-green-300 mx-auto mb-4" />
                  <p className="text-green-600">Select an order to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
