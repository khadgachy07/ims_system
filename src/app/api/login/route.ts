import { AppDataSource, initializeDatabase } from "@/db/data-source";
import { User } from "@/entity/users";
import { comparePassword } from "@/helpers/password";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();
    console.log(email, password);

 if(!AppDataSource.isInitialized) {
    await initializeDatabase();
 }
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email: email } });
        if (!user) {
            return new Response("User not found", { status: 404 });
        }
        const isPasswordValid = await comparePassword(password, user.encryptedPassword);
        if (!isPasswordValid) {
            return new Response("Invalid password", { status: 401 });
        }
    // Ensure the JWT secret is defined
    const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!jwtSecret) {
        return new Response("JWT secret is not defined", { status: 500 });
    }

    // Generate JWT token
    const token = jwt.sign(
        { userId: user.id, email: user.email , role: user.role},
        jwtSecret,
        { expiresIn: "1h" }
    );
    return NextResponse.json({ message: "Login successful", token }, { status: 200 });


}