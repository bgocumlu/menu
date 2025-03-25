import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    tags: { type: [String], default: [] },
});

const MenuCategorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    items: { type: [MenuItemSchema], required: true },
});

const MenuDataSchema = new mongoose.Schema({
    en: { type: Map, of: MenuCategorySchema, required: true },
    tr: { type: Map, of: MenuCategorySchema, required: true },
});

const CategorySchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
});

const CategoryMappingSchema = new mongoose.Schema({
    en: { type: Map, of: String, required: true },
    tr: { type: Map, of: String, required: true },
});

const ThemeSchema = new mongoose.Schema({
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
});

const ContactSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
});

const RestaurantSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    menuData: { type: MenuDataSchema, required: true },
    categories: {
        en: { type: [CategorySchema], required: true },
        tr: { type: [CategorySchema], required: true },
    },
    categoryMapping: { type: CategoryMappingSchema, required: true },
    theme: { type: ThemeSchema, required: true },
    contact: { type: ContactSchema, required: true },
});

const Restaurant =
    mongoose.models.Restaurant ||
    mongoose.model("Restaurant", RestaurantSchema);

export default Restaurant;
