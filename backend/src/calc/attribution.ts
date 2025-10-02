import { Ping, Geofence, Interval } from '../schemas';
import { isInsideRectangle } from '../geometry/rectangle';
import { clipSegmentToRectangle } from '../geometry/segmentClip';

export interface AttributionResult {
  intervals: Interval[];
  totalSecondsInside: number;
  entries: number;
  exits: number;
}

export function calculateTimeAttribution(pings: Ping[], geofence: Geofence): AttributionResult {
  if (pings.length < 2) {
    return {
      intervals: [],
      totalSecondsInside: 0,
      entries: 0,
      exits: 0,
    };
  }

  const sortedPings = [...pings].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const intervals: Interval[] = [];
  let totalSecondsInside = 0;
  let entries = 0;
  let exits = 0;
  let wasInside = false;

  for (let i = 0; i < sortedPings.length - 1; i++) {
    const ping1 = sortedPings[i];
    const ping2 = sortedPings[i + 1];

    const t1 = new Date(ping1.timestamp).getTime();
    const t2 = new Date(ping2.timestamp).getTime();
    const intervalSeconds = (t2 - t1) / 1000;

    const inside1 = isInsideRectangle(ping1.lon, ping1.lat, geofence);
    const inside2 = isInsideRectangle(ping2.lon, ping2.lat, geofence);

    const clipResult = clipSegmentToRectangle(
      ping1.lon, ping1.lat,
      ping2.lon, ping2.lat,
      geofence
    );

    const secondsInside = intervalSeconds * clipResult.insideFraction;
    totalSecondsInside += secondsInside;

    const interval: Interval = {
      start: ping1.timestamp,
      end: ping2.timestamp,
      seconds: intervalSeconds,
      insideFraction: clipResult.insideFraction,
    };
    intervals.push(interval);

    const isNowInside = clipResult.insideFraction > 0;
    
    if (!wasInside && isNowInside) {
      entries++;
    }
    if (wasInside && !isNowInside) {
      exits++;
    }
    
    wasInside = isNowInside;
  }

  return {
    intervals,
    totalSecondsInside,
    entries,
    exits,
  };
}