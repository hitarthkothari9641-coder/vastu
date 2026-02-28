import { useState, createContext, useContext, type ReactNode } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Rss, Brain, BarChart3, Building2, User, Menu, X, LogOut, ChevronDown, Shield } from 'lucide-react';
import HomePage from './pages/HomePage';
import FeedPage from './pages/FeedPage';
import AIEstimatorPage from './pages/AIEstimatorPage';
import AIDesignerPage from './pages/AIDesignerPage';
import MaterialPricePage from './pages/MaterialPricePage';
import CompanyProfilePage from './pages/CompanyProfilePage';
import AuthPage from './pages/AuthPage';
import UserDashboard from './pages/UserDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminPanel from './pages/AdminPanel';
import QuotationPage from './pages/QuotationPage';

type UserRole = 'guest' | 'user' | 'company' | 'admin';
interface AppState {
  role: UserRole;
  setRole: (r: UserRole) => void;
  userName: string;
  setUserName: (n: string) => void;
}

export const AppContext = createContext<AppState>({
  role: 'guest', setRole: () => {}, userName: '', setUserName: () => {}
});
export const useApp = () => useContext(AppContext);

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { role, setRole, userName } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/feed', label: 'Feed', icon: Rss },
    { path: '/ai-designer', label: 'AI Designer', icon: Brain },
    { path: '/ai-estimator', label: 'AI Estimator', icon: BarChart3 },
    { path: '/materials', label: 'Materials', icon: BarChart3 },
    { path: '/companies', label: 'Companies', icon: Building2 },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    setRole('guest');
    setDropdownOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (role === 'user') return '/user-dashboard';
    if (role === 'company') return '/company-dashboard';
    if (role === 'admin') return '/admin';
    return '/auth';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">BB</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Build<span className="text-primary-600">Bid</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}>
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {role === 'guest' ? (
              <>
                <Link to="/auth" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">Login</Link>
                <Link to="/auth?mode=signup" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:shadow-lg hover:shadow-primary-200 transition-all">Sign Up</Link>
              </>
            ) : (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    {role === 'admin' ? <Shield size={14} className="text-white" /> : <User size={14} className="text-white" />}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{userName}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                    <Link to={getDashboardLink()} onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User size={16} /> Dashboard
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(item.path) ? 'bg-primary-50 text-primary-700' : 'text-gray-600'
                }`}>
                <item.icon size={18} /> {item.label}
              </Link>
            ))}
            <hr className="my-2" />
            {role === 'guest' ? (
              <Link to="/auth" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-primary-600">
                <User size={18} /> Login / Sign Up
              </Link>
            ) : (
              <>
                <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600">
                  <User size={18} /> Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 w-full">
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">BB</span>
              </div>
              <span className="font-bold text-xl text-white">BuildBid</span>
            </div>
            <p className="text-sm leading-relaxed">India's #1 E-Quotation Marketplace for construction and renovation services. Get competitive bids from verified companies.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">For Customers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/feed" className="hover:text-white transition-colors">Browse Projects</Link></li>
              <li><Link to="/quotation" className="hover:text-white transition-colors">Request Quotation</Link></li>
              <li><Link to="/ai-estimator" className="hover:text-white transition-colors">AI Cost Estimator</Link></li>
              <li><Link to="/materials" className="hover:text-white transition-colors">Material Prices</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">For Companies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/auth?type=company" className="hover:text-white transition-colors">Join as Company</Link></li>
              <li><Link to="/company-dashboard" className="hover:text-white transition-colors">Company Dashboard</Link></li>
              <li><Link to="/materials" className="hover:text-white transition-colors">Price Tracker</Link></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Subscription Plans</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="hover:text-white transition-colors cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2024 BuildBid. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs hover:bg-primary-600 transition-colors cursor-pointer">f</span>
            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs hover:bg-primary-600 transition-colors cursor-pointer">𝕏</span>
            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs hover:bg-primary-600 transition-colors cursor-pointer">in</span>
            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs hover:bg-primary-600 transition-colors cursor-pointer">ig</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

export function App() {
  const [role, setRole] = useState<UserRole>('guest');
  const [userName, setUserName] = useState('');

  return (
    <AppContext.Provider value={{ role, setRole, userName, setUserName }}>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/ai-designer" element={<AIDesignerPage />} />
            <Route path="/ai-estimator" element={<AIEstimatorPage />} />
            <Route path="/materials" element={<MaterialPricePage />} />
            <Route path="/companies" element={<CompanyProfilePage />} />
            <Route path="/company/:id" element={<CompanyProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/quotation" element={<QuotationPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppContext.Provider>
  );
}
