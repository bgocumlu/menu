"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/context/language-context"

export function LanguageTooltip() {
  const { language } = useLanguage()
  const [showTooltip, setShowTooltip] = useState(true)

  // Hide tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!showTooltip) return null

  return (
    <div className="fixed top-14 right-4 z-30 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg text-xs max-w-[200px] animate-fade-in">
      <div className="absolute -top-2 right-8 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
      {language === "tr" ? "Dil değiştirmek için buraya tıklayın" : "Tap here to change language"}
    </div>
  )
}

