"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext.jsx"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"

const mockOrders = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 1298,
    items: [
      { name: "Money Plant", quantity: 2, price: 299 },
      { name: "Snake Plant", quantity: 1, price: 499 },
      { name: "Succulent Mix", quantity: 1, price: 199 },
    ],
    address: {
      street: "123 Garden Street",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
    },
  },
  {
    id: "ORD-002",
    date: "2024-01-20",
    status: "shipped",
    total: 899,
    items: [{ name: "Fiddle Leaf Fig", quantity: 1, price: 899 }],
    address: {
      street: "456 Plant Avenue",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
    },
  },
  {
    id: "ORD-003",
    date: "2024-01-22",
    status: "processing",
    total: 1098,
    items: [
      { name: "Peace Lily", quantity: 1, price: 399 },
      { name: "Rubber Tree", quantity: 1, price: 699 },
    ],
    address: {
      street: "789 Green Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
    },
  },
]

const statusConfig = {
  processing: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100", label: "Processing" },
  shipped: { icon: Truck, color: "text-blue-600", bg: "bg-blue-100", label: "Shipped" },
  delivered: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", label: "Delivered" },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {mockOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
          <a
            href="/plants"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Plants
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {mockOrders.map((order) => {
            const StatusIcon = statusConfig[order.status].icon

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order {order.id}</h3>
                    <p className="text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusConfig[order.status].bg}`}
                    >
                      <StatusIcon className={`w-4 h-4 ${statusConfig[order.status].color}`} />
                      <span className={`text-sm font-medium ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].label}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{order.total}</p>
                      <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                      <div className="text-sm text-gray-600">
                        <p>{order.address.street}</p>
                        <p>
                          {order.address.city}, {order.address.state}
                        </p>
                        <p>{order.address.pincode}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      {selectedOrder === order.id ? "Hide Details" : "View Details"}
                    </button>
                  </div>

                  {selectedOrder === order.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">Order Timeline</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Order placed on {new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        {order.status !== "processing" && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Order confirmed and processing</span>
                          </div>
                        )}
                        {order.status === "delivered" && (
                          <>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Order shipped</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Order delivered</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
