import { NextRequest, NextResponse } from "next/server";
import { AppDataSource } from "@/db/data-source";
import { User } from "@/entity/users";

export async function GET(req: NextRequest) {
  const userHeader = req.headers.get("user");
  const user = userHeader ? JSON.parse(userHeader) : null;

  if (user.role !== "innovation_manager") {
    return new Response("Forbidden", { status: 403 });
  }

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const employeeRepository = AppDataSource.getRepository(User);
  const employee = await employeeRepository.findOne({ where: { id: user.userId } });

  if (!employee) {
    return new Response("User not found", { status: 404 });
  }

  // Innovation manager-specific functionality
  return NextResponse.json({ message: "Innovation manager content", employee }, { status: 200 });
}