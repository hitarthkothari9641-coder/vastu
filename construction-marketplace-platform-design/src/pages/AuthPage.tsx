import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../App';
import { Mail, Lock, User, Phone, Building2, Shield, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'company' ? 'company' : 'user';
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [userType, setUserType] = useState<'user' | 'company' | 'admin'>(initialType);
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');

  const { setRole, setUserName } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userType === 'admin') {
      setRole('admin');
      setUserName('Admin');
      navigate('/admin');
    } else if (userType === 'company') {
      setRole('company');
      setUserName(companyName || 'My Company');
      navigate('/company-dashboard');
    } else {
      setRole('user');
      setUserName(name || 'User');
      navigate('/user-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200">
            <span className="text-white font-bold text-xl">BB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to BuildBid</h1>
          <p className="text-gray-500 mt-1">{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</p>
        </div>

        {/* User Type Selector */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          {([['user', 'Customer', User], ['company', 'Company', Building2], ['admin', 'Admin', Shield]] as const).map(([type, label, Icon]) => (
            <button key={type} onClick={() => setUserType(type)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                userType === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && userType === 'user' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                </div>
              </div>
            )}

            {mode === 'signup' && userType === 'company' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your Company"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'signup' && userType === 'company' && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-700 mb-2">Company Verification</h4>
                <div className="space-y-1.5 text-xs text-blue-600">
                  <p className="flex items-center gap-1.5"><CheckCircle2 size={12} /> GST Number verification required</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Business license upload</p>
                  <p className="flex items-center gap-1.5"><CheckCircle2 size={12} /> Phone verification via OTP</p>
                </div>
              </div>
            )}

            {userType === 'admin' && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-xs text-amber-700">🔐 Admin access is role-based and secured. Use admin credentials to access the panel.</p>
              </div>
            )}

            <button type="submit"
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-200 transition-all flex items-center justify-center gap-2">
              {mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
            </button>

            {userType !== 'admin' && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center"><span className="bg-white px-4 text-sm text-gray-400">or</span></div>
                </div>

                <button type="button" onClick={handleSubmit}
                  className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
              </>
            )}
          </form>

          {userType !== 'admin' && (
            <p className="text-center text-sm text-gray-500 mt-4">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-primary-600 font-medium hover:underline">
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
