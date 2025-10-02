import { Geofence } from '../schemas';

export interface ClipResult {
  tEnter: number;
  tExit: number;
  insideFraction: number;
}

export function clipSegmentToRectangle(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  geofence: Geofence
): ClipResult {
  const dx = x1 - x0;
  const dy = y1 - y0;
  
  let tEnter = 0;
  let tExit = 1;
  
  const p = [-dx, dx, -dy, dy];
  const q = [x0 - geofence.minLon, geofence.maxLon - x0, y0 - geofence.minLat, geofence.maxLat - y0];
  
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) {
        return { tEnter: 0, tExit: 0, insideFraction: 0 };
      }
    } else {
      const t = q[i] / p[i];
      if (p[i] < 0) {
        tEnter = Math.max(tEnter, t);
      } else {
        tExit = Math.min(tExit, t);
      }
    }
  }
  
  if (tEnter > tExit) {
    return { tEnter: 0, tExit: 0, insideFraction: 0 };
  }
  
  tEnter = Math.max(0, Math.min(1, tEnter));
  tExit = Math.max(0, Math.min(1, tExit));
  
  const insideFraction = Math.max(0, tExit - tEnter);
  
  return { tEnter, tExit, insideFraction };
}