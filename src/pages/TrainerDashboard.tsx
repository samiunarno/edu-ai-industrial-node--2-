import { useEffect, useState, useRef, useMemo } from "react";
import { fetchApi } from "../lib/api";
import { Upload, Activity, Database, GitMerge, Loader2, FileCode2, Zap, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from "../contexts/LanguageContext";

export default function TrainerDashboard() {
  const { t } = useLanguage();
  const [models, setModels] = useState<any[]>([]);
  const [logs, setLogs] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Model Chart States
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Evaluation States
  const [evalInput, setEvalInput] = useState('');
  const [evalExpected, setEvalExpected] = useState('');
  const [evalOutput, setEvalOutput] = useState('');
  const [evalScore, setEvalScore] = useState<number | null>(null);
  const [evalMetrics, setEvalMetrics] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const fetchDashboardData = () => {
    fetchApi('/trainer/dashboard').then((data: any) => {
      const activeModels = data.models || [];
      setModels(activeModels);
      if (activeModels.length > 0 && !selectedModelId) {
        setSelectedModelId(activeModels[0].id);
      }
      setLogs(data.logs || []);
    }).catch(console.error);
  };

  const selectedModel = useMemo(() => models.find(m => m.id === selectedModelId), [models, selectedModelId]);

  // Generate progression timeline based on the actual model's training history
  const chartData = useMemo(() => {
    if (!selectedModel || !selectedModel.trainingHistory) {
      if (!selectedModel) return [];
      return [{ epoch: 'Initial', acc: selectedModel.accuracy || 0, precision: 0, recall: 0, f1: 0 }];
    }
    
    let history = selectedModel.trainingHistory;
    if (typeof history === 'string') {
      try {
        history = JSON.parse(history);
      } catch (e) {
        history = [];
      }
    }

    if (!Array.isArray(history) || history.length === 0) {
      return [{ epoch: 'Initial', acc: selectedModel.accuracy || 0, precision: 0, recall: 0, f1: 0 }];
    }

    return history.map((h: any) => ({
      epoch: h.epoch,
      acc: h.accuracy,
      precision: h.precision || 0,
      recall: h.recall || 0,
      f1: h.f1Score || 0
    }));
  }, [selectedModel]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTrain = async (e: any) => {
    e.preventDefault();
    if (isTraining) return;

    setIsTraining(true);
    setTrainingProgress(25);
    setShowSuccessToast(false);

    try {
      await fetchApi('/trainer/train', {
        method: "POST",
        body: JSON.stringify({ dataset: "Historic Feedback Corpus v2", modelId: selectedModelId })
      });
      
      setTrainingProgress(100);
      setTimeout(() => {
        setIsTraining(false);
        setTrainingProgress(0);
        fetchDashboardData(); // Refresh logs to show training completed
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 5000);
      }, 500);

    } catch (error) {
      console.error(error);
      setIsTraining(false);
      setTrainingProgress(0);
      alert("Failed to start training job.");
    }
  };

  const handleEvaluate = async (e: any) => {
    e.preventDefault();
    if (!evalInput) return alert("Please enter test context data.");
    
    setIsEvaluating(true);
    setEvalOutput('');
    setEvalScore(null);
    setEvalMetrics(null);
    
    try {
      const result = await fetchApi('/trainer/evaluate', {
        method: 'POST',
        body: JSON.stringify({ testData: evalInput, expectedOutput: evalExpected })
      });
      setEvalOutput(result.actualOutput);
      if (evalExpected) {
        setEvalScore(result.similarity);
        setEvalMetrics(result.metrics);
      }
      fetchDashboardData(); // Refresh logs
    } catch (error: any) {
      alert("Evaluation failed: " + error.message);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-16 font-sans text-stone-900"
    >
      <div className="md:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-stone-900 pb-6 mb-[-16px]">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Trainer Control</h1>
          <p className="font-mono text-stone-500 text-sm">{new Date().toISOString()}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4 bg-stone-100 p-2 border border-stone-300">
          <Database className="w-5 h-5 text-stone-600" />
          <span className="font-mono font-bold text-xs uppercase tracking-widest text-stone-600">MongoDb Linked</span>
        </div>
      </div>

      <div className="md:col-span-1 bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] flex flex-col p-6 h-fit min-h-[400px]">
        {/* Subtle background progress fill */}
        {isTraining && (
          <div 
            className="absolute left-0 bottom-0 top-0 bg-indigo-50/50 z-0 transition-all duration-300 ease-out"
            style={{ width: `${trainingProgress}%` }}
          />
        )}
        
        <div className="relative z-10 flex flex-col h-full flex-1">
          <h3 className="font-sans font-black text-xl uppercase tracking-tighter mb-2">
            {t.dashboard.trainer_title}
          </h3>
          <p className="font-serif italic text-xs text-stone-500 mb-6 leading-relaxed">
            Submit dataset payload to trigger deep learning sequence.
          </p>
          
          <div className={`mt-auto border-2 ${isTraining ? 'border-indigo-600 bg-indigo-50' : 'border-stone-900 border-dashed hover:bg-stone-50'} transition-colors p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] mb-6`}>
            {isTraining ? (
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-3" />
            ) : (
              <div className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center mb-3">
                <Upload className="h-4 w-4" />
              </div>
            )}
            <p className="font-mono text-xs font-bold text-stone-900 uppercase tracking-widest mb-1">{isTraining ? 'Training Active' : 'Load Dataset'}</p>
            {isTraining ? (
              <div className="w-full mt-4">
                <div className="flex justify-between font-mono text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2">
                  <span>Progress</span>
                  <span>{trainingProgress}%</span>
                </div>
                <div className="w-full border-2 border-indigo-200 h-2 bg-white">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <p className="font-serif italic text-[10px] text-stone-500 tracking-widest uppercase">Via Storage Grid</p>
            )}
          </div>
          
            <button 
              onClick={handleTrain} 
              disabled={isTraining}
              className="w-full bg-stone-900 text-white border-2 border-stone-900 font-mono font-bold text-sm uppercase px-4 py-3 hover:bg-stone-800 transition shadow-[4px_4px_0_0_#1c1917] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] disabled:opacity-50 disabled:shadow-none disabled:translate-0 flex items-center justify-center gap-2"
            >
              {isTraining ? 'Processing Data' : t.dashboard.train_btn}
            </button>
        </div>
      </div>

      <div id="performance-metrics-section" className="md:col-span-2 bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] p-6 h-fit">
        <div className="border-b-2 border-stone-900 pb-4 mb-6">
           <h3 className="font-sans font-black text-xl uppercase tracking-tighter flex items-center gap-2">
             <GitMerge className="w-5 h-5" />
             Active Models Output
           </h3>
           <p className="font-serif italic text-xs text-stone-500 mt-1">Track precision rates mapped across production nodes.</p>
        </div>

        {models.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-stone-300 bg-stone-50">
             <div className="font-mono text-xs uppercase font-bold text-stone-400">No models active</div>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-6 h-[320px]">
            <div className="flex flex-col gap-3 xl:w-[45%] overflow-y-auto custom-scrollbar pr-4 border-r-2 border-stone-100">
              {models.map((m: any) => (
                <div 
                  key={m.id} 
                  onClick={() => setSelectedModelId(m.id)}
                  className={`flex justify-between items-center p-4 border-2 transition-colors cursor-pointer group ${selectedModelId === m.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-stone-300 hover:border-stone-900 text-stone-900'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 ${m.isActive ? 'bg-emerald-400 border border-emerald-600' : 'bg-stone-300'}`}></div>
                    <div>
                      <div className="font-bold text-sm tracking-widest uppercase mb-1">
                        {m.name} 
                      </div>
                      <div className={`font-mono text-[10px] uppercase font-bold ${selectedModelId === m.id ? 'text-indigo-200' : 'text-stone-500'}`}>
                        v{m.version} | {new Date(m.lastTrained).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-2xl font-bold">
                      {m.accuracy}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Simulated historical Accuracy Trend Line Chart */}
            {selectedModel && (
              <div className="xl:w-[55%] flex flex-col justify-between">
                <div className="w-full flex justify-between items-center mb-4">
                   <h4 className="font-sans font-black text-sm uppercase tracking-wider flex items-center gap-2">
                     Trajectory Line
                     <span className="font-mono text-[10px] text-stone-500">({selectedModel.name})</span>
                   </h4>
                   <div className="font-mono text-[10px] font-bold text-indigo-600 uppercase">
                     Peak {selectedModel.accuracy}%
                   </div>
                </div>
                
                <div className="w-full flex-1 min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1c1917" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1c1917" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPrec" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                         <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="epoch" tick={{fontSize: 10, fill: '#78716c', fontFamily: 'monospace', fontWeight: 700}} tickLine={false} axisLine={false} dy={5} />
                      <YAxis domain={[50, 100]} tick={{fontSize: 10, fill: '#78716c', fontFamily: 'monospace', fontWeight: 700}} tickLine={false} axisLine={false} dx={-5} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '0', border: '2px solid #1c1917', padding: '8px 12px', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#1c1917' }} 
                        cursor={{ stroke: '#1c1917', strokeWidth: 1, strokeDasharray: '3 3' }}
                      />
                      <Area type="monotone" dataKey="acc" name="Accuracy" stroke="#1c1917" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                      <Area type="monotone" dataKey="precision" name="Precision" stroke="#4f46e5" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPrec)" />
                      <Area type="monotone" dataKey="recall" name="Recall" stroke="#059669" strokeWidth={2} strokeDasharray="3 3" fillOpacity={1} fill="url(#colorRec)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-1.5 font-bold font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-stone-900 border border-stone-900"></div> ACC
                  </div>
                  <div className="flex items-center gap-1.5 font-bold font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-indigo-500 border border-indigo-600"></div> PREC
                  </div>
                  <div className="flex items-center gap-1.5 font-bold font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                    <div className="w-2 h-2 bg-emerald-500 border border-emerald-600"></div> REC
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Playbox */}
        <div className="bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] flex flex-col h-full min-h-[500px]">
          <div className="px-6 py-4 border-b-2 border-stone-900 bg-stone-100">
             <h3 className="font-sans font-black text-xl uppercase tracking-tighter flex items-center gap-2">
               <FileCode2 className="w-5 h-5" />
               Validation Playbox
             </h3>
             <p className="font-serif italic text-xs text-stone-500 mt-1">Test real-time inferences before pipeline release.</p>
          </div>

          <div className="p-6 flex flex-col gap-6 flex-1">
            <div className="flex-1">
              <label className="font-mono block text-xs font-bold text-stone-900 uppercase tracking-widest mb-2">Test Request Pattern *</label>
              <textarea 
                rows={5}
                value={evalInput}
                onChange={(e) => setEvalInput(e.target.value)}
                placeholder="PROMPT > Test Score: 45%. Missed Cell Division."
                className="w-full bg-stone-50 border-2 border-stone-300 text-stone-900 font-mono text-xs p-4 focus:outline-none focus:border-stone-900 transition-colors resize-none h-[120px]"
              />
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="font-mono block text-xs font-bold text-stone-900 uppercase tracking-widest">Expected Benchmark</label>
                <span className="font-serif italic text-[10px] text-stone-500">Optional diff test</span>
              </div>
              <textarea 
                rows={3}
                value={evalExpected}
                onChange={(e) => setEvalExpected(e.target.value)}
                placeholder="EXPECTED > ..."
                className="w-full bg-stone-50 border-2 border-stone-300 text-stone-900 font-mono text-xs p-4 focus:outline-none focus:border-stone-900 transition-colors resize-none h-[80px]"
              />
            </div>
            <button 
              onClick={handleEvaluate} 
              disabled={isEvaluating || !evalInput}
              className="bg-stone-900 text-white px-5 py-3 font-mono font-bold text-sm uppercase transition shadow-[4px_4px_0_0_#1c1917] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] border-2 border-stone-900 hover:text-indigo-400 disabled:opacity-50 flex items-center justify-center gap-2 w-full mt-auto"
            >
              {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Execute Validation
            </button>
          </div>
        </div>

        {/* Output Pane */}
        <div className="bg-stone-900 border-2 border-stone-900 shadow-[8px_8px_0_0_#d6d3d1] p-6 flex flex-col text-stone-100 min-h-[500px]">
          <h4 className="font-mono text-xs font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-none bg-emerald-400 animate-pulse"></span>
            SYS_OUT & DIFF
          </h4>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
             <div className="bg-stone-800 border-2 border-stone-700 p-4 overflow-y-auto max-h-[260px] custom-scrollbar relative">
               <div className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 border-b-2 border-stone-700 pb-2">Benchmark</div>
               {evalExpected ? (
                 <span className="font-mono text-xs leading-relaxed text-stone-300 block">{evalExpected}</span>
               ) : (
                 <span className="font-serif italic text-stone-600 text-xs block mt-2">N/A</span>
               )}
             </div>

             <div className="bg-stone-800 border-2 border-stone-700 p-4 overflow-y-auto max-h-[260px] custom-scrollbar relative">
               <div className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-2 border-b-2 border-stone-700 pb-2">Response</div>
               {evalOutput ? (
                 <span className="font-mono text-xs leading-relaxed text-stone-100 block">{evalOutput}</span>
               ) : (
                 <span className="font-serif italic text-stone-600 text-xs block mt-2">Awaiting execution...</span>
               )}
             </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-auto border-t-2 border-stone-800 pt-6">
            <div className="flex flex-col">
              <div className="font-serif italic text-[10px] text-stone-500 uppercase tracking-widest mb-1 pl-1 border-l-2 border-stone-700">Precision</div>
              <div className="font-mono text-xl text-emerald-400">
                {evalMetrics ? `${evalMetrics.precision}%` : '--'}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-serif italic text-[10px] text-stone-500 uppercase tracking-widest mb-1 pl-1 border-l-2 border-stone-700">Recall</div>
              <div className="font-mono text-xl text-amber-400">
                {evalMetrics ? `${evalMetrics.recall}%` : '--'}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-serif italic text-[10px] text-stone-500 uppercase tracking-widest mb-1 pl-1 border-l-2 border-stone-700">F1 Score</div>
              <div className="font-mono text-xl text-indigo-400">
                {evalMetrics ? evalMetrics.f1Score : '--'}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="font-serif italic text-[10px] text-stone-500 uppercase tracking-widest mb-1 pl-1 border-l-2 border-emerald-700">Similarity</div>
              <div className={`font-mono text-xl ${evalScore !== null && evalScore > 75 ? 'text-emerald-400' : evalScore !== null && evalScore > 40 ? 'text-amber-400' : evalOutput ? 'text-rose-400' : 'text-stone-100'}`}>
                {evalScore !== null ? `${evalScore}%` : evalOutput ? 'FAIL' : '--'}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div id="telemetry-section" className="md:col-span-3 bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917]">
        <div className="px-6 py-4 border-b-2 border-stone-900 bg-stone-100 flex justify-between items-center">
          <h3 className="font-sans font-black text-xl uppercase tracking-tighter flex items-center gap-2">
            <Activity className="w-5 h-5 text-stone-800" /> {t.dashboard.history}
          </h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-6">
            {logs.length === 0 ? (
              <div className="text-center font-mono text-xs font-bold text-stone-400 uppercase py-6">NO TELEMETRY RECORDED</div>
            ) : (
              logs.map((log: any, index: number) => {
                const colors = ['bg-indigo-500 border-indigo-700', 'bg-emerald-500 border-emerald-700', 'bg-stone-900 border-stone-900'];
                const color = colors[index % colors.length];
                return (
                  <div key={log.id} className="flex gap-4 items-start group border-b-2 border-stone-100 pb-4 last:border-b-0 last:pb-0">
                    <div className={`w-3 h-3 mt-1 rounded-none border-2 ${color} group-hover:rotate-45 transition-transform`}></div>
                    <div>
                      <div className="font-mono text-sm font-bold uppercase text-stone-900 mb-1">{log.action}</div>
                      <div className="text-sm font-medium text-stone-600 leading-relaxed font-sans">
                        <span className="font-serif italic text-[10px] text-stone-400 uppercase tracking-widest mr-3 block md:inline mb-1 md:mb-0">
                          [{new Date(log.createdAt).toLocaleTimeString()}]
                        </span>
                        {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] p-6 flex flex-col gap-4 min-w-[320px] max-w-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 border border-emerald-300 p-2 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-stone-900 font-sans font-black text-lg uppercase tracking-tight">System Ready</h4>
                  <p className="font-serif italic text-stone-500 text-[11px] mt-0.5">Model sequence completed limits.</p>
                </div>
              </div>
              <button onClick={() => setShowSuccessToast(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2 border-t-2 border-stone-100 pt-4">
              <button 
                onClick={() => {
                  setShowSuccessToast(false);
                  document.getElementById('performance-metrics-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-mono text-[10px] font-bold text-indigo-600 uppercase hover:text-indigo-800 transition-colors"
              >
                Go to Metrics
              </button>
              <div className="w-1 h-1 bg-stone-300 rounded-none"></div>
              <button 
                onClick={() => {
                  setShowSuccessToast(false);
                  document.getElementById('telemetry-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-mono text-[10px] font-bold text-stone-500 uppercase hover:text-stone-800 transition-colors"
              >
                Go to Telemetry
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
