"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              AnswerPath
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/documents"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/documents"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Documents
            </Link>
            <Link
              href="/responses"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/responses"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Responses
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </div>
  )
}
