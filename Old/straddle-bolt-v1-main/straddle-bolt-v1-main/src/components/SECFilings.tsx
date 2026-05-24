import React, { useState } from 'react';
import { 
  AlertTriangle, 
  FileText, 
  Search, 
  Filter,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Clock
} from 'lucide-react';

const SECFilings = () => {
  const [expandedFiling, setExpandedFiling] = useState<number | null>(null);
  const [filingTypeFilter, setFilingTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filings = [
    {
      id: 1,
      company: 'TechCorp Inc.',
      ticker: 'TECH',
      filingType: '10-K',
      filingDate: '2024-01-15',
      previousDate: '2023-01-15',
      severity: 'High',
      changesDetected: 15,
      sections: [
        {
          name: 'Risk Factors',
          changes: 8,
          summary: 'Added new cybersecurity risks and supply chain disruption concerns',
          details: [
            {
              type: 'Addition',
              content: 'Added detailed section on AI regulatory compliance risks and potential impact on business operations'
            },
            {
              type: 'Modification',
              content: 'Expanded cybersecurity risk factors to include nation-state threats and data privacy regulations'
            },
            {
              type: 'Removal',
              content: 'Removed COVID-19 related supply chain risks as no longer material'
            }
          ]
        },
        {
          name: 'Business Overview',
          changes: 4,
          summary: 'Updated strategic focus and market positioning',
          details: [
            {
              type: 'Modification',
              content: 'Changed primary market description from "enterprise software" to "AI-powered solutions"'
            },
            {
              type: 'Addition',
              content: 'Added new business segment: "Autonomous Systems Division"'
            }
          ]
        },
        {
          name: 'MD&A',
          changes: 3,
          summary: 'Revised outlook and capital allocation strategy',
          details: [
            {
              type: 'Modification',
              content: 'Updated capital allocation priorities to emphasize R&D investment in AI technologies'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      company: 'Industrial Solutions',
      ticker: 'INDS',
      filingType: '10-Q',
      filingDate: '2024-01-12',
      previousDate: '2023-10-15',
      severity: 'Medium',
      changesDetected: 7,
      sections: [
        {
          name: 'Risk Factors',
          changes: 3,
          summary: 'Updated environmental and regulatory risk disclosures',
          details: [
            {
              type: 'Addition',
              content: 'New environmental compliance risks related to upcoming EPA regulations'
            },
            {
              type: 'Modification',
              content: 'Expanded discussion of trade policy impacts on international operations'
            }
          ]
        },
        {
          name: 'MD&A',
          changes: 4,
          summary: 'Revised guidance and market outlook',
          details: [
            {
              type: 'Modification',
              content: 'Lowered full-year guidance citing industrial market headwinds'
            },
            {
              type: 'Addition',
              content: 'Added discussion of strategic review process for non-core assets'
            }
          ]
        }
      ]
    },
    {
      id: 3,
      company: 'Retail Holdings',
      ticker: 'RETL',
      filingType: '8-K',
      filingDate: '2024-01-10',
      previousDate: '2024-01-05',
      severity: 'High',
      changesDetected: 12,
      sections: [
        {
          name: 'Material Agreements',
          changes: 6,
          summary: 'New credit facility and amended debt agreements',
          details: [
            {
              type: 'Addition',
              content: 'Entered into $2.5B revolving credit facility with modified covenant structure'
            },
            {
              type: 'Modification',
              content: 'Amended existing term loan to relax net leverage covenant from 3.5x to 4.0x'
            }
          ]
        },
        {
          name: 'Corporate Changes',
          changes: 6,
          summary: 'Leadership transition and restructuring announcements',
          details: [
            {
              type: 'Addition',
              content: 'CEO retirement announcement effective March 31, 2024'
            },
            {
              type: 'Addition',
              content: 'Board authorized $500M cost reduction program including store closures'
            }
          ]
        }
      ]
    }
  ];

  const filteredFilings = filings.filter(filing => {
    const typeMatch = filingTypeFilter === 'all' || filing.filingType.toLowerCase().includes(filingTypeFilter.toLowerCase());
    const severityMatch = severityFilter === 'all' || filing.severity.toLowerCase() === severityFilter;
    return typeMatch && severityMatch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'addition': return 'text-green-400 bg-green-500/20';
      case 'modification': return 'text-yellow-400 bg-yellow-500/20';
      case 'removal': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedFiling(expandedFiling === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">SEC Filing Tracker</h2>
          <p className="text-slate-400 mt-2">Monitor changes in critical filing sections and regulatory updates</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Generate Report</span>
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
            {filings.filter(f => f.severity === 'High').length}
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-yellow-400">
            <Clock className="h-5 w-5" />
            <span className="font-medium">This Week</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">18</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-blue-400">
            <FileText className="h-5 w-5" />
            <span className="font-medium">Total Changes</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {filings.reduce((sum, f) => sum + f.changesDetected, 0)}
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-green-400">
            <Eye className="h-5 w-5" />
            <span className="font-medium">Companies Tracked</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">1,247</div>
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
            <label className="text-slate-400 text-sm">Filing Type:</label>
            <select 
              value={filingTypeFilter} 
              onChange={(e) => setFilingTypeFilter(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="10-k">10-K</option>
              <option value="10-q">10-Q</option>
              <option value="8-k">8-K</option>
              <option value="proxy">Proxy</option>
            </select>
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
              placeholder="Search filings..." 
              className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none w-64"
            />
          </div>
        </div>
      </div>

      {/* Filing Changes */}
      <div className="space-y-4">
        {filteredFilings.map((filing) => (
          <div key={filing.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-white">{filing.company}</h3>
                    <span className="text-slate-400">({filing.ticker})</span>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                      {filing.filingType}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-slate-400">Filed: {filing.filingDate}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">Previous: {filing.previousDate}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${getSeverityColor(filing.severity)}`}>
                  {filing.severity} Priority
                </div>
                <div className="text-slate-400 text-sm">{filing.changesDetected} changes detected</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-slate-400 text-sm mb-2">Sections with Changes:</div>
              <div className="flex flex-wrap gap-2">
                {filing.sections.map((section, index) => (
                  <div key={index} className="bg-slate-700/50 px-3 py-1 rounded-lg text-sm">
                    <span className="text-white font-medium">{section.name}</span>
                    <span className="text-slate-400 ml-2">({section.changes} changes)</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => toggleExpanded(filing.id)}
              className="w-full flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <span className="text-white font-medium">View Detailed Changes</span>
              {expandedFiling === filing.id ? 
                <ChevronUp className="h-5 w-5 text-slate-400" /> : 
                <ChevronDown className="h-5 w-5 text-slate-400" />
              }
            </button>

            {expandedFiling === filing.id && (
              <div className="mt-4 space-y-6">
                {filing.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-slate-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">{section.name}</h4>
                      <span className="text-slate-400 text-sm">{section.changes} changes</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-4">{section.summary}</p>
                    
                    <div className="space-y-3">
                      {section.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getChangeTypeColor(detail.type)}`}>
                            {detail.type}
                          </span>
                          <p className="text-slate-300 text-sm flex-1">{detail.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-3">
                <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Full Filing</span>
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Compare Versions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SECFilings;