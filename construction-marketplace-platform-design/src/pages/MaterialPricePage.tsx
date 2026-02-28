import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { materialPrices } from '../data/mockData';

const materialCategories = ['All', 'Cement', 'Steel', 'Wood', 'Electrical', 'Plumbing'];

export default function MaterialPricePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<typeof materialPrices[0] | null>(null);

  const filtered = materialPrices.filter(m => {
    const catMatch = activeCategory === 'All' || m.category === activeCategory;
    const searchMatch = m.name.toLowerCase().includes(search.toLowerCase()) || m.brand.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });

  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><BarChart3 size={24} /></div>
            <div>
              <h1 className="text-3xl font-bold">Material Price Tracker</h1>
              <p className="text-green-200">Real-time market prices to prevent overcharging</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search materials..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {materialCategories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Price List */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.map((m, i) => (
              <button key={i} onClick={() => setSelectedMaterial(m)}
                className={`w-full bg-white rounded-xl p-4 border transition-all text-left hover:shadow-md ${
                  selectedMaterial?.name === m.name ? 'border-green-500 shadow-md' : 'border-gray-100'
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{m.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">{m.category}</span>
                    </div>
                    <span className="text-sm text-gray-400">{m.brand}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{m.price.toLocaleString('en-IN')}</p>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      m.change > 0 ? 'text-green-600' : m.change < 0 ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {m.change > 0 ? <TrendingUp size={14} /> : m.change < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
                      {m.change > 0 ? '+' : ''}{m.change}%
                    </div>
                  </div>
                </div>
                {/* Mini sparkline */}
                <div className="mt-3 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={m.history.map((v, idx) => ({ v, m: months[idx] }))}>
                      <Line type="monotone" dataKey="v" stroke={m.change >= 0 ? '#16a34a' : '#dc2626'} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </button>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedMaterial ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{selectedMaterial.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{selectedMaterial.brand} | {selectedMaterial.category}</p>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-500">Current Price</p>
                  <p className="text-3xl font-bold text-gray-900">₹{selectedMaterial.price.toLocaleString('en-IN')}</p>
                  <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${
                    selectedMaterial.change > 0 ? 'text-green-600' : selectedMaterial.change < 0 ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    {selectedMaterial.change > 0 ? <TrendingUp size={14} /> : selectedMaterial.change < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
                    {selectedMaterial.change > 0 ? '+' : ''}{selectedMaterial.change}% this month
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-700 mb-2">6-Month Trend</p>
                <div className="h-40 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedMaterial.history.map((v, i) => ({ month: months[i], price: v }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip formatter={(value) => [`₹${value}`, 'Price']} />
                      <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">6M High</span>
                    <span className="font-medium text-gray-700">₹{Math.max(...selectedMaterial.history).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">6M Low</span>
                    <span className="font-medium text-gray-700">₹{Math.min(...selectedMaterial.history).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Avg Price</span>
                    <span className="font-medium text-gray-700">₹{Math.round(selectedMaterial.history.reduce((a, b) => a + b, 0) / selectedMaterial.history.length).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center sticky top-24">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 size={28} className="text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Select a Material</h3>
                <p className="text-sm text-gray-400">Click on any material to view detailed price trends and history.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
