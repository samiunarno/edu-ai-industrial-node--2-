import React, { useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';
import { motion } from 'motion/react';
import { User, Lock, Save, Loader2, Database } from 'lucide-react';

export default function Profile({ user, setUser }: { user: any, setUser: (u: any) => void }) {
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchApi('/user/profile')
      .then(data => {
        setProfile(data);
        setName(data.name || '');
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const payload: any = { name };
      if (password) payload.password = password;
      
      const updatedUser = await fetchApi('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      
      // Update local storage and app state
      localStorage.setItem('name', updatedUser.name);
      setUser({ ...user, name: updatedUser.name });
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ text: error.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="p-10 font-mono text-xs uppercase font-bold text-center text-stone-500">Loading Configuration...</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[700px] w-full mx-auto pb-16 font-sans text-stone-900"
    >
      <div className="bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] overflow-hidden">
        <div className="p-6 md:p-8 border-b-2 border-stone-900 bg-stone-100 flex justify-between items-center">
          <div>
            <h2 className="font-sans font-black text-2xl uppercase tracking-tighter">Profile Configuration</h2>
            <p className="font-serif italic text-[11px] text-stone-500 mt-1 uppercase tracking-[0.2em]">Update credentials & identity</p>
          </div>
          <div>
            <Database className="w-5 h-5 text-stone-900" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
          {message.text && (
            <div className={`p-4 border-2 font-mono text-xs uppercase font-bold tracking-widest ${message.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              {message.text}
            </div>
          )}
          
          <div className="flex flex-col gap-5">
            <div>
              <label className="font-mono block text-xs font-bold text-stone-900 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                value={profile.email} 
                disabled
                className="w-full bg-stone-100 border-2 border-stone-200 text-stone-400 text-sm font-bold rounded-none px-4 py-3 cursor-not-allowed outline-none"
              />
              <p className="font-serif italic text-[11px] text-stone-400 mt-2 uppercase tracking-widest">Immutable identifier.</p>
            </div>
            
            <div>
              <label className="font-mono block text-xs font-bold text-stone-900 uppercase tracking-widest mb-2">System Identity</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r-2 border-transparent">
                  <User className="h-5 w-5 text-stone-400" />
                </div>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-stone-300 text-stone-900 font-bold text-sm rounded-none pl-12 pr-4 py-3 focus:outline-none focus:border-stone-900 transition-colors"
                  placeholder="Designation Name"
                />
              </div>
            </div>

            <div className="h-0.5 w-full bg-stone-200 my-4"></div>
            
            <div>
              <h3 className="font-sans font-black text-lg uppercase tracking-widest text-stone-800 mb-6 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Security Key Override
              </h3>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="font-mono block text-xs font-bold text-stone-900 uppercase tracking-widest mb-2">New Access Key</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-stone-50 border-2 border-stone-300 text-stone-900 font-bold text-sm rounded-none px-4 py-3 focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-400 placeholder:font-sans placeholder:font-normal"
                      placeholder="Leave unspecified to maintain current"
                    />
                  </div>
                </div>
                
                {password && (
                  <div>
                    <label className="font-mono block text-xs font-bold text-stone-900 uppercase tracking-widest mb-2">Verify Access Key</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        required={!!password}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-stone-50 border-2 border-stone-300 text-stone-900 font-bold text-sm rounded-none px-4 py-3 focus:outline-none focus:border-stone-900 transition-colors placeholder:text-stone-400 placeholder:font-sans placeholder:font-normal"
                        placeholder="Retype access key"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-6 mt-4 border-t-2 border-stone-100 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 bg-stone-900 text-white font-mono font-bold text-sm uppercase tracking-widest transition-all border-2 border-stone-900 active:translate-y-[2px] active:translate-x-[2px] shadow-[4px_4px_0_0_#1c1917] active:shadow-none hover:bg-stone-800 disabled:opacity-50 disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-4 h-4" />}
              Commit Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
