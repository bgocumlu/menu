"use client"

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { ContactPopover } from "@/components/contact-popover"
import type { Restaurant } from "@/lib/data/restaurants"

interface MenuHeaderProps {
  restaurant: Restaurant
}

export function MenuHeader({ restaurant }: MenuHeaderProps) {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b border-accent bg-background shadow-xs">
      <div className="container px-4 py-3 md:max-w-4xl md:py-4">
        <div className="flex items-center justify-between">
          {/* Left section with logo */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 md:w-7 md:h-7 bg-primary rounded-full flex items-center justify-center">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-background rounded-full flex items-center justify-center">
                <div className="w-2 h-2 md:w-3 md:h-3 bg-secondary rounded-full" />
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">{restaurant.name}</h1>
          </div>

          {/* Middle section (empty for balance) */}
          <div className="flex-1">{/* Empty space */}</div>

          {/* Right section with controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <ContactPopover restaurant={restaurant} />
          </div>
        </div>
      </div>
    </header>
  )
}

