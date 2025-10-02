import { describe, it, expect } from 'vitest';
import { isInsideRectangle } from '../geometry/rectangle';
import { clipSegmentToRectangle } from '../geometry/segmentClip';
import { Geofence } from '../schemas';

describe('Rectangle geometry', () => {
  const geofence: Geofence = {
    minLon: -118.5,
    maxLon: -118.2,
    minLat: 34.0,
    maxLat: 34.2,
  };

  describe('isInsideRectangle', () => {
    it('should return true for points inside rectangle', () => {
      expect(isInsideRectangle(-118.3, 34.1, geofence)).toBe(true);
      expect(isInsideRectangle(-118.25, 34.05, geofence)).toBe(true);
    });

    it('should return false for points outside rectangle', () => {
      expect(isInsideRectangle(-118.6, 34.1, geofence)).toBe(false);
      expect(isInsideRectangle(-118.3, 33.9, geofence)).toBe(false);
    });

    it('should return true for points on rectangle boundary', () => {
      expect(isInsideRectangle(-118.5, 34.0, geofence)).toBe(true);
      expect(isInsideRectangle(-118.2, 34.2, geofence)).toBe(true);
    });
  });

  describe('clipSegmentToRectangle', () => {
    it('should return full segment when entirely inside', () => {
      const result = clipSegmentToRectangle(-118.4, 34.1, -118.3, 34.15, geofence);
      expect(result.insideFraction).toBeCloseTo(1.0);
      expect(result.tEnter).toBeCloseTo(0.0);
      expect(result.tExit).toBeCloseTo(1.0);
    });

    it('should return zero when entirely outside', () => {
      const result = clipSegmentToRectangle(-119.0, 34.5, -118.8, 34.6, geofence);
      expect(result.insideFraction).toBeCloseTo(0.0);
    });

    it('should return partial segment when crossing boundary', () => {
      const result = clipSegmentToRectangle(-118.6, 34.1, -118.1, 34.1, geofence);
      expect(result.insideFraction).toBeGreaterThan(0);
      expect(result.insideFraction).toBeLessThan(1);
    });

    it('should handle segment starting outside and ending inside', () => {
      const result = clipSegmentToRectangle(-118.7, 34.1, -118.3, 34.1, geofence);
      expect(result.insideFraction).toBeGreaterThan(0);
      expect(result.insideFraction).toBeLessThan(1);
      expect(result.tEnter).toBeGreaterThan(0);
      expect(result.tExit).toBeCloseTo(1.0);
    });
  });
});