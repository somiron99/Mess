"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Plus, BarChart3, Settings } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect("/login")
  }

  // Mock data - replace with real calculations later
  const currentMealRate = 45.50
  const personalBalance = -1250.00
  const totalMembers = 5
  const monthlyExpenses = 25000
  const mealsLogged = 42

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">Welcome back, {session.user?.name}!</h1>
              <p className="text-muted-foreground text-lg mt-2">Here's what's happening with your mess today</p>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Manager
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Meal Rate</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{currentMealRate.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +2.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${personalBalance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ৳{Math.abs(personalBalance).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                {personalBalance < 0 ? (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                    You owe
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    You're owed
                  </>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mess Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active members
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meals This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mealsLogged}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Logged this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks to manage your mess efficiently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button asChild className="h-20 flex-col gap-2">
                  <Link href="/dashboard/meals">
                    <Calendar className="h-6 w-6" />
                    Log Today's Meals
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2">
                  <Link href="/dashboard/expenses">
                    <DollarSign className="h-6 w-6" />
                    Add Expense
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2">
                  <Link href="/dashboard/members">
                    <Users className="h-6 w-6" />
                    Manage Members
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col gap-2">
                  <Link href="/post-ad">
                    <Plus className="h-6 w-6" />
                    Post an Ad
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/dashboard/profile">Edit Profile</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/dashboard/preferences">Preferences</Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/dashboard/notifications">Notifications</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your mess</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Grocery expense added</p>
                  <p className="text-xs text-muted-foreground">৳2,500 • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">3 meals logged for today</p>
                  <p className="text-xs text-muted-foreground">By John Doe • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New member joined the mess</p>
                  <p className="text-xs text-muted-foreground">Sarah Wilson • 1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}