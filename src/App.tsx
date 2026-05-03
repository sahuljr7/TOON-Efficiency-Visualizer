import { useState, useMemo, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  ArrowRight, 
  Info, 
  Upload, 
  Trash2, 
  Copy,
  Terminal,
  Cpu
} from 'lucide-react';
import { SAMPLE_DATASETS } from './constants';
import { jsonToToon, calculateStats } from './lib/toonConverter';
import VisualComparison from './components/VisualComparison';
import EfficiencyChart from './components/EfficiencyChart';
import EducationalSection from './components/EducationalSection';

export default function App() {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_DATASETS[0].data, null, 2));
  const [toonOutput, setToonOutput] = useState('');
  const [warning, setWarning] = useState<string | undefined>(undefined);
  
  const stats = useMemo(() => {
    const result = jsonToToon(jsonInput);
    setToonOutput(result.toon);
    setWarning(result.warning);
    return calculateStats(jsonInput, result.toon);
  }, [jsonInput]);

  const handleSampleClick = (data: any) => {
    setJsonInput(JSON.stringify(data, null, 2));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        try {
          // Validate JSON
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
        <div className="cell col-span-3 bg-ink text-white flex-row items-center justify-between px-6 py-0 h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-accent p-1.5 rounded">
              <Cpu className="w-5 h-5 text-ink" />
            </div>
            <div className="text-lg font-bold tracking-tight">
              <span>TOON</span> <span className="opacity-40 font-mono text-sm ml-2">v1.2 // Token-Oriented Object Notation</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-[13px] font-medium">
            <div className="hidden md:block">Schema Extraction: <b className="text-accent">ENABLED</b></div>
            <div className="hidden md:block">Efficiency: <b className="text-accent">+{stats.reduction}%</b></div>
            <button 
              className="bg-accent text-ink px-4 py-1.5 rounded font-bold hover:bg-accent/90 transition-all flex items-center space-x-2"
              onClick={() => navigator.clipboard.writeText(toonOutput)}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy TOON</span>
            </button>
          </div>
        </div>

        {/* Input Cell */}
        <div className="cell border-r border-border">
          <div className="panel-label">
            <span>JSON Raw Input</span>
            <span className="badge bg-ink text-white px-2 py-0.5 rounded text-[10px]">
              {jsonInput.length} Characters
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {SAMPLE_DATASETS.map((set) => (
              <button
                key={set.name}
                onClick={() => handleSampleClick(set.data)}
                className="px-2 py-1 bg-gray-100 border border-border rounded text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:border-accent transition-all"
              >
                {set.name}
              </button>
            ))}
            <div className="ml-auto flex gap-2">
              <label className="cursor-pointer bg-gray-100 border border-border p-1.5 rounded hover:bg-white transition-colors">
                <Upload className="w-3.5 h-3.5 text-gray-500" />
                <input type="file" className="hidden" accept=".json" onChange={handleFileUpload} />
              </label>
              <button 
                onClick={() => setJsonInput('')}
                className="bg-gray-100 border border-border p-1.5 rounded hover:bg-red-50 hover:border-red-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="relative flex-grow">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-full p-4 bg-[#F1F5F9] border border-border rounded-md font-mono text-[12px] leading-relaxed outline-none focus:ring-1 focus:ring-accent transition-all resize-none overflow-auto"
              placeholder="Paste JSON..."
            />
          </div>
        </div>

        {/* Output Cell */}
        <div className="cell border-r border-border bg-[#FAFAFA]">
          <div className="panel-label">
            <span>TOON Optimized Output</span>
            <span className="badge bg-accent text-ink px-2 py-0.5 rounded text-[10px]">
              {toonOutput.length} Characters
            </span>
          </div>
          
          <div className="flex-grow flex flex-col space-y-4 overflow-hidden">
            <VisualComparison json={jsonInput} toon={toonOutput} isDashboard />
          </div>

          <div className="mt-4 pt-4 border-t border-dashed border-border">
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

        {/* Sidebar Cell */}
        <div className="cell">
          <div className="panel-label">Token Analysis</div>
          
          <div className="space-y-4 mb-8">
            <div className="p-4 border border-border rounded-lg bg-white shadow-sm">
              <div className="text-[11px] text-gray-500 font-bold uppercase mb-1">JSON Tokens</div>
              <div className="text-2xl font-bold font-mono text-danger">{stats.jsonTokens}</div>
            </div>
            
            <div className="p-4 border border-border rounded-lg bg-white shadow-sm">
              <div className="text-[11px] text-gray-500 font-bold uppercase mb-1">TOON Tokens</div>
              <div className="text-2xl font-bold font-mono text-accent">{stats.toonTokens}</div>
            </div>

            <div className="p-5 bg-ink text-white rounded-lg border-none">
              <div className="text-[11px] text-gray-400 font-bold uppercase mb-1">Context Window Saving</div>
              <div className="text-3xl font-bold font-mono text-white mb-2">{stats.reduction}%</div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.reduction}%` }}
                  className="h-full bg-accent"
                />
              </div>
            </div>
          </div>

          <div className="flex-grow">
            <div className="panel-label">Visual Logic Map</div>
            <div className="h-48">
              <EfficiencyChart jsonTokens={stats.jsonTokens} toonTokens={stats.toonTokens} />
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="panel-label">LLM Advantages</div>
            <ul className="space-y-2 text-[11px] font-medium text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" /> Reduces KV cache pressure
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" /> Faster TTFT (Time to First Token)
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" /> Lower API cost per generation
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-accent rounded-full" /> Less noise for Attention heads
              </li>
            </ul>
          </div>
        </div>

        {/* Info/Educate Row */}
        <div className="cell col-span-3 flex-row gap-12 bg-ink text-white py-8 px-12 border-t border-white/5">
          <div className="max-w-md">
            <div className="panel-label !text-accent !mb-2 opacity-100">Educational Context</div>
            <p className="text-[12px] opacity-70 leading-relaxed font-medium">
              LLMs process text as numbers. Standard JSON format forces the model to attend to quotes and braces repeatedly. TOON extracts schema logic into a single header, allowing the model to focus purely on the data variation.
            </p>
          </div>
          
          <div className="flex-grow grid grid-cols-2 lg:grid-cols-4 gap-6">
            <EducationalSection isDashboard />
          </div>

          <div className="hidden lg:flex flex-col justify-end text-right">
             <div className="font-mono text-[10px] opacity-30 leading-tight">
               ARCH: TRANSFORMER-OPTIMIZED<br/>
               VER: 2026.05.03<br/>
               SPEC: V1.2.0-STABLE
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
