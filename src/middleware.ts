import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";  // Import jwtVerify from jose

export async function middleware(req: NextRequest) {
  console.log("middleware");
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
    if (!secret) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Use jose's jwtVerify to decode the token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    const response = NextResponse.next();
    response.headers.set("user", JSON.stringify(payload)) // Attach decoded payload to headers
    return response;
  } catch (error) {
    console.error("Invalid token:", error);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}

// Corrected matcher paths
export const config = {
  matcher: [
    "/api/idea/:id",
    "/api/idea/:id/vote",
    "/api/idea/:id/review",
    "/api/idea",
    "/api/submission",
    "/api/submission/:id",
    "/api/incentive",
    "/api/user",
    "/api/user/:id",
    "/api/profile",
    "/api/test",  
  ],
};