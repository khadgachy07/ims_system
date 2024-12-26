import { AppDataSource, initializeDatabase } from "@/db/data-source";
import { Role } from "@/entity/enum";
import { User } from "@/entity/users";
import { NextRequest, NextResponse } from "next/server";
import { Not } from "typeorm";

export async function GET(req: NextRequest) {
  try {
    const userHeader = req.headers.get("user");
    if (!userHeader) {
      return new NextResponse("Unauthorized: Missing user header", {
        status: 401,
      });
    }

    const user = JSON.parse(userHeader);
    if (user.role !== Role.SYSTEM_ADMIN) {
      return new NextResponse("Forbidden: Insufficient role", { status: 403 });
    }

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
    }
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find({
      where: { role: Not(Role.SYSTEM_ADMIN) },
    });
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 500 });
    }
    return new NextResponse("An unknown error occurred", { status: 500 });
  }
}
