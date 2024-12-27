import { AppDataSource, initializeDatabase } from "@/db/data-source";
import { Role } from "@/entity/enum";
import { User } from "@/entity/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest ,{ params }: { params: { id: number } }){
    try {
        const user = JSON.parse(req.headers.get("user") || '{}');
        if (!user || typeof user !== 'object') {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const param = await params;
        if (!param.id) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        if(!AppDataSource.isInitialized) {
            await initializeDatabase();
        }

        const userRepository = AppDataSource.getRepository(User);
        const userFound = await userRepository.findOneBy({ id: param.id });
        if (!userFound) {
            return new NextResponse("User not found", { status: 404 });
        }
        return new NextResponse(JSON.stringify(userFound), { status: 200 });


    }   catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: number } } ) {
    try {
        const user = JSON.parse(req.headers.get("user") || '{}');
        if (!user || typeof user !== 'object') {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (user.role !== Role.SYSTEM_ADMIN) {
            return new NextResponse("Forbidden", { status: 403 });
        }
        const param = await params;
        if (!param.id) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        if(!AppDataSource.isInitialized) {
            await initializeDatabase();
        }


        const userRepository = AppDataSource.getRepository(User);
        const userDetails = await userRepository.findOne({ where : { id: param.id} });
        if (!userDetails) {
            return new NextResponse("User not found", { status: 404 });
        }
        if (userDetails.role === Role.EMPLOYEE) {
            userDetails.role = Role.INNOVATION_MANAGER;
        } else {
            userDetails.role = Role.EMPLOYEE;
        }

        await userRepository.save(userDetails);
        return new NextResponse("User details updated successfully", { status: 200 });
    }
    catch (err) {
        console.error(err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: number } }) {
    try {
        const userHeader = req.headers.get("user");
        if (!userHeader) {
          return new NextResponse("Unauthorized: Missing user header", { status: 401 });
        }
    
        const user = JSON.parse(userHeader);
        if (user.role !== Role.SYSTEM_ADMIN) {
          return new NextResponse("Forbidden: Insufficient role", { status: 403 });
        }
    
        // Initialize database connection
        if (!AppDataSource.isInitialized) {
          await initializeDatabase();
        }
       const param = await params;
       if (!param.id) {
            return new NextResponse("User ID is required", { status: 400 });
        }
    const userId = param.id;
        const userRepository = AppDataSource.getRepository(User);
        const userDetails = await userRepository.findOneBy({ id: userId });
        if (!userDetails) {
            return new NextResponse("User not found", { status: 404 });
        }
        await userRepository.delete(userId);
        return new NextResponse("User deleted successfully", { status: 200 });
    }
    catch (err) {
        console.error(err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}