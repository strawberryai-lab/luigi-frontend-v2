import { MDXRemote } from "@mintlify/mdx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReasoningLogsProps {
    mainReasoning: string;
    rewrittenThoughts: {
        thought: string;
        ticker: string;
    }[];
    updatedAt: string;
}

export function ReasoningLogs({ mainReasoning, rewrittenThoughts, updatedAt }: ReasoningLogsProps) {
    // @ts-expect-error - TS2322: Type 'string[]' is not assignable to type 'string'.
    const uniqueTickers = [...new Set(rewrittenThoughts.map(t => t.ticker))];
    const formattedDate = new Date(updatedAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Reasoning Logs</span>
                    <span className="text-sm text-muted-foreground font-normal">
                        {formattedDate}
                    </span>
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                    {uniqueTickers.map(ticker => (
                        <code key={ticker} className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                            ${ticker}
                        </code>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                    <style>
                    {`
                    [data-radix-scroll-area-viewport] div {
                        display:block !important;
                    }
                    `}
                    </style>
                    <div className="prose dark:prose-invert max-w-none">
                        <MDXRemote source={mainReasoning} parseFrontmatter />          </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}