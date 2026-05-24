import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Building2, 
  Clock,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const metrics = [
    {
      title: 'Active Deal Rumors',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-blue-400'
    },
    {
      title: 'M&A Transactions',
      value: '$127.8B',
      change: '+8.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      title: 'Companies Tracked',
      value: '1,247',
      change: '+2.1%',
      trend: 'up',
      icon: Building2,
      color: 'text-purple-400'
    },
    {
      title: 'Upcoming Maturities',
      value: '89',
      change: '-5.2%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-400'
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'Deal Rumor',
      company: 'TechCorp Inc.',
      message: 'Increased legal activity detected - Skadden hiring surge',
      confidence: 'High',
      time: '2 hours ago',
      priority: 'high'
    },
    {
      id: 2,
      type: 'SEC Filing',
      company: 'Global Industries',
      message: 'Material change in risk factors section',
      confidence: 'Medium',
      time: '4 hours ago',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'Management Commentary',
      company: 'Retail Holdings',
      message: 'Strategic language shift detected in earnings call',
      confidence: 'High',
      time: '6 hours ago',
      priority: 'high'
    }
  ];

  const topDeals = [
    {
      acquirer: 'MegaCorp Ltd.',
      target: 'DataSystems Inc.',
      value: '$12.4B',
      multiple: '15.2x',
      sector: 'Technology',
      status: 'Announced'
    },
    {
      acquirer: 'Industrial Partners',
      target: 'Manufacturing Co.',
      value: '$8.7B',
      multiple: '12.8x',
      sector: 'Industrial',
      status: 'Pending'
    },
    {
      acquirer: 'Health Ventures',
      target: 'BioTech Solutions',
      value: '$5.9B',
      multiple: '18.4x',
      sector: 'Healthcare',
      status: 'Completed'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Market Intelligence Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Live Data</span>
          </div>
          <span>•</span>
          <span>Last updated: 2 min ago</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg bg-slate-700 ${metric.color}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
                <p className="text-slate-400 text-sm mt-1">{metric.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-xl font-semibold text-white">Recent Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 bg-slate-700/50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    alert.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{alert.company}</span>
                      <span className="text-xs text-slate-400">{alert.time}</span>
                    </div>
                    <p className="text-slate-300 text-sm mt-1">{alert.message}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                        {alert.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        alert.confidence === 'High' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {alert.confidence} Confidence
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top M&A Deals */}
        <div className="bg-slate-800 rounded-xl border border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h3 className="text-xl font-semibold text-white">Recent M&A Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topDeals.map((deal, index) => (
                <div key={index} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-white">{deal.acquirer}</h4>
                      <p className="text-slate-400 text-sm">acquiring {deal.target}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      deal.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      deal.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {deal.status}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-green-400 font-medium">{deal.value}</span>
                      <span className="text-slate-400">{deal.multiple} EV/EBITDA</span>
                    </div>
                    <span className="text-slate-400">{deal.sector}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Overview Chart Placeholder */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Deal Activity Trends</h3>
        <div className="h-64 bg-slate-700/30 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400">Interactive chart visualization would appear here</p>
            <p className="text-slate-500 text-sm mt-1">Showing M&A volume and deal value trends</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;