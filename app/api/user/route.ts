import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    
    // Fetch all users
    const users = await prisma.users.findMany();

    // Return all users
    return NextResponse.json(users);
  }
}
