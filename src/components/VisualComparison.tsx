import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface VisualComparisonProps {
  json: string;
  toon: string;
  isDashboard?: boolean;
}

export default function VisualComparison({ json, toon, isDashboard }: VisualComparisonProps) {
  const [copied, setCopied] = useState<'json' | 'toon' | null>(null);

  const copyToClipboard = (text: string, type: 'json' | 'toon') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Logic to highlight "redundant" parts in JSON
  const highlightedJson = useMemo(() => {
    try {
      const parsed = JSON.parse(json);
      let result = JSON.stringify(parsed, null, 2);
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        const keys = Object.keys(parsed[0]);
        keys.forEach(key => {
          const keyRegex = new RegExp(`"${key}":`, 'g');
          result = result.replace(keyRegex, `<span class="text-purple-500">"${key}":</span>`);
        });
      }

      // Highlight structure
      result = result.replace(/[{}[\]]/g, (match) => `<span class="text-slate-400 opacity-60">${match}</span>`);
      result = result.replace(/:\s*([^,\n}]+)/g, (match, p1) => `: <span class="text-emerald-600">${p1}</span>`);
      
      return result;
    } catch {
      return json;
    }
  }, [json]);

  // Logic to highlight "efficient" parts in TOON
  const highlightedToon = useMemo(() => {
    if (!toon) return "";
    const lines = toon.split('\n');
    if (lines.length === 0) return "";

    const header = lines[0];
    const rest = lines.slice(1);

    const headerHtml = `<span class="text-blue-600 font-bold">${header}</span>`;
    const dataHtml = rest.map(line => `<div class="toon-row py-1 border-b border-border/50">${line}</div>`).join('');

    return headerHtml + '\n' + dataHtml;
  }, [toon]);

  if (isDashboard) {
    return (
      <div className="flex-grow overflow-auto bg-white border border-border rounded-md shadow-sm font-mono text-[12px] leading-relaxed p-4">
        <div className="whitespace-pre" dangerouslySetInnerHTML={{ __html: highlightedToon || "Awaiting input..." }} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* JSON Panel */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-t-xl border-b-0">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">JSON (Standard)</span>
          <button 
            onClick={() => copyToClipboard(json, 'json')}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {copied === 'json' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
        <div className="relative group">
          <pre 
            className="p-6 bg-gray-50 border border-gray-200 rounded-b-xl overflow-x-auto text-[13px] font-mono leading-relaxed h-[400px] whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightedJson }}
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] rounded font-bold uppercase">Redundancy High</span>
          </div>
        </div>
      </div>

      {/* TOON Panel */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center px-4 py-2 bg-gray-100 border border-gray-200 rounded-t-xl border-b-0">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">TOON (Efficient)</span>
          <button 
            onClick={() => copyToClipboard(toon, 'toon')}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {copied === 'toon' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
        <div className="relative group">
          <pre 
            className="p-6 bg-white border border-gray-200 rounded-b-xl overflow-x-auto text-[13px] font-mono leading-relaxed h-[400px] whitespace-pre-wrap shadow-sm"
            dangerouslySetInnerHTML={{ __html: highlightedToon }}
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] rounded font-bold uppercase">Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
}
