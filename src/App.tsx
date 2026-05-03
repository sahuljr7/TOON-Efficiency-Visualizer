import { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Upload, 
  Trash2, 
  Copy,
  Check,
  Terminal,
  Cpu
} from 'lucide-react';
import { SAMPLE_DATASETS } from './constants';
import { jsonToToon, calculateStats } from './lib/toonConverter';
import VisualComparison from './components/VisualComparison';
import EfficiencyChart from './components/EfficiencyChart';
import EducationalSection from './components/EducationalSection';

export default function App() {
  const [jsonInput, setJsonInput] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedJson = params.get('json');
    if (encodedJson) {
      try {
        return decodeURIComponent(encodedJson);
      } catch (err) {
        return JSON.stringify(SAMPLE_DATASETS[0].data, null, 2);
      }
    }
    return JSON.stringify(SAMPLE_DATASETS[0].data, null, 2);
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    if (jsonInput) {
      url.searchParams.set('json', encodeURIComponent(jsonInput));
    } else {
      url.searchParams.delete('json');
    }
    window.history.replaceState({}, '', url);
  }, [jsonInput]);

  const [toonOutput, setToonOutput] = useState('');
  const [activeTab, setActiveTab] = useState<'input' | 'output' | 'insights'>('input');
  const [copiedToon, setCopiedToon] = useState(false);
  
  const stats = useMemo(() => {
    const result = jsonToToon(jsonInput);
    setToonOutput(result.toon);
    return calculateStats(jsonInput, result.toon);
  }, [jsonInput]);

  const handleSampleClick = (data: any) => {
    setJsonInput(JSON.stringify(data, null, 2));
  };

  const handleCopy = () => {
    if (!toonOutput) return;
    navigator.clipboard.writeText(toonOutput);
    setCopiedToon(true);
    setTimeout(() => setCopiedToon(false), 2000);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        try {
          JSON.parse(text);
          setJsonInput(text);
        } catch (err) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="dashboard-container selection:bg-accent/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border h-16 shrink-0">
        <div className="max-w-[1600px] mx-auto h-full flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="bg-ink p-2 rounded-xl shadow-lg ring-1 ring-white/10">
              <Cpu className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-sm md:text-base font-black tracking-tight flex items-center gap-2">
                TOON <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono font-bold tracking-normal">STABLE // V1.2</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider hidden sm:block">Token-Oriented Object Notation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-slate-50 rounded-full border border-border mr-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Efficiency: <span className="text-accent ml-1">+{stats.reduction}%</span></div>
              <div className="w-px h-3 bg-border" />
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">KV Cache: <span className="text-accent ml-1">OPTIMIZED</span></div>
            </div>

            <button 
              onClick={handleCopy}
              className={`h-10 px-5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 active:scale-95 shadow-sm ${
                copiedToon 
                  ? 'bg-accent text-white shadow-accent/20' 
                  : 'bg-ink text-white hover:bg-slate-800'
              }`}
            >
              {copiedToon ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedToon ? 'COPIED TO CLIPBOARD' : 'EXPORT TOON'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8 max-w-[1600px] mx-auto w-full">
        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex bg-white border border-border rounded-xl mb-4 overflow-hidden shadow-sm">
          {(['input', 'output', 'insights'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all border-b-2 ${
                activeTab === tab ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-slate-400 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">
          {/* JSON Input Panel */}
          <div className={`lg:col-span-4 flex flex-col gap-4 ${activeTab !== 'input' ? 'hidden lg:flex' : 'flex'}`}>
            <section className="panel-card flex-grow h-full min-h-[400px]">
              <div className="panel-header">
                <div className="panel-label">
                  <Terminal className="w-3.5 h-3.5" />
                  JSON SOURCE
                </div>
                <div className="flex items-center gap-2">
                  <label className="p-1.5 rounded-lg hover:bg-slate-200/50 cursor-pointer transition-colors text-slate-500">
                    <Upload className="w-4 h-4" />
                    <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
                  </label>
                  <button 
                    onClick={() => setJsonInput('')}
                    className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer transition-colors text-slate-500 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono font-bold text-slate-400">
                    {jsonInput.length || 0} CH
                  </div>
                </div>
              </div>
              
              <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 border-b border-border/50 bg-slate-50/30">
                {SAMPLE_DATASETS.map((set) => (
                  <button
                    key={set.name}
                    onClick={() => handleSampleClick(set.data)}
                    className="px-3 py-1.5 bg-white border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:border-accent hover:text-accent transition-all whitespace-nowrap shadow-sm active:scale-95"
                  >
                    {set.name}
                  </button>
                ))}
              </div>

              <div className="flex-grow p-4 relative min-h-0">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-full p-6 bg-slate-50/50 rounded-xl font-mono text-[13px] leading-relaxed outline-none focus:ring-2 focus:ring-accent/10 border border-slate-100 transition-all resize-none overflow-auto scrollbar-hide text-slate-700"
                  placeholder="Paste your JSON objects here..."
                  spellCheck={false}
                />
              </div>
            </section>
          </div>

          {/* TOON Output Panel */}
          <div className={`lg:col-span-5 flex flex-col ${activeTab !== 'output' ? 'hidden lg:flex' : 'flex'}`}>
            <section className="panel-card flex-grow h-full min-h-[400px]">
              <div className="panel-header">
                <div className="panel-label">
                  <Cpu className="w-3.5 h-3.5" />
                  TOON OPTIMIZED
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[10px] font-bold text-accent uppercase font-mono tracking-wider">PROCESSED</span>
                  </div>
                  <div className="px-2 py-0.5 bg-accent/10 rounded text-[10px] font-mono font-bold text-accent">
                    {toonOutput.length || 0} CH
                  </div>
                </div>
              </div>
              
              <div className="flex-grow p-4 overflow-hidden flex flex-col min-h-0">
                <VisualComparison json={jsonInput} toon={toonOutput} isDashboard />
              </div>

              <div className="p-5 border-t border-border bg-slate-50/50 shrink-0">
                <div className="panel-label !mb-3">
                  High-Density Signal Visualization
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ scale: 0.8, opacity: 0.3 }}
                      animate={{ 
                        scale: [0.8, 1.1, 0.9, 1], 
                        opacity: [0.3, 0.8, 0.5, 0.6],
                        backgroundColor: i < (stats.reduction / 100 * 28) ? '#10B981' : '#E2E8F0'
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
                      className="w-2.5 h-2.5 rounded-full"
                    />
                  ))}
                </div>
                <p className="mt-3 text-[10px] text-slate-400 font-medium">Diagnostic: Redundant structural markers removed. Token budget reclaimed.</p>
              </div>
            </section>
          </div>

          {/* Insights / Stats Panel */}
          <div className={`lg:col-span-3 flex flex-col gap-6 ${activeTab !== 'insights' ? 'hidden lg:flex' : 'flex'}`}>
            {/* Main Stats Card */}
            <section className="relative overflow-hidden p-6 rounded-2xl bg-ink text-white shadow-2xl shadow-ink/30 shrink-0 border border-white/5">
              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/80 mb-6">Efficiency Matrix</div>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">JSON Tokens</div>
                    <div className="text-3xl font-mono font-bold text-danger leading-none">{stats.jsonTokens}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">TOON Tokens</div>
                    <div className="text-3xl font-mono font-bold text-accent leading-none">{stats.toonTokens}</div>
                  </div>
                </div>

                <div className="mb-2 flex items-end justify-between">
                  <div className="text-5xl font-mono font-bold text-white tracking-tighter flex items-baseline">
                    {stats.reduction}<span className="text-accent text-2xl ml-1">%</span>
                  </div>
                  <div className="text-right pb-1">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">SAVINGS</div>
                    <div className="text-[10px] font-bold text-accent uppercase leading-none">REAL-TIME</div>
                  </div>
                </div>

                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.reduction}%` }}
                    transition={{ type: 'spring', stiffness: 40, damping: 20 }}
                    className="h-full bg-gradient-to-r from-accent/50 to-accent"
                  />
                </div>
              </div>
              
              {/* Background Decor */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            </section>

            {/* Chart Card */}
            <section className="panel-card flex-grow shadow-md min-h-[300px]">
              <div className="panel-header">
                <div className="panel-label">
                  <BarChart3 className="w-3.5 h-3.5" />
                  TOKEN DISTRIBUTION
                </div>
              </div>
              <div className="p-6 flex-grow flex items-center justify-center min-h-[250px]">
                <EfficiencyChart jsonTokens={stats.jsonTokens} toonTokens={stats.toonTokens} />
              </div>
            </section>

            {/* Small Advantages List */}
            <section className="panel-card p-6 bg-slate-50 border-dashed border-slate-300 shadow-none hidden lg:block shrink-0">
              <div className="panel-label !mb-4">Transformer Specifics</div>
              <ul className="space-y-3">
                {[
                  { icon: 'KV', text: 'Reduces KV Cache Memory pressure' },
                  { icon: 'TT', text: 'Faster Time-to-First-Token in inference' },
                  { icon: '$$', text: 'Direct cost reduction for deep context' },
                  { icon: 'AT', text: 'Lower attention dispersion on keys' }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="text-[8px] font-black bg-white border border-border rounded px-1 py-0.5 text-slate-400 min-w-[20px] text-center mt-0.5 shrink-0 uppercase tracking-tighter">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 leading-snug">{item.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Footer / Educational Section */}
      <footer className="bg-ink p-8 md:p-12 mt-auto border-t border-white/5 overflow-hidden relative text-white">
        <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-24">
          <div className="max-w-md">
            <div className="panel-label !text-accent !mb-4 opacity-100 flex items-center gap-2">
              <div className="w-1 h-1 bg-accent rounded-full" />
              The Architecture of Efficiency
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 tracking-tight">Structured for Machines,<br/>Readable for Humans.</h2>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              TOON solves the "Structural Noise" problem in modern LLM systems. By hoisting schema definitions and using row-based data normalization, we allow models to attend to what matters: <span className="text-accent underline underline-offset-4 decoration-accent/30">Your Data.</span>
            </p>
          </div>

          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-12 gap-y-8">
            <EducationalSection isDashboard />
          </div>
        </div>

        {/* Global Metadata */}
        <div className="max-w-[1600px] mx-auto mt-12 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 font-mono text-[10px] font-bold tracking-widest uppercase">
          <div className="flex items-center gap-8 text-[9px] md:text-[10px]">
            <div>NODE: ALPHA-SECURE</div>
            <div>SPEC: V1.2.0-STABLE</div>
            <div>LATENCY: 0.12ms</div>
          </div>
          <div className="opacity-50 text-[8px] md:text-[10px]">© 2026 TOON SYSTEMS // TRANSFORMER-OPTIMIZED</div>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      </footer>
    </div>
  );
}
