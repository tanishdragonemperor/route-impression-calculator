import { Request, Response } from 'express';
import { CalculateRequestSchema, CalculateResponse } from '../schemas';
import { calculateImpressions, validateReferences } from '../calc/impressions';

export async function calculateHandler(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = CalculateRequestSchema.safeParse(req.body);
    
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Invalid request body',
        details: parseResult.error.issues,
      });
      return;
    }

    const { markets, campaigns, routes, options } = parseResult.data;
    
    const warnings = validateReferences(markets, campaigns, routes);
    
    const campaignResults = calculateImpressions(
      markets,
      campaigns,
      routes,
      options?.returnIntervals ?? false
    );

    const totalImpressions = campaignResults.reduce((sum, c) => sum + c.totalImpressions, 0);
    const totalSecondsInside = campaignResults.reduce((sum, c) => sum + c.totalSecondsInside, 0);
    const routeCount = routes.length;
    const campaignCount = campaigns.length;

    const assumptions = [
      'Linear movement between consecutive pings',
      'Planar approximation for lat/lon coordinates (suitable for city-scale distances)',
      'Time attribution based on fraction of line segment inside geofence',
      'Impressions rounded to nearest integer',
    ];

    const limitations = [
      'Only supports rectangular geofences (axis-aligned)',
      'Does not account for GPS accuracy or smoothing',
      'Large gaps between pings may reduce accuracy',
      'No consideration for vehicle speed or direction changes',
    ];

    if (warnings.length > 0) {
      limitations.push(...warnings);
    }

    const response: CalculateResponse = {
      summary: {
        totalImpressions,
        totalSecondsInside,
        routeCount,
        campaignCount,
      },
      campaigns: campaignResults,
      assumptions,
      limitations,
    };

    res.json(response);
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}