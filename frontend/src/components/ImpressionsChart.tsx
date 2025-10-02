import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CampaignResult } from '../types';

interface ImpressionsChartProps {
  campaigns: CampaignResult[];
}

export const ImpressionsChart: React.FC<ImpressionsChartProps> = ({ campaigns }) => {
  const chartData = campaigns.map(campaign => ({
    campaignId: campaign.campaignId,
    impressions: campaign.totalImpressions,
    secondsInside: Math.round(campaign.totalSecondsInside),
  }));

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="chart-container">
      <h3>Impressions by Campaign</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="campaignId" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [
              typeof value === 'number' ? value.toLocaleString() : value,
              name === 'impressions' ? 'Impressions' : 'Seconds Inside'
            ]}
            labelFormatter={(label) => `Campaign: ${label}`}
          />
          <Bar dataKey="impressions" fill="#646cff" name="impressions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};