import { useEffect, useState, useRef, useMemo } from "react";
import { fetchApi } from "../lib/api";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Upload, BookOpen, GraduationCap, TrendingUp, Sparkles, FileText, Loader2, UserCircle, Activity, Database, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import AIChatbot from "../components/AIChatbot";
import { useLanguage } from "../contexts/LanguageContext";

export default function TeacherDashboard() {
  const { t } = useLanguage();
  const [students, setStudents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const loadData = () => {
    fetchApi('/teacher/dashboard').then((data: any) => {
      setStudents(data.students || []);
      setFeedbacks(data.feedbacks || []);
    }).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      
      await fetchApi('/teacher/students', { method: 'POST', body: formData });
      alert("Data uploaded and processed by AI!");
      setFile(null);
      loadData();
    } catch (err) {
      alert("Failed to process data.");
    } finally {
      setIsUploading(false);
    }
  };

  const avgScore = students.length > 0 ? (students.reduce((acc: any, s: any) => acc + s.marks, 0) / students.length).toFixed(1) : 0;

  // Calculate Grade Distribution
  const gradeDistribution = useMemo(() => {
    if (students.length === 0) return [];
    
    let a = 0, b = 0, c = 0, d = 0, f = 0;
    students.forEach((s: any) => {
      if (s.marks >= 90) a++;
      else if (s.marks >= 80) b++;
      else if (s.marks >= 70) c++;
      else if (s.marks >= 60) d++;
      else f++;
    });

    return [
      { name: 'Grade A (90-100)', value: a, color: '#10B981' }, // emerald-500
      { name: 'Grade B (80-89)', value: b, color: '#3B82F6' }, // blue-500
      { name: 'Grade C (70-79)', value: c, color: '#8B5CF6' }, // violet-500
      { name: 'Grade D (60-69)', value: d, color: '#F59E0B' }, // amber-500
      { name: 'Grade F (<60)', value: f, color: '#EF4444' }, // red-500
    ].filter(g => g.value > 0);
  }, [students]);

  // Student Trend Calculation
  const uniqueStudentNames = useMemo(() => Array.from(new Set(students.map((s: any) => s.name))), [students]);
  const [selectedTrendStudent, setSelectedTrendStudent] = useState<string>("");

  useEffect(() => {
    if (!selectedTrendStudent && uniqueStudentNames.length > 0) {
      setSelectedTrendStudent(uniqueStudentNames[0] as string);
    }
  }, [uniqueStudentNames, selectedTrendStudent]);

  const studentTrendData = useMemo(() => {
    if (!selectedTrendStudent || students.length === 0) return [];
    const records = students.filter((s: any) => s.name === selectedTrendStudent).sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    if (records.length > 1) {
      return records.map((r: any, i: number) => ({
        name: r.course || `Exam ${i+1}`,
        score: r.marks
      }));
    }
    
    const singleRecord = records[0];
    if (singleRecord && singleRecord.assignments && singleRecord.assignments.length > 0) {
      return singleRecord.assignments.map((a: any) => ({
        name: a.title,
        score: a.score
      }));
    }
    
    if (singleRecord) {
      return [
        { name: 'Latest Score', score: singleRecord.marks }
      ];
    }
    return [];
  }, [students, selectedTrendStudent]);

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
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Teacher Analytics</h1>
          <p className="font-mono text-stone-500 text-sm">{new Date().toISOString()}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-4 bg-stone-100 p-2 border border-stone-300">
          <Database className="w-5 h-5 text-stone-600" />
          <span className="font-mono font-bold text-xs uppercase tracking-widest text-stone-600">MongoDb Linked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border-2 border-stone-900 bg-white p-6 justify-between flex flex-col min-h-[140px] group hover:bg-stone-900 hover:text-white transition-colors duration-200">
          <div className="flex items-start justify-between mb-6">
            <div className="font-serif italic text-xs uppercase tracking-[0.2em] opacity-70">{t.dashboard.students_table}</div>
            <GraduationCap className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="font-mono text-4xl font-bold tracking-tight">{students.length}</div>
        </div>

        <div className="border-2 border-stone-900 bg-white p-6 justify-between flex flex-col min-h-[140px] group hover:bg-stone-900 hover:text-white transition-colors duration-200">
          <div className="flex items-start justify-between mb-6">
            <div className="font-serif italic text-xs uppercase tracking-[0.2em] opacity-70">Class Average</div>
            <TrendingUp className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="font-mono text-4xl font-bold tracking-tight">{avgScore}%</div>
        </div>

        <div className="border-2 border-stone-900 bg-emerald-600 text-white p-6 justify-between flex flex-col min-h-[140px] shadow-[8px_8px_0_0_#1c1917] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0_0_#1c1917] transition-all">
          <div className="flex items-start justify-between mb-6">
            <div className="font-serif italic text-xs uppercase tracking-[0.2em] opacity-80">AI Insights Generates</div>
            <Sparkles className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="font-mono text-4xl font-bold tracking-tight">{feedbacks.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] p-6 flex flex-col h-full min-h-[400px]">
          <h3 className="font-sans font-black text-xl uppercase tracking-tighter mb-2">
            {t.dashboard.upload_btn}
          </h3>
          <p className="font-serif italic text-xs text-stone-500 mb-6 leading-relaxed">
            Drop CSV files containing student progress to generate advanced AI analytics.
          </p>
          
          <div className="mt-auto flex flex-col gap-4">
            <input 
              type="file" 
              accept=".csv"
              className="hidden" 
              ref={fileInputRef} 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 ${file ? 'border-emerald-600 bg-emerald-50' : 'border-stone-900 border-dashed hover:bg-stone-50'} transition-colors p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[120px]`}
            >
              {file ? (
                 <>
                   <div className="w-8 h-8 bg-emerald-600 text-white rounded-none flex items-center justify-center mb-3">
                     <FileText className="h-4 w-4" />
                   </div>
                   <p className="font-mono text-xs font-bold text-stone-900 mb-1 truncate w-full px-2">{file.name}</p>
                   <p className="font-serif italic text-[10px] text-emerald-600 uppercase tracking-widest">Ready</p>
                 </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center mb-3">
                    <Upload className="h-4 w-4" />
                  </div>
                  <p className="font-mono text-xs font-bold text-stone-900 uppercase">Select CSV</p>
                  <p className="font-serif italic text-[10px] text-stone-500 uppercase tracking-widest mt-1">MAX 50MB</p>
                </>
              )}
            </div>
            
            <button 
              onClick={handleUpload} 
              disabled={isUploading || !file}
              className="w-full bg-stone-900 text-white px-4 py-3 font-mono font-bold text-sm uppercase hover:bg-stone-800 transition disabled:opacity-50 flex items-center justify-center gap-2 border-2 border-stone-900 hover:border-indigo-600"
            >
              {isUploading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Run Integrations'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] flex flex-col relative overflow-hidden">
          <div className="px-6 py-4 border-b-2 border-stone-900 bg-stone-100">
            <h3 className="font-sans font-black text-xl uppercase tracking-tighter">Performance Distribution</h3>
            <p className="font-serif italic text-xs text-stone-500 mt-0.5">Automated scoring metrics from recent epochs</p>
          </div>
          <div className="flex-1 p-6 h-[250px] w-full">
            {students.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={students} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d6d3d1" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#78716c', fontWeight: 700, fontFamily: 'monospace' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#78716c', fontWeight: 700, fontFamily: 'monospace' }} dx={-10} domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ fill: '#f5f5f4' }} 
                    contentStyle={{ borderRadius: '0', border: '2px solid #1c1917', padding: '8px 12px', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#1c1917' }} 
                  />
                  <Bar dataKey="marks" fill="#1c1917" radius={[0, 0, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full border border-dashed border-stone-300 flex items-center justify-center bg-stone-50">
                <span className="font-mono text-xs uppercase text-stone-400 font-bold tracking-wider">Awaiting Data</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] flex flex-col">
          <div className="px-6 py-4 border-b-2 border-stone-900 bg-stone-100">
            <h3 className="font-sans font-black text-xl uppercase tracking-tighter">Grade Tiers</h3>
            <p className="font-serif italic text-xs text-stone-500 mt-0.5">Distribution map</p>
          </div>
          <div className="flex-1 px-2 py-6 h-[250px] w-full relative">
            {gradeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="#1c1917"
                    strokeWidth={2}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '0', border: '2px solid #1c1917', padding: '8px 12px', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="square"
                    iconSize={10}
                    wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: '#1c1917', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full border border-dashed border-stone-300 flex items-center justify-center bg-stone-50 px-4 text-center">
                <span className="font-mono text-xs uppercase text-stone-400 font-bold tracking-wider">Dataset Missing</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917]">
        <div className="px-6 py-4 border-b-2 border-stone-900 bg-stone-100 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 className="font-sans font-black text-xl uppercase tracking-tighter flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Trajectory Analysis
            </h3>
            <p className="font-serif italic text-xs text-stone-500 mt-0.5">Visualize scoring trends over historical epochs.</p>
          </div>
          <div className="relative">
            <select
              value={selectedTrendStudent}
              onChange={(e) => setSelectedTrendStudent(e.target.value)}
              className="appearance-none bg-white border-2 border-stone-300 hover:border-stone-900 text-stone-900 py-2 pl-4 pr-10 text-xs font-mono font-bold uppercase outline-none focus:border-indigo-600 cursor-pointer min-w-[200px] transition-colors"
            >
              {uniqueStudentNames.length > 0 ? (
                uniqueStudentNames.map((name: any, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))
              ) : (
                <option value="">No targets</option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-900">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="p-6 h-[280px] w-full">
          {studentTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d6d3d1" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#78716c', fontWeight: 700, fontFamily: 'monospace' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#78716c', fontWeight: 700, fontFamily: 'monospace' }} dx={-10} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ stroke: '#1c1917', strokeWidth: 1, strokeDasharray: '3 3' }} 
                  contentStyle={{ borderRadius: '0', border: '2px solid #1c1917', padding: '8px 12px', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', color: '#1c1917' }} 
                />
                <Line type="step" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#FFFFFF' }} activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 0 }} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full border border-dashed border-stone-300 flex items-center justify-center bg-stone-50">
              <span className="font-mono text-xs uppercase text-stone-400 font-bold tracking-wider">Awaiting Data</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917]">
        <div className="px-6 py-4 border-b-2 border-stone-900 bg-stone-100">
          <h3 className="font-sans font-black text-xl uppercase tracking-tighter">{t.dashboard.students_table}</h3>
          <p className="font-serif italic text-xs text-stone-500 mt-0.5">Semantic assessments generated by AI.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b-2 border-stone-900">
                <th className="font-serif italic text-xs px-6 py-3 border-r border-stone-200 text-stone-500 font-normal w-[20%]">Identity</th>
                <th className="font-serif italic text-xs px-6 py-3 border-r border-stone-200 text-stone-500 font-normal w-[15%]">Subject</th>
                <th className="font-serif italic text-xs px-6 py-3 border-r border-stone-200 text-stone-500 font-normal w-[50%]">Analysis Output</th>
                <th className="font-serif italic text-xs px-6 py-3 text-stone-500 font-normal text-right">Score</th>
              </tr>
            </thead>
            <tbody className="font-mono text-sm">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-[13px] font-medium text-stone-400 italic">No semantic reports generated.</td>
                </tr>
              ) : (
                feedbacks.map((fb: any, idx) => (
                  <tr key={fb.id} className="border-b border-stone-200 hover:bg-stone-50 transition-colors align-top group">
                    <td className="px-6 py-4 border-r border-stone-200 group-hover:border-stone-300">
                       <div className="flex items-center gap-3">
                         <UserCircle className="w-6 h-6 text-stone-400 shrink-0" />
                         <div className="font-bold text-stone-900">{fb.studentId?.name || "Unknown"}</div>
                       </div>
                    </td>
                    <td className="px-6 py-4 border-r border-stone-200 group-hover:border-stone-300">
                      <span className="bg-indigo-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border border-indigo-700 mx-auto w-max block text-center">
                        {fb.course}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-r border-stone-200 group-hover:border-stone-300 text-xs text-stone-600 leading-relaxed max-w-[400px]">
                      <div className="whitespace-pre-wrap break-words max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                        {fb.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {fb.studentId?.marks !== undefined && (
                        <div className={`font-mono text-lg font-bold ${fb.studentId.marks >= 80 ? 'text-emerald-600' : fb.studentId.marks >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                          {fb.studentId.marks}%
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Interactive AI Analytics Assistant */}
      <AIChatbot students={students} feedbacks={feedbacks} />
    </motion.div>
  );
}
