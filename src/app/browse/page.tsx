"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

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
  const [filters, setFilters] = useState({
    area: "",
    type: "",
    minBudget: "",
    maxBudget: "",
    gender: ""
  })

  const fetchAds = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.area) params.append("area", filters.area)
      if (filters.type) params.append("type", filters.type)
      if (filters.minBudget) params.append("minBudget", filters.minBudget)
      if (filters.maxBudget) params.append("maxBudget", filters.maxBudget)
      if (filters.gender) params.append("gender", filters.gender)

      const response = await fetch(`/api/ads?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAds(data)
      }
    } catch (error) {
      console.error("Error fetching ads:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAds()
  }, [filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Browse Ads</h1>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search location..."
              className="md:w-1/3"
              onChange={(e) => handleFilterChange("area", e.target.value)}
            />
            <Select onValueChange={(value) => handleFilterChange("area", value)}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mirpur">Mirpur</SelectItem>
                <SelectItem value="Dhanmondi">Dhanmondi</SelectItem>
                <SelectItem value="Uttara">Uttara</SelectItem>
                <SelectItem value="Banani">Banani</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange("type", value)}>
              <SelectTrigger className="md:w-1/4">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ROOM">Room</SelectItem>
                <SelectItem value="SEAT">Seat</SelectItem>
                <SelectItem value="ROOMMATE">Roommate</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAds}>Search</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <Card key={ad.id}>
                <CardHeader>
                  <CardTitle>{ad.title}</CardTitle>
                  <CardDescription>
                    {ad.area} • {ad.budget} BDT/month • {ad.type.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {ad.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {ad.gender} • {ad.smoker === false ? "Non-smoker" : ad.smoker === true ? "Smoker" : ""} • {ad.jobType?.toLowerCase()}
                    </span>
                    <Button variant="outline" asChild>
                      <Link href={`/ad/${ad.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}