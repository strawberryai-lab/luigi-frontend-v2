import prisma from "@/lib/prisma";

export async function countAllTickers() {
    // @ts-ignore
    const result = await prisma.twitter_sentiment.aggregateRaw({
      pipeline: [
        { $unwind: "$narratives" },
        { $unwind: "$narratives.detectedTickers" },
        {
          $group: {
            _id: null,
            totalTickers: { $sum: 1 }
          }
        }
      ]
    });
    const totalTickers = result[0]?.totalTickers || 0;
    return totalTickers;
}

export async function getPostsCount() {
  return await prisma.twitter_posts.count({
    where: {
      created_at: {
        gte: new Date('2025-01-01')
      }
    }
  });
}

export async function getNarratives() {
  const response = await fetch('https://luigi-bigdata.usestrawberry.ai/narratives', {
    next: { revalidate: 3600 }
  });
  return response.json();
}

export async function getFirstJob() {
  return await prisma.jobs_v3.findFirst({
    orderBy: {
      createdAt: 'asc'
    }
  });
}

export async function getAllJobsThoughts() {
  const allJobs = await prisma.jobs_v3.findMany({
    select: {
      result: true
    }
  });

  return allJobs.reduce((sum: number, job) => {
    return sum + (job.result?.thoughts?.length || 0);
  }, 0);
}

export async function getTickers() {
  const response = await fetch('https://luigi-bigdata.usestrawberry.ai/tickers?hours=18&limit=100', {
    next: { revalidate: 300 }
  });
  return response.json();
}

export async function getLastJob() {
  const response = await fetch('https://luigi-reasoning.usestrawberry.ai/last_job', {
    next: { revalidate: 300 }
  });
  return response.json();
}