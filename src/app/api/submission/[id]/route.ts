import { AppDataSource, initializeDatabase } from "@/db/data-source";
import { Submission } from "@/entity/submission";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const userHeader = req.headers.get("user");
    if (!userHeader) {
      return new NextResponse("Unauthorized: Missing user header", {
        status: 401,
      });
    }
    const param = await params;
    if (!AppDataSource.isInitialized) {
      await initializeDatabase();
    }
    const submissionRepository = AppDataSource.getRepository(Submission);
    const submission = await submissionRepository.findOneBy({ id: param.id });
    if (!submission) {
      return new NextResponse("Submission not found", { status: 404 });
    }
    return new NextResponse(JSON.stringify(submission), { status: 200 });
} catch (error) {
    console.error("Error in GET /api/submissions/:id:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }}