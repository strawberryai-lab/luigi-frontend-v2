import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const lastJob = await prisma.jobs_v3.findFirst({
      where: {
        status: "completed",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!lastJob) {
      return NextResponse.json(
        { error: "No completed jobs found" },
        { status: 404 }
      );
    }

    return NextResponse.json(lastJob);
  } catch (error) {
    console.error("Error fetching last job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
