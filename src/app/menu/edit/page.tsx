"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Save,
  Trash2,
  Plus,
  ArrowLeft,
  Edit,
  RefreshCw,
  Settings,
  Phone,
  Palette,
  Moon,
  Sun,
  Lock,
  MoveUp,
  MoveDown,
  GripVertical,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTheme } from "@/lib/context/theme-context"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

import { type MenuItem, type MenuData, type Restaurant } from "@/lib/data/restaurants"
import { useLanguage } from "@/lib/context/language-context"
import { useRestaurant } from "@/lib/hooks/useRestaurant";

import { anatoliaRestaurant } from "@/lib/data/restaurants"

async function verifyPassword(password: string) {
    const response = await fetch("/api/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
    });

    const data = await response.json();
    return data.message === "Password is correct";
}


export const loadDefaultAnatoliaRestaurant = async () => {
    const response = await fetch("/api/restaurant", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(anatoliaRestaurant), // Send the updated data
    });

    if (response.ok) {
        alert("Restaurant data updated successfully");
    } else {
        alert("Failed to update restaurant data");
    }
};

export default function EditMenuPage() {
    const router = useRouter();
    const { toast } = useToast();

    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);

    // Working copy state - now includes the full Restaurant interface
    const [workingCopy, setWorkingCopy] = useState<Restaurant | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("menu"); // "menu", "settings", "theme", "contact"
    const [loading, setLoading] = useState(false);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryId, setNewCategoryId] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");

    const { restaurant: originalRestaurant } = useRestaurant();

    const handleSubmit = async () => {
        const response = await fetch("/api/restaurant", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(workingCopy), // Send the updated data
        });

        if (response.ok) {
            alert("Restaurant data updated successfully");
        } else {
            alert("Failed to update restaurant data");
        }
    };

    // Helper functions for visual feedback during reordering
    const handleCategoryReorder = (
        categoryId: string,
        direction: "up" | "down"
    ) => {
        // Add visual feedback
        const element = document.getElementById(`category-${categoryId}`);
        if (element) {
            element.classList.add("reordering");
            setTimeout(() => {
                element.classList.remove("reordering");
            }, 300);
        }

        // Perform the reordering
        if (direction === "up") {
            moveCategoryUp(categoryId);
        } else {
            moveCategoryDown(categoryId);
        }
    };

    const handleItemReorder = (
        categoryId: string,
        itemIndex: number,
        direction: "up" | "down"
    ) => {
        // Add visual feedback
        const element = document.getElementById(
            `item-${categoryId}-${itemIndex}`
        );
        if (element) {
            element.classList.add("reordering");
            setTimeout(() => {
                element.classList.remove("reordering");
            }, 300);
        }

        // Perform the reordering
        if (direction === "up") {
            moveItemUp(categoryId, itemIndex);
        } else {
            moveItemDown(categoryId, itemIndex);
        }
    };

    // Initialize working copy from original restaurant data
    useEffect(() => {
        if (originalRestaurant) {
            // Create a deep copy of the restaurant data
            setWorkingCopy(JSON.parse(JSON.stringify(originalRestaurant)));

            // Set active category to first one
            setActiveCategory(
                originalRestaurant.categories[language][0]?.id || ""
            );
        }
    }, [originalRestaurant, language]);

    // Reset working copy to original data
    const resetToDefault = () => {
        if (originalRestaurant) {            
            setWorkingCopy(JSON.parse(JSON.stringify(originalRestaurant)));

            // Reset active category to first one
            setActiveCategory(
                originalRestaurant.categories[language][0]?.id || ""
            );

            toast({
                title: language === "tr" ? "Sıfırlandı" : "Reset Complete",
                description:
                    language === "tr"
                        ? "Tüm değişiklikler varsayılan değerlere sıfırlandı"
                        : "All changes have been reset to default values",
            });
        } else {
            loadDefaultAnatoliaRestaurant();
        }
    };

    // Get current working data based on language
    const currentMenuData = workingCopy ? workingCopy.menuData[language] : {};
    const currentCategories = workingCopy
        ? workingCopy.categories[language]
        : [];
    const currentCategoryMapping = workingCopy
        ? workingCopy.categoryMapping[language]
        : {};

    // Update basic restaurant info
    const updateRestaurantInfo = (
        field: keyof Pick<Restaurant, "name" | "cuisine" | "id">,
        value: string
    ) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: value,
            };
        });
    };

    // Update theme colors
    const updateTheme = (field: keyof Restaurant["theme"], value: string) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                theme: {
                    ...prev.theme,
                    [field]: value,
                },
            };
        });
    };

    // Update contact information
    const updateContact = (
        field: keyof Restaurant["contact"],
        value: string
    ) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                contact: {
                    ...prev.contact,
                    [field]: value,
                },
            };
        });
    };

    // Update category mapping
    const updateCategoryMapping = (categoryId: string, value: string) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newCategoryMapping = { ...prev.categoryMapping };
            const langMapping = { ...newCategoryMapping[language] };
            langMapping[categoryId] = value;
            newCategoryMapping[language] = langMapping;

            return {
                ...prev,
                categoryMapping: newCategoryMapping,
            };
        });
    };

    // Handle item update
    const updateItem = (
        categoryId: string,
        index: number,
        field: keyof MenuItem,
        value: string
    ) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newMenuData = { ...prev.menuData };
            const langData = { ...newMenuData[language] };
            const categoryData = { ...langData[categoryId] };
            const newItems = [...categoryData.items];

            newItems[index] = { ...newItems[index], [field]: value };
            categoryData.items = newItems;
            langData[categoryId] = categoryData;
            newMenuData[language] = langData;

            return {
                ...prev,
                menuData: newMenuData,
            };
        });
    };

    // Handle tag update
    const updateTag = (
        categoryId: string,
        itemIndex: number,
        tagIndex: number,
        value: string
    ) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newMenuData = { ...prev.menuData };
            const langData = { ...newMenuData[language] };
            const categoryData = { ...langData[categoryId] };
            const newItems = [...categoryData.items];
            const item = { ...newItems[itemIndex] };
            const newTags = [...(item.tags || [])];

            newTags[tagIndex] = value;
            item.tags = newTags;
            newItems[itemIndex] = item;
            categoryData.items = newItems;
            langData[categoryId] = categoryData;
            newMenuData[language] = langData;

            return {
                ...prev,
                menuData: newMenuData,
            };
        });
    };

    // Add new tag
    const addTag = (categoryId: string, itemIndex: number) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newMenuData = { ...prev.menuData };
            const langData = { ...newMenuData[language] };
            const categoryData = { ...langData[categoryId] };
            const newItems = [...categoryData.items];
            const item = { ...newItems[itemIndex] };
            const newTags = [...(item.tags || []), ""];

            item.tags = newTags;
            newItems[itemIndex] = item;
            categoryData.items = newItems;
            langData[categoryId] = categoryData;
            newMenuData[language] = langData;

            return {
                ...prev,
                menuData: newMenuData,
            };
        });
    };

    // Remove tag
    const removeTag = (
        categoryId: string,
        itemIndex: number,
        tagIndex: number
    ) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newMenuData = { ...prev.menuData };
            const langData = { ...newMenuData[language] };
            const categoryData = { ...langData[categoryId] };
            const newItems = [...categoryData.items];
            const item = { ...newItems[itemIndex] };
            const newTags = [...(item.tags || [])];

            newTags.splice(tagIndex, 1);
            item.tags = newTags;
            newItems[itemIndex] = item;
            categoryData.items = newItems;
            langData[categoryId] = categoryData;
            newMenuData[language] = langData;

            return {
                ...prev,
                menuData: newMenuData,
            };
        });
    };

    // Add new item
    const addItem = (categoryId: string) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newMenuData = { ...prev.menuData };
            const langData = { ...newMenuData[language] };
            const categoryData = { ...langData[categoryId] };
            const newItems = [...categoryData.items];

            newItems.push({
                name: language === "tr" ? "Yeni Ürün" : "New Item",
                description: "",
                price: "0.00",
                image: "/placeholder.svg?height=300&width=400",
                tags: [],
            });

            categoryData.items = newItems;
            langData[categoryId] = categoryData;
            newMenuData[language] = langData;

            return {
                ...prev,
                menuData: newMenuData,
            };
        });
    };

    // Remove item
    const removeItem = (categoryId: string, itemIndex: number) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newMenuData = { ...prev.menuData };
            const langData = { ...newMenuData[language] };
            const categoryData = { ...langData[categoryId] };
            const newItems = [...categoryData.items];

            newItems.splice(itemIndex, 1);
            categoryData.items = newItems;
            langData[categoryId] = categoryData;
            newMenuData[language] = langData;

            return {
                ...prev,
                menuData: newMenuData,
            };
        });
    };

    // Update category title or description
    const updateCategory = (
        categoryId: string,
        field: "title" | "description",
        value: string
    ) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newMenuData = { ...prev.menuData };
            const langData = { ...newMenuData[language] };
            const categoryData = { ...langData[categoryId] };

            categoryData[field] = value;
            langData[categoryId] = categoryData;
            newMenuData[language] = langData;

            return {
                ...prev,
                menuData: newMenuData,
            };
        });
    };

    // Update category name in categories array
    const updateCategoryName = (categoryId: string, newName: string) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newCategories = { ...prev.categories };
            const langCategories = [...newCategories[language]];

            const categoryIndex = langCategories.findIndex(
                (cat) => cat.id === categoryId
            );
            if (categoryIndex !== -1) {
                langCategories[categoryIndex] = {
                    ...langCategories[categoryIndex],
                    name: newName,
                };
            }

            newCategories[language] = langCategories;

            return {
                ...prev,
                categories: newCategories,
            };
        });
    };

    // Add function to add a new category
    const addCategory = () => {
        if (!workingCopy) return;

        if (!newCategoryId || !newCategoryName) {
            toast({
                title: language === "tr" ? "Hata" : "Error",
                description:
                    language === "tr"
                        ? "Kategori ID ve isim gereklidir"
                        : "Category ID and name are required",
            });
            return;
        }

        // Check if ID already exists
        if (currentCategories.some((cat) => cat.id === newCategoryId)) {
            toast({
                title: language === "tr" ? "Hata" : "Error",
                description:
                    language === "tr"
                        ? "Bu ID ile bir kategori zaten var"
                        : "A category with this ID already exists",
            });
            return;
        }

        // Create new category object
        const newCategory = { id: newCategoryId, name: newCategoryName };

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            // Add new category to categories
            const newCategories = { ...prev.categories };
            const langCategories = [...newCategories[language], newCategory];
            newCategories[language] = langCategories;

            // Add new category to menu data with empty items
            const newMenuData = { ...prev.menuData };
            const langData = { ...newMenuData[language] };
            langData[newCategoryId] = {
                title: newCategoryName,
                description: "",
                items: [],
            };
            newMenuData[language] = langData;

            // Add new category to category mapping
            const newCategoryMapping = { ...prev.categoryMapping };
            const langMapping = { ...newCategoryMapping[language] };
            langMapping[newCategoryId] = newCategoryId; // Default mapping to itself
            newCategoryMapping[language] = langMapping;

            return {
                ...prev,
                categories: newCategories,
                menuData: newMenuData,
                categoryMapping: newCategoryMapping,
            };
        });

        // Reset form
        setNewCategoryId("");
        setNewCategoryName("");
        setShowNewCategoryInput(false);

        // Set active category to the new one
        setActiveCategory(newCategoryId);
    };

    // Add function to remove a category
    const removeCategory = (categoryId: string) => {
        if (!workingCopy) return;

        // First update the active category before modifying the state
        // Find the categories that will remain after deletion
        const remainingCategories = currentCategories.filter(
            (cat) => cat.id !== categoryId
        );

        // If we're deleting the active category, switch to another one or empty string if none left
        if (activeCategory === categoryId) {
            if (remainingCategories.length > 0) {
                setActiveCategory(remainingCategories[0].id);
            } else {
                setActiveCategory("");
            }
        }

        // Now update the working copy
        setWorkingCopy((prev) => {
            if (!prev) return prev;

            // Create deep copies of all data structures
            const newCategories = { ...prev.categories };
            const newLangCategories = [...newCategories[language]].filter(
                (cat) => cat.id !== categoryId
            );
            newCategories[language] = newLangCategories;

            const newMenuData = { ...prev.menuData };
            const newLangData = { ...newMenuData[language] };
            // Create a new object without the deleted category
            const filteredLangData: MenuData = {};
            Object.keys(newLangData).forEach((key) => {
                if (key !== categoryId) {
                    filteredLangData[key] = newLangData[key];
                }
            });
            newMenuData[language] = filteredLangData;

            // Remove from category mapping
            const newCategoryMapping = { ...prev.categoryMapping };
            const newLangMapping = { ...newCategoryMapping[language] };
            delete newLangMapping[categoryId];
            newCategoryMapping[language] = newLangMapping;

            return {
                ...prev,
                categories: newCategories,
                menuData: newMenuData,
                categoryMapping: newCategoryMapping,
            };
        });

        // Show confirmation toast
        toast({
            title: language === "tr" ? "Kategori silindi" : "Category deleted",
            description:
                language === "tr"
                    ? `"${
                          currentCategories.find((c) => c.id === categoryId)
                              ?.name
                      }" kategorisi silindi`
                    : `Category "${
                          currentCategories.find((c) => c.id === categoryId)
                              ?.name
                      }" has been deleted`,
        });
    };

    // Show password modal before saving
    const saveChanges = () => {
        setPasswordError(false);
        setPassword("");
        setShowPasswordModal(true);
    };

    // Actual save function that runs after password verification
    const handleSaveWithPassword = async () => {
        const res = await verifyPassword(password);

        if (!res) {
            setPasswordError(true);
            return;
        }

        setShowPasswordModal(false);
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Log the complete data structure
        console.log("Working Copy:", workingCopy);
        handleSubmit();

        toast({
            title:
                language === "tr"
                    ? "Değişiklikler kaydedildi"
                    : "Changes saved",
            description:
                language === "tr"
                    ? "Menü başarıyla güncellendi (simülasyon)"
                    : "The menu has been successfully updated (simulation)",
        });

        setLoading(false);
    };

    // Function to move a category up in the order
    const moveCategoryUp = (categoryId: string) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newCategories = { ...prev.categories };
            const langCategories = [...newCategories[language]];

            const index = langCategories.findIndex(
                (cat) => cat.id === categoryId
            );
            if (index <= 0) return prev; // Already at the top

            // Swap with the previous item
            const temp = langCategories[index];
            langCategories[index] = langCategories[index - 1];
            langCategories[index - 1] = temp;

            newCategories[language] = langCategories;

            return {
                ...prev,
                categories: newCategories,
            };
        });
    };

    // Function to move a category down in the order
    const moveCategoryDown = (categoryId: string) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newCategories = { ...prev.categories };
            const langCategories = [...newCategories[language]];

            const index = langCategories.findIndex(
                (cat) => cat.id === categoryId
            );
            if (index === -1 || index >= langCategories.length - 1) return prev; // Already at the bottom

            // Swap with the next item
            const temp = langCategories[index];
            langCategories[index] = langCategories[index + 1];
            langCategories[index + 1] = temp;

            newCategories[language] = langCategories;

            return {
                ...prev,
                categories: newCategories,
            };
        });
    };

    // Function to move a menu item up within its category
    const moveItemUp = (categoryId: string, itemIndex: number) => {
        if (!workingCopy || itemIndex <= 0) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newMenuData = { ...prev.menuData };
            const langData = { ...newMenuData[language] };
            const categoryData = { ...langData[categoryId] };
            const newItems = [...categoryData.items];

            // Swap with the previous item
            const temp = newItems[itemIndex];
            newItems[itemIndex] = newItems[itemIndex - 1];
            newItems[itemIndex - 1] = temp;

            categoryData.items = newItems;
            langData[categoryId] = categoryData;
            newMenuData[language] = langData;

            return {
                ...prev,
                menuData: newMenuData,
            };
        });
    };

    // Function to move a menu item down within its category
    const moveItemDown = (categoryId: string, itemIndex: number) => {
        if (!workingCopy) return;

        setWorkingCopy((prev) => {
            if (!prev) return prev;

            const newMenuData = { ...prev.menuData };
            const langData = { ...newMenuData[language] };
            const categoryData = { ...langData[categoryId] };
            const newItems = [...categoryData.items];

            if (itemIndex >= newItems.length - 1) return prev; // Already at the bottom

            // Swap with the next item
            const temp = newItems[itemIndex];
            newItems[itemIndex] = newItems[itemIndex + 1];
            newItems[itemIndex + 1] = temp;

            categoryData.items = newItems;
            langData[categoryId] = categoryData;
            newMenuData[language] = langData;

            return {
                ...prev,
                menuData: newMenuData,
            };
        });
    };

    // If working copy is not loaded yet, show loading
    if (!workingCopy) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>{language === "tr" ? "Yükleniyor..." : "Loading..."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-accent bg-background shadow-xs">
                <div className="container px-4 py-3 md:max-w-5xl md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/menu`)}
                                aria-label="Back to menu"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-xl font-bold text-primary">
                                {language === "tr"
                                    ? `${workingCopy.name} Düzenle`
                                    : `Edit ${workingCopy.name}`}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2">
                            <Select
                                value={language}
                                onValueChange={(value) =>
                                    setLanguage(value as "en" | "tr")
                                }
                            >
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="tr">Türkçe</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    setTheme(
                                        theme === "light" ? "dark" : "light"
                                    )
                                }
                                className="h-9 w-9 rounded-full"
                                aria-label="Toggle theme"
                            >
                                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={resetToDefault}
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    {language === "tr" ? "Sıfırla" : "Reset"}
                                </span>
                            </Button>

                            <Button
                                onClick={saveChanges}
                                disabled={loading}
                                className="gap-1"
                            >
                                <Save className="h-4 w-4" />
                                <span className="hidden sm:inline">
                                    {language === "tr" ? "Kaydet" : "Save"}
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Tabs */}
            <div className="container px-4 py-4 md:max-w-5xl">
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger
                            value="menu"
                            className="flex items-center gap-1"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-utensils"
                            >
                                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                                <path d="M7 2v20" />
                                <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                            </svg>
                            <span>{language === "tr" ? "Menü" : "Menu"}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="settings"
                            className="flex items-center gap-1"
                        >
                            <Settings className="h-4 w-4" />
                            <span>
                                {language === "tr" ? "Ayarlar" : "Settings"}
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="theme"
                            className="flex items-center gap-1"
                        >
                            <Palette className="h-4 w-4" />
                            <span>{language === "tr" ? "Tema" : "Theme"}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="contact"
                            className="flex items-center gap-1"
                        >
                            <Phone className="h-4 w-4" />
                            <span>
                                {language === "tr" ? "İletişim" : "Contact"}
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Menu Tab Content */}
                    <TabsContent value="menu" className="mt-4">
                        {currentCategories.length > 0 ? (
                            <Tabs
                                value={activeCategory}
                                onValueChange={setActiveCategory}
                                className="w-full"
                            >
                                <div className="mb-6">
                                    <div className="overflow-x-auto pb-2 mb-2 -mx-1 px-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-medium">
                                                {language === "tr"
                                                    ? "Kategoriler"
                                                    : "Categories"}
                                            </h3>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setShowNewCategoryInput(
                                                        !showNewCategoryInput
                                                    )
                                                }
                                                className="gap-1"
                                            >
                                                {showNewCategoryInput ? (
                                                    <>
                                                        <Edit className="h-4 w-4" />
                                                        {language === "tr"
                                                            ? "İptal"
                                                            : "Cancel"}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="h-4 w-4" />
                                                        {language === "tr"
                                                            ? "Yeni Kategori"
                                                            : "New Category"}
                                                    </>
                                                )}
                                            </Button>
                                        </div>

                                        <div className="grid gap-2">
                                            {currentCategories.map(
                                                (category, index) => (
                                                    <div
                                                        id={`category-${category.id}`}
                                                        key={category.id}
                                                        className={`flex items-center gap-2 p-3 border rounded-md transition-colors ${
                                                            activeCategory ===
                                                            category.id
                                                                ? "border-primary bg-primary/5"
                                                                : "border-border bg-card hover:bg-muted/40"
                                                        }`}
                                                    >
                                                        <div
                                                            className="flex items-center gap-2 grow cursor-pointer"
                                                            onClick={() =>
                                                                setActiveCategory(
                                                                    category.id
                                                                )
                                                            }
                                                        >
                                                            <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
                                                            <div className="font-medium truncate">
                                                                {category.name}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <div className="flex border rounded-md overflow-hidden">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-none border-0 border-r"
                                                                    onClick={() =>
                                                                        handleCategoryReorder(
                                                                            category.id,
                                                                            "up"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        index ===
                                                                        0
                                                                    }
                                                                    aria-label={
                                                                        language ===
                                                                        "tr"
                                                                            ? "Yukarı taşı"
                                                                            : "Move up"
                                                                    }
                                                                >
                                                                    <MoveUp className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-none border-0"
                                                                    onClick={() =>
                                                                        handleCategoryReorder(
                                                                            category.id,
                                                                            "down"
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        index ===
                                                                        currentCategories.length -
                                                                            1
                                                                    }
                                                                    aria-label={
                                                                        language ===
                                                                        "tr"
                                                                            ? "Aşağı taşı"
                                                                            : "Move down"
                                                                    }
                                                                >
                                                                    <MoveDown className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 px-2 gap-1"
                                                                onClick={() =>
                                                                    removeCategory(
                                                                        category.id
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    {language ===
                                                                    "tr"
                                                                        ? "Sil"
                                                                        : "Delete"}
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className="mt-4">
                                            <TabsList className="hidden">
                                                {currentCategories.map(
                                                    (category) => (
                                                        <TabsTrigger
                                                            key={category.id}
                                                            value={category.id}
                                                        >
                                                            {category.name}
                                                        </TabsTrigger>
                                                    )
                                                )}
                                            </TabsList>
                                        </div>
                                    </div>

                                    {showNewCategoryInput && (
                                        <div className="mt-4 p-4 border rounded-md bg-muted/30">
                                            <h3 className="text-sm font-medium mb-3">
                                                {language === "tr"
                                                    ? "Yeni Kategori Ekle"
                                                    : "Add New Category"}
                                            </h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor="new-category-id"
                                                        className="text-sm font-medium"
                                                    >
                                                        {language === "tr"
                                                            ? "Kategori ID"
                                                            : "Category ID"}
                                                    </label>
                                                    <Input
                                                        id="new-category-id"
                                                        value={newCategoryId}
                                                        onChange={(e) =>
                                                            setNewCategoryId(
                                                                e.target.value
                                                                    .toLowerCase()
                                                                    .replace(
                                                                        /\s+/g,
                                                                        "-"
                                                                    )
                                                            )
                                                        }
                                                        placeholder="category-id"
                                                    />
                                                    <p className="text-xs text-muted-foreground">
                                                        {language === "tr"
                                                            ? "Sadece küçük harfler, sayılar ve tire kullanın"
                                                            : "Use only lowercase letters, numbers, and hyphens"}
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor="new-category-name"
                                                        className="text-sm font-medium"
                                                    >
                                                        {language === "tr"
                                                            ? "Kategori Adı"
                                                            : "Category Name"}
                                                    </label>
                                                    <Input
                                                        id="new-category-name"
                                                        value={newCategoryName}
                                                        onChange={(e) =>
                                                            setNewCategoryName(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={
                                                            language === "tr"
                                                                ? "Kategori Adı"
                                                                : "Category Name"
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-end">
                                                <Button
                                                    onClick={addCategory}
                                                    disabled={
                                                        !newCategoryId ||
                                                        !newCategoryName
                                                    }
                                                    size="sm"
                                                >
                                                    {language === "tr"
                                                        ? "Kategori Ekle"
                                                        : "Add Category"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {currentCategories.map((category) => (
                                    <TabsContent
                                        key={category.id}
                                        value={category.id}
                                        className="space-y-6"
                                    >
                                        {currentMenuData[category.id] && (
                                            <>
                                                {/* Category Settings */}
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>
                                                            {language === "tr"
                                                                ? "Kategori Ayarları"
                                                                : "Category Settings"}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="grid gap-4 md:grid-cols-2">
                                                            <div className="space-y-2">
                                                                <label
                                                                    htmlFor={`category-name-${category.id}`}
                                                                    className="text-sm font-medium"
                                                                >
                                                                    {language ===
                                                                    "tr"
                                                                        ? "Kategori Adı (Navigasyon)"
                                                                        : "Category Name (Navigation)"}
                                                                </label>
                                                                <Input
                                                                    id={`category-name-${category.id}`}
                                                                    value={
                                                                        category.name
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateCategoryName(
                                                                            category.id,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                <p className="text-xs text-muted-foreground">
                                                                    {language ===
                                                                    "tr"
                                                                        ? "Bu, menü navigasyonunda görünen isimdir"
                                                                        : "This is the name shown in the menu navigation"}
                                                                </p>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label
                                                                    htmlFor={`category-title-${category.id}`}
                                                                    className="text-sm font-medium"
                                                                >
                                                                    {language ===
                                                                    "tr"
                                                                        ? "Kategori Başlığı (İçerik)"
                                                                        : "Category Title (Content)"}
                                                                </label>
                                                                <Input
                                                                    id={`category-title-${category.id}`}
                                                                    value={
                                                                        currentMenuData[
                                                                            category
                                                                                .id
                                                                        ].title
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateCategory(
                                                                            category.id,
                                                                            "title",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                <p className="text-xs text-muted-foreground">
                                                                    {language ===
                                                                    "tr"
                                                                        ? "Bu, kategori içeriğinin üstünde görünen başlıktır"
                                                                        : "This is the title shown above the category content"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label
                                                                htmlFor={`category-desc-${category.id}`}
                                                                className="text-sm font-medium"
                                                            >
                                                                {language ===
                                                                "tr"
                                                                    ? "Kategori Açıklaması"
                                                                    : "Category Description"}
                                                            </label>
                                                            <Textarea
                                                                id={`category-desc-${category.id}`}
                                                                value={
                                                                    currentMenuData[
                                                                        category
                                                                            .id
                                                                    ]
                                                                        .description
                                                                }
                                                                onChange={(e) =>
                                                                    updateCategory(
                                                                        category.id,
                                                                        "description",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                rows={2}
                                                            />
                                                        </div>

                                                        <div className="grid gap-2">
                                                            <label
                                                                htmlFor={`category-mapping-${category.id}`}
                                                                className="text-sm font-medium"
                                                            >
                                                                {language ===
                                                                "tr"
                                                                    ? "Kategori Eşleştirmesi"
                                                                    : "Category Mapping"}
                                                            </label>
                                                            <Input
                                                                id={`category-mapping-${category.id}`}
                                                                value={
                                                                    currentCategoryMapping[
                                                                        category
                                                                            .id
                                                                    ] ||
                                                                    category.id
                                                                }
                                                                onChange={(e) =>
                                                                    updateCategoryMapping(
                                                                        category.id,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            <p className="text-xs text-muted-foreground">
                                                                {language ===
                                                                "tr"
                                                                    ? "Bu, dil değiştiğinde kategorilerin nasıl eşleşeceğini belirler"
                                                                    : "This determines how categories map when language changes"}
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                {/* Items */}
                                                {currentMenuData[
                                                    category.id
                                                ].items.map(
                                                    (item, itemIndex) => (
                                                        <Card
                                                            key={itemIndex}
                                                            id={`item-${category.id}-${itemIndex}`}
                                                            className="relative"
                                                        >
                                                            <CardHeader className="pb-2">
                                                                <CardTitle className="text-lg flex justify-between items-center">
                                                                    <div className="flex items-center gap-2">
                                                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                                        <span>
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <div className="flex border rounded-md overflow-hidden">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 rounded-none border-0 border-r"
                                                                                onClick={() =>
                                                                                    handleItemReorder(
                                                                                        category.id,
                                                                                        itemIndex,
                                                                                        "up"
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    itemIndex ===
                                                                                    0
                                                                                }
                                                                                aria-label={
                                                                                    language ===
                                                                                    "tr"
                                                                                        ? "Yukarı taşı"
                                                                                        : "Move up"
                                                                                }
                                                                            >
                                                                                <MoveUp className="h-4 w-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8 rounded-none border-0"
                                                                                onClick={() =>
                                                                                    handleItemReorder(
                                                                                        category.id,
                                                                                        itemIndex,
                                                                                        "down"
                                                                                    )
                                                                                }
                                                                                disabled={
                                                                                    itemIndex ===
                                                                                    currentMenuData[
                                                                                        category
                                                                                            .id
                                                                                    ]
                                                                                        .items
                                                                                        .length -
                                                                                        1
                                                                                }
                                                                                aria-label={
                                                                                    language ===
                                                                                    "tr"
                                                                                        ? "Aşağı taşı"
                                                                                        : "Move down"
                                                                                }
                                                                            >
                                                                                <MoveDown className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="icon"
                                                                            className="h-8 w-8"
                                                                            onClick={() =>
                                                                                removeItem(
                                                                                    category.id,
                                                                                    itemIndex
                                                                                )
                                                                            }
                                                                            aria-label={
                                                                                language ===
                                                                                "tr"
                                                                                    ? "Sil"
                                                                                    : "Delete"
                                                                            }
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </CardTitle>
                                                            </CardHeader>
                                                            <CardContent className="space-y-4">
                                                                <div className="grid gap-4 md:grid-cols-2">
                                                                    <div className="space-y-2">
                                                                        <label
                                                                            htmlFor={`item-name-${itemIndex}`}
                                                                            className="text-sm font-medium"
                                                                        >
                                                                            {language ===
                                                                            "tr"
                                                                                ? "Ürün Adı"
                                                                                : "Item Name"}
                                                                        </label>
                                                                        <Input
                                                                            id={`item-name-${itemIndex}`}
                                                                            value={
                                                                                item.name
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateItem(
                                                                                    category.id,
                                                                                    itemIndex,
                                                                                    "name",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="space-y-2">
                                                                        <label
                                                                            htmlFor={`item-price-${itemIndex}`}
                                                                            className="text-sm font-medium"
                                                                        >
                                                                            {language ===
                                                                            "tr"
                                                                                ? "Fiyat"
                                                                                : "Price"}
                                                                        </label>
                                                                        <Input
                                                                            id={`item-price-${itemIndex}`}
                                                                            value={
                                                                                item.price
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateItem(
                                                                                    category.id,
                                                                                    itemIndex,
                                                                                    "price",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            type="text"
                                                                            inputMode="decimal"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label
                                                                        htmlFor={`item-desc-${itemIndex}`}
                                                                        className="text-sm font-medium"
                                                                    >
                                                                        {language ===
                                                                        "tr"
                                                                            ? "Açıklama"
                                                                            : "Description"}
                                                                    </label>
                                                                    <Textarea
                                                                        id={`item-desc-${itemIndex}`}
                                                                        value={
                                                                            item.description
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateItem(
                                                                                category.id,
                                                                                itemIndex,
                                                                                "description",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        rows={3}
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label
                                                                        htmlFor={`item-image-${itemIndex}`}
                                                                        className="text-sm font-medium"
                                                                    >
                                                                        {language ===
                                                                        "tr"
                                                                            ? "Görsel URL"
                                                                            : "Image URL"}
                                                                    </label>
                                                                    <Input
                                                                        id={`item-image-${itemIndex}`}
                                                                        value={
                                                                            item.image
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateItem(
                                                                                category.id,
                                                                                itemIndex,
                                                                                "image",
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="/placeholder.svg?height=300&width=400"
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between items-center">
                                                                        <label className="text-sm font-medium">
                                                                            {language ===
                                                                            "tr"
                                                                                ? "Etiketler"
                                                                                : "Tags"}
                                                                        </label>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                addTag(
                                                                                    category.id,
                                                                                    itemIndex
                                                                                )
                                                                            }
                                                                            className="h-7 text-xs gap-1"
                                                                        >
                                                                            <Plus className="h-3 w-3" />
                                                                            {language ===
                                                                            "tr"
                                                                                ? "Etiket Ekle"
                                                                                : "Add Tag"}
                                                                        </Button>
                                                                    </div>

                                                                    <div className="flex flex-wrap gap-2">
                                                                        {item.tags &&
                                                                            item.tags.map(
                                                                                (
                                                                                    tag,
                                                                                    tagIndex
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            tagIndex
                                                                                        }
                                                                                        className="flex items-center gap-1"
                                                                                    >
                                                                                        <Input
                                                                                            value={
                                                                                                tag
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                updateTag(
                                                                                                    category.id,
                                                                                                    itemIndex,
                                                                                                    tagIndex,
                                                                                                    e
                                                                                                        .target
                                                                                                        .value
                                                                                                )
                                                                                            }
                                                                                            className="h-7 w-32 text-xs"
                                                                                        />
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            onClick={() =>
                                                                                                removeTag(
                                                                                                    category.id,
                                                                                                    itemIndex,
                                                                                                    tagIndex
                                                                                                )
                                                                                            }
                                                                                            className="h-7 w-7 text-destructive"
                                                                                        >
                                                                                            <Trash2 className="h-3 w-3" />
                                                                                        </Button>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        {(!item.tags ||
                                                                            item
                                                                                .tags
                                                                                .length ===
                                                                                0) && (
                                                                            <div className="text-sm text-muted-foreground italic">
                                                                                {language ===
                                                                                "tr"
                                                                                    ? "Henüz etiket yok"
                                                                                    : "No tags yet"}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    )
                                                )}

                                                <Button
                                                    variant="outline"
                                                    className="w-full gap-2"
                                                    onClick={() =>
                                                        addItem(category.id)
                                                    }
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    {language === "tr"
                                                        ? "Yeni Ürün Ekle"
                                                        : "Add New Item"}
                                                </Button>
                                            </>
                                        )}
                                    </TabsContent>
                                ))}
                            </Tabs>
                        ) : (
                            <div className="text-center py-12">
                                <h2 className="text-xl font-semibold mb-4">
                                    {language === "tr"
                                        ? "Henüz kategori yok"
                                        : "No categories yet"}
                                </h2>
                                <Button
                                    onClick={() =>
                                        setShowNewCategoryInput(true)
                                    }
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    {language === "tr"
                                        ? "İlk Kategoriyi Ekle"
                                        : "Add First Category"}
                                </Button>

                                {showNewCategoryInput && (
                                    <div className="mt-8 p-4 border rounded-md bg-muted/30 max-w-md mx-auto text-left">
                                        <h3 className="text-sm font-medium mb-3">
                                            {language === "tr"
                                                ? "Yeni Kategori Ekle"
                                                : "Add New Category"}
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="new-category-id"
                                                    className="text-sm font-medium"
                                                >
                                                    {language === "tr"
                                                        ? "Kategori ID"
                                                        : "Category ID"}
                                                </label>
                                                <Input
                                                    id="new-category-id"
                                                    value={newCategoryId}
                                                    onChange={(e) =>
                                                        setNewCategoryId(
                                                            e.target.value
                                                                .toLowerCase()
                                                                .replace(
                                                                    /\s+/g,
                                                                    "-"
                                                                )
                                                        )
                                                    }
                                                    placeholder="category-id"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    {language === "tr"
                                                        ? "Sadece küçük harfler, sayılar ve tire kullanın"
                                                        : "Use only lowercase letters, numbers, and hyphens"}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="new-category-name"
                                                    className="text-sm font-medium"
                                                >
                                                    {language === "tr"
                                                        ? "Kategori Adı"
                                                        : "Category Name"}
                                                </label>
                                                <Input
                                                    id="new-category-name"
                                                    value={newCategoryName}
                                                    onChange={(e) =>
                                                        setNewCategoryName(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={
                                                        language === "tr"
                                                            ? "Kategori Adı"
                                                            : "Category Name"
                                                    }
                                                />
                                            </div>

                                            <div className="mt-4 flex justify-end">
                                                <Button
                                                    onClick={addCategory}
                                                    disabled={
                                                        !newCategoryId ||
                                                        !newCategoryName
                                                    }
                                                    size="sm"
                                                >
                                                    {language === "tr"
                                                        ? "Kategori Ekle"
                                                        : "Add Category"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </TabsContent>

                    {/* Settings Tab Content */}
                    <TabsContent value="settings" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {language === "tr"
                                        ? "Restoran Ayarları"
                                        : "Restaurant Settings"}
                                </CardTitle>
                                <CardDescription>
                                    {language === "tr"
                                        ? "Temel restoran bilgilerini düzenleyin"
                                        : "Edit basic restaurant information"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="restaurant-id"
                                            className="text-sm font-medium"
                                        >
                                            {language === "tr"
                                                ? "Restoran ID"
                                                : "Restaurant ID"}
                                        </label>
                                        <Input
                                            id="restaurant-id"
                                            value={workingCopy.id}
                                            onChange={(e) =>
                                                updateRestaurantInfo(
                                                    "id",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="restaurant-id"
                                            disabled
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {language === "tr"
                                                ? "URL'de kullanılan benzersiz tanımlayıcı"
                                                : "Unique identifier used in the URL"}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="restaurant-name"
                                            className="text-sm font-medium"
                                        >
                                            {language === "tr"
                                                ? "Restoran Adı"
                                                : "Restaurant Name"}
                                        </label>
                                        <Input
                                            id="restaurant-name"
                                            value={workingCopy.name}
                                            onChange={(e) =>
                                                updateRestaurantInfo(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Restaurant Name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="restaurant-cuisine"
                                        className="text-sm font-medium"
                                    >
                                        {language === "tr"
                                            ? "Mutfak Türü"
                                            : "Cuisine Type"}
                                    </label>
                                    <Input
                                        id="restaurant-cuisine"
                                        value={workingCopy.cuisine}
                                        onChange={(e) =>
                                            updateRestaurantInfo(
                                                "cuisine",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Turkish, Italian, etc."
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Theme Tab Content */}
                    <TabsContent value="theme" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {language === "tr"
                                        ? "Tema Ayarları"
                                        : "Theme Settings"}
                                </CardTitle>
                                <CardDescription>
                                    {language === "tr"
                                        ? "Restoran menüsünün görsel stilini özelleştirin"
                                        : "Customize the visual style of your restaurant menu"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="primary-color"
                                            className="text-sm font-medium"
                                        >
                                            {language === "tr"
                                                ? "Ana Renk"
                                                : "Primary Color"}
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="primary-color"
                                                value={
                                                    workingCopy.theme
                                                        .primaryColor
                                                }
                                                onChange={(e) =>
                                                    updateTheme(
                                                        "primaryColor",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="#c83232"
                                            />
                                            <div
                                                className="w-10 h-10 rounded border"
                                                style={{
                                                    backgroundColor:
                                                        workingCopy.theme
                                                            .primaryColor,
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {language === "tr"
                                                ? "Başlıklar ve vurgu öğeleri için kullanılır"
                                                : "Used for headings and accent elements"}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="secondary-color"
                                            className="text-sm font-medium"
                                        >
                                            {language === "tr"
                                                ? "İkincil Renk"
                                                : "Secondary Color"}
                                        </label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="secondary-color"
                                                value={
                                                    workingCopy.theme
                                                        .secondaryColor
                                                }
                                                onChange={(e) =>
                                                    updateTheme(
                                                        "secondaryColor",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="#00798c"
                                            />
                                            <div
                                                className="w-10 h-10 rounded border"
                                                style={{
                                                    backgroundColor:
                                                        workingCopy.theme
                                                            .secondaryColor,
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {language === "tr"
                                                ? "Düğmeler ve ikincil öğeler için kullanılır"
                                                : "Used for buttons and secondary elements"}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 border rounded-md mt-4">
                                    <h3 className="font-medium mb-2">
                                        {language === "tr"
                                            ? "Önizleme"
                                            : "Preview"}
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        <div
                                            className="p-3 rounded-md"
                                            style={{
                                                backgroundColor:
                                                    workingCopy.theme
                                                        .primaryColor,
                                            }}
                                        >
                                            <p className="text-white font-medium">
                                                {language === "tr"
                                                    ? "Ana Renk Örneği"
                                                    : "Primary Color Sample"}
                                            </p>
                                        </div>
                                        <div
                                            className="p-3 rounded-md"
                                            style={{
                                                backgroundColor:
                                                    workingCopy.theme
                                                        .secondaryColor,
                                            }}
                                        >
                                            <p className="text-white font-medium">
                                                {language === "tr"
                                                    ? "İkincil Renk Örneği"
                                                    : "Secondary Color Sample"}
                                            </p>
                                        </div>
                                        <div className="p-3 border rounded-md">
                                            <h3
                                                className="font-bold"
                                                style={{
                                                    color: workingCopy.theme
                                                        .primaryColor,
                                                }}
                                            >
                                                {language === "tr"
                                                    ? "Başlık Örneği"
                                                    : "Heading Sample"}
                                            </h3>
                                            <p className="text-sm">
                                                {language === "tr"
                                                    ? "Bu, normal metin içeriğinin nasıl görüneceğini gösterir."
                                                    : "This shows how normal text content will appear."}
                                            </p>
                                            <button
                                                className="mt-2 px-3 py-1 text-white rounded-md text-sm"
                                                style={{
                                                    backgroundColor:
                                                        workingCopy.theme
                                                            .secondaryColor,
                                                }}
                                            >
                                                {language === "tr"
                                                    ? "Düğme Örneği"
                                                    : "Button Sample"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Contact Tab Content */}
                    <TabsContent value="contact" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {language === "tr"
                                        ? "İletişim Bilgileri"
                                        : "Contact Information"}
                                </CardTitle>
                                <CardDescription>
                                    {language === "tr"
                                        ? "Müşterilerin sizinle iletişim kurabilmesi için bilgilerinizi güncelleyin"
                                        : "Update your information so customers can contact you"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="contact-phone"
                                        className="text-sm font-medium"
                                    >
                                        {language === "tr"
                                            ? "Telefon"
                                            : "Phone"}
                                    </label>
                                    <Input
                                        id="contact-phone"
                                        value={workingCopy.contact.phone}
                                        onChange={(e) =>
                                            updateContact(
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                        placeholder="(123) 456-7890"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="contact-email"
                                        className="text-sm font-medium"
                                    >
                                        {language === "tr"
                                            ? "E-posta"
                                            : "Email"}
                                    </label>
                                    <Input
                                        id="contact-email"
                                        value={workingCopy.contact.email}
                                        onChange={(e) =>
                                            updateContact(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="info@restaurant.com"
                                        type="email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="contact-address"
                                        className="text-sm font-medium"
                                    >
                                        {language === "tr"
                                            ? "Adres"
                                            : "Address"}
                                    </label>
                                    <Textarea
                                        id="contact-address"
                                        value={workingCopy.contact.address}
                                        onChange={(e) =>
                                            updateContact(
                                                "address",
                                                e.target.value
                                            )
                                        }
                                        placeholder="123 Restaurant St, City"
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Password Confirmation Modal */}
            <Dialog
                open={showPasswordModal}
                onOpenChange={setShowPasswordModal}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            <div className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                {language === "tr"
                                    ? "Şifre Doğrulama"
                                    : "Password Confirmation"}
                            </div>
                        </DialogTitle>
                        <DialogDescription>
                            {language === "tr"
                                ? "Değişiklikleri kaydetmek için şifreyi girin"
                                : "Enter the password to save your changes"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                {language === "tr" ? "Şifre" : "Password"}
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={
                                    language === "tr"
                                        ? "Şifrenizi girin"
                                        : "Enter your password"
                                }
                                className={
                                    passwordError ? "border-destructive" : ""
                                }
                            />
                            {passwordError && (
                                <p className="text-sm text-destructive">
                                    {language === "tr"
                                        ? "Hatalı şifre"
                                        : "Incorrect password"}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowPasswordModal(false)}
                        >
                            {language === "tr" ? "İptal" : "Cancel"}
                        </Button>
                        <Button
                            onClick={handleSaveWithPassword}
                            disabled={!password}
                        >
                            {language === "tr"
                                ? "Doğrula ve Kaydet"
                                : "Verify and Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );

}
