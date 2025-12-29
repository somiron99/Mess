"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    redirect("/login")
  }

  // Mock data - replace with real calculations later
  const currentMealRate = 45.50
  const personalBalance = -1250.00

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your mess finances and meals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Current Meal Rate</CardTitle>
              <CardDescription>Per meal cost this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{currentMealRate.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Balance</CardTitle>
              <CardDescription>Amount you owe or are owed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${personalBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ৳{personalBalance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mess Members</CardTitle>
              <CardDescription>Active members in your mess</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/dashboard/meals">Log Today's Meals</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/expenses">Add Expense</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/members">Manage Members</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>• Grocery expense added: ৳2500</div>
                <div>• 3 meals logged for today</div>
                <div>• New member joined the mess</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}