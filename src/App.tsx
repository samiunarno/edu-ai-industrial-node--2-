import { Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, BrainCircuit, Activity, Database, LogOut, Menu, X, User, Languages, Terminal } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import Profile from './pages/Profile';
import Landing from './pages/Landing';

import React from 'react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: string }> {
  public state = { hasError: false, error: '' };

  constructor(props: { children: React.ReactNode }) {
    super(props);
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 m-10 bg-red-50 text-red-600 border-2 border-red-600 shadow-[8px_8px_0_0_#dc2626]">
          <h2 className="font-sans font-black text-2xl uppercase tracking-tighter mb-4">React Runtime Error</h2>
          <p className="font-mono text-sm leading-relaxed">{this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<{ role: string, name: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (token && role && name) {
      setUser({ role, name });
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const getDashboardHome = () => {
    if (!user) return "/login";
    if (user.role === 'admin') return "/admin";
    if (user.role === 'ai_trainer') return "/trainer";
    return "/teacher";
  };

  const isDashboardRoute = user && ['/admin', '/teacher', '/trainer', '/profile'].includes(location.pathname);

  // Determine Nav Items Based on Role
  const navItems = [];
  if (user?.role === 'admin') {
    navItems.push({ label: t.nav.overview, icon: LayoutDashboard, path: '/admin' });
    navItems.push({ label: t.nav.users, icon: Users, path: '/admin' });
    navItems.push({ label: t.nav.logs, icon: Activity, path: '/admin' });
  } else if (user?.role === 'ai_trainer') {
    navItems.push({ label: t.nav.training, icon: BrainCircuit, path: '/trainer' });
    navItems.push({ label: t.nav.registry, icon: Database, path: '/trainer' });
  } else if (user?.role === 'teacher') {
    navItems.push({ label: t.nav.analytics, icon: LayoutDashboard, path: '/teacher' });
    navItems.push({ label: t.nav.data, icon: Users, path: '/teacher' });
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col relative w-full overflow-x-hidden">
      {isDashboardRoute && (
         <>
          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`w-[280px] bg-stone-100 border-r-2 border-stone-900 h-screen flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <Link to={getDashboardHome()} className="p-6 md:p-8 flex items-center gap-4 cursor-pointer hover:bg-stone-200 transition-colors border-b-2 border-stone-900 group">
              <div className="bg-stone-900 p-2 border-2 border-stone-900 group-hover:bg-stone-800 transition-colors shadow-[2px_2px_0_0_#1c1917] group-hover:shadow-[4px_4px_0_0_#1c1917]">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div className="font-sans font-black text-2xl text-stone-900 tracking-tighter uppercase">
                EDU-AI
              </div>
            </Link>
            
            <div className="px-6 py-8 flex flex-col flex-grow">
              <div className="font-mono text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <div className="w-4 h-px bg-stone-500"></div> Nav
              </div>
              <nav className="flex flex-col gap-2">
                 {navItems.map((item, idx) => {
                   const isActive = idx === 0 && location.pathname !== '/profile';
                   return (
                     <Link to={item.path} key={idx} className={`px-4 py-3 flex items-center gap-3 font-mono text-xs font-bold tracking-wider uppercase cursor-pointer transition-all border-2 ${isActive ? 'bg-stone-900 text-white border-stone-900 shadow-[4px_4px_0_0_#d6d3d1]' : 'text-stone-600 bg-transparent border-transparent hover:border-stone-900 hover:bg-white hover:text-stone-900 hover:shadow-[4px_4px_0_0_#1c1917]'}`}>
                       <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                       {item.label}
                     </Link>
                   );
                 })}
                 
                 <div className="mt-8 font-mono text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <div className="w-4 h-px bg-stone-500"></div> User
                 </div>
                 <Link to="/profile" className={`px-4 py-3 flex items-center gap-3 font-mono text-xs font-bold tracking-wider uppercase cursor-pointer transition-all border-2 ${location.pathname === '/profile' ? 'bg-stone-900 text-white border-stone-900 shadow-[4px_4px_0_0_#d6d3d1]' : 'text-stone-600 bg-transparent border-transparent hover:border-stone-900 hover:bg-white hover:text-stone-900 hover:shadow-[4px_4px_0_0_#1c1917]'}`}>
                   <User className={`w-4 h-4 ${location.pathname === '/profile' ? 'text-white' : ''}`} />
                   {t.nav.profile}
                 </Link>
              </nav>
            </div>
            
            <div className="p-6 border-t-2 border-stone-900 bg-white">
              <div className="border-2 border-stone-900 p-4 relative group">
                <div className="absolute -top-3 left-4 bg-white px-2 font-mono text-[10px] font-bold text-stone-500 uppercase tracking-widest z-10">Status</div>
                <div className="flex items-center gap-3 font-mono text-xs font-bold text-stone-900 uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 bg-emerald-500 border border-stone-900"></span>
                  </span>
                  APIs Online
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <header className={`h-[80px] bg-white border-b-2 border-stone-900 flex items-center justify-between px-6 md:px-8 fixed top-0 w-full lg:w-[calc(100%-280px)] lg:left-[280px] z-20 transition-all`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-stone-900 border-2 border-transparent hover:border-stone-900 transition-colors lg:hidden bg-stone-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <div className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600"></div> System View
                </div>
                <div className="font-sans font-black text-xl text-stone-900 tracking-tighter uppercase">{location.pathname === '/profile' ? t.nav.profile : `${location.pathname.replace('/', '')} Node`}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-5">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-stone-900 font-mono text-[10px] font-bold text-stone-900 uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors"
                title={language === 'en' ? 'Switch to Chinese' : '切换至英文'}
              >
                <Languages className="w-4 h-4" />
                <span>{language === 'en' ? 'EN' : 'ZH'}</span>
              </button>

              <div 
                className="text-right hidden sm:flex flex-col items-end cursor-pointer group"
                onClick={() => navigate('/profile')}
              >
                <div className="font-sans font-black text-sm uppercase text-stone-900 group-hover:text-indigo-600 transition-colors">{user.name}</div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-stone-500 font-bold">{user.role.replace('_', ' ')} ID</div>
              </div>
              <div 
                onClick={() => navigate('/profile')}
                className="w-10 h-10 border-2 border-stone-900 bg-stone-900 flex items-center justify-center font-mono font-bold text-sm text-white cursor-pointer hover:bg-white hover:text-stone-900 transition-colors shadow-[2px_2px_0_0_#1c1917]"
                title="View Profile"
              >
                {(user.name || "U").substring(0, 2).toUpperCase()}
              </div>
              <div className="w-0.5 h-8 bg-stone-900 mx-1 md:mx-2 hidden sm:block"></div>
              <button 
                onClick={handleLogout}
                className="p-2.5 text-stone-900 hover:text-white hover:bg-red-600 transition-colors border-2 border-transparent hover:border-red-600 flex items-center justify-center hover:shadow-[4px_4px_0_0_#1c1917]"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </header>
        </>
      )}

      <main className={`flex-1 flex flex-col relative w-full ${isDashboardRoute ? 'lg:pl-[280px] pt-[80px] p-6 lg:p-10' : ''}`}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to={getDashboardHome()} />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to={getDashboardHome()} />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
            <Route path="/teacher" element={user && ['admin', 'teacher'].includes(user.role) ? <TeacherDashboard /> : <Navigate to="/login" />} />
            <Route path="/trainer" element={user && ['admin', 'ai_trainer'].includes(user.role) ? <TrainerDashboard /> : <Navigate to="/login" />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  );
}
