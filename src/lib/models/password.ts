import mongoose, { Schema, Document } from "mongoose";

// Define the interface for TypeScript
export interface PasswordDocument extends Document {
    passwordHash: string; // Hashed password
}

// Mongoose Schema
const PasswordSchema = new Schema<PasswordDocument>({
    passwordHash: {
        type: String,
        required: true,
    },
});

// Export the model
const Password =
    mongoose.models.Password ||
    mongoose.model<PasswordDocument>("Password", PasswordSchema);
    
export default Password;
