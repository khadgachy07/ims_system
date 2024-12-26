import { AppDataSource, initializeDatabase } from "@/db/data-source";
import { Role } from "@/entity/enum";
import { Idea } from "@/entity/ideas";
import { Submission } from "@/entity/submission";
import { User } from "@/entity/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Parse the user from request headers
    const userHeader = req.headers.get("user");
    if (!userHeader) {
      return new NextResponse("Unauthorized: Missing user header", {
        status: 401,
      });
    }

    const user = JSON.parse(userHeader);
    if (user.role !== Role.EMPLOYEE) {
      return new NextResponse("Forbidden: Insufficient role", { status: 403 });
    }

    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
    }
    console.log("User:", user.userId);

    // Parse and validate input
    const { title, description } = await req.json();
    if (
      !title ||
      typeof title !== "string" ||
      !description ||
      typeof description !== "string"
    ) {
      return new NextResponse(
        "Invalid input: Title and description are required",
        { status: 400 }
      );
    }

    // Create a new idea
    const idea = new Idea();
    idea.title = title;
    idea.description = description;

    const userRepository = AppDataSource.getRepository(User);
    const foundUser = await userRepository.findOneBy({ id: user.userId });
    if (!foundUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Resolving the Promise
    idea.submittedBy = foundUser;

    const ideaRepository = AppDataSource.getRepository(Idea);
    await ideaRepository.save(idea);

    const submissionRepository = AppDataSource.getRepository(Submission);
    const submission = new Submission();
    submission.idea = idea;
    submission.offlineStatus = false;
    submission.syncStatus = false;
    submission.submittedBy = foundUser;
    await submissionRepository.save(submission);

    return new NextResponse(JSON.stringify({
      message: "Idea created successfully",
      idea: idea,
    }), { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/ideas:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userHeader = req.headers.get("user");
    if (!userHeader) {
      return new NextResponse("Unauthorized: Missing user header", {
        status: 401,
      });
    }

    let user;
    try {
      user = JSON.parse(userHeader);
    } catch (error) {
      return new NextResponse("Unauthorized: Invalid user header: ", {
        status: 401,
      });
    }

    if (!user || typeof user !== "object") {
      return new NextResponse("Unauthorized: User not recognized", {
        status: 401,
      });
    }

    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
    }

    const ideaRepository = AppDataSource.getRepository(Idea);
    const ideas = await ideaRepository.find({
      order: {
        votes: "DESC",
      }
    });

    return new NextResponse(JSON.stringify(ideas), { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/ideas:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
