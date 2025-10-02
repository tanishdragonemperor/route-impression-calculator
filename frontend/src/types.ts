export interface Market {
  marketId: string;
  impressionsPerMinute: number;
}

export interface Geofence {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

export interface Campaign {
  campaignId: string;
  marketId: string;
  geofence: Geofence;
}

export interface Ping {
  timestamp: string;
  lon: number;
  lat: number;
}

export interface Route {
  routeId: string;
  campaignId: string;
  pings: Ping[];
}

export interface CalculateRequest {
  markets: Market[];
  campaigns: Campaign[];
  routes: Route[];
  options?: {
    returnIntervals?: boolean;
  };
}

export interface Interval {
  start: string;
  end: string;
  seconds: number;
  insideFraction: number;
}

export interface RouteResult {
  routeId: string;
  secondsInside: number;
  impressions: number;
  entries: number;
  exits: number;
  intervals?: Interval[];
}

export interface CampaignResult {
  campaignId: string;
  marketId: string;
  impressionsPerMinute: number;
  totalSecondsInside: number;
  totalImpressions: number;
  routes: RouteResult[];
}

export interface Summary {
  totalImpressions: number;
  totalSecondsInside: number;
  routeCount: number;
  campaignCount: number;
}

export interface CalculateResponse {
  summary: Summary;
  campaigns: CampaignResult[];
  assumptions: string[];
  limitations: string[];
}