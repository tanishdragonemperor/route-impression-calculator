import { Market, Campaign, Route } from './types';

export const sampleMarkets: Market[] = [
  { marketId: 'LA', impressionsPerMinute: 1200 },
  { marketId: 'NYC', impressionsPerMinute: 1500 },
];

export const sampleCampaigns: Campaign[] = [
  {
    campaignId: 'camp_001',
    marketId: 'LA',
    geofence: { minLon: -118.5, maxLon: -118.2, minLat: 34.0, maxLat: 34.2 },
  },
  {
    campaignId: 'camp_002',
    marketId: 'LA',
    geofence: { minLon: -118.3, maxLon: -118.1, minLat: 34.1, maxLat: 34.3 },
  },
  {
    campaignId: 'camp_003',
    marketId: 'NYC',
    geofence: { minLon: -74.1, maxLon: -73.9, minLat: 40.7, maxLat: 40.8 },
  },
];

export const sampleRoutes: Route[] = [
  {
    routeId: 'route_001',
    campaignId: 'camp_001',
    pings: [
      { timestamp: '2025-01-15T10:00:00Z', lon: -118.25, lat: 34.05 },
      { timestamp: '2025-01-15T10:02:30Z', lon: -118.30, lat: 34.10 },
      { timestamp: '2025-01-15T10:05:00Z', lon: -118.35, lat: 34.15 },
    ],
  },
  {
    routeId: 'route_002',
    campaignId: 'camp_001',
    pings: [
      { timestamp: '2025-01-15T11:00:00Z', lon: -118.6, lat: 34.1 },
      { timestamp: '2025-01-15T11:01:00Z', lon: -118.4, lat: 34.1 },
      { timestamp: '2025-01-15T11:02:00Z', lon: -118.3, lat: 34.1 },
      { timestamp: '2025-01-15T11:03:00Z', lon: -118.1, lat: 34.1 },
    ],
  },
  {
    routeId: 'route_003',
    campaignId: 'camp_002',
    pings: [
      { timestamp: '2025-01-15T12:00:00Z', lon: -118.25, lat: 34.15 },
      { timestamp: '2025-01-15T12:01:00Z', lon: -118.20, lat: 34.20 },
      { timestamp: '2025-01-15T12:02:00Z', lon: -118.15, lat: 34.25 },
    ],
  },
  {
    routeId: 'route_004',
    campaignId: 'camp_003',
    pings: [
      { timestamp: '2025-01-15T13:00:00Z', lon: -74.0, lat: 40.75 },
      { timestamp: '2025-01-15T13:01:00Z', lon: -73.95, lat: 40.76 },
      { timestamp: '2025-01-15T13:02:00Z', lon: -73.92, lat: 40.77 },
    ],
  },
];