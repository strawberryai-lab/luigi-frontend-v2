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