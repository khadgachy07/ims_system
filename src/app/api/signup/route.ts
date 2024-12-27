'use server';
import { User } from "@/entity/users";
import { NextRequest, NextResponse } from "next/server";
import hashedPassword from "@/helpers/password";
import { AppDataSource, initializeDatabase } from "@/db/data-source";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, region} = await req.json(); // Parse the request body
    console.log(name, email, password, region);

    // Create a new user entity
    const newUser = new User();
    newUser.name = name;
    newUser.email = email;

    // Encrypt password
    const encryptedPassword = await hashedPassword(password);
    newUser.encryptedPassword = encryptedPassword;
    console.log(encryptedPassword);

    // Connect to database
  
    await initializeDatabase();
    const userRepository = AppDataSource.getRepository(User);

    // Check if the email already exists
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      console.log("Email already exists");
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Save the new user
    await userRepository.save(newUser);
    console.log("User created successfully");

    return NextResponse.json({ message: "User created" });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}