
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowUpRight, DollarSign, Briefcase, Activity, Layers, Globe } from 'lucide-react';
import { MOCK_DEALS } from '../constants';

const COLORS = ['#1e3a8a', '#3b82f6', '#93c5fd', '#e2e8f0'];

const Dashboard: React.FC = () => {
  const dealsByStage = [
    { name: 'Sourcing', value: MOCK_DEALS.filter(d => d.stage === 'SOURCING').length },
    { name: 'LOI', value: MOCK_DEALS.filter(d => d.stage === 'LOI').length },
    { name: 'Diligence', value: MOCK_DEALS.filter(d => d.stage === 'DILIGENCE').length },
    { name: 'Closed', value: MOCK_DEALS.filter(d => d.stage === 'CLOSED').length },
  ];

  const industryData = [
    { name: 'Logistics', deals: 1 },
    { name: 'SaaS', deals: 2 },
    { name: 'Healthcare', deals: 1 },
    { name: 'Mfg', deals: 0 },
  ];

  const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
    <div className="bg-white p-4 rounded shadow-sm border border-slate-300 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <span className="text-xs font-medium text-green-600 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-1">{subtext}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Executive Dashboard</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">Market Overview & Pipeline Analytics</p>
        </div>
        <div className="text-right text-xs text-slate-400">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Active Pipeline" 
          value={MOCK_DEALS.length} 
          subtext="Across 4 stages" 
          icon={Briefcase} 
          trend="+2 MoM"
        />
        <StatCard 
          title="Avg. Deal Size" 
          value="$5.8M" 
          subtext="EBITDA Multiple: 4.2x" 
          icon={DollarSign} 
        />
        <StatCard 
          title="Network Reach" 
          value="1,242" 
          subtext="Investors & Advisors" 
          icon={Globe} 
          trend="+12"
        />
        <StatCard 
          title="Market Activity" 
          value="High" 
          subtext="Sector Volatility: Low" 
          icon={Activity} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded shadow-sm border border-slate-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase">Pipeline Distribution</h3>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="grid grid-cols-2 gap-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dealsByStage}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dealsByStage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '4px', fontSize: '12px'}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col justify-center gap-3">
                {dealsByStage.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-100 pb-1 last:border-0">
                    <div className="flex items-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                      {entry.name}
                    </div>
                    <span className="font-mono font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded shadow-sm border border-slate-300">
            <h3 className="text-sm font-bold text-slate-800 uppercase mb-4">Deal Flow by Industry</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryData} layout="vertical" margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{fontSize: 10}} />
                  <YAxis dataKey="name" type="category" tick={{fontSize: 11}} width={80} />
                  <RechartsTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '4px', fontSize: '12px'}} />
                  <Bar dataKey="deals" fill="#1e3a8a" barSize={20} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Activity Feed */}
        <div className="bg-white p-0 rounded shadow-sm border border-slate-300 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-800 uppercase">Recent Activity</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 text-sm">
                <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-slate-800 font-medium">New Deal Added: Project Alpha</p>
                  <p className="text-xs text-slate-500 mt-0.5">2 hours ago • System</p>
                </div>
              </div>
            ))}
            <div className="flex gap-3 text-sm">
               <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-green-500"></div>
               <div>
                  <p className="text-slate-800 font-medium">LOI Signed for Project Beta</p>
                  <p className="text-xs text-slate-500 mt-0.5">Yesterday • User</p>
               </div>
            </div>
          </div>
          <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
            <button className="text-xs text-blue-700 font-semibold hover:underline">View All Activity</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
