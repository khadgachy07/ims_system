import { AppDataSource } from "@/db/data-source";
import { Role } from "@/entity/enum";
import { Idea } from "@/entity/ideas";
import { User } from "@/entity/users";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: number } }) {
    try {
        const user = JSON.parse(req.headers.get("user") || "{}");

        // Validate user authentication
        if (!user || typeof user !== "object") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Validate user role
        if (user.role !== Role.EMPLOYEE) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const ideaId = Number(params.id);
        if (!ideaId) {
            return new NextResponse("Idea ID is required", { status: 400 });
        }

        // Initialize database connection
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const ideaRepository = AppDataSource.getRepository(Idea);
        const userRepository = AppDataSource.getRepository(User);

        // Find the user entity
        const userEntity = await userRepository.findOne({
            where: { id: user.userId },
        });
        if (!userEntity) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Find the idea entity
        const idea = await ideaRepository.findOne({
            where: { id: ideaId },
            relations: ["votedBy", "submittedBy"],
        });
        if (!idea) {
            return new NextResponse("Idea not found", { status: 404 });
        }

        // Prevent voting on own idea
        if (idea.submittedBy.id === userEntity.id) {
            return new NextResponse("You cannot vote for your own idea", { status: 400 });
        }

        // Prevent multiple votes
        const alreadyVoted = idea.votedBy.some((voter) => voter.id === userEntity.id);
        if (alreadyVoted) {
            return new NextResponse("You have already voted for this idea", { status: 400 });
        }

        // Add vote
        idea.votes += 1;
        idea.votedBy.push(userEntity);

        // Save updated idea
        await ideaRepository.save(idea);

        return new NextResponse(
            JSON.stringify({
                message: "Idea updated successfully",
                idea,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating idea:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}