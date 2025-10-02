import { describe, it, expect } from 'vitest';
import { calculateImpressions, validateReferences } from '../calc/impressions';
import { Market, Campaign, Route } from '../schemas';

describe('Impressions calculation', () => {
  const markets: Market[] = [
    { marketId: 'LA', impressionsPerMinute: 1200 },
  ];

  const campaigns: Campaign[] = [
    {
      campaignId: 'camp_001',
      marketId: 'LA',
      geofence: { minLon: -118.5, maxLon: -118.2, minLat: 34.0, maxLat: 34.2 },
    },
  ];

  it('should calculate impressions for route entirely inside geofence', () => {
    const routes: Route[] = [
      {
        routeId: 'route_001',
        campaignId: 'camp_001',
        pings: [
          { timestamp: '2025-01-15T10:00:00Z', lon: -118.4, lat: 34.1 },
          { timestamp: '2025-01-15T10:02:00Z', lon: -118.3, lat: 34.15 },
        ],
      },
    ];

    const results = calculateImpressions(markets, campaigns, routes);
    expect(results).toHaveLength(1);
    expect(results[0].totalSecondsInside).toBe(120);
    expect(results[0].totalImpressions).toBe(2400); // 120 * (1200/60) = 2400
    expect(results[0].routes[0].impressions).toBe(2400);
  });

  it('should calculate zero impressions for route outside geofence', () => {
    const routes: Route[] = [
      {
        routeId: 'route_002',
        campaignId: 'camp_001',
        pings: [
          { timestamp: '2025-01-15T10:00:00Z', lon: -119.0, lat: 34.5 },
          { timestamp: '2025-01-15T10:02:00Z', lon: -118.9, lat: 34.6 },
        ],
      },
    ];

    const results = calculateImpressions(markets, campaigns, routes);
    expect(results[0].totalSecondsInside).toBe(0);
    expect(results[0].totalImpressions).toBe(0);
  });

  it('should validate market references', () => {
    const invalidCampaigns: Campaign[] = [
      {
        campaignId: 'camp_001',
        marketId: 'NYC', // non-existent market
        geofence: { minLon: -118.5, maxLon: -118.2, minLat: 34.0, maxLat: 34.2 },
      },
    ];

    expect(() => {
      validateReferences(markets, invalidCampaigns, []);
    }).toThrow('Campaign camp_001 references non-existent market NYC');
  });

  it('should validate campaign references', () => {
    const routes: Route[] = [
      {
        routeId: 'route_001',
        campaignId: 'invalid_campaign',
        pings: [],
      },
    ];

    expect(() => {
      validateReferences(markets, campaigns, routes);
    }).toThrow('Route route_001 references non-existent campaign invalid_campaign');
  });

  it('should warn about routes with insufficient pings', () => {
    const routes: Route[] = [
      {
        routeId: 'route_001',
        campaignId: 'camp_001',
        pings: [{ timestamp: '2025-01-15T10:00:00Z', lon: -118.4, lat: 34.1 }],
      },
    ];

    const warnings = validateReferences(markets, campaigns, routes);
    expect(warnings).toContain('Route route_001 has fewer than 2 pings - no time intervals to calculate');
  });
});