
import React, { useState } from 'react';
import { Plus, Download, Filter, PieChart, MoreHorizontal, FileText, X, Upload, Target, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { MOCK_PORTFOLIO, MOCK_FUND_METRICS } from '../constants';
import { PortfolioCompany, CompanyGoal, DealDocument } from '../types';

const Portfolio: React.FC = () => {
  const [companies, setCompanies] = useState<PortfolioCompany[]>(MOCK_PORTFOLIO);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Exited'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<PortfolioCompany | null>(null);

  // New Investment Form State
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanySector, setNewCompanySector] = useState('');
  const [newInvestmentAmount, setNewInvestmentAmount] = useState('');

  // Detail View State
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'financials' | 'goals'>('overview');
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDate, setNewGoalDate] = useState('');

  const filteredCompanies = companies.filter(c => 
    filterStatus === 'All' || c.status === filterStatus
  );

  const handleAddInvestment = () => {
    if (!newCompanyName || !newCompanySector) return;

    const newComp: PortfolioCompany = {
      id: Date.now().toString(),
      name: newCompanyName,
      sector: newCompanySector,
      vintage: new Date().getFullYear().toString(),
      investmentDate: new Date().toISOString().split('T')[0],
      initialInvestment: parseFloat(newInvestmentAmount) || 0,
      currentValue: parseFloat(newInvestmentAmount) || 0, // Starts at cost
      ownershipPercentage: 0,
      moic: 1.0,
      irr: 0.0,
      status: 'Active',
      boardSeat: false,
      lastValuationDate: new Date().toISOString().split('T')[0],
      revenue: '$0',
      ebitda: '$0',
      documents: [],
      goals: []
    };
    
    setCompanies([...companies, newComp]);
    setIsModalOpen(false);
    setNewCompanyName('');
    setNewCompanySector('');
    setNewInvestmentAmount('');
  };

  const handleAddGoal = () => {
    if (!selectedCompany || !newGoalTitle) return;
    
    const goal: CompanyGoal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      deadline: newGoalDate || new Date().toISOString().split('T')[0],
      status: 'On Track',
      progress: 0
    };
    
    const updatedCompany = { 
        ...selectedCompany, 
        goals: [...(selectedCompany.goals || []), goal] 
    };
    
    setCompanies(companies.map(c => c.id === selectedCompany.id ? updatedCompany : c));
    setSelectedCompany(updatedCompany);
    setNewGoalTitle('');
    setNewGoalDate('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedCompany && e.target.files && e.target.files[0]) {
       const file = e.target.files[0];
       const newDoc: DealDocument = {
         id: Date.now().toString(),
         name: file.name,
         uploadDate: new Date().toISOString().split('T')[0],
         size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
         type: file.name.split('.').pop()?.toUpperCase() || 'FILE'
       };
       const updatedCompany = { ...selectedCompany, documents: [...(selectedCompany.documents || []), newDoc] };
       setCompanies(companies.map(c => c.id === selectedCompany.id ? updatedCompany : c));
       setSelectedCompany(updatedCompany);
    }
  };

  const downloadCSV = () => {
    const headers = ['Company', 'Sector', 'Vintage', 'Invested ($M)', 'Fair Value ($M)', 'Revenue', 'EBITDA', 'MOIC', 'IRR %', 'Status'];
    const csvRows = [headers.join(',')];

    for (const c of filteredCompanies) {
      const row = [
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.sector.replace(/"/g, '""')}"`,
        c.vintage,
        c.initialInvestment.toFixed(2),
        c.currentValue.toFixed(2),
        `"${c.revenue}"`,
        `"${c.ebitda}"`,
        c.moic.toFixed(2) + 'x',
        c.irr.toFixed(1) + '%',
        c.status
      ];
      csvRows.push(row.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `portfolio_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const MetricCard = ({ label, value, subtext, positive }: any) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      {subtext && (
        <p className={`text-xs mt-1 ${positive ? 'text-green-600' : 'text-slate-400'}`}>
          {subtext}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Portfolio Management</h2>
          <p className="text-slate-500 text-sm mt-1">Fund II • Vintage 2016 • Growth Equity</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Investment
          </button>
          <button onClick={downloadCSV} className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </header>

      {/* Fund Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard label="Total AUM" value={`$${MOCK_FUND_METRICS.aum}M`} subtext="Committed Capital" />
        <MetricCard label="Invested" value={`$${MOCK_FUND_METRICS.deployedCapital}M`} subtext={`${((MOCK_FUND_METRICS.deployedCapital / MOCK_FUND_METRICS.aum) * 100).toFixed(1)}% Deployed`} />
        <MetricCard label="Net IRR" value={`${MOCK_FUND_METRICS.netIrr}%`} subtext="Top Quartile" positive />
        <MetricCard label="TVPI" value={`${MOCK_FUND_METRICS.tvpi}x`} subtext="Total Value" positive />
        <MetricCard label="DPI" value={`${MOCK_FUND_METRICS.dpi}x`} subtext="Distributed" />
      </div>

      {/* Main Holdings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex-grow flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Holdings</h3>
          </div>
          <div className="flex gap-2">
            {['All', 'Active', 'Exited'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-3 py-1 text-xs font-medium rounded-full border ${
                  filterStatus === status 
                    ? 'bg-slate-800 text-white border-slate-800' 
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sector</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vintage</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Invested ($M)</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Fair Value ($M)</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Own. %</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">MOIC</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">IRR</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-sm">
              {filteredCompanies.map((company) => (
                <tr 
                  key={company.id} 
                  onClick={() => setSelectedCompany(company)}
                  className="hover:bg-blue-50/50 transition-colors group cursor-pointer"
                >
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-slate-900 group-hover:text-blue-700">{company.name}</div>
                    {company.boardSeat && <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1 rounded border border-blue-100">Board Seat</span>}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600">{company.sector}</td>
                  <td className="py-3 px-4 text-slate-600">{company.vintage}</td>
                  <td className="py-3 px-4 text-right text-slate-700">{company.initialInvestment.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">{company.currentValue.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right text-slate-600">{company.ownershipPercentage}%</td>
                  <td className={`py-3 px-4 text-right font-medium ${company.moic >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {company.moic.toFixed(2)}x
                  </td>
                  <td className={`py-3 px-4 text-right font-medium ${company.irr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {company.irr.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
                      company.status === 'Active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      company.status === 'Exited' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 font-medium text-xs border-t border-slate-200">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900" colSpan={3}>Total Portfolio</td>
                <td className="py-3 px-4 text-right text-slate-900">{filteredCompanies.reduce((acc, c) => acc + c.initialInvestment, 0).toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-slate-900">{filteredCompanies.reduce((acc, c) => acc + c.currentValue, 0).toFixed(2)}</td>
                <td colSpan={5}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add Investment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add Portfolio Company</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sector</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={newCompanySector}
                  onChange={e => setNewCompanySector(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Investment ($M)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={newInvestmentAmount}
                  onChange={e => setNewInvestmentAmount(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm">Cancel</button>
                <button 
                  onClick={handleAddInvestment} 
                  disabled={!newCompanyName || !newCompanySector}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Company View Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900 bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50 sticky top-0 z-20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedCompany.name}</h2>
                  <p className="text-slate-500 text-sm">{selectedCompany.sector} • Vintage {selectedCompany.vintage}</p>
                </div>
                <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="flex gap-6 mt-4">
                <div className="text-center px-4 py-2 bg-white rounded border border-slate-200 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Invested</p>
                  <p className="text-lg font-bold text-slate-900">${selectedCompany.initialInvestment}M</p>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded border border-slate-200 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Current Value</p>
                  <p className="text-lg font-bold text-slate-900">${selectedCompany.currentValue}M</p>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded border border-slate-200 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-slate-400">MOIC</p>
                  <p className={`text-lg font-bold ${selectedCompany.moic >= 1 ? 'text-green-600' : 'text-red-600'}`}>{selectedCompany.moic}x</p>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded border border-slate-200 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-slate-400">IRR</p>
                  <p className={`text-lg font-bold ${selectedCompany.irr >= 0 ? 'text-green-600' : 'text-red-600'}`}>{selectedCompany.irr}%</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 mt-8 border-b border-slate-200">
                {['overview', 'docs', 'financials', 'goals'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                      activeTab === tab 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab === 'docs' ? 'Documents' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow">
              
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Ownership</h4>
                      <p className="text-sm text-slate-900">{selectedCompany.ownershipPercentage}% Equity</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Board Status</h4>
                      <p className="text-sm text-slate-900">{selectedCompany.boardSeat ? 'Board Seat Held' : 'Observer / No Seat'}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Investment Date</h4>
                      <p className="text-sm text-slate-900">{selectedCompany.investmentDate}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Last Valuation</h4>
                      <p className="text-sm text-slate-900">{selectedCompany.lastValuationDate}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financials' && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 uppercase mb-4">Latest Performance</h3>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Annual Revenue</p>
                        <p className="text-3xl font-bold text-slate-900">{selectedCompany.revenue}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">EBITDA</p>
                        <p className="text-3xl font-bold text-slate-900">{selectedCompany.ebitda}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 uppercase mb-2">Profitability Analysis</h3>
                    <p className="text-sm text-slate-600">
                      Based on current EBITDA of {selectedCompany.ebitda} vs Revenue of {selectedCompany.revenue}, 
                      the company is {selectedCompany.ebitda.includes('-') ? 'operating at a loss' : 'profitable'}.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-slate-800 text-sm">Data Room</h3>
                    <label className="cursor-pointer flex items-center gap-2 text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100 transition-colors">
                      <Upload className="w-3 h-3" /> Upload File
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                  {(!selectedCompany.documents || selectedCompany.documents.length === 0) ? (
                    <div className="text-center py-8 bg-slate-50 rounded border border-dashed border-slate-200 text-slate-400 text-sm">
                      No documents available (CIM, Financials, Cap Table)
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedCompany.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 text-red-600 rounded">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                              <p className="text-[10px] text-slate-400">{doc.uploadDate} • {doc.size}</p>
                            </div>
                          </div>
                          <button className="text-blue-600 text-xs hover:underline">Download</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'goals' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-sm">Strategic Milestones</h3>
                    </div>
                    <div className="p-4 space-y-4">
                      {(!selectedCompany.goals || selectedCompany.goals.length === 0) && (
                        <p className="text-sm text-slate-400 text-center py-4">No goals tracked yet.</p>
                      )}
                      {selectedCompany.goals && selectedCompany.goals.map((goal, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg">
                          <div className={`p-2 rounded-full flex-shrink-0 ${
                            goal.status === 'Completed' ? 'bg-green-100 text-green-600' :
                            goal.status === 'At Risk' ? 'bg-red-100 text-red-600' :
                            goal.status === 'Delayed' ? 'bg-amber-100 text-amber-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {goal.status === 'Completed' ? <CheckCircle className="w-4 h-4" /> :
                             goal.status === 'At Risk' ? <AlertTriangle className="w-4 h-4" /> :
                             goal.status === 'Delayed' ? <Clock className="w-4 h-4" /> :
                             <Target className="w-4 h-4" />}
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-slate-900">{goal.title}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                goal.status === 'Completed' ? 'bg-green-50 text-green-700' :
                                goal.status === 'At Risk' ? 'bg-red-50 text-red-700' :
                                'bg-blue-50 text-blue-700'
                              }`}>{goal.status}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    goal.status === 'Completed' ? 'bg-green-500' : 
                                    goal.status === 'At Risk' ? 'bg-red-500' : 
                                    'bg-blue-500'
                                  }`} 
                                  style={{ width: `${goal.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-slate-400 whitespace-nowrap">Due {goal.deadline}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Add New Goal</h4>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Goal Title (e.g. Hire CFO)" 
                        className="flex-grow px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                      />
                      <input 
                        type="date" 
                        className="w-32 px-3 py-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                        value={newGoalDate}
                        onChange={(e) => setNewGoalDate(e.target.value)}
                      />
                      <button 
                        onClick={handleAddGoal}
                        disabled={!newGoalTitle}
                        className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
