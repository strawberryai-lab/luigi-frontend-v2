import { StatsCard } from "@/components/stats/stats-card";
import { Header } from "@/components/layout/header";
import { Separator } from "@/components/ui/separator";
import { SlidingTickers } from "@/components/tickers/sliding-tickers";
import { NarrativesChart } from "@/components/charts/narratives-chart";
import { ReasoningBlock } from "@/components/reasoning/reasoning-block";
import {
  getPostsCount,
  getNarratives,
  getFirstJob,
  getAllJobsThoughts,
  countAllTickers,
  getTickers,
} from "./utils/queries";
import {
  ChartNoAxesColumnIncreasing,
  FileChartPie,
  Flame,
  Sparkles,
} from "lucide-react";
import CookieConsent from "@/components/ui/cookie-consent";

export default async function Home() {
  const [
    postsCount,
    narratives,
    firstJob,
    totalThoughts,
    numberOfTickers,
    tickers,
  ] = await Promise.all([
    getPostsCount(),
    getNarratives(),
    getFirstJob(),
    getAllJobsThoughts(),
    countAllTickers(),
    getTickers(),
  ]);

  const narrativesCount = narratives.length;
  const sinceDate = firstJob
    ? firstJob.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  return (
    <main>
      <Header />
      <div className="pt-24 px-6">
        <div className="container mx-auto">
          <div className="items-stretch flex flex-col gap-2 sm:grid sm:grid-cols-2 md:grid-cols-4 items-center justify-center gap-4 w-full">
            <StatsCard
              title="Posts scraped"
              description="Since 01/01/25"
              value={postsCount}
              icon={<FileChartPie className="w-6 h-6" />}
            />
            <StatsCard
              title="Analyzed Narratives"
              description="Last 24 hours"
              value={narrativesCount}
              icon={<Flame className="w-6 h-6" />}
            />
            <StatsCard
              title="Thoughts Generated"
              description={`Since ${sinceDate}`}
              value={totalThoughts}
              icon={<Sparkles className="w-6 h-6" />}
            />
            <StatsCard
              title="Analyzed Tickers"
              description={`Since inception`}
              value={numberOfTickers}
              icon={<ChartNoAxesColumnIncreasing className="w-6 h-6" />}
            />
          </div>
          <Separator className="mt-6 mb-6" />
          <div className="">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl">Watchlist</h2>
                <p className="text-muted-foreground">
                  Tickers monitored by Luigi in Real-Time
                </p>
                <SlidingTickers>
                  {/** @ts-ignore */}
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
                <p className="text-muted-foreground">
                  Mindshare of narratives tracked by Luigi across social medias
                </p>
                <SlidingTickers>
                  {narratives.map((narrative: any) => (
                    <div
                      key={narrative.narrative}
                      className="px-4 flex items-center gap-2"
                    >
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {narrative.narrative}
                      </code>
                      <span
                        className={`text-xs font-medium ${
                          narrative["24h_change_pct"] > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {narrative["24h_change_pct"] > 0 ? "↑" : "↓"}
                        {Math.abs(narrative["24h_change_pct"]).toFixed(2)}%
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
            <ReasoningBlock />
          </div>
          <Separator className="mt-6 mb-6" />
        </div>
      </div>
      <CookieConsent />
    </main>
  );
}
