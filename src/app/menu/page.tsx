"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MenuHeader } from "@/components/menu-header";
import { MenuFooter } from "@/components/menu-footer";
import { LanguageTooltip } from "@/components/language-tooltip";
import { Restaurant } from "@/lib/data/restaurants";
import { useLanguage } from "@/lib/context/language-context";
import { ChevronUp } from "lucide-react";

// Fetcher function for SWR with logging
const fetcher = async (url: string) => {
    console.log(
        `🔄 Fetching data from ${url} at ${new Date().toLocaleTimeString()}`
    );

    const res = await fetch(url);
    if (!res.ok) {
        console.error(`❌ Error fetching from ${url}: ${res.status}`);
        notFound();
        throw new Error(`Failed to fetch: ${res.status}`);
    }

    const data = await res.json();
    console.log(`✅ Successfully fetched data from ${url}`);
    return data;
};


// async function setPassword(password: string) {
//     const response = await fetch("/api/password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ password }),
//     });

//     const data = await response.json();
//     console.log(data.message);
// }

export default function RestaurantPage() {
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

    // Log component renders
    console.log(`🔄 Component rendering at ${new Date().toLocaleTimeString()}`);

    // Use SWR for data fetching with caching
    const {
        data: restaurant,
        error,
        isLoading,
    } = useSWR<Restaurant>("/api/restaurant", fetcher, {
        revalidateOnFocus: false, // Don't refetch when window regains focus
        revalidateOnReconnect: false, // Don't refetch when browser regains connection
        dedupingInterval: 3600000, // Cache for 1 hour (in milliseconds)
        onSuccess: () => {
            console.log(
                `✅ SWR cache hit or successful fetch at ${new Date().toLocaleTimeString()}`
            );
        },
        onError: (err) => {
            console.error(`❌ SWR error: ${err.message}`);
        },
    });

    // Log loading state changes
    useEffect(() => {
        console.log(
            `🔄 Loading state changed to: ${isLoading} at ${new Date().toLocaleTimeString()}`
        );
    }, [isLoading]);

    // Log when restaurant data becomes available
    useEffect(() => {
        if (restaurant) {
            console.log(
                `📊 Restaurant data available at ${new Date().toLocaleTimeString()}`
            );
        }
    }, [restaurant]);

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
        if (restaurant) {
            const mappedCategory =
                restaurant.categoryMapping[language][
                    activeCategory as keyof typeof restaurant.categoryMapping.en
                ];
            if (mappedCategory) {
                setActiveCategory(mappedCategory);
            }
        }
    }, [language, activeCategory, restaurant]);

    // Scroll to top when category changes
    useEffect(() => {
        // Scroll to top with smooth animation
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [activeCategory]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>{language === "tr" ? "Yükleniyor..." : "Loading..."}</p>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Failed to load restaurant data
            </div>
        );
    }

    // Get the appropriate menu data and categories based on language
    const currentMenuData =
        language === "tr" ? restaurant.menuData.tr : restaurant.menuData.en;
    const categories = restaurant.categories[language];

    // Get the current category data
    const currentCategory =
        currentMenuData[activeCategory as keyof typeof currentMenuData];

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

                {/* Rest of your component... */}
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
                                {/* Card content... */}
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

                {/* Mobile Navigation Tabs */}
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
