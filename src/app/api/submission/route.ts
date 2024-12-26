import { AppDataSource, initializeDatabase } from "@/db/data-source";
import { Submission } from "@/entity/submission";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
         const userHeader = req.headers.get("user");
            if (!userHeader) {
              return new NextResponse("Unauthorized: Missing user header", {
                status: 401,
              });
            }
        
        
            // Initialize database connection
            if (!AppDataSource.isInitialized) {
              await initializeDatabase();
            }

            const submissionRepository = AppDataSource.getRepository(Submission);
            const submissions = await submissionRepository.find({
              where : {
                offlineStatus: true,
                syncStatus: true
              }
            });
            return NextResponse.json(submissions, { status: 200 });
    }
    catch  {
        return NextResponse.json("Error getting submission", { status: 500 });
    }
} 