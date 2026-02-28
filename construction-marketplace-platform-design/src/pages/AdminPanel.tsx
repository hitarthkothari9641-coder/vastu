import { useState } from 'react';
import { Shield, Users, Building2, FolderOpen, DollarSign, AlertTriangle, BarChart3, CheckCircle2, XCircle, Eye, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { adminStats, companies } from '../data/mockData';

const adminTabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'finance', label: 'Finance', icon: DollarSign },
  { id: 'moderation', label: 'Moderation', icon: AlertTriangle },
];

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444'];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');

  const serviceData = [
    { name: 'Interior', value: 35 },
    { name: 'Renovation', value: 28 },
    { name: 'Construction', value: 20 },
    { name: 'Electrical', value: 10 },
    { name: 'Plumbing', value: 7 },
  ];

  const monthlyUsers = [
    { month: 'Aug', users: 980, companies: 65 },
    { month: 'Sep', users: 1200, companies: 78 },
    { month: 'Oct', users: 1450, companies: 92 },
    { month: 'Nov', users: 1680, companies: 105 },
    { month: 'Dec', users: 1900, companies: 118 },
    { month: 'Jan', users: 2200, companies: 135 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><Shield size={20} className="text-red-400" /></div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-gray-400 text-sm">Platform Management & Analytics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 mb-6 border border-gray-100 overflow-x-auto">
          {adminTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), change: '+12.5%', icon: Users, color: 'bg-blue-500' },
                { label: 'Companies', value: adminStats.totalCompanies.toLocaleString(), change: '+8.3%', icon: Building2, color: 'bg-orange-500' },
                { label: 'Active Projects', value: adminStats.activeProjects.toLocaleString(), change: '+15.2%', icon: FolderOpen, color: 'bg-green-500' },
                { label: 'Revenue', value: adminStats.totalRevenue, change: '+22.1%', icon: DollarSign, color: 'bg-purple-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon size={18} className="text-white" />
                    </div>
                    <span className="text-sm text-green-500 font-medium flex items-center gap-0.5"><TrendingUp size={12} /> {stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Growth Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Platform Growth</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyUsers}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip />
                      <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Users" />
                      <Bar dataKey="companies" fill="#f97316" radius={[4, 4, 0, 0]} name="Companies" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Service Distribution */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Service Distribution</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={serviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {serviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-2">
                  {serviceData.map((s, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        {s.name}
                      </span>
                      <span className="font-medium text-gray-700">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2"><Activity size={16} className="text-green-500" /><span className="text-sm text-gray-500">Success Rate</span></div>
                <p className="text-3xl font-bold text-gray-900">{adminStats.projectSuccessRate}%</p>
                <div className="mt-2 h-2 bg-gray-100 rounded-full"><div className="h-full bg-green-500 rounded-full" style={{ width: `${adminStats.projectSuccessRate}%` }} /></div>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2"><DollarSign size={16} className="text-primary-500" /><span className="text-sm text-gray-500">Avg Quotation</span></div>
                <p className="text-3xl font-bold text-gray-900">{adminStats.avgQuotationValue}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-2 mb-2"><AlertTriangle size={16} className="text-red-500" /><span className="text-sm text-gray-500">Active Disputes</span></div>
                <p className="text-3xl font-bold text-gray-900">{adminStats.disputes}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-400 mt-1">View and manage all registered users</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3">User</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Projects</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { name: 'Rajesh Kumar', email: 'rajesh@email.com', location: 'Mumbai', projects: 3, status: 'Active' },
                    { name: 'Priya Sharma', email: 'priya@email.com', location: 'Delhi', projects: 1, status: 'Active' },
                    { name: 'Amit Patel', email: 'amit@email.com', location: 'Ahmedabad', projects: 5, status: 'Active' },
                    { name: 'Sneha Reddy', email: 'sneha@email.com', location: 'Hyderabad', projects: 0, status: 'Suspended' },
                    { name: 'Vikram Singh', email: 'vikram@email.com', location: 'Jaipur', projects: 2, status: 'Active' },
                  ].map((user, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium">{user.name[0]}</div>
                          <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{user.email}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{user.location}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{user.projects}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{user.status}</span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-gray-400" /></button>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg"><XCircle size={14} className="text-red-400" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Company Management</h3>
              <p className="text-sm text-gray-400 mt-1">Verify and manage registered companies</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-5 py-3">Company</th><th className="px-5 py-3">Location</th><th className="px-5 py-3">Rating</th><th className="px-5 py-3">Projects</th><th className="px-5 py-3">Verification</th><th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {companies.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{c.logo}</span>
                          <span className="text-sm font-medium text-gray-900">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-500">{c.location}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">⭐ {c.rating}</td>
                      <td className="px-5 py-3 text-sm text-gray-700">{c.completedProjects}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          {c.gstVerified && <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-xs">GST</span>}
                          {c.licensed && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">License</span>}
                          {c.platformVerified && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-xs">Verified</span>}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 hover:bg-green-50 rounded-lg"><CheckCircle2 size={14} className="text-green-500" /></button>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg"><XCircle size={14} className="text-red-400" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Project Oversight</h3>
              <div className="space-y-3">
                {[
                  { title: '2BHK Interior Design', client: 'Rajesh Kumar', company: 'DesignHub Studios', status: 'In Progress', progress: 65, amount: '₹6,80,000' },
                  { title: 'Kitchen Renovation', client: 'Priya Sharma', company: 'BuildCraft India', status: 'In Progress', progress: 30, amount: '₹2,80,000' },
                  { title: 'Home Wiring', client: 'Amit Patel', company: 'PowerGrid Solutions', status: 'Completed', progress: 100, amount: '₹1,20,000' },
                  { title: 'Bathroom Renovation', client: 'Vikram Singh', company: 'AquaFix Plumbers', status: 'Dispute', progress: 80, amount: '₹2,50,000' },
                ].map((p, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-gray-50 gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{p.title}</p>
                      <p className="text-xs text-gray-400">{p.client} → {p.company}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{p.amount}</span>
                    <div className="w-32">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className={`h-full rounded-full ${p.status === 'Dispute' ? 'bg-red-500' : p.status === 'Completed' ? 'bg-green-500' : 'bg-primary-500'}`} style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.status === 'Completed' ? 'bg-green-50 text-green-600' :
                      p.status === 'Dispute' ? 'bg-red-50 text-red-600' :
                      'bg-blue-50 text-blue-600'
                    }`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <p className="text-sm text-gray-400">Total Platform Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{adminStats.totalRevenue}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <p className="text-sm text-gray-400">Commission Earned</p>
                <p className="text-2xl font-bold text-green-600">₹22.5L</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <p className="text-sm text-gray-400">Pending Payouts</p>
                <p className="text-2xl font-bold text-orange-600">₹8.3L</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">Payment Logs</h3>
              <div className="space-y-2">
                {[
                  { id: 'PAY001', from: 'Rajesh Kumar', to: 'DesignHub Studios', amount: '₹1,50,000', type: 'Milestone', date: '2024-01-20', status: 'Completed' },
                  { id: 'PAY002', from: 'Priya Sharma', to: 'BuildCraft India', amount: '₹80,000', type: 'Escrow', date: '2024-01-19', status: 'In Escrow' },
                  { id: 'PAY003', from: 'Amit Patel', to: 'PowerGrid Solutions', amount: '₹1,20,000', type: 'Final', date: '2024-01-18', status: 'Completed' },
                ].map(pay => (
                  <div key={pay.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-gray-50 rounded-xl gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{pay.id} • {pay.from} → {pay.to}</p>
                      <p className="text-xs text-gray-400">{pay.date} • {pay.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">{pay.amount}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pay.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{pay.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-red-500" /> Reports & Moderation</h3>
              <div className="space-y-3">
                {[
                  { type: 'Fake Bid', reporter: 'Rajesh Kumar', target: 'Unknown Company', severity: 'High', date: '2024-01-20' },
                  { type: 'Delayed Project', reporter: 'Priya Sharma', target: 'BuildCraft India', severity: 'Medium', date: '2024-01-19' },
                  { type: 'Fake Review', reporter: 'System AI', target: 'Review #4521', severity: 'Low', date: '2024-01-18' },
                  { type: 'Payment Dispute', reporter: 'Amit Patel', target: 'WoodWorks Pro', severity: 'High', date: '2024-01-17' },
                ].map((report, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-gray-100 gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${report.severity === 'High' ? 'bg-red-500' : report.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.type}</p>
                        <p className="text-xs text-gray-400">By: {report.reporter} • Target: {report.target}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        report.severity === 'High' ? 'bg-red-50 text-red-600' : report.severity === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                      }`}>{report.severity}</span>
                      <span className="text-xs text-gray-400">{report.date}</span>
                      <button className="px-3 py-1 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800">Review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
