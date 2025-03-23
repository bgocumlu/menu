"use client"

import { useLanguage } from "@/lib/context/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "tr" ? "en" : "tr")}
      className="h-9 rounded-full border-accent bg-muted hover:bg-muted/80 flex items-center gap-1.5 px-2 md:px-3 md:text-sm"
      aria-label={language === "tr" ? "Switch to English" : "Türkçe'ye geç"}
    >
      <Globe className="h-3.5 w-3.5 md:h-4 md:w-4 text-foreground/70" />
      <span className="text-xs font-semibold md:text-sm">{language === "tr" ? "EN" : "TR"}</span>
    </Button>
  )
}

