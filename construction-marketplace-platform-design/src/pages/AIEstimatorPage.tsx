import { useState } from 'react';
import { Brain, Calculator, Clock, Package, Sparkles, IndianRupee, Ruler, Layers } from 'lucide-react';

const serviceTypes = ['Interior Design', 'Renovation', 'Furniture', 'Plumbing', 'Electrical', 'Full Construction'];
const qualityLevels = [
  { label: 'Economy', multiplier: 1, desc: 'Budget-friendly materials' },
  { label: 'Standard', multiplier: 1.5, desc: 'Good quality materials' },
  { label: 'Premium', multiplier: 2.2, desc: 'High-end imported materials' },
  { label: 'Luxury', multiplier: 3.5, desc: 'Top-tier luxury finishes' },
];

const baseCosts: Record<string, number> = {
  'Interior Design': 800,
  'Renovation': 650,
  'Furniture': 500,
  'Plumbing': 200,
  'Electrical': 150,
  'Full Construction': 1800,
};

export default function AIEstimatorPage() {
  const [service, setService] = useState('');
  const [area, setArea] = useState('');
  const [quality, setQuality] = useState('');
  const [rooms, setRooms] = useState('');
  const [result, setResult] = useState<{ min: number; max: number; duration: string; materials: string[] } | null>(null);
  const [calculating, setCalculating] = useState(false);

  const calculate = () => {
    if (!service || !area || !quality) return;
    setCalculating(true);
    setTimeout(() => {
      const base = baseCosts[service] || 800;
      const q = qualityLevels.find(ql => ql.label === quality);
      const mult = q?.multiplier || 1;
      const sqft = parseInt(area) || 1000;
      const r = parseInt(rooms) || 3;
      const min = Math.round(base * sqft * mult * 0.85);
      const max = Math.round(base * sqft * mult * 1.15);
      const days = Math.round((sqft / 100) * mult * r * 1.5);
      const materialMap: Record<string, string[]> = {
        'Interior Design': ['Plywood BWR', 'Laminate/Veneer', 'Hardware', 'Paint', 'Lighting', 'Tiles'],
        'Renovation': ['Cement', 'Sand', 'Tiles', 'Paint', 'Plumbing Fittings', 'Electrical'],
        'Furniture': ['Teak/Sal Wood', 'Plywood', 'Laminate', 'Hardware', 'Glass'],
        'Plumbing': ['CPVC Pipes', 'Fittings', 'Mixer Taps', 'Sanitaryware'],
        'Electrical': ['Copper Wire', 'Switches', 'MCB Panel', 'LED Lights'],
        'Full Construction': ['Cement', 'Steel TMT', 'Bricks/Blocks', 'Sand', 'Aggregate', 'Plumbing', 'Electrical', 'Paint'],
      };
      setResult({ min, max, duration: `${days} - ${days + 15} days`, materials: materialMap[service] || [] });
      setCalculating(false);
    }, 1500);
  };

  const fmt = (n: number) => new Intl.NumberFormat('en-IN').format(n);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-purple-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><Brain size={24} /></div>
            <div>
              <h1 className="text-3xl font-bold">AI Cost Estimator</h1>
              <p className="text-primary-200">Get instant rough estimates before bidding</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles size={20} className="text-purple-500" /> Project Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Layers size={14} className="inline mr-1" /> Service Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {serviceTypes.map(s => (
                    <button key={s} onClick={() => setService(s)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        service === s ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler size={14} className="inline mr-1" /> Area (sq.ft)
                </label>
                <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. 1200"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Rooms</label>
                <input type="number" value={rooms} onChange={e => setRooms(e.target.value)} placeholder="e.g. 3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {qualityLevels.map(q => (
                    <button key={q.label} onClick={() => setQuality(q.label)}
                      className={`px-3 py-3 rounded-xl text-left border transition-all ${
                        quality === q.label ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <span className={`text-sm font-semibold ${quality === q.label ? 'text-primary-700' : 'text-gray-700'}`}>{q.label}</span>
                      <span className="block text-xs text-gray-400 mt-0.5">{q.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={calculate} disabled={!service || !area || !quality || calculating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-primary-600 text-white font-semibold hover:shadow-lg hover:shadow-primary-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {calculating ? (
                  <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Calculating...</>
                ) : (
                  <><Calculator size={18} /> Get Estimate</>
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 animate-slide-up">
                <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Brain size={18} className="text-purple-500" /> AI Estimate
                </h3>
                <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-5 mb-5">
                  <p className="text-sm text-gray-500 mb-1">Estimated Cost Range</p>
                  <p className="text-2xl font-bold text-gray-900 flex items-center">
                    <IndianRupee size={22} /> {fmt(result.min)} - {fmt(result.max)}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Clock size={18} className="text-primary-500" />
                    <div>
                      <p className="text-xs text-gray-400">Duration</p>
                      <p className="text-sm font-semibold text-gray-700">{result.duration}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Package size={14} /> Materials Required
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.materials.map(m => (
                        <span key={m} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                    <p className="text-xs text-yellow-700">⚠️ This is an AI-generated rough estimate. Final costs may vary based on site conditions, material availability, and company quotations.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
                  <Brain size={28} className="text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">Enter Project Details</h3>
                <p className="text-sm text-gray-400">Fill in the form to get an instant AI-powered cost estimate for your project.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
