import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Password from "@/lib/models/password";
import { connectToDatabase } from "@/lib/mongodb";

const SALT_ROUNDS = 10;

// Connect to DB
async function connectToDB() {
    await connectToDatabase();
}

// Save a new password (one-time setup)
export async function POST(req: Request) {
    await connectToDB();
    const { password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Store hashed password (Only one entry)
    const existing = await Password.findOne();
    if (existing) {
        return NextResponse.json(
            { message: "Password already exists" },
            { status: 400 }
        );
    }

    const newPassword = new Password({ passwordHash: hashedPassword });
    await newPassword.save();

    return NextResponse.json(
        { message: "Password saved successfully" },
        { status: 201 }
    );
}

// Verify password (but never return it)
export async function PATCH(req: Request) {
    await connectToDB();
    const { password } = await req.json();

    const storedPassword = await Password.findOne();
    if (!storedPassword) {
        return NextResponse.json(
            { message: "No password set" },
            { status: 404 }
        );
    }

    const isMatch = await bcrypt.compare(password, storedPassword.passwordHash);
    if (!isMatch) {
        return NextResponse.json(
            { message: "Incorrect password" },
            { status: 401 }
        );
    }

    return NextResponse.json({ message: "Password is correct" });
}
