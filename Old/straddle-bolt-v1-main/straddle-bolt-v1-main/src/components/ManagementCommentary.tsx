import React, { useState } from 'react';
import { 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Search, 
  Filter,
  Calendar,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

const ManagementCommentary = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [severityFilter, setSeverityFilter] = useState('all');

  const commentaryChanges = [
    {
      id: 1,
      company: 'TechCorp Inc.',
      ticker: 'TECH',
      sector: 'Technology',
      reportType: 'Earnings Call',
      date: '2024-01-15',
      severity: 'High',
      changesDetected: 8,
      keyChanges: [
        {
          category: 'Strategic Direction',
          before: 'Focused on organic growth and market expansion',
          after: 'Evaluating strategic alternatives including potential partnerships and acquisitions',
          significance: 'Major shift towards inorganic growth strategy'
        },
        {
          category: 'Financial Guidance',
          before: 'Expecting 15-20% revenue growth for FY2024',
          after: 'Revising growth expectations to 8-12% due to market headwinds',
          significance: 'Significant downward revision in growth outlook'
        },
        {
          category: 'Risk Factors',
          before: 'Standard competitive and regulatory risks',
          after: 'Added supply chain disruption and geopolitical risks as primary concerns',
          significance: 'New risk categories introduced'
        }
      ],
      sentiment: 'Cautious',
      riskLevel: 'Elevated'
    },
    {
      id: 2,
      company: 'Industrial Solutions',
      ticker: 'INDS',
      sector: 'Industrial',
      reportType: 'Quarterly Report',
      date: '2024-01-12',
      severity: 'Medium',
      changesDetected: 5,
      keyChanges: [
        {
          category: 'Capital Allocation',
          before: 'Prioritizing dividend growth and share buybacks',
          after: 'Reducing dividend payout to fund strategic investments in automation',
          significance: 'Shift from shareholder returns to growth investment'
        },
        {
          category: 'Market Outlook',
          before: 'Optimistic about industrial recovery',
          after: 'More measured view on recovery timeline, expecting gradual improvement',
          significance: 'Tempered expectations for market recovery'
        }
      ],
      sentiment: 'Neutral',
      riskLevel: 'Moderate'
    },
    {
      id: 3,
      company: 'Retail Holdings',
      ticker: 'RETL',
      sector: 'Consumer',
      reportType: 'Annual Shareholder Letter',
      date: '2024-01-10',
      severity: 'High',
      changesDetected: 12,
      keyChanges: [
        {
          category: 'Business Model',
          before: 'Traditional brick-and-mortar focus with limited digital presence',
          after: 'Accelerating digital transformation with omnichannel approach',
          significance: 'Fundamental business model evolution'
        },
        {
          category: 'Leadership Changes',
          before: 'Stable executive team with long tenure',
          after: 'Announcing retirement of CEO and CFO, actively searching for replacements',
          significance: 'Major leadership transition underway'
        },
        {
          category: 'Cost Structure',
          before: 'Maintaining current operational footprint',
          after: 'Initiating comprehensive cost reduction program, closing underperforming locations',
          significance: 'Significant operational restructuring planned'
        }
      ],
      sentiment: 'Transformative',
      riskLevel: 'High'
    }
  ];

  const filteredChanges = commentaryChanges.filter(change => {
    return severityFilter === 'all' || change.severity.toLowerCase() === severityFilter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'elevated': return 'text-orange-400';
      case 'moderate': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Management Commentary Tracker</h2>
          <p className="text-slate-400 mt-2">Detect shifts in tone, guidance, and strategy across management communications</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trend Analysis</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">High Severity</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {commentaryChanges.filter(c => c.severity === 'High').length}
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-yellow-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Medium Severity</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {commentaryChanges.filter(c => c.severity === 'Medium').length}
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-blue-400">
            <FileText className="h-5 w-5" />
            <span className="font-medium">Companies Tracked</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">247</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-green-400">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">This Week</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">18</div>
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
            <label className="text-slate-400 text-sm">Severity:</label>
            <select 
              value={severityFilter} 
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Severity</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
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

      {/* Commentary Changes */}
      <div className="space-y-4">
        {filteredChanges.map((change) => (
          <div key={change.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-white">{change.company}</h3>
                    <span className="text-slate-400">({change.ticker})</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-slate-400">{change.sector}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300">{change.reportType}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">{change.date}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${getSeverityColor(change.severity)}`}>
                  {change.severity} Severity
                </div>
                <div className="text-slate-400 text-sm">{change.changesDetected} changes detected</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-slate-400 text-sm">Sentiment</div>
                <div className="text-white font-medium">{change.sentiment}</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-slate-400 text-sm">Risk Level</div>
                <div className={`font-medium ${getRiskColor(change.riskLevel)}`}>{change.riskLevel}</div>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-slate-400 text-sm">Changes</div>
                <div className="text-white font-medium">{change.changesDetected} detected</div>
              </div>
            </div>

            <button 
              onClick={() => toggleExpanded(change.id)}
              className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <span className="text-white font-medium">View Detailed Changes</span>
              {expandedItem === change.id ? 
                <ChevronUp className="h-5 w-5 text-slate-400" /> : 
                <ChevronDown className="h-5 w-5 text-slate-400" />
              }
            </button>

            {expandedItem === change.id && (
              <div className="mt-4 space-y-4">
                {change.keyChanges.map((keyChange, index) => (
                  <div key={index} className="border border-slate-600 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-3">{keyChange.category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-slate-400 text-sm mb-2">Previous Statement</div>
                        <div className="bg-slate-700/50 p-3 rounded text-slate-300 text-sm">
                          {keyChange.before}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-sm mb-2">Current Statement</div>
                        <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded text-blue-200 text-sm">
                          {keyChange.after}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded">
                      <div className="text-orange-400 text-sm font-medium mb-1">Analysis</div>
                      <div className="text-orange-200 text-sm">{keyChange.significance}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-3">
                <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Full Report</span>
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Add to Watch List
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagementCommentary;