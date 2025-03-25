import { NextResponse } from "next/server";
import Restaurant from "@/lib/models/restaurant"; // Import the Mongoose model
import { connectToDatabase } from "@/lib/mongodb"; // Import the DB connection
import { Restaurant as RestaurantType } from "@/lib/data/restaurants"; 

// Connect to the database
async function connectToDB() {
    console.log("Connecting to the database...");
    await connectToDatabase();
}

// Handle GET request to fetch the restaurant data
export async function GET() {
    await connectToDB();

    // Fetch the single restaurant
    const restaurant = await Restaurant.findOne();

    if (!restaurant) {
        return NextResponse.json(
            { message: "Restaurant not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(restaurant as RestaurantType);
}

// Handle POST request to update restaurant data
export async function POST(req: Request) {
    await connectToDB();

    const updatedData = await req.json(); // Get data from the frontend

    // Find and update the restaurant data
    const restaurant = await Restaurant.findOneAndUpdate({}, updatedData, {
        new: true,
        upsert: true,
    });

    if (!restaurant) {
        return NextResponse.json(
            { message: "Failed to update restaurant" },
            { status: 400 }
        );
    }

    return NextResponse.json(restaurant as RestaurantType);
}
