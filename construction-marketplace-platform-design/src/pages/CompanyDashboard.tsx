import { useState } from 'react';
import { LayoutDashboard, Gavel, BarChart3, FolderOpen, Rss, DollarSign, User, Clock, CheckCircle2, Plus, Eye, Upload, TrendingUp, IndianRupee } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { quotationRequests, companyRevenue, activeProjects } from '../data/mockData';
import { useApp } from '../App';


const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bids', label: 'Give Bids', icon: Gavel },
  { id: 'materials', label: 'Material Prices', icon: BarChart3 },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'feed', label: 'Feed', icon: Rss },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { userName } = useApp();
  const [bidAmount, setBidAmount] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white font-bold text-lg">
                  {userName?.[0] || 'C'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{userName || 'Company'}</p>
                  <p className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 size={10} /> Verified</p>
                </div>
              </div>
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id ? 'bg-accent-50 text-accent-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}>
                    <tab.icon size={18} /> {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Company Dashboard</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Earnings', value: companyRevenue.totalEarnings, icon: DollarSign, color: 'from-green-500 to-green-600' },
                    { label: 'Active Projects', value: companyRevenue.activeProjects.toString(), icon: FolderOpen, color: 'from-primary-500 to-primary-600' },
                    { label: 'Completed', value: companyRevenue.completedProjects.toString(), icon: CheckCircle2, color: 'from-purple-500 to-purple-600' },
                    { label: 'Pending Bids', value: '12', icon: Gavel, color: 'from-accent-500 to-accent-600' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                        <stat.icon size={18} className="text-white" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Revenue Overview</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={companyRevenue.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(v) => [`₹${Number(v || 0).toLocaleString('en-IN')}`, 'Revenue']} />
                        <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Recent Requests</h3>
                    {quotationRequests.filter(q => q.status === 'Active').slice(0, 3).map(q => (
                      <div key={q.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{q.title}</p>
                          <p className="text-xs text-gray-400">{q.budget}</p>
                        </div>
                        <button onClick={() => { setActiveTab('bids'); setSelectedRequest(q.id); }}
                          className="px-3 py-1 text-xs bg-accent-50 text-accent-600 rounded-lg font-medium hover:bg-accent-100">
                          Bid
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Performance</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Bid Success Rate</span><span className="font-medium text-gray-700">78%</span></div>
                        <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-green-500 rounded-full" style={{ width: '78%' }} /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Customer Satisfaction</span><span className="font-medium text-gray-700">96%</span></div>
                        <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-primary-500 rounded-full" style={{ width: '96%' }} /></div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">On-time Delivery</span><span className="font-medium text-gray-700">89%</span></div>
                        <div className="h-2 bg-gray-100 rounded-full"><div className="h-full bg-accent-500 rounded-full" style={{ width: '89%' }} /></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bids' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Available Quotation Requests</h2>
                {quotationRequests.filter(q => q.status === 'Active').map(q => (
                  <div key={q.id} className={`bg-white rounded-2xl p-5 border transition-all ${selectedRequest === q.id ? 'border-accent-300 shadow-lg' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs text-gray-400">{q.id} • {q.date}</span>
                        <h3 className="font-bold text-gray-900 text-lg">{q.title}</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">{q.bids} bids</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{q.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><IndianRupee size={14} /> {q.budget}</span>
                      <span className="flex items-center gap-1"><Eye size={14} /> {q.area}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {q.timeline}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {q.materials.map(m => <span key={m} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">{m}</span>)}
                    </div>

                    {selectedRequest === q.id ? (
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3 animate-slide-up">
                        <h4 className="font-semibold text-gray-900">Submit Your Bid</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-500">Total Price (₹)</label>
                            <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} placeholder="e.g. 500000"
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Labor Cost (₹)</label>
                            <input type="number" placeholder="e.g. 150000" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Material Cost (₹)</label>
                            <input type="number" placeholder="e.g. 300000" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Timeline</label>
                            <input type="text" placeholder="e.g. 60 days" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Warranty Terms</label>
                          <input type="text" placeholder="e.g. 2 years comprehensive warranty" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-accent-600 text-white rounded-lg text-sm font-medium hover:bg-accent-700">Submit Bid</button>
                          <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setSelectedRequest(q.id)}
                        className="px-4 py-2 bg-accent-600 text-white rounded-xl text-sm font-medium hover:bg-accent-700 flex items-center gap-1">
                        <Gavel size={14} /> Place Bid
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
                {activeProjects.map(project => (
                  <div key={project.id} className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-500">Client Project</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">{project.status}</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Progress</span><span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {project.milestones.map((ms, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className={ms.status === 'completed' ? 'text-green-500' : ms.status === 'in-progress' ? 'text-blue-500' : 'text-gray-300'} />
                            <span className="text-sm text-gray-700">{ms.name}</span>
                          </div>
                          {ms.status === 'in-progress' && (
                            <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">Mark Complete</button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium flex items-center gap-1 hover:bg-gray-50">
                      <Upload size={14} /> Upload Site Photos
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'feed' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Feed Management</h2>
                  <button className="px-4 py-2 bg-accent-600 text-white rounded-xl text-sm font-medium flex items-center gap-1">
                    <Plus size={16} /> New Post
                  </button>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Create New Post</h3>
                  <div className="space-y-3">
                    <input type="text" placeholder="Project Title" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                    <textarea placeholder="Project description, materials used, timeline..." rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none" />
                    <div className="flex gap-3">
                      <select className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-500">
                        <option>Select Category</option>
                        <option>Renovation</option>
                        <option>Interior</option>
                        <option>Construction</option>
                        <option>Furniture</option>
                      </select>
                      <input type="text" placeholder="Cost Range" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                    </div>
                    <button className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-accent-300 hover:text-accent-500 flex items-center justify-center gap-2">
                      <Upload size={16} /> Upload Project Images
                    </button>
                    <button className="px-6 py-2.5 bg-accent-600 text-white rounded-xl text-sm font-medium hover:bg-accent-700">Publish Post</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <p className="text-sm text-gray-400">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">{companyRevenue.totalEarnings}</p>
                    <p className="text-sm text-green-500 flex items-center gap-1 mt-1"><TrendingUp size={14} /> +12.5% this month</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <p className="text-sm text-gray-400">Platform Commission</p>
                    <p className="text-2xl font-bold text-gray-900">{companyRevenue.commission}</p>
                    <p className="text-xs text-gray-400 mt-1">5% of total earnings</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 border border-gray-100">
                    <p className="text-sm text-gray-400">Net Revenue</p>
                    <p className="text-2xl font-bold text-green-600">₹43,32,000</p>
                    <p className="text-xs text-gray-400 mt-1">After commission</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Monthly Revenue Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={companyRevenue.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                        <Tooltip formatter={(v) => [`₹${Number(v || 0).toLocaleString('en-IN')}`, 'Revenue']} />
                        <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Material Price Tracker</h2>
                <p className="text-gray-500">Use live prices for accurate bidding. <a href="#/materials" className="text-primary-600 hover:underline">View full tracker →</a></p>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Reference Prices</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { name: 'UltraTech Cement', price: '₹380/bag', change: '+2.1%' },
                      { name: 'TATA TMT 8mm', price: '₹72/kg', change: '+3.5%' },
                      { name: 'Teak Wood', price: '₹3,500/cft', change: '+5.2%' },
                      { name: 'Havells Wire 1.5mm', price: '₹2,200/roll', change: '+1.5%' },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{m.name}</p>
                          <p className="text-lg font-bold text-gray-900">{m.price}</p>
                        </div>
                        <span className="text-sm text-green-600 font-medium">{m.change}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-accent-50 rounded-xl border border-accent-100">
                    <h4 className="text-sm font-semibold text-accent-700 mb-1">💡 Margin Calculator</h4>
                    <p className="text-xs text-accent-600">Add 15-20% margin on material costs for procurement, storage, and wastage.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input type="text" defaultValue={userName} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" defaultValue="company@email.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered</label>
                    <input type="text" defaultValue="Construction, Renovation, Interior" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                    <input type="text" defaultValue="27AABCU9603R1ZM" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={3} defaultValue="Leading construction company..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 resize-none" />
                  </div>
                  <button className="px-6 py-2.5 bg-accent-600 text-white rounded-xl text-sm font-medium hover:bg-accent-700">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
