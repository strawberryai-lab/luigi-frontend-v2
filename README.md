# Luigi Frontend V2 API Documentation

## Reasoning Endpoints

### Get Job by ID

```http
GET /api/reasoning/:id
```

Fetches a specific job by its ID.

**Response**

- `200 OK`: Returns the complete job object
- `404 Not Found`: If job doesn't exist
- `500 Internal Server Error`: If there's a server error

### Get Jobs Count

```http
GET /api/reasoning/count
```

Returns the total count of completed jobs.

**Response**

```json
{
  "count": number
}
```

- `200 OK`: Returns the count object
- `500 Internal Server Error`: If there's a server error

### Get Job Pagination

```http
GET /api/reasoning/:id/pagination
```

Fetches the current job along with references to the next and previous jobs (by creation date).

**Response**

```json
{
  "current": JobObject,
  "prev": {
    "id": string,
    "createdAt": Date
  } | null,
  "next": {
    "id": string,
    "createdAt": Date
  } | null
}
```

- `200 OK`: Returns the pagination object
- `404 Not Found`: If current job doesn't exist
- `500 Internal Server Error`: If there's a server error

### Get Last Completed Job

```http
GET /api/reasoning/last
```

Fetches the most recent completed job.

**Response**

- `200 OK`: Returns the complete job object
- `404 Not Found`: If no completed jobs exist
- `500 Internal Server Error`: If there's a server error

## Job Object Structure

```typescript
{
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  result: {
    finalReasoning?: string;
    mainReasoning?: string;
    posts: string[];
    reason: {
      reason?: string;
      ticker?: string;
    }[];
    rewrittenThoughts: {
      thought?: string;
      ticker?: string;
    }[];
    thoughts: {
      thought?: string;
      ticker?: string;
    }[];
    topPicks: {
      mentionsAcceleration?: number;
      mentionsScore?: number | float;
      rank?: number;
      rank_hourly_pct_change?: number;
      sentimentAcceleration?: number | float;
      sentimentScore?: number | float;
      ticker?: string;
      trend: {
        hourlyTimeFrame?: string;
        mentionsAcceleration?: number;
        mentionsScore?: number | float;
        sentimentAcceleration?: number | float;
        sentimentScore?: number | float;
        smoothedMindshare?: number;
      }[];
    }[];
    topPicksMetadata: {
      ticker?: string;
      metadata?: {
        buy_now_score?: number;
        can_it_moon?: boolean;
        confident_on_next_24hours?: number;
        is_low_market_cap_token?: boolean;
        long_term_bullish?: boolean;
        reasons?: string[];
      };
    }[];
  };
  webhook?: any;
}
```
