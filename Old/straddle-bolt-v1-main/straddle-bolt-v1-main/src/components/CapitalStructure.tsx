import React, { useState } from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  Calendar, 
  DollarSign,
  TrendingDown,
  Filter,
  Search,
  Clock,
  Building2,
  ExternalLink
} from 'lucide-react';

const CapitalStructure = () => {
  const [riskFilter, setRiskFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  const companies = [
    {
      id: 1,
      name: 'TechCorp Inc.',
      ticker: 'TECH',
      sector: 'Technology',
      totalDebt: 8.5,
      netDebt: 6.2,
      creditRating: 'BBB+',
      maturities: [
        { year: '2024', amount: 1.2, type: 'Term Loan', rate: '4.5%', covenant: 'Net Leverage < 3.5x' },
        { year: '2025', amount: 2.8, type: 'Senior Notes', rate: '5.2%', covenant: 'EBITDA > $500M' },
        { year: '2026', amount: 1.5, type: 'Credit Facility', rate: 'SOFR + 275bps', covenant: 'Interest Coverage > 4.0x' },
        { year: '2027', amount: 3.0, type: 'Senior Notes', rate: '6.1%', covenant: 'Asset Coverage > 1.5x' }
      ],
      covenantRisk: 'Medium',
      refinancingRisk: 'High',
      liquidityPosition: 2.4,
      debtToEBITDA: 3.2
    },
    {
      id: 2,
      name: 'Industrial Solutions',
      ticker: 'INDS',
      sector: 'Industrial',
      totalDebt: 12.8,
      netDebt: 10.1,
      creditRating: 'BBB-',
      maturities: [
        { year: '2024', amount: 2.5, type: 'Revolver', rate: 'SOFR + 250bps', covenant: 'Net Leverage < 4.0x' },
        { year: '2025', amount: 4.2, type: 'Senior Notes', rate: '6.8%', covenant: 'Fixed Charge Coverage > 1.25x' },
        { year: '2026', amount: 3.1, type: 'Term Loan', rate: '5.9%', covenant: 'EBITDA > $800M' },
        { year: '2028', amount: 3.0, type: 'Senior Notes', rate: '7.5%', covenant: 'Total Leverage < 5.0x' }
      ],
      covenantRisk: 'High',
      refinancingRisk: 'High',
      liquidityPosition: 1.8,
      debtToEBITDA: 4.1
    },
    {
      id: 3,
      name: 'Retail Holdings',
      ticker: 'RETL',
      sector: 'Consumer',
      totalDebt: 5.2,
      netDebt: 4.8,
      creditRating: 'BB+',
      maturities: [
        { year: '2024', amount: 0.8, type: 'Credit Facility', rate: 'SOFR + 350bps', covenant: 'EBITDA > $200M' },
        { year: '2025', amount: 1.5, type: 'Senior Notes', rate: '8.2%', covenant: 'Liquidity > $500M' },
        { year: '2026', amount: 2.9, type: 'Term Loan', rate: '7.8%', covenant: 'Asset Coverage > 1.2x' }
      ],
      covenantRisk: 'High',
      refinancingRisk: 'Medium',
      liquidityPosition: 0.9,
      debtToEBITDA: 5.8
    }
  ];

  const filteredCompanies = companies.filter(company => {
    const riskMatch = riskFilter === 'all' || 
      (riskFilter === 'high' && (company.refinancingRisk === 'High' || company.covenantRisk === 'High')) ||
      (riskFilter === 'medium' && (company.refinancingRisk === 'Medium' || company.covenantRisk === 'Medium')) ||
      (riskFilter === 'low' && (company.refinancingRisk === 'Low' || company.covenantRisk === 'Low'));
    
    const timeMatch = timeFilter === 'all' || 
      company.maturities.some(maturity => {
        if (timeFilter === '2024') return maturity.year === '2024';
        if (timeFilter === '2025') return maturity.year === '2025';
        if (timeFilter === 'near') return ['2024', '2025'].includes(maturity.year);
        return true;
      });
    
    return riskMatch && timeMatch;
  });

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getCreditRatingColor = (rating: string) => {
    if (rating.startsWith('A')) return 'text-green-400';
    if (rating.startsWith('BBB')) return 'text-blue-400';
    if (rating.startsWith('BB')) return 'text-yellow-400';
    if (rating.startsWith('B')) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMaturityColor = (year: string) => {
    const yearNum = parseInt(year);
    const currentYear = 2024;
    if (yearNum <= currentYear + 1) return 'bg-red-500/20 text-red-400';
    if (yearNum <= currentYear + 2) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  };

  const totalDebtMaturing2024 = companies.reduce((sum, company) => {
    return sum + company.maturities.filter(m => m.year === '2024').reduce((s, m) => s + m.amount, 0);
  }, 0);

  const totalDebtMaturing2025 = companies.reduce((sum, company) => {
    return sum + company.maturities.filter(m => m.year === '2025').reduce((s, m) => s + m.amount, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Capital Structure Analysis</h2>
          <p className="text-slate-400 mt-2">Debt maturity profiles and refinancing risk assessment</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Export Heatmap</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">2024 Maturities</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">${totalDebtMaturing2024.toFixed(1)}B</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-yellow-400">
            <Clock className="h-5 w-5" />
            <span className="font-medium">2025 Maturities</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">${totalDebtMaturing2025.toFixed(1)}B</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-orange-400">
            <TrendingDown className="h-5 w-5" />
            <span className="font-medium">High Risk Companies</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {companies.filter(c => c.refinancingRisk === 'High' || c.covenantRisk === 'High').length}
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 text-blue-400">
            <Building2 className="h-5 w-5" />
            <span className="font-medium">Companies Tracked</span>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{companies.length}</div>
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
            <label className="text-slate-400 text-sm">Risk Level:</label>
            <select 
              value={riskFilter} 
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="low">Low Risk</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-slate-400 text-sm">Maturity:</label>
            <select 
              value={timeFilter} 
              onChange={(e) => setTimeFilter(e.target.value)}
              className="bg-slate-700 text-white px-3 py-1 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="near">Near Term (2024-2025)</option>
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

      {/* Company Debt Profiles */}
      <div className="space-y-6">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            {/* Company Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-slate-700 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-white">{company.name}</h3>
                    <span className="text-slate-400">({company.ticker})</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-slate-400">{company.sector}</span>
                    <span className="text-slate-400">•</span>
                    <span className={`font-medium ${getCreditRatingColor(company.creditRating)}`}>
                      {company.creditRating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(company.refinancingRisk)}`}>
                    Refinancing: {company.refinancingRisk}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(company.covenantRisk)}`}>
                    Covenant: {company.covenantRisk}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Total Debt</div>
                <div className="text-2xl font-bold text-white">${company.totalDebt}B</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Net Debt</div>
                <div className="text-2xl font-bold text-white">${company.netDebt}B</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Debt/EBITDA</div>
                <div className={`text-2xl font-bold ${company.debtToEBITDA > 4 ? 'text-red-400' : 'text-white'}`}>
                  {company.debtToEBITDA}x
                </div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <div className="text-slate-400 text-sm">Liquidity</div>
                <div className={`text-2xl font-bold ${company.liquidityPosition < 1 ? 'text-red-400' : 'text-white'}`}>
                  ${company.liquidityPosition}B
                </div>
              </div>
            </div>

            {/* Maturity Schedule */}
            <div>
              <h4 className="font-medium text-white mb-4">Debt Maturity Schedule</h4>
              <div className="space-y-3">
                {company.maturities.map((maturity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center space-x-6">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMaturityColor(maturity.year)}`}>
                        {maturity.year}
                      </div>
                      <div>
                        <div className="text-white font-medium">${maturity.amount}B {maturity.type}</div>
                        <div className="text-slate-400 text-sm">Rate: {maturity.rate}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-300 text-sm">Covenant:</div>
                      <div className="text-slate-400 text-xs">{maturity.covenant}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end mt-6 pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-3">
                <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Credit Profile</span>
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Monitor Covenants
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapitalStructure;