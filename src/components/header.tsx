"use client"

import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
              <span className="font-bold">MessMate</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <Link href="/browse" onClick={() => setOpen(false)}>Browse Ads</Link>
                {session && <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>}
                {session ? (
                  <Button variant="ghost" onClick={() => { signOut(); setOpen(false); }}>
                    Logout
                  </Button>
                ) : (
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/login">Login / Sign Up</Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              MessMate
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/browse">Browse Ads</Link>
            {session && <Link href="/dashboard">Dashboard</Link>}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search can go here later */}
          </div>
          <nav className="flex items-center space-x-2">
            {session ? (
              <>
                <span className="hidden text-sm md:inline">Welcome, {session.user?.name}</span>
                <Button variant="ghost" onClick={() => signOut()}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="hidden md:flex">
                <Button asChild>
                  <Link href="/login">Login / Sign Up</Link>
                </Button>
              </div>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}