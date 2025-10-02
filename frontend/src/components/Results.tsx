import React, { useState } from 'react';
import { CalculateResponse } from '../types';
import { ImpressionsChart } from './ImpressionsChart';

interface ResultsProps {
  results: CalculateResponse | null;
  returnIntervals: boolean;
}

export const Results: React.FC<ResultsProps> = ({ results, returnIntervals }) => {
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set());

  if (!results) {
    return (
      <div className="section">
        <p>No results to display. Upload data and click "Calculate Impressions" to see results.</p>
      </div>
    );
  }

  const toggleRouteExpansion = (routeId: string): void => {
    const newExpanded = new Set(expandedRoutes);
    if (newExpanded.has(routeId)) {
      newExpanded.delete(routeId);
    } else {
      newExpanded.add(routeId);
    }
    setExpandedRoutes(newExpanded);
  };

  return (
    <div className="results">
      <h2>Calculation Results</h2>

      <div className="summary-card">
        <h3>Overall Summary</h3>
        <p><strong>Total Impressions:</strong> {results.summary.totalImpressions.toLocaleString()}</p>
        <p><strong>Total Time Inside:</strong> {Math.round(results.summary.totalSecondsInside)} seconds ({Math.round(results.summary.totalSecondsInside / 60)} minutes)</p>
        <p><strong>Routes Processed:</strong> {results.summary.routeCount}</p>
        <p><strong>Campaigns Analyzed:</strong> {results.summary.campaignCount}</p>
      </div>

      <ImpressionsChart campaigns={results.campaigns} />

      <h3>Campaign Details</h3>
      {results.campaigns.map((campaign) => (
        <div key={campaign.campaignId} className="campaign-card">
          <h4>Campaign: {campaign.campaignId}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <p><strong>Market:</strong> {campaign.marketId}</p>
            <p><strong>IPM:</strong> {campaign.impressionsPerMinute}</p>
            <p><strong>Total Seconds Inside:</strong> {Math.round(campaign.totalSecondsInside)}</p>
            <p><strong>Total Impressions:</strong> {campaign.totalImpressions.toLocaleString()}</p>
          </div>

          <h5>Routes ({campaign.routes.length})</h5>
          <table className="route-table">
            <thead>
              <tr>
                <th>Route ID</th>
                <th>Seconds Inside</th>
                <th>Impressions</th>
                <th>Entries</th>
                <th>Exits</th>
                {returnIntervals && <th>Intervals</th>}
              </tr>
            </thead>
            <tbody>
              {campaign.routes.map((route) => (
                <tr key={route.routeId}>
                  <td>{route.routeId}</td>
                  <td>{Math.round(route.secondsInside)}</td>
                  <td>{route.impressions.toLocaleString()}</td>
                  <td>{route.entries}</td>
                  <td>{route.exits}</td>
                  {returnIntervals && (
                    <td>
                      {route.intervals && route.intervals.length > 0 && (
                        <button
                          onClick={() => toggleRouteExpansion(route.routeId)}
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          {expandedRoutes.has(route.routeId) ? 'Hide' : 'Show'} ({route.intervals.length})
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {returnIntervals && campaign.routes.map((route) => (
            route.intervals && expandedRoutes.has(route.routeId) && (
              <div key={`${route.routeId}-intervals`} className="intervals">
                <h6>Intervals for {route.routeId}</h6>
                {route.intervals.map((interval, idx) => (
                  <div key={idx} className="interval-item">
                    <strong>{new Date(interval.start).toLocaleTimeString()} - {new Date(interval.end).toLocaleTimeString()}</strong>
                    <br />
                    Duration: {Math.round(interval.seconds)}s, Inside Fraction: {(interval.insideFraction * 100).toFixed(1)}%
                  </div>
                ))}
              </div>
            )
          ))}
        </div>
      ))}

      <div className="section">
        <h3>Assumptions</h3>
        <ul>
          {results.assumptions.map((assumption, idx) => (
            <li key={idx}>{assumption}</li>
          ))}
        </ul>

        <h3>Limitations</h3>
        <ul>
          {results.limitations.map((limitation, idx) => (
            <li key={idx}>{limitation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};