import React, { useState } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { Database } from 'lucide-react';

export default function Login({ setUser }: { setUser: (u: any) => void }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('name', data.name);
      setUser({ role: data.role, name: data.name });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-screen bg-white font-sans text-stone-900 border-x-2 border-stone-900 max-w-[1400px] mx-auto w-full relative">
      <div className="absolute top-0 right-0 p-4 border-b-2 border-l-2 border-stone-900 bg-stone-100 flex items-center justify-center">
        <Database className="w-5 h-5 text-stone-900" />
      </div>
      <div className="w-full max-w-md bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] p-8">
        <div className="text-center mb-8 border-b-2 border-stone-900 pb-6">
          <div className="font-sans font-black text-4xl text-stone-900 tracking-tighter uppercase mb-2">
            EDU-AI
          </div>
          <h2 className="font-serif italic text-[11px] text-stone-500 uppercase tracking-[0.2em]">{t.auth.login_title}</h2>
        </div>
        {error && <div className="mb-6 text-red-600 bg-red-50 p-4 border-2 border-red-200 font-mono text-xs uppercase font-bold tracking-widest">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-mono block text-xs font-bold text-stone-900 uppercase tracking-widest mb-2">{t.auth.email}</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-300 text-sm font-bold text-stone-900 focus:bg-white focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400 placeholder:font-sans placeholder:font-normal"
              placeholder="name@organization.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono block text-xs font-bold text-stone-900 uppercase tracking-widest">{t.auth.password}</label>
              <a href="#" className="font-serif italic text-[11px] text-indigo-600 hover:text-indigo-800 transition-colors">Forgot?</a>
            </div>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-300 text-sm font-bold text-stone-900 focus:bg-white focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400 placeholder:font-sans placeholder:font-normal"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="pt-4">
            <button className="w-full bg-stone-900 text-white py-4 font-mono font-bold text-sm uppercase tracking-widest hover:bg-stone-800 transition-all border-2 border-stone-900 active:translate-y-[2px] active:translate-x-[2px] shadow-[4px_4px_0_0_#1c1917] active:shadow-none">
              {t.auth.signin}
            </button>
          </div>
        </form>
        <div className="mt-8 pt-6 border-t-2 border-stone-100 text-center font-mono text-xs font-bold text-stone-500 uppercase tracking-widest">
          {t.auth.no_account} <Link to="/register" className="text-indigo-600 hover:text-indigo-800 ml-2 relative group">REGISTER
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
          </Link>
        </div>
      </div>
    </div>
  );
}
