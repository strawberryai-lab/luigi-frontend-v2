import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Get the current job with full data
    const currentJob = await prisma.jobs_v3.findUnique({
      where: { id },
    });

    if (!currentJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Find the prev (newer) job
    const prev = await prisma.jobs_v3.findFirst({
      where: {
        status: "completed",
        createdAt: {
          gt: currentJob.createdAt,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    // Find the next (older) job
    const next = await prisma.jobs_v3.findFirst({
      where: {
        status: "completed",
        createdAt: {
          lt: currentJob.createdAt,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      current: currentJob,
      prev: prev || null,
      next: next || null,
    });
  } catch (error) {
    console.error("Error fetching pagination data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
