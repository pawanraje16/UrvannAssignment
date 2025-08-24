"use client"

import { useState, useMemo } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useAuth, AuthGuard } from "../../components/auth/AuthGuard"
import { Search, Grid, List, Leaf, LogOut, Settings } from "lucide-react"

const mockPlants = [
  {
    id: 1,
    name: "Money Plant",
    price: 25.99,
    categories: ["Indoor", "Home Decor", "Low Light"],
    stock: true,
    image: "/money-plant-in-pot.png",
    description: "Perfect for beginners, brings good luck and prosperity",
  },
  {
    id: 2,
    name: "Snake Plant",
    price: 35.5,
    categories: ["Indoor", "Air Purifying", "Low Maintenance"],
    stock: true,
    image: "/snake-plant-in-modern-pot.png",
    description: "Excellent air purifier, thrives in low light conditions",
  },
  {
    id: 3,
    name: "Fiddle Leaf Fig",
    price: 89.99,
    categories: ["Indoor", "Statement Plant", "Bright Light"],
    stock: false,
    image: "/fiddle-leaf-fig-tree.png",
    description: "Large statement plant perfect for living rooms",
  },
  {
    id: 4,
    name: "Succulent Mix",
    price: 18.75,
    categories: ["Succulent", "Outdoor", "Drought Tolerant"],
    stock: true,
    image: "/colorful-succulent-arrangement.png",
    description: "Beautiful arrangement of colorful succulents",
  },
  {
    id: 5,
    name: "Peace Lily",
    price: 42.0,
    categories: ["Indoor", "Air Purifying", "Flowering"],
    stock: true,
    image: "/peace-lily-with-white-flowers.png",
    description: "Elegant flowering plant that purifies air",
  },
  {
    id: 6,
    name: "Rubber Tree",
    price: 55.25,
    categories: ["Indoor", "Statement Plant", "Glossy Foliage"],
    stock: true,
    image: "/rubber-tree-with-glossy-leaves.png",
    description: "Beautiful glossy leaves, perfect for modern homes",
  },
]

function PlantsContent() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [isLoading, setIsLoading] = useState(false)
  const [plants, setPlants] = useState(mockPlants)

  const allCategories = useMemo(() => {
    const categories = new Set()
    plants.forEach((plant) => {
      plant.categories.forEach((category) => categories.add(category))
    })
    return Array.from(categories).sort()
  }, [plants])

  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesSearch =
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || plant.categories.includes(selectedCategory)
      return matchesSearch && matchesCategory
    })
  }, [plants, searchTerm, selectedCategory])

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">PlantShop</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name} ({user?.userType})
              </span>
              {user?.userType === "admin" && (
                <Button variant="outline" size="sm" asChild>
                  <a href="/admin">
                    <Settings className="h-4 w-4 mr-2" />
                    Admin Panel
                  </a>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Our Plants</h2>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search plants by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading plants...</p>
          </div>
        )}

        {/* Plants Grid/List */}
        {!isLoading && (
          <>
            {filteredPlants.length === 0 ? (
              <div className="text-center py-12">
                <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No plants found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredPlants.map((plant) => (
                  <Card key={plant.id} className={viewMode === "list" ? "flex flex-row" : ""}>
                    <div className={viewMode === "list" ? "w-48 flex-shrink-0" : ""}>
                      <img
                        src={plant.image || "/placeholder.svg"}
                        alt={plant.name}
                        className={`w-full object-cover ${
                          viewMode === "list" ? "h-full rounded-l-lg" : "h-48 rounded-t-lg"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{plant.name}</CardTitle>
                          <span className="text-xl font-bold text-green-600">${plant.price}</span>
                        </div>
                        <CardDescription>{plant.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {plant.categories.map((category) => (
                              <Badge key={category} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className={`text-sm font-medium ${plant.stock ? "text-green-600" : "text-red-600"}`}>
                              {plant.stock ? "In Stock" : "Out of Stock"}
                            </span>
                            <Button size="sm" disabled={!plant.stock} className="bg-green-600 hover:bg-green-700">
                              {plant.stock ? "Add to Cart" : "Notify Me"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default function PlantsPage() {
  return (
    <AuthGuard>
      <PlantsContent />
    </AuthGuard>
  )
}
