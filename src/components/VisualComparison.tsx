import { useMemo, useState } from 'react';
import { Database } from 'lucide-react';

interface VisualComparisonProps {
  json: string;
  toon: string;
  isDashboard?: boolean;
}

export default function VisualComparison({ toon, isDashboard }: VisualComparisonProps) {
  if (isDashboard) {
    if (!toon) {
      return (
        <div className="flex-grow flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50 bg-white rounded-xl border border-border shadow-inner min-h-[300px]">
          <Database className="w-12 h-12 stroke-[1]" />
          <p className="text-xs font-bold uppercase tracking-[0.2em]">Awaiting Source Logic</p>
        </div>
      );
    }

    return (
      <div className="flex-grow flex flex-col min-h-0 bg-white rounded-xl border border-border shadow-inner overflow-hidden">
        <div className="bg-slate-50 px-4 py-2 border-b border-border flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <div className="w-2 h-2 rounded-full bg-slate-300" />
            <div className="w-2 h-2 rounded-full bg-slate-300" />
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">NORMALIZED_VIEW</span>
        </div>
        <div className="flex-grow overflow-auto p-4 md:p-6 font-mono text-[11px] md:text-[13px] leading-relaxed scrollbar-hide">
          {toon.split('\n').map((line, i) => {
            if (line.includes('[') && line.includes(']{')) {
              // Schema line
              const [nameWithCount, keys] = line.split('{');
              const name = nameWithCount.split('[')[0];
              const count = nameWithCount.match(/\[(.*?)\]/)?.[1] || '';
              
              return (
                <div key={i} className="mb-4 bg-accent/5 -mx-6 px-6 py-3 border-y border-accent/10 group bg-grid-slate-100">
                  <span className="text-accent font-black">{name}</span>
                  <span className="text-slate-400">[{count}]</span>
                  <span className="text-slate-500">{'{'}</span>
                  <span className="text-slate-600 font-bold uppercase tracking-tighter text-[10px] md:text-[11px]">{keys.replace('}:', '')}</span>
                  <span className="text-slate-500">{'}'}:</span>
                </div>
              );
            }
            
            if (line.trim() === '') return <div key={i} className="h-2" />;

            // Data line
            return (
              <div key={i} className="py-1 flex gap-4 hover:bg-slate-50 -mx-6 px-6 transition-colors border-l-2 border-transparent hover:border-accent group items-baseline">
                <span className="text-slate-300 w-4 text-right select-none font-bold text-[9px] group-hover:text-accent/50">{i + 1}</span>
                <div className="flex flex-wrap items-center">
                  {line.split(',').map((val, j) => {
                    const trimmed = val.trim();
                    let color = 'text-slate-700';
                    if (!isNaN(Number(trimmed)) && trimmed !== '') color = 'text-blue-600 font-bold';
                    if (['true', 'false'].includes(trimmed.toLowerCase())) color = 'text-pink-600 font-bold';
                    if (trimmed.startsWith('"') || trimmed.length > 20) color = 'text-teal-600';
                    
                    return (
                      <span key={j} className="flex items-center">
                        <span className={`${color} break-all`}>{val}</span>
                        {j < line.split(',').length - 1 && <span className="text-slate-300 mx-1">,</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
