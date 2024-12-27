import { NextRequest, NextResponse } from "next/server";
import { Role, Status } from "@/entity/enum";
import { Idea } from "@/entity/ideas";
import { Submission } from "@/entity/submission";
import { AppDataSource } from "@/db/data-source";

export async function PATCH(req: NextRequest) {
    try {
        const user = JSON.parse(req.headers.get("user") || '{}');
        if (!user || typeof user !== 'object') {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (user.role !== Role.INNOVATION_MANAGER) {
            return new NextResponse("Forbidden", { status: 403 });
        }
        const url = new URL(req.url);
        const id = url.pathname.split('/').pop();
        
        if (!id) { // Check for id within params
            return new NextResponse("Idea ID is required", { status: 400 });
        }

        // Make sure AppDataSource is initialized
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const ideaRepository = AppDataSource.getRepository(Idea);
        const idea = await ideaRepository.findOneBy({ id: +id });
        if (!idea) {
            return new NextResponse("Idea not found", { status: 404 });
        }

        const body = await req.json();
        const { status }: { status: Status } = body;
        idea.status = status;

        await ideaRepository.save(idea);

        const submissionRepository = AppDataSource.getRepository(Submission);
        const submission = await submissionRepository.findOneBy({ idea: { id: idea.id } });
        if (!submission) {
            return new NextResponse("Submission not found", { status: 404 });
        }

        submission.offlineStatus = true;
        submission.syncStatus = true;
        await submissionRepository.save(submission);

        return new NextResponse("Idea updated successfully", { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}