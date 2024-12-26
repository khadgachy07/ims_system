import { AppDataSource, checkDatabaseConnection, initializeDatabase } from "@/db/data-source";
import { Incentives } from "@/entity/incentives";
import { Role, User } from "@/entity/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const user = JSON.parse(req.headers.get("user") || '{}');
        if (!user || typeof user !== 'object') {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (user.role !== Role.SYSTEM_ADMIN) {
            return new NextResponse("Forbidden", { status: 403 });
        }
        // Implement your logic to update idea status
        if(!checkDatabaseConnection) {
            await initializeDatabase();
        }
        const { points, userId }: { points: number, userId: number[] } = await req.json();
        const userRepository = AppDataSource.getRepository(User);
        const incentivePerUser = points / userId.length;
        const recipients : User[] = []
        for (const user of userId){
            const recipient = await userRepository.findOne({where: {
                id: user
            }});
            if (!recipient) {
                return new NextResponse("User not found", { status: 404 });
            }
            recipient.points += incentivePerUser;
            recipients.push(recipient);
        }
      
        const incentiveRepository = AppDataSource.getRepository(Incentives);
        const incentive = new Incentives();
        incentive.points = points;

        incentive.recipient = recipients;
        await incentiveRepository.save(incentive);
        return new NextResponse("Incentive added successfully", { status: 201 });
    }
        catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}
export async function GET(req: NextRequest ) {   
    try {
        const user = JSON.parse(req.headers.get("user") || '{}');
        if (!user || typeof user !== 'object') {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (user.role !== Role.INNOVATION_MANAGER) {
            return new NextResponse("Forbidden", { status: 403 });
        }
       
        // Implement your logic to update idea status by ID}
        if(!checkDatabaseConnection) {
            await initializeDatabase();
        }

        const incentiveRepository =  AppDataSource.getRepository(Incentives);
        const incentives = await incentiveRepository.find();
        if (!incentives) {
            return new NextResponse("Incentive not found", { status: 404 });
        }
        return new NextResponse(JSON.stringify(incentives), { status: 200 });
    }
    catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}







      
       

