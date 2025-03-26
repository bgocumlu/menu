"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MenuHeader } from "@/components/menu-header"
import { MenuFooter } from "@/components/menu-footer"
import { LanguageTooltip } from "@/components/language-tooltip"
import { getRestaurantData } from "@/lib/data/restaurants"
import { useLanguage } from "@/lib/context/language-context"
import { ChevronUp } from "lucide-react";

import { use } from "react";

type Params = Promise<{ restaurantId: string }>;

export default function RestaurantPage(props: { params: Params }) {
    const params = use(props.params);
    const { restaurantId } = params;
    const restaurant = getRestaurantData(restaurantId);

    // If restaurant doesn't exist, show 404
    if (!restaurant) {
        notFound();
    }

    const { language } = useLanguage();
    const [activeCategory, setActiveCategory] = useState("starters");
    const [firstVisit, setFirstVisit] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Handle scroll event to show/hide scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Function to scroll to top
    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, []);

    // Get the appropriate menu data and categories based on language
    const currentMenuData =
        language === "tr" ? restaurant.menuData.tr : restaurant.menuData.en;
    const categories = restaurant.categories[language];

    // Get the current category data
    const currentCategory =
        currentMenuData[activeCategory as keyof typeof currentMenuData];

    // Check if this is the first visit
    useEffect(() => {
        const visited = localStorage.getItem("visited");
        if (visited) {
            setFirstVisit(false);
        } else {
            localStorage.setItem("visited", "true");
        }
    }, []);

    // Update active category when language changes to maintain the same category
    useEffect(() => {
        const mappedCategory =
            restaurant.categoryMapping[language][
                activeCategory as keyof typeof restaurant.categoryMapping.en
            ];
        if (mappedCategory) {
            setActiveCategory(mappedCategory);
        }
    }, [language, activeCategory, restaurant.categoryMapping, restaurant]);

    useEffect(() => {
        // Scroll to top with smooth animation
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [activeCategory]);

    return (
        <div className="flex min-h-screen flex-col">
            <MenuHeader restaurant={restaurant} />
            {firstVisit ?? <LanguageTooltip />}

            <main className="flex-1 pb-16 md:pb-0">
                {/* Desktop Category Navigation - Only visible on md and up */}
                <div className="hidden md:block border-b border-accent bg-background">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="flex justify-center">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() =>
                                        setActiveCategory(category.id)
                                    }
                                    className={`px-6 py-3 font-medium text-sm transition-colors ${
                                        activeCategory === category.id
                                            ? "text-primary border-b-2 border-primary"
                                            : "text-foreground/70 hover:text-foreground"
                                    }`}
                                    aria-label={`View ${category.name}`}
                                    data-selected={
                                        activeCategory === category.id
                                    }
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category Title */}
                <div className="px-4 pt-4 pb-2 text-center">
                    <h2 className="text-2xl font-bold text-primary">
                        {currentCategory.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground max-w-2xl mx-auto">
                        {currentCategory.description}
                    </p>
                </div>

                {/* Food Items */}
                <div className="px-4 py-2 md:py-6">
                    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
                        {currentCategory.items.map((item, index) => (
                            <Card
                                key={index}
                                className="overflow-hidden border-accent menu-card-shadow md:hover:shadow-md md:transition-shadow"
                            >
                                <div className="relative -mt-10">
                                    <div className="relative h-60 w-full overflow-hidden">
                                        <Image
                                            src={
                                                item.image || "/placeholder.svg"
                                            }
                                            alt={item.name}
                                            fill
                                            className="object-cover md:hover:scale-105 md:transition-transform md:duration-300"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            priority={index < 2}
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-lg font-bold text-white drop-shadow-md">
                                                {item.name}
                                            </h3>
                                            <div className="price-tag">
                                                {item.price}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <CardContent className="p-3 md:p-4">
                                    <p className="text-sm text-foreground">
                                        {item.description}
                                    </p>

                                    {item.tags && item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {item.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className="bg-muted text-muted-foreground border-accent text-xs py-0"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Mobile Navigation Tabs - Only visible on small screens */}
                <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t border-accent shadow-md md:hidden">
                    <div className="grid grid-cols-4 gap-px bg-accent">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`category-button ${
                                    activeCategory === category.id
                                        ? "active"
                                        : ""
                                }`}
                                aria-label={`View ${category.name}`}
                                data-selected={activeCategory === category.id}
                            >
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scroll to top button */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-20 right-4 z-10 p-2 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-opacity"
                        aria-label={
                            language === "tr" ? "Yukarı çık" : "Scroll to top"
                        }
                    >
                        <ChevronUp className="h-5 w-5" />
                    </button>
                )}
            </main>

            <MenuFooter restaurant={restaurant} />
        </div>
    );
}

