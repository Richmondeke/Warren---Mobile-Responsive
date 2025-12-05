
import React, { useState } from 'react';
import { Plus, FileText, Upload, MoreHorizontal, Sparkles, X, GripHorizontal, Columns, Globe, ArrowRight, DollarSign, Briefcase, Eye, Share2, Search, Bell, LayoutList, Kanban } from 'lucide-react';
import { MOCK_DEALS, MOCK_NETWORK_DEALS } from '../constants';
import { Deal, DealStage, NetworkDeal } from '../types';
import { generateDealDescription } from '../services/geminiService';

const INITIAL_STAGES: { id: string; label: string; color: string }[] = [
  { id: 'SOURCING', label: 'Sourcing', color: 'bg-slate-100 border-slate-200' },
  { id: 'NDA_SIGNED', label: 'NDA Signed', color: 'bg-blue-50 border-blue-200' },
  { id: 'LOI', label: 'LOI Submitted', color: 'bg-indigo-50 border-indigo-200' },
  { id: 'DILIGENCE', label: 'Due Diligence', color: 'bg-purple-50 border-purple-200' },
  { id: 'CLOSED', label: 'Closed', color: 'bg-green-50 border-green-200' },
];

const DealFlow: React.FC = () => {
  const [viewMode, setViewMode] = useState<'LIST' | 'BOARD'>('LIST');
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);
  const [networkDeals, setNetworkDeals] = useState<NetworkDeal[]>(MOCK_NETWORK_DEALS);
  const [stages, setStages] = useState(INITIAL_STAGES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null); // For detail view
  
  // Drag and Drop State
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [draggedStageId, setDraggedStageId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  
  // New Deal Form State
  const [newDealName, setNewDealName] = useState('');
  const [newDealIndustry, setNewDealIndustry] = useState('');
  const [newDealHighlights, setNewDealHighlights] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // New Stage Form State
  const [newStageName, setNewStageName] = useState('');

  const handleGenerateDesc = async () => {
    if (!newDealName || !newDealIndustry) return;
    setIsGenerating(true);
    try {
      const desc = await generateDealDescription({
        companyName: newDealName,
        industry: newDealIndustry,
        keyHighlights: newDealHighlights
      });
      setGeneratedDesc(desc);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddDeal = () => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      title: newDealName,
      companyName: newDealName,
      industry: newDealIndustry,
      revenue: 'TBD',
      ebitda: 'TBD',
      stage: 'SOURCING',
      description: generatedDesc || newDealHighlights,
      notes: '',
      documents: []
    };
    setDeals([...deals, newDeal]);
    setIsModalOpen(false);
    setNewDealName('');
    setNewDealIndustry('');
    setNewDealHighlights('');
    setGeneratedDesc('');
  };

  // ... (Keep existing drag/drop handlers for Board View)
  const handleDragStart = (e: React.DragEvent, type: 'DEAL' | 'STAGE', id: string) => {
    e.dataTransfer.setData('type', type);
    e.dataTransfer.setData('id', id);
    e.dataTransfer.effectAllowed = 'move';
    if (type === 'DEAL') setDraggedDealId(id);
    if (type === 'STAGE') setDraggedStageId(id);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');
    const sourceId = e.dataTransfer.getData('id');

    if (type === 'STAGE' && sourceId !== targetStageId) {
      // Reorder stages logic
      const sourceIndex = stages.findIndex(s => s.id === sourceId);
      const targetIndex = stages.findIndex(s => s.id === targetStageId);
      if (sourceIndex > -1 && targetIndex > -1) {
        const newStages = [...stages];
        const [removed] = newStages.splice(sourceIndex, 1);
        newStages.splice(targetIndex, 0, removed);
        setStages(newStages);
      }
    } else if (type === 'DEAL' && sourceId) {
      setDeals(prevDeals => prevDeals.map(deal => 
        deal.id === sourceId ? { ...deal, stage: targetStageId as DealStage } : deal
      ));
    }
    setDraggedDealId(null);
    setDraggedStageId(null);
    setDragOverStage(null);
  };

  const handleDragEnd = () => {
    setDraggedDealId(null);
    setDraggedStageId(null);
    setDragOverStage(null);
  };

  const StatBox = ({ icon, label, value }: any) => (
    <div className="border border-slate-100 bg-white p-3 rounded-xl flex flex-col justify-between h-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2 text-slate-400">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <span className="font-bold text-slate-800 text-sm">{value}</span>
    </div>
  );

  return (
    <div className="h-full flex flex-col max-w-[1600px] mx-auto">
      {/* Custom Header matching the screenshot */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Hi Kevin! <span className="text-slate-500 font-medium">Let's Dive Into Your Flow Deck.</span>
          </h2>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Startups.." 
              className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-full w-full md:w-64 text-sm focus:ring-2 focus:ring-slate-200 outline-none transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-100 rounded-full shadow-sm hover:shadow-md transition-all relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow">
        {/* Sub-header / Title Area */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Flow Deck</h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('LIST')}
              className={`p-2 rounded-md transition-all ${viewMode === 'LIST' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutList className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('BOARD')}
              className={`p-2 rounded-md transition-all ${viewMode === 'BOARD' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Kanban className="w-5 h-5" />
            </button>
          </div>
        </div>

        {viewMode === 'LIST' ? (
          <div className="space-y-6">
            {deals.map((deal, idx) => (
              <div key={deal.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row gap-8 relative overflow-hidden group">
                
                {/* Left Content */}
                <div className="flex-1 z-10">
                  {/* Header Row */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                        {deal.companyName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{deal.companyName}</h3>
                        <p className="text-slate-500 text-sm">San Francisco, California</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl font-bold text-slate-900">{deal.revenue === 'TBD' ? '$10,000' : deal.revenue}</h3>
                      <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-medium">Safe Investment</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="border border-slate-100 bg-white p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase"><Briefcase className="w-3 h-3"/> Stage</div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">Seed</span>
                        <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">All</span>
                      </div>
                    </div>
                    <div className="border border-slate-100 bg-white p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase"><FileText className="w-3 h-3"/> Type</div>
                      <span className="font-bold text-slate-800 text-sm">Safe Or Notes</span>
                    </div>
                    <div className="border border-slate-100 bg-white p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase"><Globe className="w-3 h-3"/> Founders</div>
                      <span className="font-bold text-slate-800 text-sm">3 Founders</span>
                    </div>
                    <div className="border border-slate-100 bg-white p-3 rounded-xl">
                      <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs font-bold uppercase"><TrendingUpIcon className="w-3 h-3"/> Traction</div>
                      <span className="font-bold text-slate-800 text-sm">123% YoY</span>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-100">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {deal.description} 
                      {/* Filler text for visual balance if description is short */}
                      <span className="opacity-60"> Renowned for redefining consumer experiences through relentless innovation. From the iPhone to the MacBook, they have built a hardware, software, and services ecosystem that powers billions of users globally.</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-sm">
                        View Term Sheet
                      </button>
                      <button 
                        onClick={() => setActiveDeal(deal)}
                        className="px-5 py-2.5 bg-[#0F172A] text-white font-semibold rounded-xl text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                      >
                        View Pitch Deck
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                      <span className="flex items-center gap-1.5 hover:text-slate-800 cursor-pointer"><Eye className="w-4 h-4" /> 100K Views</span>
                      <span className="flex items-center gap-1.5 hover:text-slate-800 cursor-pointer"><Share2 className="w-4 h-4" /> Share</span>
                    </div>
                  </div>
                </div>

                {/* Right Image (Mock) */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                  <div className="h-40 w-full rounded-2xl overflow-hidden shadow-md relative group-hover:scale-[1.02] transition-transform duration-300">
                    <img 
                      src={`https://source.unsplash.com/random/400x300?tech,startup&sig=${idx}`} 
                      alt="Deal Cover" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Kanban Board View */
          <div className="overflow-x-auto pb-6 h-[calc(100vh-200px)]">
            <div className="flex gap-6 min-w-max h-full">
              {stages.map((stage) => {
                const stageDeals = deals.filter(d => d.stage === stage.id);
                const isDragOver = dragOverStage === stage.id;
                
                return (
                  <div 
                    key={stage.id} 
                    className={`
                      w-80 flex-shrink-0 flex flex-col h-full rounded-2xl transition-all duration-200 bg-slate-50/50 border border-slate-100
                      ${isDragOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                    `}
                    onDragOver={(e) => handleDragOver(e, stage.id)}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    <div className={`flex items-center justify-between px-4 py-4 rounded-t-2xl`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stage.id === 'CLOSED' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                        <h3 className="font-bold text-slate-700">{stage.label}</h3>
                      </div>
                      <span className="bg-white text-slate-400 text-xs px-2.5 py-1 rounded-full font-bold border border-slate-100">
                        {stageDeals.length}
                      </span>
                    </div>
                    <div className="p-3 flex-grow space-y-3 overflow-y-auto">
                      {stageDeals.map((deal) => (
                        <div 
                          key={deal.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, 'DEAL', deal.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setActiveDeal(deal)}
                          className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md cursor-grab active:cursor-grabbing transition-all group relative"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                              {deal.companyName.charAt(0)}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-50 px-2 py-1 rounded-md">{deal.industry}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-1">{deal.title}</h4>
                          <p className="text-xs text-slate-500 line-clamp-1 mb-3">{deal.companyName}</p>
                          <div className="pt-3 border-t border-slate-50 flex justify-between text-xs font-medium text-slate-600">
                             <span>{deal.revenue} Rev</span>
                             <span>{deal.ebitda} EBITDA</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Deal Modal (Simplified for brevity, keep existing logic) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
           {/* ... Keep existing modal content ... */}
           <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Add New Deal</h3>
              <input className="w-full border p-2 mb-2 rounded" placeholder="Company Name" value={newDealName} onChange={e => setNewDealName(e.target.value)} />
              <button onClick={handleAddDeal} className="w-full bg-black text-white p-2 rounded-lg font-bold">Add</button>
              <button onClick={() => setIsModalOpen(false)} className="w-full mt-2 text-slate-500 text-sm">Cancel</button>
           </div>
        </div>
      )}

      {/* Deal Detail Overlay */}
      {activeDeal && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 p-8">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900">{activeDeal.companyName}</h2>
                <button onClick={() => setActiveDeal(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X className="w-6 h-6"/></button>
             </div>
             <p className="text-lg text-slate-600 leading-relaxed mb-8">{activeDeal.description}</p>
             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-6 rounded-2xl">
                   <span className="text-sm text-slate-500 font-bold uppercase">Revenue</span>
                   <div className="text-3xl font-bold text-slate-900 mt-1">{activeDeal.revenue}</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl">
                   <span className="text-sm text-slate-500 font-bold uppercase">EBITDA</span>
                   <div className="text-3xl font-bold text-slate-900 mt-1">{activeDeal.ebitda}</div>
                </div>
             </div>
             {/* Placeholders for Deal Room / Chat */}
             <div className="border-t border-slate-100 pt-8">
                <h3 className="font-bold text-xl mb-4">Deal Room</h3>
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400">
                   Secure Data Room Access Required
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon
const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default DealFlow;
