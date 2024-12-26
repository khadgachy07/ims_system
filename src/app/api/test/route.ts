import { NextRequest, NextResponse } from "next/server";

// app/api/test/route.ts
export async function GET(req: NextRequest) {
    console.log("Authorization Header:", req.headers.get("user")); 
    console.log("JWT Secret:", process.env.NEXT_PUBLIC_JWT_SECRET); // Check if the token is passed
    return new NextResponse("Middleware is working!");
  }