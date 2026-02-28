import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Shield, CheckCircle2, Clock, Users, Search, TrendingUp, FileText } from 'lucide-react';
import { companies, feedProjects } from '../data/mockData';

function CompanyCard({ company }: { company: typeof companies[0] }) {
  return (
    <Link to={`/company/${company.id}`}
      className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl shadow-sm">{company.logo}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900">{company.name}</h3>
            {company.platformVerified && <CheckCircle2 size={16} className="text-primary-500" />}
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={12} /> {company.location}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-3">
        <span className="flex items-center gap-1 text-sm font-medium"><Star size={14} className="text-yellow-400 fill-yellow-400" /> {company.rating} ({company.reviews})</span>
        <span className="text-sm text-gray-400">{company.experience} yrs exp</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-lg font-bold text-gray-900">{company.completedProjects}</p>
          <p className="text-xs text-gray-400">Projects</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-lg font-bold text-green-600">{company.successRate}%</p>
          <p className="text-xs text-gray-400">Success</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-lg font-bold text-primary-600">{company.rating}</p>
          <p className="text-xs text-gray-400">Rating</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {company.services.map(s => (
          <span key={s} className="px-2.5 py-1 rounded-full bg-primary-50 text-primary-600 text-xs font-medium">{s}</span>
        ))}
        {company.gstVerified && <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">GST ✓</span>}
        {company.licensed && <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">Licensed</span>}
      </div>
    </Link>
  );
}

function CompanyDetail({ company }: { company: typeof companies[0] }) {
  const companyProjects = feedProjects.filter(p => p.companyId === company.id);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-6">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-32" />
        <div className="px-6 pb-6 -mt-10">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-4 border-white shadow-lg flex items-center justify-center text-4xl">{company.logo}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                {company.platformVerified && <CheckCircle2 size={20} className="text-primary-500" />}
              </div>
              <p className="text-gray-500 flex items-center gap-1 mt-1"><MapPin size={14} /> {company.location}</p>
            </div>
            <Link to="/quotation" className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors">
              Request Quotation
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {['overview', 'projects', 'reviews'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">About</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{company.description}</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{company.experience} years of experience</span>
              </div>
              <div className="flex items-center gap-3">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{company.completedProjects} projects completed</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">{company.successRate}% success rate</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Star size={16} className="text-yellow-400" /> Ratings & Reviews</h3>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-gray-900">{company.rating}</span>
                <div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} className={s <= Math.round(company.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />)}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{company.reviews} reviews</p>
                </div>
              </div>
              {[5,4,3,2,1].map(r => (
                <div key={r} className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400 w-3">{r}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${r === 5 ? 65 : r === 4 ? 25 : r === 3 ? 7 : r === 2 ? 2 : 1}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Shield size={16} className="text-green-500" /> Verification</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className={company.gstVerified ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-sm text-gray-600">GST Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className={company.licensed ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-sm text-gray-600">Licensed Contractor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className={company.platformVerified ? 'text-green-500' : 'text-gray-300'} />
                  <span className="text-sm text-gray-600">Platform Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid md:grid-cols-2 gap-4">
          {companyProjects.length > 0 ? companyProjects.map(p => (
            <div key={p.id} className="bg-white rounded-xl overflow-hidden border border-gray-100">
              <img src={p.images[0]} alt={p.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="font-semibold text-gray-900">{p.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{p.costRange} • {p.timeline}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.materials.map(m => <span key={m} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">{m}</span>)}
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-2 text-center py-12 text-gray-400">
              <FileText size={32} className="mx-auto mb-2 opacity-50" />
              <p>No projects to display yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {[
            { name: 'Rajesh Kumar', rating: 5, date: '2 weeks ago', text: 'Excellent work on our kitchen renovation. Professional team and great attention to detail.' },
            { name: 'Priya Sharma', rating: 4, date: '1 month ago', text: 'Good quality work, completed within timeline. Minor delays in material procurement but overall satisfied.' },
            { name: 'Amit Patel', rating: 5, date: '2 months ago', text: 'Outstanding service! They went above and beyond our expectations. Highly recommended.' },
          ].map((review, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-medium text-sm">{review.name[0]}</div>
                  <div>
                    <p className="font-medium text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />)}
                </div>
              </div>
              <p className="text-sm text-gray-600">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CompanyProfilePage() {
  const { id } = useParams();
  const [search, setSearch] = useState('');

  if (id) {
    const company = companies.find(c => c.id === parseInt(id));
    if (company) return <CompanyDetail company={company} />;
    return <div className="text-center py-20 text-gray-400">Company not found</div>;
  }

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.services.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Verified Companies</h1>
          <p className="text-gray-500 mt-1">Browse and connect with trusted construction professionals</p>
          <div className="relative mt-4 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies or services..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => <CompanyCard key={c.id} company={c} />)}
        </div>
        {filtered.length === 0 && <p className="text-center py-12 text-gray-400">No companies found.</p>}
      </div>
    </div>
  );
}
