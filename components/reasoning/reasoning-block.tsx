"use client";

import { ReasoningLogs } from "./reasoning-logs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface JobData {
  id: string;
  result: {
    mainReasoning: string;
    rewrittenThoughts: {
      thought: string;
      ticker: string;
    }[];
  };
  updatedAt: string;
}

interface PaginationData {
  current: JobData;
  prev: { id: string; createdAt: string } | null;
  next: { id: string; createdAt: string } | null;
}

async function fetchLastJob() {
  const response = await fetch("/api/reasoning/last", {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch last job");
  const data = await response.json();
  if (!data?.result?.mainReasoning || !data?.result?.rewrittenThoughts) {
    throw new Error("Invalid job data structure");
  }
  return data;
}

async function fetchJobWithPagination(jobId: string) {
  const response = await fetch(`/api/reasoning/${jobId}/pagination`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch job");
  const data = await response.json();
  if (
    !data?.current?.result?.mainReasoning ||
    !data?.current?.result?.rewrittenThoughts
  ) {
    throw new Error("Invalid job data structure");
  }
  return data;
}

function SkeletonReasoningLogs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reasoning Logs</span>
          <Skeleton className="h-4 w-32" />
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[92%]" />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function ReasoningBlockContent() {
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  // Fetch last job if no current job is selected
  const lastJobQuery = useQuery({
    queryKey: ["lastJob"],
    queryFn: fetchLastJob,
    enabled: !currentJobId,
    retry: 1,
  });

  // Fetch current job with pagination data
  const paginationQuery = useQuery({
    queryKey: ["jobPagination", currentJobId],
    queryFn: () => fetchJobWithPagination(currentJobId!),
    enabled: !!currentJobId,
    retry: 1,
  });

  // Handle initial load of last job's pagination
  const lastJobPaginationQuery = useQuery({
    queryKey: ["jobPagination", lastJobQuery.data?.id],
    queryFn: () => fetchJobWithPagination(lastJobQuery.data!.id),
    enabled: !!lastJobQuery.data?.id && !currentJobId,
    retry: 1,
  });

  // Determine which data to use
  const currentData = currentJobId
    ? paginationQuery.data?.current
    : lastJobQuery.data;
  const paginationData = currentJobId ? paginationQuery.data : null;
  const isLoading = lastJobQuery.isLoading || paginationQuery.isLoading;
  const error = lastJobQuery.error || paginationQuery.error;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonReasoningLogs />
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="pointer-events-none opacity-50"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="pointer-events-none opacity-50"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        Error loading reasoning data:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (!currentData || !currentData.result) {
    return <div></div>;
  }

  const handlePrevClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const prevId = (currentJobId ? paginationData : lastJobPaginationQuery.data)
      ?.prev?.id;
    if (prevId) {
      setCurrentJobId(prevId);
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextId = (currentJobId ? paginationData : lastJobPaginationQuery.data)
      ?.next?.id;
    if (nextId) {
      setCurrentJobId(nextId);
    }
  };

  const activePaginationData = currentJobId
    ? paginationData
    : lastJobPaginationQuery.data;

  return (
    <div className="space-y-4">
      <ReasoningLogs
        mainReasoning={currentData.result.mainReasoning}
        rewrittenThoughts={currentData.result.rewrittenThoughts}
        updatedAt={currentData.updatedAt}
      />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={`text-muted-foreground ${
                !activePaginationData?.prev
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
              onClick={handlePrevClick}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              className={`text-muted-foreground ${
                !activePaginationData?.next
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
              onClick={handleNextClick}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

// Create a new QueryClient instance for this component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Export the wrapped component with its own QueryClientProvider
export function ReasoningBlock() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReasoningBlockContent />
    </QueryClientProvider>
  );
}
