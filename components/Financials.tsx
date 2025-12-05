
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, Activity, PieChart, BarChart2, RefreshCw, Calendar } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { getStockQuote, getMarketOverview, getUpcomingIPOs, StockQuote, IPOData } from '../services/massiveService';

const Financials: React.FC = () => {
  const [symbol, setSymbol] = useState('AAPL');
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [ipoData, setIpoData] = useState<IPOData[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  // Generate some dummy chart data for visualization
  const generateChartData = () => {
    const data = [];
    let val = 150;
    for (let i = 0; i < 30; i++) {
      val = val + (Math.random() * 10 - 5);
      data.push({
        date: `Day ${i + 1}`,
        value: Math.abs(val)
      });
    }
    return data;
  };

  const fetchData = async (sym: string) => {
    setLoading(true);
    try {
      const [qData, mData, iData] = await Promise.all([
        getStockQuote(sym),
        getMarketOverview(),
        getUpcomingIPOs()
      ]);
      setQuote(qData);
      setMarketData(mData);
      setIpoData(iData);
      setChartData(generateChartData());
    } catch (error) {
      console.error("Failed to load financial data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(symbol);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol) fetchData(symbol);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Financial Data</h2>
          <p className="text-slate-500 mt-1">Real-time market insights powered by Massive.com</p>
        </div>
      </header>

      {/* Market Ticker Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {marketData.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">{item.name}</p>
              <p className="text-lg font-bold text-slate-900">{item.value.toLocaleString()}</p>
            </div>
            <div className={`flex items-center text-sm font-medium ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {item.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {item.change}%
            </div>
          </div>
        ))}
      </div>

      {/* Search & Main Quote Area */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="Enter Symbol (e.g., MSFT)"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
          </form>
          <button onClick={() => fetchData(symbol)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-400">Loading market data...</p>
          </div>
        ) : quote ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Key Metrics Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-4xl font-bold text-slate-900 flex items-baseline gap-3">
                  ${quote.price.toFixed(2)}
                  <span className={`text-lg font-medium px-2 py-1 rounded ${quote.changePercent >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {quote.changePercent > 0 ? '+' : ''}{quote.changePercent}%
                  </span>
                </h3>
                <p className="text-slate-500 font-medium mt-1">{quote.symbol} • Real-time Quote</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Market Cap</p>
                  <p className="font-semibold text-slate-900">{quote.marketCap}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Volume</p>
                  <p className="font-semibold text-slate-900">{quote.volume}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">P/E Ratio</p>
                  <p className="font-semibold text-slate-900">{quote.peRatio}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">52W Range</p>
                  <p className="font-semibold text-slate-900 text-xs">{quote.low52} - {quote.high52}</p>
                </div>
              </div>
            </div>

            {/* Chart Column */}
            <div className="lg:col-span-2 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={['auto', 'auto']} orientation="right" tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            Enter a symbol to view data
          </div>
        )}
      </div>

      {/* Bottom Section: IPOs and Other Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming IPOs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Upcoming IPOs</h3>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {ipoData.length > 0 ? (
              ipoData.map((ipo, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                  <div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{ipo.symbol || 'TBD'}</span>
                    <p className="text-sm font-medium text-slate-900 mt-1">{ipo.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Expected: {ipo.filingDate}</p>
                    <p className="text-sm font-semibold text-slate-700">{ipo.offeringPrice || 'Price TBD'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm text-center py-4">No IPO data available</p>
            )}
          </div>
        </div>

        {/* Sector/Performance (Placeholder for now) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900">Sector Allocation</h3>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-48 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <span>Sector Breakdown Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financials;
