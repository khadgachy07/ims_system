import { AppDataSource, initializeDatabase } from "@/db/data-source";
import { Idea } from "@/entity/ideas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest ,{params}: { params: { id: number } }){
    try {
        const user = JSON.parse(req.headers.get("user") || '{}');
        if (!user || typeof user !== 'object') {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const param = await params;
        if (!param.id) {
            return new NextResponse("Idea ID is required", { status: 400 });
        }

        if(!AppDataSource.isInitialized) {
            await initializeDatabase();
        }

        const ideaRepository = AppDataSource.getRepository(Idea);
        const idea = await ideaRepository.findOneBy({ id: param.id });
        if (!idea) {
            return new NextResponse("Idea not found", { status: 404 });
        }
        return new NextResponse(JSON.stringify(idea), { status: 200 });


    }   catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}