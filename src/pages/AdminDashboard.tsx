import { useEffect, useState } from "react";
import { fetchApi } from "../lib/api";
import { motion } from "motion/react";
import { Users, Activity, ShieldCheck, Search, ChevronDown, Loader2, Database, BrainCircuit, History, Plus, CheckCircle, Circle, Trash2, Power } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [models, setModels] = useState([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({});
  
  const [showModelForm, setShowModelForm] = useState(false);
  const [newModel, setNewModel] = useState({ name: '', version: '', apiDetails: '' });
  const [isSubmittingModel, setIsSubmittingModel] = useState(false);

  const refreshLogs = () => {
    fetchApi('/admin/logs').then(setLogs).catch(console.error);
  };

  useEffect(() => {
    fetchApi('/admin/users').then(setUsers).catch(console.error);
    refreshLogs();
    fetchApi('/admin/models').then(setModels).catch(console.error);
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const updatedUsers = await fetchApi(`/admin/users/${userId}/role`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole })
      });
      setUsers(updatedUsers);
      refreshLogs();
    } catch (error: any) {
      alert("Failed to update user role: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddModel = async (e: any) => {
    e.preventDefault();
    setIsSubmittingModel(true);
    try {
      const created = await fetchApi('/admin/models', {
        method: "POST",
        body: JSON.stringify(newModel)
      });
      setModels([created, ...models] as any);
      setShowModelForm(false);
      setNewModel({ name: '', version: '', apiDetails: '' });
      refreshLogs();
    } catch (error: any) {
      alert("Failed to add model: " + error.message);
    } finally {
      setIsSubmittingModel(false);
    }
  };

  const handleToggleModelStatus = async (modelId: string, currentStatus: boolean) => {
    try {
      const updatedModels = await fetchApi(`/admin/models/${modelId}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !currentStatus })
      });
      setModels(updatedModels);
      refreshLogs();
    } catch (error: any) {
      alert("Failed to update status: " + error.message);
    }
  };

  const stats = [
    { label: 'Total Accounts', value: users.length.toString(), icon: Users },
    { label: 'System Uptime', value: '99.9%', icon: Activity },
    { label: 'Platform Logs', value: logs.length.toString(), icon: ShieldCheck },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[1400px] w-full mx-auto flex flex-col gap-10 pb-16 font-sans text-stone-900"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-stone-900 pb-6">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Command Center</h1>
          <p className="font-mono text-stone-500 text-sm">{new Date().toISOString()}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4 bg-stone-100 p-2 border border-stone-300">
          <Database className="w-5 h-5 text-stone-600" />
          <span className="font-mono font-bold text-xs uppercase tracking-widest text-stone-600">MongoDb Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="border-2 border-stone-900 bg-white p-6 relative group overflow-hidden flex flex-col justify-between min-h-[140px] hover:bg-stone-900 hover:text-white transition-colors duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="font-serif italic text-xs uppercase tracking-[0.2em] opacity-70">{stat.label}</div>
              <stat.icon className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="font-mono text-4xl font-bold tracking-tight">{stat.value}</div>
          </div>
        ))}
        {/* AI Management Widget */}
        <div className="border-2 border-stone-900 bg-indigo-600 text-white p-6 relative flex flex-col justify-between min-h-[140px] shadow-[8px_8px_0_0_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0_0_#1c1917] transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="font-serif italic text-xs uppercase tracking-[0.2em] opacity-80">AI Hub</div>
            <BrainCircuit className="w-5 h-5 text-indigo-200" />
          </div>
          <div className="flex items-end justify-between">
            <div className="font-mono text-xl font-bold leading-tight">Models Manager</div>
            <button 
              onClick={() => {
                document.getElementById('ai-management-section')?.scrollIntoView({ behavior: 'smooth' });
              }} 
              className="mt-auto bg-white text-indigo-700 font-bold font-mono uppercase text-[10px] px-3 py-1.5 border-2 border-transparent hover:border-white hover:bg-transparent hover:text-white transition-colors"
            >
              Configure
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column - Users & Models */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          {/* User Registry */}
          <div className="bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917]">
            <div className="px-6 py-4 border-b-2 border-stone-900 bg-stone-100 flex justify-between items-center">
              <h3 className="font-sans font-black text-xl uppercase tracking-tighter">User Registry</h3>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="SEARCH USERS" 
                  className="pl-9 pr-3 py-1.5 bg-white border border-stone-300 font-mono text-xs outline-none focus:border-stone-900 w-[200px]"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b-2 border-stone-900">
                    <th className="font-serif italic text-xs px-6 py-3 border-r border-stone-200 text-stone-500 font-normal">Identity</th>
                    <th className="font-serif italic text-xs px-6 py-3 border-r border-stone-200 text-stone-500 font-normal">Privilege</th>
                    <th className="font-serif italic text-xs px-6 py-3 border-r border-stone-200 text-stone-500 font-normal">Status</th>
                    <th className="font-serif italic text-xs px-6 py-3 text-stone-500 font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-sm">
                  {users.map((u: any) => (
                    <tr key={u.id} className="border-b border-stone-200 hover:bg-stone-900 hover:text-white group transition-colors">
                      <td className="px-6 py-4 border-r border-stone-200 group-hover:border-stone-700">
                        <div className="font-bold mb-1">{u.name || "Unknown"}</div>
                        <div className="text-xs opacity-60">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 border-r border-stone-200 group-hover:border-stone-700">
                        <div className="flex flex-col gap-2 relative">
                          <select
                            value={pendingRoles[u.id] || u.role}
                            onChange={(e) => setPendingRoles({...pendingRoles, [u.id]: e.target.value})}
                            disabled={updatingId === u.id}
                            className="bg-transparent border border-stone-300 group-hover:border-stone-600 px-2 py-1 uppercase text-xs cursor-pointer outline-none w-full appearance-none"
                          >
                            <option value="admin" className="text-black">Admin</option>
                            <option value="teacher" className="text-black">Teacher</option>
                            <option value="ai_trainer" className="text-black">AI Trainer</option>
                            <option value="banned" className="text-black text-red-600">Banned</option>
                          </select>
                          {pendingRoles[u.id] && pendingRoles[u.id] !== u.role && (
                            <div className="flex items-center gap-2 mt-1">
                              <button onClick={() => {
                                  handleRoleChange(u.id, pendingRoles[u.id]);
                                  const updated = {...pendingRoles};
                                  delete updated[u.id];
                                  setPendingRoles(updated);
                                }}
                                className="bg-indigo-600 text-white px-2 py-0.5 text-xs border border-indigo-700 hover:bg-indigo-500"
                              >
                                {updatingId === u.id ? '...' : 'SAVE'}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-stone-200 group-hover:border-stone-700">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider">
                          <div className={`w-2 h-2 rounded-full ${u.role === 'banned' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                          <span>{u.role === 'banned' ? 'SYS DENY' : 'SYS OK'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button
                           onClick={async () => {
                             if (confirm(`PURGE RECORD: ${u.name}?`)) {
                                try {
                                  const updatedUsers = await fetchApi(`/admin/users/${u.id}`, { method: 'DELETE' });
                                  setUsers(updatedUsers);
                                  refreshLogs();
                                } catch(e) {}
                             }
                           }}
                           className="text-stone-400 group-hover:text-red-400 hover:text-red-500 transition-colors"
                         >
                           <Trash2 className="w-5 h-5 inline-block" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Management */}
          <div id="ai-management-section" className="bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917]">
            <div className="px-6 py-4 border-b-2 border-stone-900 bg-stone-100 flex justify-between items-center">
              <h3 className="font-sans font-black text-xl uppercase tracking-tighter">AI Gateway Grid</h3>
              <button 
                onClick={() => setShowModelForm(!showModelForm)}
                className="flex items-center gap-2 bg-stone-900 text-white px-3 py-1.5 font-mono text-xs uppercase border border-stone-900 hover:bg-stone-800 transition"
              >
                <Plus className="w-4 h-4" /> Add Protocol
              </button>
            </div>

            {showModelForm && (
              <div className="p-6 border-b-2 border-stone-900 bg-stone-50">
                <form onSubmit={handleAddModel} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-serif italic text-xs text-stone-500 block mb-1">DESIGNATION</label>
                    <input 
                      type="text" required placeholder="Identifier"
                      value={newModel.name} onChange={e => setNewModel({...newModel, name: e.target.value})}
                      className="w-full bg-white border-2 border-stone-300 px-3 py-2 font-mono text-sm uppercase outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="font-serif italic text-xs text-stone-500 block mb-1">BUILD VERSION</label>
                    <input 
                      type="text" required placeholder="v1.0"
                      value={newModel.version} onChange={e => setNewModel({...newModel, version: e.target.value})}
                      className="w-full bg-white border-2 border-stone-300 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-600"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="font-serif italic text-xs text-stone-500 block mb-1">ENDPOINT SECRETS</label>
                      <input 
                        type="text" placeholder="api.url..."
                        value={newModel.apiDetails} onChange={e => setNewModel({...newModel, apiDetails: e.target.value})}
                        className="w-full bg-white border-2 border-stone-300 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-600"
                      />
                    </div>
                    <button type="submit" disabled={isSubmittingModel} className="bg-indigo-600 text-white border-2 border-indigo-600 font-mono font-bold uppercase text-sm px-4 py-2 hover:bg-indigo-700 focus:outline-none">
                      {isSubmittingModel ? '...' : 'INIT'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <tbody className="font-mono text-sm">
                  {models.map((model: any) => (
                    <tr key={model.id} className="border-b border-stone-200 hover:bg-stone-100 transition-colors">
                      <td className="px-6 py-4 font-bold border-r border-stone-200 uppercase">
                        {model.name} <span className="text-stone-400 font-normal">#{model.version}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-stone-200 text-stone-500 text-xs truncate max-w-[150px]">
                        {model.apiDetails || 'N/A_CONFIG'}
                      </td>
                      <td className="px-6 py-4 text-center border-r border-stone-200">
                        {model.isActive ? 
                          <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 uppercase border border-emerald-200 flex items-center gap-1 w-max mx-auto"><CheckCircle className="w-3 h-3"/> PRI_NODE</span> : 
                          <span className="text-stone-400 text-xs bg-stone-50 px-2 py-1 uppercase border border-stone-200 flex items-center gap-1 w-max mx-auto"><Circle className="w-3 h-3"/> STBY</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => handleToggleModelStatus(model.id, model.isActive)}
                           className={`font-bold text-xs px-3 py-1 cursor-pointer border ${model.isActive ? 'bg-stone-900 text-white border-stone-900 hover:bg-stone-800' : 'bg-transparent text-indigo-600 border-indigo-600 hover:bg-indigo-50'}`}
                         >
                           {model.isActive ? 'HALT' : 'ENGAGE'}
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Logs */}
        <div className="bg-stone-900 text-stone-300 border-2 border-stone-900 flex flex-col h-[700px] shadow-[8px_8px_0_0_#d6d3d1]">
          <div className="px-6 py-4 border-b border-stone-700 flex justify-between items-center bg-stone-800">
            <h3 className="font-sans font-black text-xl uppercase text-white tracking-tighter flex gap-2 items-center">
              <History className="w-5 h-5 text-indigo-400" />
              Terminal Output
            </h3>
          </div>
          <div className="overflow-y-auto flex-1 p-6 space-y-4 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-stone-500 text-center uppercase tracking-widest mt-10 opacity-50">&gt;_ NO ACTIVITY DETECTED</div>
            ) : (
              logs.map((log: any) => (
                <div key={log.id} className="border-l-2 border-stone-700 pl-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-indigo-400 font-bold uppercase">{log.action}</span>
                    <span className="text-[10px] text-stone-500">{new Date(log.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-stone-400 break-words mb-1">
                    {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                  </div>
                  {log.userId && (
                    <div className="text-[10px] bg-stone-800 text-stone-500 px-2 py-0.5 inline-block uppercase border border-stone-700">
                      USR_REQ: {log.userId?.name || log.userId}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
