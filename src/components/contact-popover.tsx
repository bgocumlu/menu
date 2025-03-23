"use client"

import { Phone, Clock, MapPin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Restaurant } from "@/lib/data/restaurants"
import { useLanguage } from "@/lib/context/language-context"

interface ContactPopoverProps {
  restaurant: Restaurant
}

export function ContactPopover({ restaurant }: ContactPopoverProps) {
  const { language } = useLanguage()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 md:h-10 md:w-10 rounded-full border-accent bg-muted hover:bg-muted/80"
          aria-label="Contact Information"
        >
          <Phone className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white dark:bg-black" align="end">
        <div className="grid gap-4 p-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-primary">
              {language === "tr" ? "İletişim Bilgileri" : "Contact Information"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {language === "tr" ? "Bize ulaşın" : "Get in touch with us"}
            </p>
          </div>

          <div className="grid gap-3">
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="font-medium">{restaurant.contact.phone}</div>
                <a
                  href={`tel:${restaurant.contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-xs text-primary hover:underline"
                >
                  {language === "tr" ? "Şimdi Ara" : "Call Now"}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="font-medium">{restaurant.contact.email}</div>
                <a href={`mailto:${restaurant.contact.email}`} className="text-xs text-primary hover:underline">
                  {language === "tr" ? "E-posta Gönder" : "Send Email"}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="font-medium">{restaurant.contact.address}</div>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  {language === "tr" ? "Haritada Görüntüle" : "View on Map"}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                  <div className="font-medium">{language === "tr" ? "Pzt - Cuma" : "Mon - Fri"}:</div>
                  <div>11:00 - 22:00</div>
                  <div className="font-medium">{language === "tr" ? "Cumartesi" : "Saturday"}:</div>
                  <div>10:00 - 23:00</div>
                  <div className="font-medium">{language === "tr" ? "Pazar" : "Sunday"}:</div>
                  <div>10:00 - 21:00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

