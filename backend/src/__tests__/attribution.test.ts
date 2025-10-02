import { describe, it, expect } from 'vitest';
import { calculateTimeAttribution } from '../calc/attribution';
import { Ping, Geofence } from '../schemas';

describe('Time attribution', () => {
  const geofence: Geofence = {
    minLon: -118.5,
    maxLon: -118.2,
    minLat: 34.0,
    maxLat: 34.2,
  };

  it('should handle empty ping array', () => {
    const result = calculateTimeAttribution([], geofence);
    expect(result.totalSecondsInside).toBe(0);
    expect(result.entries).toBe(0);
    expect(result.exits).toBe(0);
  });

  it('should handle single ping', () => {
    const pings: Ping[] = [
      { timestamp: '2025-01-15T10:00:00Z', lon: -118.3, lat: 34.1 },
    ];
    const result = calculateTimeAttribution(pings, geofence);
    expect(result.totalSecondsInside).toBe(0);
    expect(result.entries).toBe(0);
    expect(result.exits).toBe(0);
  });

  it('should calculate time for route entirely inside geofence', () => {
    const pings: Ping[] = [
      { timestamp: '2025-01-15T10:00:00Z', lon: -118.4, lat: 34.1 },
      { timestamp: '2025-01-15T10:02:00Z', lon: -118.3, lat: 34.15 },
    ];
    const result = calculateTimeAttribution(pings, geofence);
    expect(result.totalSecondsInside).toBe(120); // 2 minutes
    expect(result.intervals).toHaveLength(1);
    expect(result.intervals[0].insideFraction).toBeCloseTo(1.0);
  });

  it('should calculate time for route entirely outside geofence', () => {
    const pings: Ping[] = [
      { timestamp: '2025-01-15T10:00:00Z', lon: -119.0, lat: 34.5 },
      { timestamp: '2025-01-15T10:02:00Z', lon: -118.9, lat: 34.6 },
    ];
    const result = calculateTimeAttribution(pings, geofence);
    expect(result.totalSecondsInside).toBe(0);
    expect(result.intervals[0].insideFraction).toBeCloseTo(0.0);
  });

  it('should handle route crossing geofence boundary', () => {
    const pings: Ping[] = [
      { timestamp: '2025-01-15T10:00:00Z', lon: -118.7, lat: 34.1 },
      { timestamp: '2025-01-15T10:02:00Z', lon: -118.1, lat: 34.1 },
    ];
    const result = calculateTimeAttribution(pings, geofence);
    expect(result.totalSecondsInside).toBeGreaterThan(0);
    expect(result.totalSecondsInside).toBeLessThan(120);
    expect(result.intervals[0].insideFraction).toBeGreaterThan(0);
    expect(result.intervals[0].insideFraction).toBeLessThan(1);
  });

  it('should sort out-of-order timestamps', () => {
    const pings: Ping[] = [
      { timestamp: '2025-01-15T10:02:00Z', lon: -118.3, lat: 34.15 },
      { timestamp: '2025-01-15T10:00:00Z', lon: -118.4, lat: 34.1 },
    ];
    const result = calculateTimeAttribution(pings, geofence);
    expect(result.totalSecondsInside).toBe(120);
    expect(result.intervals[0].start).toBe('2025-01-15T10:00:00Z');
    expect(result.intervals[0].end).toBe('2025-01-15T10:02:00Z');
  });
});