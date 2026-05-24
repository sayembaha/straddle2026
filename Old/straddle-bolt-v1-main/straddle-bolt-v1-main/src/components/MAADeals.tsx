import React, { useState } from 'react';
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Building2, 
  ExternalLink,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const MAADeals = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');

  const deals = [
    {
      id: 1,
      acquirer: 'Global Tech Corp',
      target: 'DataSystems Inc.',
      dealValue: 12.4,
      multiple: 15.2,
      sector: 'Technology',
      status: 'Announced',
      announcedDate: '2024-01-15',
      expectedClose: '2024-04-15',
      rationale: 'Strategic acquisition to expand cloud infrastructure capabilities and enter new geographic markets',
      advisors: {
        acquirer: 'Goldman Sachs',
        target: 'Morgan Stanley'
      },
      premium: 28.5,
      synergies: 850
    },
    {
      id: 2,
      acquirer: 'Industrial Partners',
      target: 'Manufacturing Solutions',
      dealValue: 8.7,
      multiple: 12.8,
      sector: 'Industrial',
      status: 'Pending Approval',
      announcedDate: '2024-01-10',
      expectedClose: '2024-06-30',
      rationale: 'Vertical integration to secure supply chain and achieve operational efficiencies',
      advisors: {
        acquirer: 'JPMorgan',
        target: 'Credit Suisse'
      },
      premium: 31.2,
      synergies: 420
    },
    {
      id: 3,
      acquirer: 'Health Ventures',
      target: 'BioTech Solutions',
      dealValue: 5.9,
      multiple: 18.4,
      sector: 'Healthcare',
      status: 'Completed',
      announcedDate: '2023-11-20',
      expectedClose: '2024-02-15',
      rationale: 'Acquisition of breakthrough drug pipeline and R&D capabilities',
      advisors: {
        acquirer: 'Barclays',
        target: 'Lazard'
      },
      premium: 42.1,
      synergies: 1200
    },
    {
      id: 4,
      acquirer: 'Retail Group',
      target: 'E-commerce Platform',
      dealValue: 3.2,
      multiple: 22.1,
      sector: 'Consumer',
      status: 'Announced',
      announcedDate: '2024-01-08',
      expectedClose: '2024-03-30',
      rationale: 'Digital transformation and omnichannel retail capabilities enhancement',
      advisors: {
        acquirer: 'Deutsche Bank',
        target: 'UBS'
      },
      premium: 35.7,
      synergies: 280
    }
  ];

  const filteredDeals = deals.filter(deal => {
    const statusMatch = statusFilter === 'all' || deal.status.toLowerCase().includes(statusFilter.toLowerCase());
    const sectorMatch = sectorFilter === 'all' || deal.sector.toLowerCase().includes(sectorFilter.toLowerCase());
    return statusMatch && sectorMatch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'Pending Approval': return <Clock className="h-5 w-5 text-yellow-400" />;
      case 'Announced': return <AlertCircle className="h-5 w-5 text-blue-400" />;
      default: return <AlertCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-400 bg-green-500/20';
      case 'Pending Approval': return 'text-yellow-400 bg-yellow-500/20';
      case 'Announced': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.dealValue, 0);
  const avgMultiple = deals.reduce((sum, deal) => sum + deal.multiple, 0) / deals.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">M&A Deal Digest</h2>
          <p className="text-slate-400 mt-2">Track publicly announced M&A transactions with standardized deal cards</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-green-400">
            <DollarSign className="h-5 w-5" />
            <span className="font-medium">Total Deal Value</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">${totalValue.toFixed(1)}B</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-purple-400">
            <Target className="h-5 w-5" />
            <span className="font-medium">Avg Multiple</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{avgMultiple.toFixed(1)}x</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-blue-400">
            <Building2 className="h-5 w-5" />
            <span className="font-medium">Active Deals</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{deals.length}</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-orange-400">
            <Calendar className="h-5 w-5" />
            <span className="font-medium">This Quarter</span>
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
            <label className="text-slate-400 text-sm">Status:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="announced">Announced</option>
              <option value="pending">Pending Approval</option>
              <option value="completed">Completed</option>
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
              <option value="healthcare">Healthcare</option>
              <option value="industrial">Industrial</option>
              <option value="consumer">Consumer</option>
            </select>
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search deals..." 
              className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none w-64"
            />
          </div>
        </div>
      </div>

      {/* Deal Cards */}
      <div className="space-y-6">
        {filteredDeals.map((deal) => (
          <div key={deal.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            {/* Deal Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {deal.acquirer} acquiring {deal.target}
                  </h3>
                  <p className="text-slate-400 mt-1">{deal.sector} • ${deal.dealValue}B Transaction</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deal.status)}`}>
                  {getStatusIcon(deal.status)}
                  <span>{deal.status}</span>
                </div>
                <p className="text-slate-400 text-sm mt-2">Announced: {deal.announcedDate}</p>
              </div>
            </div>

            {/* Deal Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Deal Value</div>
                <div className="text-2xl font-bold text-green-400">${deal.dealValue}B</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">EV/EBITDA Multiple</div>
                <div className="text-2xl font-bold text-purple-400">{deal.multiple}x</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Premium Paid</div>
                <div className="text-2xl font-bold text-orange-400">{deal.premium}%</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Synergies</div>
                <div className="text-2xl font-bold text-blue-400">${deal.synergies}M</div>
              </div>
            </div>

            {/* Deal Rationale */}
            <div className="mb-6">
              <h4 className="font-medium text-white mb-3">Deal Rationale</h4>
              <p className="text-slate-300 bg-slate-700/50 p-4 rounded-lg">{deal.rationale}</p>
            </div>

            {/* Timeline & Advisors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Announced: {deal.announcedDate}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-orange-400" />
                    <span className="text-slate-300">Expected Close: {deal.expectedClose}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Financial Advisors</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-4 w-4 text-green-400" />
                    <span className="text-slate-300">Acquirer: {deal.advisors.acquirer}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Target className="h-4 w-4 text-purple-400" />
                    <span className="text-slate-300">Target: {deal.advisors.target}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end mt-6 pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-3">
                <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Filing</span>
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Add to Comps
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MAADeals;