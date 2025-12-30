"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Search, MapPin, DollarSign, Users, Cigarette, Briefcase } from "lucide-react"

type Ad = {
  id: string
  type: string
  title: string
  description: string | null
  location: string
  area: string
  budget: number
  gender: string | null
  smoker: boolean | null
  jobType: string | null
  user: {
    name: string | null
    phone: string | null
  }
}

export default function BrowsePage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    area: "",
    type: "",
    minBudget: "",
    maxBudget: "",
    gender: "",
    smoker: "",
    jobType: ""
  })
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const adsPerPage = 9

  const fetchAds = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (filters.area) params.append("area", filters.area)
      if (filters.type) params.append("type", filters.type)
      if (filters.minBudget) params.append("minBudget", filters.minBudget)
      if (filters.maxBudget) params.append("maxBudget", filters.maxBudget)
      if (filters.gender) params.append("gender", filters.gender)
      if (filters.smoker) params.append("smoker", filters.smoker)
      if (filters.jobType) params.append("jobType", filters.jobType)
      if (sortBy) params.append("sortBy", sortBy)

      const response = await fetch(`/api/ads?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAds(data)
        setCurrentPage(1) // Reset to first page on new search
      }
    } catch (error) {
      console.error("Error fetching ads:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [filters, sortBy])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    fetchAds()
  }

  const clearFilters = () => {
    setFilters({
      area: "",
      type: "",
      minBudget: "",
      maxBudget: "",
      gender: "",
      smoker: "",
      jobType: ""
    })
    setSearchQuery("")
  }

  // Pagination
  const totalPages = Math.ceil(ads.length / adsPerPage)
  const startIndex = (currentPage - 1) * adsPerPage
  const paginatedAds = ads.slice(startIndex, startIndex + adsPerPage)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Find Your Perfect Space</h1>
          <p className="text-muted-foreground text-lg">Discover rooms, seats, and roommates in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 shadow-sm border">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by title, description, or location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="lg:w-auto">
              Search
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select onValueChange={(value) => handleFilterChange("area", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Areas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Areas</SelectItem>
                <SelectItem value="Mirpur">Mirpur</SelectItem>
                <SelectItem value="Dhanmondi">Dhanmondi</SelectItem>
                <SelectItem value="Uttara">Uttara</SelectItem>
                <SelectItem value="Banani">Banani</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="ROOM">Room</SelectItem>
                <SelectItem value="SEAT">Seat</SelectItem>
                <SelectItem value="ROOMMATE">Roommate</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                placeholder="Min Budget"
                type="number"
                value={filters.minBudget}
                onChange={(e) => handleFilterChange("minBudget", e.target.value)}
              />
              <Input
                placeholder="Max Budget"
                type="number"
                value={filters.maxBudget}
                onChange={(e) => handleFilterChange("maxBudget", e.target.value)}
              />
            </div>

            <Select onValueChange={(value) => handleFilterChange("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Gender</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="ANY">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 items-start sm:items-center justify-between">
            <div className="flex gap-4">
              <Select onValueChange={(value) => handleFilterChange("smoker", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Smoker" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="false">Non-smoker</SelectItem>
                  <SelectItem value="true">Smoker</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => handleFilterChange("jobType", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="JOB_HOLDER">Job Holder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-muted-foreground">
                {ads.length} {ads.length === 1 ? 'result' : 'results'} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedAds.map((ad) => (
                <Card key={ad.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {ad.type.toLowerCase()}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          ৳{ad.budget.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">per month</div>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{ad.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {ad.location}, {ad.area}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {ad.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ad.gender && (
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {ad.gender.toLowerCase()}
                        </Badge>
                      )}
                      {ad.smoker !== null && (
                        <Badge variant="outline" className="text-xs">
                          <Cigarette className="h-3 w-3 mr-1" />
                          {ad.smoker ? 'Smoker' : 'Non-smoker'}
                        </Badge>
                      )}
                      {ad.jobType && (
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {ad.jobType.replace('_', ' ').toLowerCase()}
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        by {ad.user.name || 'Anonymous'}
                      </span>
                      <Button asChild size="sm">
                        <Link href={`/ad/${ad.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10 p-0"
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}