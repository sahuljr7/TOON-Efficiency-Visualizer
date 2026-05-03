import { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  ArrowRight, 
  Info, 
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
  const [warning, setWarning] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'input' | 'output' | 'insights'>('input');
  const [copiedToon, setCopiedToon] = useState(false);
  
  const stats = useMemo(() => {
    const result = jsonToToon(jsonInput);
    setToonOutput(result.toon);
    setWarning(result.warning);
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
    <div className="min-h-screen bg-bg text-ink font-sans selection:bg-accent/20">
      <div className="dashboard-grid">
        {/* Header Cell */}
        <div className="cell col-span-1 lg:col-span-3 bg-ink text-white flex-row items-center justify-between px-4 md:px-6 py-0 min-h-16 h-auto md:h-16 sticky top-0 z-50">
          <div className="flex items-center space-x-3 py-3 md:py-0">
            <div className="bg-accent p-1.5 rounded">
              <Cpu className="w-5 h-5 text-ink" />
            </div>
            <div className="text-base md:text-lg font-bold tracking-tight">
              <span>TOON</span> <span className="opacity-40 font-mono text-[10px] md:text-xs ml-1 md:ml-2">v1.2 // Optimized</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-6 text-[11px] md:text-[13px] font-medium py-3 md:py-0">
            <div className="hidden lg:block">Schema Extraction: <b className="text-accent">ENABLED</b></div>
            <div className="hidden lg:block">Efficiency: <b className="text-accent">+{stats.reduction}%</b></div>
            <button 
              className={`px-3 md:px-4 py-1.5 rounded font-bold transition-all flex items-center space-x-2 shadow-lg active:scale-95 ${
                copiedToon ? 'bg-white text-accent' : 'bg-accent text-ink shadow-accent/20 hover:bg-accent/90'
              }`}
              onClick={handleCopy}
            >
              {copiedToon ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedToon ? 'Copied' : 'Copy TOON'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden bg-white border-b border-border flex sticky top-16 z-40 overflow-x-auto scrollbar-hide">
          {(['input', 'output', 'insights'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[100px] py-4 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab ? 'border-accent text-accent bg-accent/5' : 'border-transparent text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Input Cell */}
        <div className={`cell border-r border-border ${activeTab !== 'input' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="panel-label">
            <span>JSON Raw Input</span>
            <span className="badge bg-ink text-white px-2 py-0.5 rounded text-[10px]">
              {jsonInput.length} Chars
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {SAMPLE_DATASETS.map((set) => (
              <button
                key={set.name}
                onClick={() => handleSampleClick(set.data)}
                className="px-2 py-1 bg-gray-100 border border-border rounded text-[9px] md:text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:border-accent transition-all whitespace-nowrap"
              >
                {set.name}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <label className="cursor-pointer bg-gray-100 border border-border p-1.5 rounded hover:bg-white transition-colors active:bg-blue-50">
                <Upload className="w-3.5 h-3.5 text-gray-500" />
                <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
              </label>
              <button 
                onClick={() => setJsonInput('')}
                className="bg-gray-100 border border-border p-1.5 rounded hover:bg-red-50 hover:border-red-200 transition-colors active:bg-red-100"
              >
                <Trash2 className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="relative h-full min-h-[350px] lg:min-h-0">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-full p-4 bg-[#F1F5F9] border border-border rounded-md font-mono text-[12px] leading-relaxed outline-none focus:ring-1 focus:ring-accent transition-all resize-none md:resize-y overflow-auto"
              placeholder="Paste JSON..."
            />
          </div>
        </div>

        {/* Output Cell */}
        <div className={`cell border-r border-border bg-[#FAFAFA] ${activeTab !== 'output' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="panel-label">
            <span>TOON Optimized Output</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  copiedToon ? 'bg-accent text-ink' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {copiedToon ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedToon ? 'COPIED' : 'COPY'}
              </button>
              <span className="badge bg-accent text-ink px-2 py-0.5 rounded text-[10px]">
                {toonOutput.length} Chars
              </span>
            </div>
          </div>
          
          <div className="flex-grow flex flex-col space-y-4 overflow-hidden min-h-[350px] lg:min-h-0">
            <VisualComparison json={jsonInput} toon={toonOutput} isDashboard />
          </div>

          <div className="mt-4 pt-4 border-t border-dashed border-border lg:block hidden">
            <div className="panel-label !mb-2">High-Density Signal</div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 40 }).map((_, i) => (
                <div 
                  key={i} 
                  className="w-2.5 h-2.5 rounded-sm bg-accent transition-all duration-1000"
                  style={{ opacity: 0.2 + (Math.random() * 0.8) }}
                />
              ))}
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-medium">
              Pure diagnostic data. Schema definitions are hoisted once.
            </p>
          </div>
        </div>

        {/* Sidebar Cell / Analysis */}
        <div className={`cell ${activeTab !== 'insights' ? 'hidden lg:flex' : 'flex'}`}>
          <div className="panel-label">Token Analysis</div>
          
          <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="p-3 md:p-4 border border-border rounded-lg bg-white shadow-sm">
                <div className="text-[10px] md:text-[11px] text-gray-500 font-bold uppercase mb-1">JSON Tokens</div>
                <div className="text-xl md:text-2xl font-bold font-mono text-danger tracking-tight">{stats.jsonTokens}</div>
              </div>
              
              <div className="p-3 md:p-4 border border-border rounded-lg bg-white shadow-sm">
                <div className="text-[10px] md:text-[11px] text-gray-500 font-bold uppercase mb-1">TOON Tokens</div>
                <div className="text-xl md:text-2xl font-bold font-mono text-accent tracking-tight">{stats.toonTokens}</div>
              </div>
            </div>

            <div className="p-4 md:p-5 bg-ink text-white rounded-lg border-none shadow-xl shadow-ink/20 transform hover:scale-[1.01] transition-transform">
              <div className="text-[10px] md:text-[11px] text-gray-400 font-bold uppercase mb-1">Inference Savings</div>
              <div className="text-2xl md:text-3xl font-bold font-mono text-white mb-2">{stats.reduction}%</div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.reduction}%` }}
                  transition={{ type: 'spring', stiffness: 50, damping: 15 }}
                  className="h-full bg-accent"
                />
              </div>
            </div>
          </div>

          <div className="flex-grow min-h-[250px] lg:min-h-0">
            <div className="panel-label">Visual Logic Map</div>
            <div className="h-48 md:h-64 lg:h-auto lg:max-h-64">
              <EfficiencyChart jsonTokens={stats.jsonTokens} toonTokens={stats.toonTokens} />
            </div>
          </div>

          <div className="mt-4 pt-4 lg:pt-6 border-t border-border lg:block hidden">
            <div className="panel-label">LLM Advantages</div>
            <ul className="space-y-2 text-[10px] md:text-[11px] font-medium text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" /> Reduces KV cache pressure
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" /> Faster TTFT (Generation Speed)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" /> Lower API cost per request
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" /> Less noise for Attention logic
              </li>
            </ul>
          </div>
        </div>

        {/* Info/Educate Row */}
        <div className="cell col-span-1 lg:col-span-3 flex-col lg:flex-row gap-8 md:gap-12 bg-ink text-white py-8 md:py-10 px-6 md:px-12 border-t border-white/5 order-last lg:order-none">
          <div className="max-w-md w-full">
            <div className="panel-label !text-accent !mb-2 opacity-100">Educational Context</div>
            <p className="text-[11px] md:text-[12px] opacity-70 leading-relaxed font-medium">
              Large Language Models process text as discrete numeric representations. Format overhead in JSON forces the model to attend to repeated structural markers. TOON extracts schema logic once, allowing the model to focus purely on relevant data variation.
            </p>
          </div>
          
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-4 lg:pb-0">
            <EducationalSection isDashboard />
          </div>

          <div className="hidden lg:flex flex-col justify-end text-right">
             <div className="font-mono text-[10px] opacity-30 leading-tight">
               ARCH: TRANSFORMER-OPTIMIZED<br/>
               VER: 2026.05.03<br/>
               ENV: PROD-STABLE
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
