import { Market, Campaign, Route, RouteResult, CampaignResult } from '../schemas';
import { calculateTimeAttribution } from './attribution';

export function calculateImpressions(
  markets: Market[],
  campaigns: Campaign[],
  routes: Route[],
  returnIntervals = false
): CampaignResult[] {
  const marketMap = new Map(markets.map(m => [m.marketId, m]));
  const campaignMap = new Map(campaigns.map(c => [c.campaignId, c]));
  
  const campaignResults: CampaignResult[] = campaigns.map(campaign => {
    const market = marketMap.get(campaign.marketId);
    if (!market) {
      throw new Error(`Market ${campaign.marketId} not found for campaign ${campaign.campaignId}`);
    }

    const campaignRoutes = routes.filter(r => r.campaignId === campaign.campaignId);
    const routeResults: RouteResult[] = [];

    let totalSecondsInside = 0;
    let totalImpressions = 0;

    for (const route of campaignRoutes) {
      const attribution = calculateTimeAttribution(route.pings, campaign.geofence);
      const impressions = Math.round(attribution.totalSecondsInside * (market.impressionsPerMinute / 60));

      const routeResult: RouteResult = {
        routeId: route.routeId,
        secondsInside: attribution.totalSecondsInside,
        impressions,
        entries: attribution.entries,
        exits: attribution.exits,
        ...(returnIntervals && { intervals: attribution.intervals }),
      };

      routeResults.push(routeResult);
      totalSecondsInside += attribution.totalSecondsInside;
      totalImpressions += impressions;
    }

    return {
      campaignId: campaign.campaignId,
      marketId: campaign.marketId,
      impressionsPerMinute: market.impressionsPerMinute,
      totalSecondsInside,
      totalImpressions,
      routes: routeResults,
    };
  });

  return campaignResults;
}

export function validateReferences(markets: Market[], campaigns: Campaign[], routes: Route[]): string[] {
  const warnings: string[] = [];
  const marketIds = new Set(markets.map(m => m.marketId));
  const campaignIds = new Set(campaigns.map(c => c.campaignId));

  for (const campaign of campaigns) {
    if (!marketIds.has(campaign.marketId)) {
      throw new Error(`Campaign ${campaign.campaignId} references non-existent market ${campaign.marketId}`);
    }
  }

  for (const route of routes) {
    if (!campaignIds.has(route.campaignId)) {
      throw new Error(`Route ${route.routeId} references non-existent campaign ${route.campaignId}`);
    }
    
    if (route.pings.length < 2) {
      warnings.push(`Route ${route.routeId} has fewer than 2 pings - no time intervals to calculate`);
    }

    const timestamps = route.pings.map(p => new Date(p.timestamp).getTime());
    const sortedTimestamps = [...timestamps].sort((a, b) => a - b);
    if (!timestamps.every((t, i) => t === sortedTimestamps[i])) {
      warnings.push(`Route ${route.routeId} has out-of-order timestamps - they will be sorted automatically`);
    }
  }

  return warnings;
}