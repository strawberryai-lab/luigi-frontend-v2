import prisma from "@/lib/prisma";

export async function countAllTickers() {
  // @ts-ignore
  const result = (await prisma.twitter_sentiment.aggregateRaw({
    pipeline: [
      { $unwind: "$narratives" },
      { $unwind: "$narratives.detectedTickers" },
      {
        $group: {
          _id: null,
          totalTickers: { $sum: 1 },
        },
      },
    ],
  })) as { totalTickers: number }[];
  const totalTickers = result[0]?.totalTickers || 0;
  return totalTickers;
}

export async function getPostsCount() {
  return await prisma.twitter_posts.count({
    where: {
      created_at: {
        gte: new Date("2025-01-01"),
      },
    },
  });
}

export async function getNarratives() {
  const response = await fetch(
    "https://luigi-bigdata.usestrawberry.ai/narratives",
    {
      cache: "no-store",
    }
  );
  return response.json();
}

export async function getFirstJob() {
  return await prisma.jobs_v3.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });
}

export async function getAllJobsThoughts() {
  const allJobs = await prisma.jobs_v3.findMany({
    where: {
      status: "completed",
    },
    select: {
      result: true,
    },
  });

  return allJobs.reduce((sum: number, job) => {
    const thoughtsLength =
      job.result &&
      typeof job.result === "object" &&
      Array.isArray(job.result.thoughts)
        ? job.result.thoughts.length
        : 0;
    return sum + thoughtsLength;
  }, 0);
}

export async function getTickers() {
  const response = await fetch(
    "https://luigi-bigdata.usestrawberry.ai/tickers?hours=18&limit=100",
    {
      cache: "no-store",
    }
  );
  return response.json();
}

export async function getLastJob() {
  const response = await fetch(
    "https://luigi-reasoning.usestrawberry.ai/last_job",
    {
      cache: "no-store",
    }
  );
  return response.json();
}
