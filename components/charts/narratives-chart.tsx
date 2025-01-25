"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface NarrativeChartProps {
  narratives: {
    narrative: string;
    historicalRank: { datetime: string; rank: number; }[];
    "24h_change_pct": number;
  }[];
}

const chartConfig = {
  rank: {
    label: "Mindshare",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function NarrativesChart({ narratives }: NarrativeChartProps) {
  const chartData = narratives
    .sort((a, b) => {
      const lastRankA = a.historicalRank[a.historicalRank.length - 1]?.rank || 0;
      const lastRankB = b.historicalRank[b.historicalRank.length - 1]?.rank || 0;
      return lastRankB - lastRankA;
    })
    .slice(0, 10)
    .map(item => ({
      narrative: item.narrative,
      rank: (item.historicalRank[item.historicalRank.length - 1]?.rank || 0) * 100,
      change: item["24h_change_pct"]
    }));

  return (
        <ChartContainer config={chartConfig} className="p-2">
          <BarChart
            data={chartData}
            layout="vertical"
            barGap={1}
            barCategoryGap={1}
          >
            <YAxis
              dataKey="narrative"
              type="category"
              tickLine={false}
              tickMargin={0}
              axisLine={false}
              width={60}
              height={10}
              spacing={2}
              tickSize={10}
              padding={{
                top: 0,
                bottom: 0
              }}
              minTickGap={0}
            />
            <XAxis 
              type="number" 
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              tickSize={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar 
              dataKey="rank" 
              fill="hsl(var(--berry))" 
              radius={[4, 6, 6, 4]}
              barSize={10}
            />
          </BarChart>
        </ChartContainer>
  )
}