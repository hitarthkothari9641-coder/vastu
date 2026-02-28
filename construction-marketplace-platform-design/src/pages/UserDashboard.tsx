import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, Gavel, FolderOpen, History, User, Plus, Star, CheckCircle2, Clock, MessageCircle, ChevronRight, IndianRupee, Award } from 'lucide-react';
import { quotationRequests, bids, activeProjects, previousProjects } from '../data/mockData';
import { useApp } from '../App';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'quotations', label: 'My Quotations', icon: FileText },
  { id: 'bids', label: 'Bid Quotations', icon: Gavel },
  { id: 'active', label: 'Active Projects', icon: FolderOpen },
  { id: 'previous', label: 'Previous Projects', icon: History },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { userName } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                  {userName?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{userName || 'User'}</p>
                  <p className="text-xs text-gray-400">Homeowner</p>
                </div>
              </div>
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
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
                <h2 className="text-2xl font-bold text-gray-900">Welcome back, {userName || 'User'}! 👋</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Active Quotations', value: '2', color: 'from-primary-500 to-primary-600', icon: FileText },
                    { label: 'Total Bids Received', value: '13', color: 'from-green-500 to-green-600', icon: Gavel },
                    { label: 'Active Projects', value: '1', color: 'from-accent-500 to-accent-600', icon: FolderOpen },
                    { label: 'Completed', value: '2', color: 'from-purple-500 to-purple-600', icon: CheckCircle2 },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                        <stat.icon size={18} className="text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <CheckCircle2 size={18} className="text-green-500" />
                      <div className="flex-1"><p className="text-sm font-medium text-gray-700">New bid received for "Kitchen Renovation"</p><p className="text-xs text-gray-400">2 hours ago</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <MessageCircle size={18} className="text-blue-500" />
                      <div className="flex-1"><p className="text-sm font-medium text-gray-700">DesignHub Studios sent a message</p><p className="text-xs text-gray-400">5 hours ago</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                      <FolderOpen size={18} className="text-purple-500" />
                      <div className="flex-1"><p className="text-sm font-medium text-gray-700">Project milestone completed: Carpentry Work</p><p className="text-xs text-gray-400">1 day ago</p></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quotations' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">My Quotation Requests</h2>
                  <Link to="/quotation" className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 flex items-center gap-1">
                    <Plus size={16} /> New Request
                  </Link>
                </div>
                {quotationRequests.map(q => (
                  <div key={q.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-xs text-gray-400">{q.id}</span>
                        <h3 className="font-bold text-gray-900">{q.title}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${q.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{q.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{q.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><FileText size={14} /> {q.serviceType}</span>
                      <span className="flex items-center gap-1"><IndianRupee size={14} /> {q.budget}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {q.timeline}</span>
                      <span className="flex items-center gap-1"><Gavel size={14} /> {q.bids} bids</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {q.materials.map(m => <span key={m} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">{m}</span>)}
                    </div>
                    {q.status === 'Active' && (
                      <button onClick={() => setActiveTab('bids')} className="mt-3 text-sm text-primary-600 font-medium flex items-center gap-1 hover:underline">
                        View Bids <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'bids' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Compare Bids</h2>
                <p className="text-gray-500">For: 2BHK Interior Design (QR001)</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bids.filter(b => b.quotationId === 'QR001').map(bid => (
                    <div key={bid.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                          {bid.companyName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{bid.companyName}</p>
                          <div className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-gray-400">{bid.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 mb-4">
                        <p className="text-sm text-gray-400">Total Quote</p>
                        <p className="text-2xl font-bold text-gray-900">₹{(bid.totalPrice / 100000).toFixed(1)}L</p>
                      </div>
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between"><span className="text-gray-400">Labor</span><span className="font-medium text-gray-700">₹{(bid.laborCost / 1000).toFixed(0)}K</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Material</span><span className="font-medium text-gray-700">₹{(bid.materialCost / 1000).toFixed(0)}K</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Other</span><span className="font-medium text-gray-700">₹{(bid.otherCost / 1000).toFixed(0)}K</span></div>
                      </div>
                      <div className="flex justify-between text-sm mb-4">
                        <span className="text-gray-400 flex items-center gap-1"><Clock size={12} /> {bid.timeline}</span>
                        <span className="text-gray-400 flex items-center gap-1"><Award size={12} /> {bid.warranty}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                          <CheckCircle2 size={14} /> Accept
                        </button>
                        <button className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                          <MessageCircle size={14} /> Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'active' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
                {activeProjects.map(project => (
                  <div key={project.id} className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-500">by {project.company}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">{project.status}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-gray-900">{project.progress}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                    {/* Milestones */}
                    <div className="space-y-3">
                      {project.milestones.map((ms, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                            ms.status === 'completed' ? 'bg-green-100 text-green-600' :
                            ms.status === 'in-progress' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {ms.status === 'completed' ? <CheckCircle2 size={16} /> : ms.status === 'in-progress' ? <Clock size={16} /> : (i + 1)}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${ms.status === 'completed' ? 'text-gray-900' : ms.status === 'in-progress' ? 'text-blue-700' : 'text-gray-400'}`}>{ms.name}</p>
                            <p className="text-xs text-gray-400">{ms.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                      <MessageCircle size={16} /> Chat with Company
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'previous' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Previous Projects</h2>
                {previousProjects.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{p.title}</h3>
                        <p className="text-sm text-gray-500">by {p.company}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold">Completed</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span>Total: {p.totalCost}</span>
                      <span>Completed: {p.completedDate}</span>
                      <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" /> {p.rating}/5</span>
                    </div>
                    {p.hasWarranty && (
                      <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
                        <Award size={16} className="text-blue-500" />
                        <span className="text-sm text-blue-700">Warranty valid until {p.warrantyExpiry}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" defaultValue={userName} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" defaultValue="user@email.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" defaultValue="Mumbai, Maharashtra" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                  </div>
                  <button className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
