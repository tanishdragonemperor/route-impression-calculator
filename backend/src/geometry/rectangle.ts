import { Geofence } from '../schemas';

export function isInsideRectangle(lon: number, lat: number, geofence: Geofence): boolean {
  return (
    lon >= geofence.minLon &&
    lon <= geofence.maxLon &&
    lat >= geofence.minLat &&
    lat <= geofence.maxLat
  );
}

export function clampToRange(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}