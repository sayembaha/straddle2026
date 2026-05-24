import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  AlertTriangle, 
  Building2,
  ExternalLink,
  Star,
  Clock,
  Target
} from 'lucide-react';

const DealRumorTracker = () => {
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');

  const rumors = [
    {
      id: 1,
      company: 'TechCorp Inc.',
      ticker: 'TECH',
      sector: 'Technology',
      signals: [
        'Skadden Arps hiring M&A associates',
        'Board meeting frequency increased 3x',
        'CFO hired Goldman Sachs for "strategic review"'
      ],
      confidence: 'High',
      confidenceScore: 85,
      lastUpdated: '2 hours ago',
      sources: 5,
      starred: true,
      marketCap: '$12.4B',
      potentialBuyers: ['MegaCorp', 'Global Industries', 'Tech Giant']
    },
    {
      id: 2,
      company: 'Retail Holdings Ltd.',
      ticker: 'RETL',
      sector: 'Consumer',
      signals: [
        'Unusual director resignations',
        'Increased IR activity with PE firms',
        'Sudden hiring freeze announced'
      ],
      confidence: 'Medium',
      confidenceScore: 65,
      lastUpdated: '5 hours ago',
      sources: 3,
      starred: false,
      marketCap: '$8.2B',
      potentialBuyers: ['Private Equity Co', 'Consumer Giant']
    },
    {
      id: 3,
      company: 'Industrial Solutions',
      ticker: 'INDS',
      sector: 'Industrial',
      signals: [
        'Activist investor building position',
        'Management discussing "strategic alternatives"',
        'Real estate advisors engaged'
      ],
      confidence: 'High',
      confidenceScore: 78,
      lastUpdated: '1 day ago',
      sources: 7,
      starred: true,
      marketCap: '$15.7B',
      potentialBuyers: ['Industrial Partners', 'Global Manufacturing']
    },
    {
      id: 4,
      company: 'BioMed Innovations',
      ticker: 'BMED',
      sector: 'Healthcare',
      signals: [
        'Patent portfolio being evaluated',
        'Key executives leaving for "personal reasons"',
        'Unusual trading volume spikes'
      ],
      confidence: 'Low',
      confidenceScore: 42,
      lastUpdated: '3 hours ago',
      sources: 2,
      starred: false,
      marketCap: '$4.1B',
      potentialBuyers: ['Big Pharma Co']
    }
  ];

  const filteredRumors = rumors.filter(rumor => {
    const confidenceMatch = confidenceFilter === 'all' || rumor.confidence.toLowerCase() === confidenceFilter;
    const sectorMatch = sectorFilter === 'all' || rumor.sector.toLowerCase().includes(sectorFilter.toLowerCase());
    return confidenceMatch && sectorMatch;
  });

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Deal Rumor Tracker</h2>
          <p className="text-slate-400 mt-2">Monitor pre-announcement deal signals and market intelligence</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>Watch List</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-slate-400" />
            <span className="text-slate-300 font-medium">Filters:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-slate-400 text-sm">Confidence:</label>
            <select 
              value={confidenceFilter} 
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-slate-400 text-sm">Sector:</label>
            <select 
              value={sectorFilter} 
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Sectors</option>
              <option value="technology">Technology</option>
              <option value="consumer">Consumer</option>
              <option value="industrial">Industrial</option>
              <option value="healthcare">Healthcare</option>
            </select>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none w-64"
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-medium">High Confidence</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">12</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400 font-medium">Medium Confidence</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">8</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-medium">Low Confidence</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">4</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Companies Tracked</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">247</div>
        </div>
      </div>

      {/* Deal Rumors List */}
      <div className="space-y-4">
        {filteredRumors.map((rumor) => (
          <div key={rumor.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-white">{rumor.company}</h3>
                    <span className="text-slate-400">({rumor.ticker})</span>
                    {rumor.starred && <Star className="h-5 w-5 text-yellow-400 fill-current" />}
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-slate-400">{rumor.sector}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300 font-medium">{rumor.marketCap}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(rumor.confidence)}`}>
                  {rumor.confidence} ({rumor.confidenceScore}%)
                </div>
                <div className="flex items-center space-x-2 mt-2 text-slate-400 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{rumor.lastUpdated}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Deal Signals</h4>
                <div className="space-y-2">
                  {rumor.signals.map((signal, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-700/50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5" />
                      <span className="text-slate-300 text-sm">{signal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Potential Acquirers</h4>
                <div className="space-y-2">
                  {rumor.potentialBuyers.map((buyer, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-lg">
                      <Target className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300 text-sm">{buyer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <span>{rumor.sources} sources</span>
                <span>•</span>
                <span>Last updated {rumor.lastUpdated}</span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="text-slate-400 hover:text-white transition-colors">
                  <Star className="h-5 w-5" />
                </button>
                <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Sources</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealRumorTracker;