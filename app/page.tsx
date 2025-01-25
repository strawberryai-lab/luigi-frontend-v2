import { StatsCard } from "@/components/stats/stats-card";
import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import { Separator } from "@/components/ui/separator";
import { SlidingTickers } from "@/components/tickers/sliding-tickers";
import { NarrativesChart } from "@/components/charts/narratives-chart";
import { ReasoningLogs } from "@/components/reasoning/reasoning-logs";

const formatter = new Intl.NumberFormat('en', { notation: 'compact' });

interface TickerData {
  ticker: string;
  rank: number;
  rank_hourly_pct_change: number;
  sentimentScore: number;
  mentionsScore: number;
  mentionsAcceleration: number;
  sentimentAcceleration: number;
}

interface NarrativeData {
  narrative: string;
  historicalRank: {
    datetime: string;
    rank: number;
  }[];
  "24h_change_pct": number;
}

// Add this interface with the other interfaces
interface LastJobData {
  _id: string;
  status: string;
  webhook: null;
  createdAt: string;
  updatedAt: string;
  result: {
    mainReasoning: string;
    rewrittenThoughts: {
      thought: string;
      ticker: string;
    }[]
  };
}

export default async function Home() {
  const postsCount = await prisma.twitter_posts.count({
    where: {
      created_at: {
        gte: new Date('2025-01-01')
      }
    }
  });

  const narrativesResponse = await fetch('https://luigi-bigdata.usestrawberry.ai/narratives', {
    next: { revalidate: 3600 }
  });
  const narratives = await narrativesResponse.json();
  const narrativesCount = narratives.length;

  // Get the earliest job and total thoughts count
  const firstJob = await prisma.jobs_v3.findFirst({
    orderBy: {
      createdAt: 'asc'
    }
  });

  const allJobs = await prisma.jobs_v3.findMany({
    select: {
      result: true
    }
  });

  // Calculate total thoughts by summing up the thoughts array length from each job
  const totalThoughts = allJobs.reduce((sum, job) => {
    return sum + (job.result?.thoughts?.length || 0);
  }, 0);

  const formattedCount = formatter.format(postsCount);
  const formattedNarrativesCount = formatter.format(narrativesCount);
  const formattedThoughtsCount = formatter.format(totalThoughts);

  const sinceDate = firstJob ? firstJob.createdAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'N/A';

  const tickersResponse = await fetch('https://luigi-bigdata.usestrawberry.ai/tickers?hours=18&limit=100', {
    next: { revalidate: 300 } // Revalidate every 5 minutes
  });
  const tickers: TickerData[] = await tickersResponse.json();

  const lastJobResponse = await fetch('https://luigi-reasoning.usestrawberry.ai/last_job', {
    next: { revalidate: 300 } // Revalidate every 5 minutes
  });
  const lastJob: LastJobData = await lastJobResponse.json();

  return (
    <main>
      <Header />
      <div className="pt-24 px-6">
        <div className="container mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 items-center justify-center gap-4 w-full">
            <StatsCard title="Posts scraped" description="Since 01/01/25">
              <h1 className="text-2xl">{formattedCount}</h1>
            </StatsCard>
            <StatsCard title="Analyzed narratives" description="Last 24 hours">
              <h1 className="text-2xl">{formattedNarrativesCount}</h1>
            </StatsCard>
            <StatsCard title="Thoughts Generated" description={`Since ${sinceDate}`}>
              <h1 className="text-2xl">{formattedThoughtsCount}</h1>
            </StatsCard>
            <StatsCard title="Monitored Tickers" description={`In Watchlist`}>
              <h1 className="text-2xl">{formatter.format(tickers.length)}</h1>
            </StatsCard>
          </div>
          <Separator className="mt-6 mb-6" />
          <div className="">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl">Watchlist</h2>
                <p className="text-muted-foreground">Tickers monitored by Luigi in Real-Time</p>
                <SlidingTickers>
                  {tickers.map((ticker) => (
                    <div key={ticker.ticker} className="px-4">
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        ${ticker.ticker}
                      </code>
                    </div>
                  ))}
                </SlidingTickers>
              </div>
              <Separator />
              <div>
                <h2 className="text-2xl">Narratives</h2>
                <p className="text-muted-foreground">Mindshare of narratives tracked by Luigi across social medias</p>
                <SlidingTickers>
                  {narratives.map((narrative: NarrativeData) => (
                    <div key={narrative.narrative} className="px-4 flex items-center gap-2">
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {narrative.narrative}
                      </code>
                      <span className={`text-xs font-medium ${
                        narrative['24h_change_pct'] > 0 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {narrative['24h_change_pct'] > 0 ? '↑' : '↓'}
                        {Math.abs(narrative['24h_change_pct']).toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </SlidingTickers>
                <NarrativesChart narratives={narratives} />
              </div>
            </div>
          </div>
          <Separator className="mt-6 mb-6" />
          <div>
            <ReasoningLogs 
              mainReasoning={lastJob.result.mainReasoning}
              rewrittenThoughts={lastJob.result.rewrittenThoughts}
              updatedAt={lastJob.updatedAt}
            />
          </div>
          <Separator className="mt-6 mb-6" />
        </div>
      </div>
    </main>
  );
}
