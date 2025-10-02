import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { DataInput } from './components/DataInput';
import { Results } from './components/Results';
import { Market, Campaign, Route, CalculateRequest, CalculateResponse } from './types';

type Tab = 'input' | 'results';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('input');
  const [markets, setMarkets] = useState<Market[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [results, setResults] = useState<CalculateResponse | null>(null);
  const [returnIntervals, setReturnIntervals] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleDataChange = (newMarkets: Market[], newCampaigns: Campaign[], newRoutes: Route[]): void => {
    setMarkets(newMarkets);
    setCampaigns(newCampaigns);
    setRoutes(newRoutes);
  };

  const calculateImpressions = async (): Promise<void> => {
    if (markets.length === 0 || campaigns.length === 0 || routes.length === 0) {
      toast.error('Please provide markets, campaigns, and routes data');
      return;
    }

    setIsCalculating(true);
    try {
      const request: CalculateRequest = {
        markets,
        campaigns,
        routes,
        options: {
          returnIntervals,
        },
      };

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: CalculateResponse = await response.json();
      setResults(data);
      setActiveTab('results');
      toast.success('Impressions calculated successfully');
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error(`Calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="app">
      <Toaster position="top-right" />
      
      <h1>Route Impression Calculator</h1>
      <p>Calculate advertising impressions for vehicles passing through geofenced campaign areas</p>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'input' ? 'active' : ''}`}
          onClick={() => setActiveTab('input')}
        >
          Data Input
        </button>
        <button
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Results
        </button>
      </div>

      {activeTab === 'input' && (
        <div>
          <DataInput
            markets={markets}
            campaigns={campaigns}
            routes={routes}
            onDataChange={handleDataChange}
          />

          <div className="section">
            <label>
              <input
                type="checkbox"
                checked={returnIntervals}
                onChange={(e) => setReturnIntervals(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Return detailed intervals (for debugging)
            </label>
          </div>

          <button
            className="calculate-button"
            onClick={calculateImpressions}
            disabled={isCalculating}
          >
            {isCalculating ? 'Calculating...' : 'Calculate Impressions'}
          </button>

          {markets.length > 0 && (
            <div className="section">
              <h3>Current Data Summary</h3>
              <p>Markets: {markets.length}</p>
              <p>Campaigns: {campaigns.length}</p>
              <p>Routes: {routes.length}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'results' && (
        <Results results={results} returnIntervals={returnIntervals} />
      )}
    </div>
  );
};

export default App;