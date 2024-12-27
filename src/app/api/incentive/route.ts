import { AppDataSource, initializeDatabase } from "@/db/data-source";
import { Role } from "@/entity/enum";
import { Incentives } from "@/entity/incentives";
import { User } from "@/entity/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest ) {
  try {
    const user = JSON.parse(req.headers.get("user") || "{}");
    if (!user || typeof user !== "object") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (user.role !== Role.SYSTEM_ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    // Implement your logic to update idea status

    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
    }

   const body = await req.json();
           const { userId }: { userId: number } = body;
           if (!userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }
    const userRepository = AppDataSource.getRepository(User);
    const recipient = await userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!recipient) {
      return new NextResponse("User not found", { status: 404 });
    }
    recipient.points += 1000;
    await userRepository.save(recipient);

    const incentiveRepository = AppDataSource.getRepository(Incentives);
    const incentive = new Incentives();
    incentive.points = 1000;

    incentive.recipient = [recipient];
    await incentiveRepository.save(incentive);
    return new NextResponse("Incentive added successfully", { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  try {
    const user = JSON.parse(req.headers.get("user") || "{}");
    if (!user || typeof user !== "object") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Implement your logic to update idea status by ID}
    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
    }
    const incentiveRepository = AppDataSource.getRepository(Incentives);
    let incentives :Incentives[]= [];
    if (user.role === Role.EMPLOYEE) {
       incentives = await incentiveRepository.find({
        where: {
          recipient: {
            id: user.userId,
          },
        },
        relations: ["recipient"],
      });
      if (!incentives) {
        return new NextResponse("Incentive not found", { status: 404 });
      }
      return new NextResponse(JSON.stringify(incentives), { status: 200 });
    } else {
    incentives = await incentiveRepository.find({
        relations: ["recipient"],
      });
      if (!incentives) {
        return new NextResponse("Incentive not found", { status: 404 });
      }
    }
    const minimizedIncentives = incentives.map((incentive) => ({
      id: incentive.id,
      points: incentive.points,
      recipient: incentive.recipient.map((recipient) => ({
        id: recipient.id,
        name: recipient.name, // Include only necessary fields
      })),
      dateAwarded: incentive.dateAwarded
    }));
    return new NextResponse(JSON.stringify(minimizedIncentives), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
