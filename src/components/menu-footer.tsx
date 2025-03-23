"use client"

import { useLanguage } from "@/lib/context/language-context"
import type { Restaurant } from "@/lib/data/restaurants"

interface MenuFooterProps {
  restaurant: Restaurant
}

export function MenuFooter({ restaurant }: MenuFooterProps) {
  const { language } = useLanguage()

  return (
    <footer className="border-t border-accent py-2 md:py-3 bg-background text-center text-xs text-muted-foreground">
      <div className="px-4 md:max-w-4xl md:mx-auto">
        {language === "tr"
          ? `© ${new Date().getFullYear()} ${restaurant.name} • Tüm hakları saklıdır`
          : `© ${new Date().getFullYear()} ${restaurant.name} • All rights reserved`}
      </div>
    </footer>
  )
}

