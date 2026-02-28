import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight, ChevronLeft, CheckCircle2, Upload, Ruler, Clock, IndianRupee, Layers, Package, Leaf } from 'lucide-react';
import { useApp } from '../App';

const steps = ['Service Type', 'Project Details', 'Materials', 'Timeline & Budget', 'Review'];
const services = [
  { label: 'Interior Design', icon: '🎨', desc: 'Complete interior solutions' },
  { label: 'Renovation', icon: '🏠', desc: 'Upgrade & remodel spaces' },
  { label: 'Construction', icon: '🏗️', desc: 'New construction projects' },
  { label: 'Furniture', icon: '🪑', desc: 'Custom furniture making' },
  { label: 'Electrical', icon: '⚡', desc: 'Wiring & electrical work' },
  { label: 'Plumbing', icon: '🔧', desc: 'Pipes, fittings & fixtures' },
];

const materialOptions: Record<string, string[]> = {
  'Cement': ['UltraTech', 'ACC', 'Ambuja', 'Birla', 'No Preference'],
  'Steel': ['TATA Steel', 'JSW', 'SAIL', 'Vizag Steel', 'No Preference'],
  'Wood': ['Teak', 'Sal', 'Plywood BWR', 'MDF', 'No Preference'],
  'Electrical': ['Havells', 'Polycab', 'Finolex', 'No Preference'],
  'Plumbing': ['Jaquar', 'Hindware', 'Cera', 'Astral', 'No Preference'],
  'Paint': ['Asian Paints', 'Berger', 'Nerolac', 'Dulux', 'No Preference'],
};

export default function QuotationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [service, setService] = useState('');
  const [area, setArea] = useState('');
  const [rooms, setRooms] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<Record<string, string>>({});
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [greenMode, setGreenMode] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { role } = useApp();
  const navigate = useNavigate();

  const toggleMaterial = (category: string, brand: string) => {
    setSelectedMaterials(prev => ({ ...prev, [category]: brand }));
  };

  const canNext = () => {
    if (currentStep === 0) return !!service;
    if (currentStep === 1) return !!area;
    if (currentStep === 3) return !!budget && !!timeline;
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (role !== 'user') {
      setTimeout(() => navigate('/auth'), 2000);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quotation Request Submitted!</h2>
          <p className="text-gray-500 mb-6 max-w-md">Your request has been sent to verified companies. You'll start receiving competitive bids within 24 hours.</p>
          <button onClick={() => navigate(role === 'user' ? '/user-dashboard' : '/auth')}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700">
            {role === 'user' ? 'Go to Dashboard' : 'Login to Track'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <FileText size={20} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Request Quotation</h1>
              <p className="text-sm text-gray-500">Fill in your project details to receive competitive bids</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-1">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 flex items-center gap-1">
                <div className={`flex items-center gap-1.5 ${i <= currentStep ? 'text-primary-600' : 'text-gray-300'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < currentStep ? 'bg-primary-600 text-white' : i === currentStep ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i < currentStep ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:inline">{step}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < currentStep ? 'bg-primary-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {/* Step 0: Service Type */}
          {currentStep === 0 && (
            <div className="animate-slide-up">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2"><Layers size={20} /> Select Service Type</h2>
              <p className="text-gray-500 mb-6">What type of work do you need?</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.map(s => (
                  <button key={s.label} onClick={() => setService(s.label)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      service === s.label ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                    }`}>
                    <span className="text-2xl">{s.icon}</span>
                    <p className={`font-semibold mt-2 ${service === s.label ? 'text-primary-700' : 'text-gray-900'}`}>{s.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Project Details */}
          {currentStep === 1 && (
            <div className="animate-slide-up space-y-5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Ruler size={20} /> Project Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area Size (sq.ft)</label>
                <input type="number" value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. 1200"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms</label>
                <input type="number" value={rooms} onChange={e => setRooms(e.target.value)} placeholder="e.g. 3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe your project requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Reference Images</label>
                <button className="w-full py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-primary-300 hover:text-primary-500 flex flex-col items-center gap-2 transition-colors">
                  <Upload size={24} />
                  <span className="text-sm">Click to upload images or drawings</span>
                  <span className="text-xs">PNG, JPG up to 10MB</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Materials */}
          {currentStep === 2 && (
            <div className="animate-slide-up space-y-5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Package size={20} /> Material Preferences</h2>
              <p className="text-gray-500">Select your preferred brands (optional)</p>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                <Leaf size={18} className="text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-700">Green Construction Mode 🌱</p>
                  <p className="text-xs text-green-600">Suggest eco-friendly materials</p>
                </div>
                <button onClick={() => setGreenMode(!greenMode)}
                  className={`w-10 h-6 rounded-full transition-colors ${greenMode ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${greenMode ? 'translate-x-4' : ''}`} />
                </button>
              </div>
              {Object.entries(materialOptions).map(([category, brands]) => (
                <div key={category}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{category}</label>
                  <div className="flex flex-wrap gap-2">
                    {brands.map(brand => (
                      <button key={brand} onClick={() => toggleMaterial(category, brand)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                          selectedMaterials[category] === brand ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}>{brand}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Timeline & Budget */}
          {currentStep === 3 && (
            <div className="animate-slide-up space-y-5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><IndianRupee size={20} /> Timeline & Budget</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['Under ₹1L', '₹1L - ₹3L', '₹3L - ₹5L', '₹5L - ₹10L', '₹10L - ₹25L', '₹25L+'].map(b => (
                    <button key={b} onClick={() => setBudget(b)}
                      className={`px-3 py-2.5 rounded-xl text-sm border transition-all ${
                        budget === b ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-200 text-gray-600'
                      }`}>{b}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Clock size={14} /> Expected Timeline</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['15 days', '1 month', '2 months', '3 months', '6 months', '1 year', 'Flexible', 'ASAP'].map(t => (
                    <button key={t} onClick={() => setTimeline(t)}
                      className={`px-3 py-2.5 rounded-xl text-sm border transition-all ${
                        timeline === t ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium' : 'border-gray-200 text-gray-600'
                      }`}>{t}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="animate-slide-up space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><CheckCircle2 size={20} /> Review Your Request</h2>
              <div className="space-y-3">
                {[
                  { label: 'Service Type', value: service },
                  { label: 'Area', value: area ? `${area} sq.ft` : 'Not specified' },
                  { label: 'Rooms', value: rooms || 'Not specified' },
                  { label: 'Budget', value: budget },
                  { label: 'Timeline', value: timeline },
                  { label: 'Green Mode', value: greenMode ? 'Enabled 🌱' : 'Disabled' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
                {Object.entries(selectedMaterials).length > 0 && (
                  <div className="py-2.5">
                    <span className="text-sm text-gray-500">Material Preferences</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {Object.entries(selectedMaterials).map(([cat, brand]) => (
                        <span key={cat} className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">{cat}: {brand}</span>
                      ))}
                    </div>
                  </div>
                )}
                {description && (
                  <div className="py-2.5">
                    <span className="text-sm text-gray-500">Description</span>
                    <p className="text-sm text-gray-700 mt-1">{description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
              className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft size={16} /> Back
            </button>
            {currentStep < steps.length - 1 ? (
              <button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canNext()}
                className="flex items-center gap-1 px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit}
                className="flex items-center gap-1 px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700">
                Submit Request <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
