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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Mobile menu button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <Link href="/" className="flex items-center mb-6" onClick={() => setOpen(false)}>
                <span className="font-bold text-lg">MessMate</span>
              </Link>
              <div className="flex flex-col space-y-4">
                <Link href="/browse" onClick={() => setOpen(false)} className="text-sm font-medium">
                  Browse Ads
                </Link>
                {session && (
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium">
                    Dashboard
                  </Link>
                )}
                {session ? (
                  <Button variant="ghost" onClick={() => { signOut(); setOpen(false); }} className="justify-start">
                    Logout
                  </Button>
                ) : (
                  <Button asChild onClick={() => setOpen(false)}>
                    <Link href="/login">Login / Sign Up</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-bold text-lg">MessMate</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/browse" className="text-sm font-medium hover:text-primary transition-colors">
              Browse Ads
            </Link>
            {session && (
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {session ? (
              <>
                <span className="hidden lg:inline text-sm text-muted-foreground">
                  Welcome, {session.user?.name}
                </span>
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild size="sm" className="hidden md:inline-flex">
                <Link href="/login">Login / Sign Up</Link>
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}