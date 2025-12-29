import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Find Your Perfect Mess in Dhaka
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Discover roommates, rent rooms, and manage your mess finances effortlessly.
              The ultimate platform for bachelor living.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/browse">Browse Ads</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/post-ad">Post an Ad</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Ads Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-8">
            Featured Listings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder cards */}
            <Card>
              <CardHeader>
                <CardTitle>Room in Mirpur</CardTitle>
                <CardDescription>Spacious room for 2, 8000 BDT/month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Looking for non-smoking students. Near metro station.
                </p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link href="/ad/1">View Details</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Roommate Wanted</CardTitle>
                <CardDescription>Student seeking mess in Dhanmondi</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clean, respectful, budget up to 5000 BDT.
                </p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link href="/ad/2">View Details</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Seat Available</CardTitle>
                <CardDescription>Single seat in Uttara mess</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All amenities included. 4000 BDT/month.
                </p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link href="/ad/3">View Details</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
