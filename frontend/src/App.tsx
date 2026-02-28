
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Intelligence } from './components/Intelligence';
import { Performance } from './components/Performance';
import { Network } from './components/Network';
import { PropertyDetail } from './components/PropertyDetail';
import { Targets } from './components/Targets';
import { MOCK_DATA } from './mockData';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [data, setData] = useState<any /* eslint-disable-line @typescript-eslint/no-explicit-any */>(null);
  const [loading, setLoading] = useState(true);

  // Settings State
  const [liveSync, setLiveSync] = useState(true);
  const [autoInsights, setAutoInsights] = useState(true);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${apiUrl}/api/portfolio`)
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.warn("Failed to fetch live data. Falling back to offline Neural Core mock telemetry.", err);
        setData(MOCK_DATA);
        setLoading(false);
      });
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedPropertyId(null);
    setShowSettings(false);
  };

  const handlePropertySelect = (id: string) => {
    setSelectedPropertyId(id);
    setActiveTab('detail');
  };

  const handleGenerateReport = () => {
    // Add a specific print class to the body to trigger CSS print media queries
    document.body.classList.add('printing-pdf');

    // Slight delay to allow CSS to apply
    setTimeout(() => {
      window.print();
      // Remove the class after print dialog closes
      setTimeout(() => {
        document.body.classList.remove('printing-pdf');
      }, 500);
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bcp-bg)]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-t-4 border-[var(--color-bcp-primary)] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-r-4 border-[var(--color-bcp-accent)] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-[var(--color-bcp-success)] rounded-full animate-pulse shadow-[var(--shadow-neon)]"></div>
            </div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-white font-display text-xl tracking-widest font-bold">BOOTING SYSTEM</p>
            <p className="text-[var(--color-bcp-muted)] text-xs tracking-[0.2em] font-medium uppercase">Initializing Enterprise Neural Core</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bcp-bg)] selection:bg-[var(--color-bcp-primary)] selection:text-white relative">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} onOpenSettings={() => { setShowSettings(true); setSelectedPropertyId(null); }} />

      <main className="flex-1 overflow-y-auto px-10 py-10 relative z-10 w-full">
        {/* Deep, Premium Ambient Background Gradients */}
        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-bcp-primary)] rounded-[100%] blur-[150px] opacity-[0.15] pointer-events-none -z-10"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-bcp-accent)] rounded-[100%] blur-[150px] opacity-[0.1] pointer-events-none -z-10"></div>

        <div id="export-content" className="max-w-[1600px] mx-auto min-h-full">
          {showSettings ? (
            <div className="max-w-3xl mx-auto premium-card p-10">
              <h2 className="text-3xl font-display font-bold text-white mb-8 border-b border-[var(--color-bcp-border)] pb-4">System Configurations</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-[var(--color-bcp-surfaceHighlight)] rounded-xl border border-[var(--color-bcp-border)] hover:border-[var(--color-bcp-primary)] transition-colors cursor-pointer" onClick={() => setLiveSync(!liveSync)}>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Live Telemetry Sync</h4>
                    <p className="text-[var(--color-bcp-muted)] text-sm">Continuously fetch data from PMS systems every 15 minutes.</p>
                  </div>
                  <div className={`w-12 h-6 ${liveSync ? 'bg-[var(--color-bcp-primary)]' : 'bg-gray-600'} rounded-full flex items-center px-1 shadow-[var(--shadow-neon)] transition-colors`}>
                    <div className={`w-4 h-4 rounded-full bg-white transform ${liveSync ? 'translate-x-6' : 'translate-x-0'} transition-transform`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--color-bcp-surfaceHighlight)] rounded-xl border border-[var(--color-bcp-border)] hover:border-[var(--color-bcp-primary)] transition-colors cursor-pointer" onClick={() => setAutoInsights(!autoInsights)}>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">Neural Core Auto-Insights</h4>
                    <p className="text-[var(--color-bcp-muted)] text-sm">Allow AI to generate push notifications for critical revenue shifts.</p>
                  </div>
                  <div className={`w-12 h-6 ${autoInsights ? 'bg-[var(--color-bcp-primary)]' : 'bg-gray-600'} rounded-full flex items-center px-1 shadow-[var(--shadow-neon)] transition-colors`}>
                    <div className={`w-4 h-4 rounded-full bg-white transform ${autoInsights ? 'translate-x-6' : 'translate-x-0'} transition-transform`}></div>
                  </div>
                </div>
                <button
                  onClick={() => alert("System Cache successfully flushed. Telemetry rebuilt.")}
                  className="w-full py-4 mt-6 bg-[var(--color-bcp-bg)] border border-[var(--color-bcp-danger)] text-[var(--color-bcp-danger)] rounded-xl font-bold hover:bg-[var(--color-bcp-danger)] hover:text-white transition-colors">
                  Flush System Cache
                </button>
              </div>
            </div>
          ) : selectedPropertyId ? (
            <PropertyDetail propertyId={selectedPropertyId} data={data} onBack={() => setSelectedPropertyId(null)} />
          ) : activeTab === 'overview' ? (
            <Dashboard data={data} onPropertySelect={handlePropertySelect} onGenerateReport={handleGenerateReport} onInitAI={() => setActiveTab('intelligence')} />
          ) : activeTab === 'intelligence' ? (
            <Intelligence data={data} />
          ) : activeTab === 'performance' ? (
            <Performance data={data} onPropertySelect={handlePropertySelect} />
          ) : activeTab === 'network' ? (
            <Network data={data} onPropertySelect={handlePropertySelect} />
          ) : activeTab === 'targets' ? (
            <Targets data={data} />
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center p-16 premium-card max-w-xl w-full">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] shadow-[var(--shadow-premium-dark)]">
                  <div className="w-3 h-3 bg-[var(--color-bcp-primary)] rounded-full shadow-[var(--shadow-neon)] animate-ping"></div>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-3 tracking-wide">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module Initializing</h2>
                <p className="text-[var(--color-bcp-muted)] leading-relaxed font-medium">The {activeTab} service is currently synchronizing with the central properties database. Please standby.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
