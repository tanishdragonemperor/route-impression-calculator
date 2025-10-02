import { z } from 'zod';

export const GeofenceSchema = z.object({
  minLon: z.number(),
  maxLon: z.number(),
  minLat: z.number(),
  maxLat: z.number(),
});

export const MarketSchema = z.object({
  marketId: z.string(),
  impressionsPerMinute: z.number().positive(),
});

export const CampaignSchema = z.object({
  campaignId: z.string(),
  marketId: z.string(),
  geofence: GeofenceSchema,
});

export const PingSchema = z.object({
  timestamp: z.string().datetime(),
  lon: z.number(),
  lat: z.number(),
});

export const RouteSchema = z.object({
  routeId: z.string(),
  campaignId: z.string(),
  pings: z.array(PingSchema),
});

export const OptionsSchema = z.object({
  returnIntervals: z.boolean().optional(),
}).optional();

export const CalculateRequestSchema = z.object({
  markets: z.array(MarketSchema),
  campaigns: z.array(CampaignSchema),
  routes: z.array(RouteSchema),
  options: OptionsSchema,
});

export const IntervalSchema = z.object({
  start: z.string(),
  end: z.string(),
  seconds: z.number(),
  insideFraction: z.number(),
});

export const RouteResultSchema = z.object({
  routeId: z.string(),
  secondsInside: z.number(),
  impressions: z.number(),
  entries: z.number(),
  exits: z.number(),
  intervals: z.array(IntervalSchema).optional(),
});

export const CampaignResultSchema = z.object({
  campaignId: z.string(),
  marketId: z.string(),
  impressionsPerMinute: z.number(),
  totalSecondsInside: z.number(),
  totalImpressions: z.number(),
  routes: z.array(RouteResultSchema),
});

export const SummarySchema = z.object({
  totalImpressions: z.number(),
  totalSecondsInside: z.number(),
  routeCount: z.number(),
  campaignCount: z.number(),
});

export const CalculateResponseSchema = z.object({
  summary: SummarySchema,
  campaigns: z.array(CampaignResultSchema),
  assumptions: z.array(z.string()),
  limitations: z.array(z.string()),
});

export type Geofence = z.infer<typeof GeofenceSchema>;
export type Market = z.infer<typeof MarketSchema>;
export type Campaign = z.infer<typeof CampaignSchema>;
export type Ping = z.infer<typeof PingSchema>;
export type Route = z.infer<typeof RouteSchema>;
export type CalculateRequest = z.infer<typeof CalculateRequestSchema>;
export type Interval = z.infer<typeof IntervalSchema>;
export type RouteResult = z.infer<typeof RouteResultSchema>;
export type CampaignResult = z.infer<typeof CampaignResultSchema>;
export type Summary = z.infer<typeof SummarySchema>;
export type CalculateResponse = z.infer<typeof CalculateResponseSchema>;