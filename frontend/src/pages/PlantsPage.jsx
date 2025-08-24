"use client"

import { useState, useMemo } from "react"
import { useCart } from "../contexts/CartContext.jsx"
import { Search, Grid, List } from "lucide-react"

const mockPlants = [
  {
    id: 1,
    name: "Money Plant",
    price: 299,
    categories: ["Indoor", "Low Light", "Air Purifying"],
    stock: true,
    image: "/money-plant-in-pot.png",
    description: "Perfect for beginners, brings good luck and prosperity",
  },
  {
    id: 2,
    name: "Snake Plant",
    price: 499,
    categories: ["Indoor", "Low Light", "Air Purifying"],
    stock: true,
    image: "/snake-plant-in-modern-pot.png",
    description: "Extremely hardy, perfect for low-light conditions",
  },
  {
    id: 3,
    name: "Fiddle Leaf Fig",
    price: 899,
    categories: ["Indoor", "Bright Light"],
    stock: false,
    image: "/fiddle-leaf-fig-tree.png",
    description: "Statement plant with large, glossy leaves",
  },
  {
    id: 4,
    name: "Succulent Mix",
    price: 199,
    categories: ["Succulent", "Indoor", "Low Maintenance"],
    stock: true,
    image: "/colorful-succulent-arrangement.png",
    description: "Beautiful arrangement of colorful succulents",
  },
  {
    id: 5,
    name: "Peace Lily",
    price: 399,
    categories: ["Indoor", "Air Purifying", "Flowering"],
    stock: true,
    image: "/peace-lily-with-white-flowers.png",
    description: "Elegant flowering plant that purifies air",
  },
  {
    id: 6,
    name: "Rubber Tree",
    price: 699,
    categories: ["Indoor", "Bright Light"],
    stock: true,
    image: "/rubber-tree-with-glossy-leaves.png",
    description: "Large glossy leaves, perfect statement plant",
  },
]

const categories = [
  "All",
  "Indoor",
  "Outdoor",
  "Succulent",
  "Air Purifying",
  "Low Light",
  "Bright Light",
  "Flowering",
  "Low Maintenance",
]

export default function PlantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [viewMode, setViewMode] = useState("grid")
  const [loading, setLoading] = useState(false)
  const { addToCart } = useCart()

  const filteredPlants = useMemo(() => {
    return mockPlants.filter((plant) => {
      const matchesSearch =
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = selectedCategory === "All" || plant.categories.includes(selectedCategory)
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const handleAddToCart = (plant) => {
    addToCart(plant)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plant Collection</h1>
        <p className="text-gray-600">Discover our beautiful selection of plants for your home and garden</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search plants by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-green-500 text-white" : "bg-white text-gray-600"}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-green-500 text-white" : "bg-white text-gray-600"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plants Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <img
                src={plant.image || "/placeholder.svg"}
                alt={plant.name}
                className={`object-cover ${viewMode === "list" ? "w-32 h-32" : "w-full h-48"}`}
              />
              <div className="p-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{plant.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{plant.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {plant.categories.map((category) => (
                    <span key={category} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {category}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-600">₹{plant.price}</span>
                    <div className={`text-sm ${plant.stock ? "text-green-600" : "text-red-600"}`}>
                      {plant.stock ? "In Stock" : "Out of Stock"}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(plant)}
                    disabled={!plant.stock}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      plant.stock
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {plant.stock ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPlants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No plants found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
