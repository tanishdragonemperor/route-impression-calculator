import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Market, Campaign, Route } from '../types';
import { sampleMarkets, sampleCampaigns, sampleRoutes } from '../sampleData';

interface DataInputProps {
  markets: Market[];
  campaigns: Campaign[];
  routes: Route[];
  onDataChange: (markets: Market[], campaigns: Campaign[], routes: Route[]) => void;
}

export const DataInput: React.FC<DataInputProps> = ({
  markets,
  campaigns,
  routes,
  onDataChange,
}) => {
  const [marketsText, setMarketsText] = useState('');
  const [campaignsText, setCampaignsText] = useState('');
  const [routesText, setRoutesText] = useState('');

  const loadSampleData = (): void => {
    onDataChange(sampleMarkets, sampleCampaigns, sampleRoutes);
    setMarketsText(JSON.stringify(sampleMarkets, null, 2));
    setCampaignsText(JSON.stringify(sampleCampaigns, null, 2));
    setRoutesText(JSON.stringify(sampleRoutes, null, 2));
    toast.success('Sample data loaded');
  };

  const clearData = (): void => {
    onDataChange([], [], []);
    setMarketsText('');
    setCampaignsText('');
    setRoutesText('');
    toast.success('Data cleared');
  };

  const parseJSON = (text: string, name: string): any[] => {
    if (!text.trim()) return [];
    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      toast.error(`Invalid JSON in ${name}: ${error instanceof Error ? error.message : 'Parse error'}`);
      throw error;
    }
  };

  const updateFromText = (): void => {
    try {
      const newMarkets = parseJSON(marketsText, 'markets');
      const newCampaigns = parseJSON(campaignsText, 'campaigns');
      const newRoutes = parseJSON(routesText, 'routes');
      
      onDataChange(newMarkets, newCampaigns, newRoutes);
      toast.success('Data updated from text');
    } catch (error) {
      // Error already shown by parseJSON
    }
  };

  const handleFileUpload = (file: File, setter: (data: any[]) => void): void => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        const array = Array.isArray(data) ? data : [data];
        setter(array);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Error reading ${file.name}: ${error instanceof Error ? error.message : 'Parse error'}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="section">
      <div className="button-group">
        <button onClick={loadSampleData}>Load Sample Data</button>
        <button onClick={clearData}>Clear All Data</button>
        <button onClick={updateFromText}>Update from Text</button>
      </div>

      <div className="form-group">
        <label>Markets JSON:</label>
        <textarea
          value={marketsText}
          onChange={(e) => setMarketsText(e.target.value)}
          placeholder='[{"marketId": "LA", "impressionsPerMinute": 1200}]'
        />
        <input
          type="file"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(file, (data) => {
                setMarketsText(JSON.stringify(data, null, 2));
                onDataChange(data, campaigns, routes);
              });
            }
          }}
        />
      </div>

      <div className="form-group">
        <label>Campaigns JSON:</label>
        <textarea
          value={campaignsText}
          onChange={(e) => setCampaignsText(e.target.value)}
          placeholder='[{"campaignId": "camp_001", "marketId": "LA", "geofence": {"minLon": -118.5, "maxLon": -118.2, "minLat": 34.0, "maxLat": 34.2}}]'
        />
        <input
          type="file"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(file, (data) => {
                setCampaignsText(JSON.stringify(data, null, 2));
                onDataChange(markets, data, routes);
              });
            }
          }}
        />
      </div>

      <div className="form-group">
        <label>Routes JSON:</label>
        <textarea
          value={routesText}
          onChange={(e) => setRoutesText(e.target.value)}
          placeholder='[{"routeId": "route_001", "campaignId": "camp_001", "pings": [{"timestamp": "2025-01-15T10:00:00Z", "lon": -118.25, "lat": 34.05}]}]'
        />
        <input
          type="file"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleFileUpload(file, (data) => {
                setRoutesText(JSON.stringify(data, null, 2));
                onDataChange(markets, campaigns, data);
              });
            }
          }}
        />
      </div>
    </div>
  );
};