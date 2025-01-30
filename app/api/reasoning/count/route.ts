import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.jobs_v3.count({
      where: {
        status: "completed", // Only counting completed jobs as per the pattern in getAllJobsThoughts
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting jobs count:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
