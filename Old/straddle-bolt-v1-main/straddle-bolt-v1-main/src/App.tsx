import React, { useState } from 'react';
import { 
  TrendingUp, 
  Search, 
  FileText, 
  Target, 
  BarChart3, 
  AlertTriangle,
  Building2,
  Clock,
  DollarSign,
  Activity,
  ChevronRight,
  Filter,
  Bell,
  Settings
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import DealRumorTracker from './components/DealRumorTracker';
import MAADeals from './components/MAADeals';
import ManagementCommentary from './components/ManagementCommentary';
import CapitalStructure from './components/CapitalStructure';
import SECFilings from './components/SECFilings';

const agents = [
  {
    id: 'deal-rumor',
    name: 'Deal Rumor Tracker',
    icon: Search,
    description: 'Monitor industry signals and pre-announcement deal activity',
    color: 'bg-blue-500',
    alerts: 3
  },
  {
    id: 'ma-deals',
    name: 'M&A Deal Digest',
    icon: Target,
    description: 'Track publicly announced M&A transactions with deal cards',
    color: 'bg-green-500',
    alerts: 7
  },
  {
    id: 'management',
    name: 'Management Commentary',
    icon: FileText,
    description: 'Detect changes in strategic language and guidance',
    color: 'bg-purple-500',
    alerts: 2
  },
  {
    id: 'capital',
    name: 'Capital Structure',
    icon: BarChart3,
    description: 'Debt maturity profiles and refinancing risk analysis',
    color: 'bg-orange-500',
    alerts: 5
  },
  {
    id: 'sec-filings',
    name: 'SEC Filing Tracker',
    icon: AlertTriangle,
    description: 'Compare filing changes and track regulatory updates',
    color: 'bg-red-500',
    alerts: 1
  }
];

function App() {
  const [activeAgent, setActiveAgent] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeAgent) {
      case 'dashboard':
        return <Dashboard />;
      case 'deal-rumor':
        return <DealRumorTracker />;
      case 'ma-deals':
        return <MAADeals />;
      case 'management':
        return <ManagementCommentary />;
      case 'capital':
        return <CapitalStructure />;
      case 'sec-filings':
        return <SECFilings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold">Straddle</h1>
              <span className="text-slate-400 text-sm">AI Research Platform</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-slate-300" />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
              <Settings className="h-5 w-5 text-slate-300" />
            </button>
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">JP</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 bg-slate-800 border-r border-slate-700 min-h-screen">
          <nav className="p-4">
            <button
              onClick={() => setActiveAgent('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all mb-2 ${
                activeAgent === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Activity className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            <div className="mt-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                AI Agents
              </h3>
              {agents.map((agent) => {
                const IconComponent = agent.icon;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgent(agent.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all mb-2 ${
                      activeAgent === agent.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${agent.color}`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-sm">{agent.name}</div>
                        <div className="text-xs text-slate-400 mt-1">
                          {agent.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {agent.alerts > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {agent.alerts}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  );
}

export default App;