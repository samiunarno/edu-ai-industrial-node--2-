import { Link } from 'react-router';
import { motion } from 'motion/react';
import { BrainCircuit, BookOpen, BarChart3, ChevronRight, CheckCircle2, ShieldCheck, Activity, Database, Workflow, Lock, Zap, Languages, Globe, Cpu, Layers, Terminal, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Landing() {
  const { t, language, setLanguage } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" as const } }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-900 selection:text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />
      
      {/* 1. Navigation */}
      <nav className="border-b-4 border-stone-900 bg-white sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-4 group">
             <div className="p-2 border-2 border-stone-900 bg-stone-900 shadow-[2px_2px_0_0_#1c1917] group-hover:shadow-[4px_4px_0_0_#1c1917] transition-all">
                <Terminal className="w-5 h-5 text-white" />
              </div>
            <span className="font-sans font-black text-2xl text-stone-900 tracking-tighter uppercase">
              EDU-AI
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 font-mono text-xs font-bold text-stone-900 uppercase tracking-widest">
            <a href="#features" className="hover:bg-stone-900 hover:text-white px-2 py-1 transition-colors border-2 border-transparent hover:border-stone-900">{t.nav.platform}</a>
            <a href="#architecture" className="hover:bg-stone-900 hover:text-white px-2 py-1 transition-colors border-2 border-transparent hover:border-stone-900">{t.nav.architecture}</a>
            <a href="#security" className="hover:bg-stone-900 hover:text-white px-2 py-1 transition-colors border-2 border-transparent hover:border-stone-900">{t.nav.security}</a>
            <a href="#pricing" className="hover:bg-stone-900 hover:text-white px-2 py-1 transition-colors border-2 border-transparent hover:border-stone-900">{t.landing?.pricing?.title || "Pricing"}</a>
          </div>

          <div className="flex items-center gap-4">
             <button 
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-stone-100 border-2 border-stone-900 font-mono text-[10px] font-bold text-stone-900 uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'EN' : 'ZH'}</span>
            </button>
            <Link to="/login" className="font-mono text-xs font-bold text-stone-900 uppercase tracking-widest px-4 py-2 border-2 border-transparent hover:border-stone-900 hover:bg-stone-100 transition-colors">
              {t.nav.login}
            </Link>
            <Link to="/register" className="bg-stone-900 text-white font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 border-2 border-stone-900 shadow-[4px_4px_0_0_#1c1917] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] transition-all">
              {t.nav.deploy}
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-40 lg:pb-48 overflow-hidden z-10 border-b-4 border-stone-900 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-stone-900 bg-stone-100 text-stone-900 font-mono text-xs font-bold uppercase tracking-widest mb-10 shadow-[4px_4px_0_0_#1c1917]">
              <div className="w-2 h-2 bg-green-500 rounded-full border border-stone-900 animate-pulse"></div>
              {t.hero.badge}
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="font-sans text-6xl md:text-[100px] font-black text-stone-900 leading-[0.9] mb-8 tracking-tighter uppercase px-4 bg-stone-100 border-x-4 border-t-4 border-stone-900 pt-6 pb-2 inline-block shadow-[8px_8px_0_0_#1c1917]">
              {t.hero.title_part1} <br/>
              <span className="text-white bg-stone-900 px-4 mt-2 inline-block pb-2 -ml-4 -mr-4 border-y-4 border-stone-900">
                {t.hero.title_part2}
              </span>
            </motion.h1>
            
            <motion.div variants={itemVariants} className="text-[18px] md:text-xl font-mono font-medium text-stone-600 mb-12 max-w-3xl mx-auto border-2 border-stone-300 p-6 bg-white relative">
               <div className="absolute top-[-10px] left-4 bg-white px-2 font-mono text-[10px] font-bold text-stone-500 uppercase tracking-widest">MISSION_STATEMENT</div>
              {t.hero.description}
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-8 items-center mt-6">
              <Link to="/register" className="bg-stone-900 text-white font-mono text-sm font-bold uppercase tracking-widest px-10 py-5 border-2 border-stone-900 shadow-[8px_8px_0_0_#1c1917] hover:shadow-[2px_2px_0_0_#1c1917] hover:translate-y-[6px] hover:translate-x-[6px] transition-all flex items-center gap-3 group">
                {t.hero.cta}
                <ChevronRight className="w-5 h-5 group-hover:block" />
              </Link>
              
              <div className="flex items-center gap-6 p-4 border-2 border-stone-900 bg-stone-50 shadow-[4px_4px_0_0_#1c1917]">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-10 h-10 border-2 border-stone-900 bg-white shadow-sm overflow-hidden flex items-center justify-center font-mono text-xs font-bold text-stone-500">
                       <User size={20} className="text-stone-400" />
                     </div>
                   ))}
                </div>
                <div className="text-left leading-none flex flex-col gap-1">
                  <div className="text-xl font-black text-stone-900 font-sans tracking-tighter">4,200+</div>
                  <div className="font-mono text-[9px] font-bold text-stone-500 uppercase tracking-widest">Active Instances</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="bg-stone-900 py-16 border-b-4 border-stone-900">
        <div className="max-w-[1400px] mx-auto px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
             {[
               { val: "99.9%", label: t.landing?.stats?.uptime || "SYSTEM UPTIME" },
               { val: "98.2%", label: t.landing?.stats?.accuracy || "PREDICTION DELTA" },
               { val: "2.5s", label: t.landing?.stats?.efficiency || "PROCESSING LATENCY" },
               { val: "100%", label: "DATA SOVEREIGNTY" }
             ].map((s, i) => (
               <div key={i} className="flex flex-col gap-2 relative group">
                  <div className="absolute -left-6 top-2 w-4 h-[2px] bg-stone-700"></div>
                 <div className="font-sans text-5xl font-black text-white tracking-tighter">{s.val}</div>
                 <div className="font-mono text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 border border-stone-500 inline-block"></span>
                    {s.label}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. AI Analysis Showcase */}
      <section className="py-32 bg-stone-100 border-b-4 border-stone-900 relative">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="bg-white border-4 border-stone-900 p-8 shadow-[16px_16px_0_0_#1c1917]">
               <div className="flex items-center justify-between mb-8 border-b-4 border-stone-900 pb-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-stone-900 border-2 border-stone-900 flex items-center justify-center shadow-[4px_4px_0_0_#d6d3d1]">
                     <Database className="w-6 h-6 text-white" />
                   </div>
                   <div className="font-sans font-black text-xl uppercase tracking-tighter">Cognitive Analysis</div>
                 </div>
                 <div className="h-8 px-4 bg-white border-2 border-stone-900 text-stone-900 font-mono text-[10px] font-bold uppercase tracking-widest flex items-center shadow-[2px_2px_0_0_#1c1917]">SYS_OK</div>
               </div>
               <div className="space-y-6">
                 {[85, 42, 70].map((w, i) => (
                   <div key={i} className="space-y-2">
                     <div className="flex justify-between font-mono text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                       <span>NODE_{i+1}_METRIC</span>
                       <span className="text-stone-900">{w}%</span>
                     </div>
                     <div className="h-4 w-full bg-stone-200 border-2 border-stone-900 overflow-hidden relative">
                        <motion.div 
                          className={`h-full border-r-2 border-stone-900 ${i === 1 ? 'bg-red-500' : 'bg-stone-900'}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${w}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                        />
                     </div>
                   </div>
                 ))}
               </div>
               <div className="mt-8 pt-6 border-t-4 border-stone-900">
                 <div className="bg-stone-100 p-4 border-2 border-stone-900 flex items-start gap-4">
                   <div className="w-3 h-3 bg-red-500 border border-stone-900 mt-0.5 animate-pulse shrink-0" />
                   <p className="font-mono text-xs font-bold text-stone-900 leading-relaxed uppercase">Anomaly detected: NODE_2 shows high cognitive drift. Recalibration advised.</p>
                 </div>
               </div>
            </div>
          </div>
          <div>
            <div className="inline-block px-4 py-2 border-2 border-stone-900 bg-stone-900 text-white font-mono text-[10px] font-bold uppercase tracking-widest mb-8 shadow-[4px_4px_0_0_#d6d3d1]">
               Neural Architecture
            </div>
            <h2 className="font-sans text-5xl font-black text-stone-900 leading-[0.9] mb-8 tracking-tighter uppercase p-4 bg-white border-4 border-stone-900 shadow-[8px_8px_0_0_#1c1917] inline-block">
              {t.landing?.showcase?.title || "Deep Insights"}
            </h2>
            <p className="text-xl text-stone-600 font-mono font-medium mb-12 leading-relaxed border-l-4 border-stone-900 pl-6 py-2 bg-white/50 backdrop-blur-sm">
              {t.landing?.showcase?.subtitle || "Our proprietary engine decodes raw data into trajectory forecasts."}
            </p>
            <div className="grid gap-6">
              {[
                { title: t.landing?.showcase?.card1_title, desc: t.landing?.showcase?.card1_desc, icon: BrainCircuit },
                { title: t.landing?.showcase?.card2_title, desc: t.landing?.showcase?.card2_desc, icon: Activity }
              ].map((f, i) => (
                <div key={i} className="flex gap-6 p-6 bg-white border-2 border-stone-900 shadow-[4px_4px_0_0_#1c1917] group hover:bg-stone-100 transition-colors">
                  <div className="w-14 h-14 bg-stone-900 border-2 border-stone-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_#d6d3d1] group-hover:shadow-[4px_4px_0_0_#d6d3d1] transition-shadow">
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-sans text-xl font-black text-stone-900 mb-2 uppercase tracking-tighter">{f.title}</h4>
                    <p className="font-mono text-xs text-stone-600 leading-relaxed font-bold">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. How it Works Section */}
      <section id="architecture" className="py-32 border-b-4 border-stone-900 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between border-b-4 border-stone-900 pb-8 gap-8">
            <h2 className="font-sans text-6xl font-black text-stone-900 tracking-tighter uppercase leading-none">
              <span className="text-transparent bg-clip-text" style={{ WebkitTextStroke: '2px #1c1917' }}>DATA</span> {t.landing?.how_it_works?.title}
            </h2>
            <div className="font-mono text-xs font-bold text-stone-500 uppercase tracking-widest max-w-[200px]">System topology & processing pipeline</div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { num: "01", title: t.landing?.how_it_works?.step1, desc: t.landing?.how_it_works?.step1_desc, icon: Database },
               { num: "02", title: t.landing?.how_it_works?.step2, desc: t.landing?.how_it_works?.step2_desc, icon: Cpu },
               { num: "03", title: t.landing?.how_it_works?.step3, desc: t.landing?.how_it_works?.step3_desc, icon: BarChart3 }
             ].map((s, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.2 }}
                 className="bg-stone-50 border-4 border-stone-900 p-8 shadow-[8px_8px_0_0_#1c1917] flex flex-col relative"
               >
                  <div className="absolute -top-6 -right-6 font-sans text-8xl font-black text-stone-900/10 pointer-events-none">{s.num}</div>
                 <div className="w-16 h-16 bg-white border-2 border-stone-900 flex items-center justify-center shadow-[4px_4px_0_0_#1c1917] mb-8 relative z-10">
                   <s.icon className="w-8 h-8 text-stone-900" />
                 </div>
                 <h4 className="font-sans text-2xl font-black text-stone-900 mb-4 uppercase tracking-tighter mt-auto pt-8 border-t-2 border-stone-900 relative z-10">{s.title}</h4>
                 <p className="font-mono text-xs font-bold text-stone-600 leading-relaxed relative z-10">{s.desc}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. Professional Pricing */}
      <section id="pricing" className="py-32 bg-stone-100 border-b-4 border-stone-900">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="mb-20 text-center flex flex-col items-center">
             <div className="inline-block px-4 py-2 border-2 border-stone-900 bg-white font-mono text-[10px] font-bold text-stone-900 uppercase tracking-widest mb-6 shadow-[2px_2px_0_0_#1c1917]">RESOURCE_ALLOCATION</div>
            <h2 className="font-sans text-6xl font-black text-stone-900 tracking-tighter uppercase p-4 bg-white border-4 border-stone-900 shadow-[8px_8px_0_0_#1c1917] inline-block">{t.landing?.pricing?.title}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch pt-4">
            {[
              { tier: t.landing?.pricing?.free_title, price: "$0", features: ["1 Model integration", "Basic analytics", "50 Student entries"], btn: "Get Started" },
              { tier: t.landing?.pricing?.pro_title, price: "$299", popular: true, features: ["Multi-model routing", "Deep semantic insights", "Unlimited students", "CSV Batch processing"], btn: "Deploy Instance" },
              { tier: t.landing?.pricing?.enterprise_title, price: "Custom", features: ["Private cloud node", "SSO & IAM integration", "24/7 dedicated API support", "Custom ML training"], btn: "Contact Nodes" }
            ].map((p, i) => (
              <div key={i} className={`p-8 flex flex-col h-full border-4 border-stone-900 relative ${p.popular ? 'bg-stone-900 text-white shadow-[12px_12px_0_0_#d6d3d1] -top-4 md:-top-8 scale-[1.02]' : 'bg-white text-stone-900 shadow-[8px_8px_0_0_#1c1917]'}`}>
                {p.popular && (
                  <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-white text-stone-900 font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 border-2 border-stone-900 shadow-[4px_4px_0_0_#1c1917]">RECOMMENDED_T</div>
                )}
                <div className={`font-mono text-xs font-bold uppercase tracking-widest mb-8 border-b-2 pb-4 ${p.popular ? 'border-stone-700 text-stone-400' : 'border-stone-200 text-stone-500'}`}>
                   {p.tier}
                </div>
                <div className="font-sans text-6xl font-black tracking-tighter mb-10">{p.price}</div>
                
                <div className="flex-1 space-y-4 mb-12">
                  {p.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-4">
                      <div className={`w-2 h-2 mt-1.5 shrink-0 border ${p.popular ? 'bg-white border-white' : 'bg-stone-900 border-stone-900'}`}></div>
                      <span className={`font-mono text-xs font-bold leading-relaxed ${p.popular ? 'text-stone-300' : 'text-stone-600'}`}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link to="/register" className={`w-full py-4 text-center font-mono text-xs font-bold uppercase tracking-widest border-2 transition-all ${p.popular ? 'bg-white text-stone-900 border-stone-900 hover:bg-stone-200 shadow-[4px_4px_0_0_#d6d3d1] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]' : 'bg-stone-900 text-white border-stone-900 shadow-[4px_4px_0_0_#1c1917] hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px] hover:bg-stone-800'}`}>
                  {p.btn}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-stone-900 pt-32 pb-16 text-white border-t-[16px] border-white">
         <div className="max-w-[1400px] mx-auto px-12">
            <div className="grid md:grid-cols-5 gap-12 mb-32 border-b-4 border-stone-800 pb-20">
               <div className="md:col-span-2 pr-12">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="p-2 border-2 border-white bg-white">
                        <Terminal className="w-6 h-6 text-stone-900" />
                      </div>
                    <span className="font-sans font-black text-3xl tracking-tighter uppercase">EDU-AI</span>
                  </div>
                  <p className="font-mono text-xs font-bold text-stone-400 leading-relaxed max-w-sm">
                    Propelling educational workflows into the era of specialized computation.
                  </p>
               </div>
               
               {[
                 { title: "Core", links: ["Features", "Security", "Scale", "Ethics"] },
                 { title: "Network", links: ["Documentation", "API Reference", "Status", "Github"] },
                 { title: "Legal", links: ["Sovereignty", "Access Tiers", "Privacy", "Terms"] }
               ].map((group, idx) => (
                 <div key={idx}>
                   <h5 className="font-sans text-xl font-black uppercase tracking-tighter mb-8">{group.title}</h5>
                   <ul className="space-y-4">
                     {group.links.map((link, j) => (
                       <li key={j}>
                         <a href="#" className="font-mono text-[10px] font-bold text-stone-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2 group">
                            <span className="w-1 h-px bg-stone-700 group-hover:bg-white group-hover:w-2 transition-all"></span>
                            {link}
                         </a>
                       </li>
                     ))}
                   </ul>
                 </div>
               ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="font-mono text-[10px] font-bold text-stone-500 uppercase tracking-widest text-center md:text-left">
                  © 2026 ED-TECH INDUSTRIAL CORE.<br className="md:hidden" /> ALL INFRASTRUCTURE RESERVED.
               </div>
               <div className="flex gap-6">
                 <ShieldCheck className="w-5 h-5 text-stone-600" />
                 <Lock className="w-5 h-5 text-stone-600" />
                 <Workflow className="w-5 h-5 text-stone-600" />
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

