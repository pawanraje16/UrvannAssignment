"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Checkbox } from "../../components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useAuth, AuthGuard } from "../../components/auth/AuthGuard"
import { Leaf, Plus, Package, TrendingUp, Users, ArrowLeft, Edit, Trash2, Eye, ShoppingCart } from "lucide-react"

const availableCategories = [
  "Indoor",
  "Outdoor",
  "Succulent",
  "Air Purifying",
  "Low Light",
  "Bright Light",
  "Low Maintenance",
  "Statement Plant",
  "Flowering",
  "Home Decor",
  "Drought Tolerant",
  "Glossy Foliage",
]

const mockPlants = [
  {
    id: 1,
    name: "Money Plant",
    price: 15.99,
    categories: ["Indoor", "Air Purifying", "Low Light"],
    stock: true,
    orders: 12,
  },
  {
    id: 2,
    name: "Snake Plant",
    price: 24.99,
    categories: ["Indoor", "Low Maintenance", "Air Purifying"],
    stock: true,
    orders: 8,
  },
  {
    id: 3,
    name: "Fiddle Leaf Fig",
    price: 45.99,
    categories: ["Indoor", "Statement Plant", "Bright Light"],
    stock: false,
    orders: 5,
  },
  {
    id: 4,
    name: "Succulent Mix",
    price: 12.99,
    categories: ["Succulent", "Low Maintenance", "Indoor"],
    stock: true,
    orders: 15,
  },
]

const mockOrders = [
  {
    id: 1,
    customerName: "John Doe",
    email: "john@example.com",
    plant: "Money Plant",
    quantity: 2,
    total: 31.98,
    status: "Pending",
    date: "2024-01-15",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    email: "jane@example.com",
    plant: "Snake Plant",
    quantity: 1,
    total: 24.99,
    status: "Shipped",
    date: "2024-01-14",
  },
  {
    id: 3,
    customerName: "Bob Wilson",
    email: "bob@example.com",
    plant: "Succulent Mix",
    quantity: 3,
    total: 38.97,
    status: "Delivered",
    date: "2024-01-13",
  },
]

function AdminContent() {
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [plants, setPlants] = useState(mockPlants)
  const [orders, setOrders] = useState(mockOrders)

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    }
  }

  const handleAddPlant = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const formData = new FormData(e.target)
    const plantData = {
      id: plants.length + 1,
      name: formData.get("name"),
      price: Number.parseFloat(formData.get("price")),
      description: formData.get("description"),
      categories: selectedCategories,
      stock: formData.get("stock") === "on",
      orders: 0,
    }

    if (!plantData.name || !plantData.price || selectedCategories.length === 0) {
      setError("Please fill in all required fields and select at least one category")
      setIsLoading(false)
      return
    }

    if (plantData.price <= 0) {
      setError("Price must be greater than 0")
      setIsLoading(false)
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPlants((prev) => [...prev, plantData])
      setSuccess(`Plant "${plantData.name}" added successfully!`)
      e.target.reset()
      setSelectedCategories([])
    } catch (err) {
      setError("Failed to add plant. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePlantStock = (plantId) => {
    setPlants((prev) => prev.map((plant) => (plant.id === plantId ? { ...plant, stock: !plant.stock } : plant)))
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/plants">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Plants
                </a>
              </Button>
              <span className="text-sm text-gray-600">{user?.name} (Admin)</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Plants</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plants.length}</div>
              <p className="text-xs text-muted-foreground">+{plants.length - mockPlants.length} added today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plants.filter((p) => p.stock).length}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((plants.filter((p) => p.stock).length / plants.length) * 100)}% availability
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">
                {orders.filter((o) => o.status === "Pending").length} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableCategories.length}</div>
              <p className="text-xs text-muted-foreground">Active categories</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="add-plant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="add-plant">Add Plant</TabsTrigger>
            <TabsTrigger value="manage-plants">Manage Plants</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Add Plant Tab */}
          <TabsContent value="add-plant">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Plant
                </CardTitle>
                <CardDescription>Add a new plant to your inventory with detailed information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPlant} className="space-y-6">
                  {/* ... existing form code ... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Plant Name *</Label>
                      <Input id="name" name="name" placeholder="e.g., Monstera Deliciosa" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 29.99"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe the plant, its care requirements, and benefits..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Categories * (Select at least one)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {availableCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                          />
                          <Label htmlFor={category} className="text-sm font-normal">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {selectedCategories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedCategories.map((category) => (
                          <Badge key={category} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="stock" name="stock" defaultChecked />
                    <Label htmlFor="stock">Available in stock</Label>
                  </div>

                  {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}
                  {success && <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">{success}</div>}

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                    {isLoading ? "Adding Plant..." : "Add Plant"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage-plants">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Manage Plants
                </CardTitle>
                <CardDescription>View and manage your plant inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plants.map((plant) => (
                    <div key={plant.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{plant.name}</h3>
                        <p className="text-sm text-gray-600">${plant.price}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {plant.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{plant.orders} orders</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={plant.stock ? "default" : "destructive"}>
                          {plant.stock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => togglePlantStock(plant.id)}>
                          {plant.stock ? "Mark Out" : "Mark In"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Management
                </CardTitle>
                <CardDescription>View and manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {order.customerName} - {order.email}
                        </p>
                        <p className="text-sm">
                          {order.plant} x{order.quantity}
                        </p>
                        <p className="text-sm font-medium">${order.total}</p>
                        <p className="text-xs text-gray-500">{order.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "Shipped"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin={true}>
      <AdminContent />
    </AuthGuard>
  )
}
