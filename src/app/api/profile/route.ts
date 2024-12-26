import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
   const user = JSON.parse(req.headers.get("user") || '{}');
           if (!user || typeof user !== 'object') {
               return new NextResponse("Unauthorized", { status: 401 });
           }
    return NextResponse.json({user: user}, { status: 200 });
}