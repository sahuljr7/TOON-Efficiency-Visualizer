import { Lightbulb, Zap, Database, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';

const reasons = [
  {
    icon: Database,
    title: "Key Redundancy",
    description: "In JSON, keys are repeated for every single object in an array. In a dataset of 1000 users, the word \"email\" is sent 1000 times. TOON sends it exactly once."
  },
  {
    icon: BrainCircuit,
    title: "LLM Context Window",
    description: "LLMs have limited context windows. Every bracket, quote, and colon in JSON consumes tokens that could otherwise be used for actual data or logic."
  },
  {
    icon: Zap,
    title: "Structural Noise",
    description: "Braces {} and brackets [] contribute significant token overhead. TOON uses minimal separators which reduces the attention mechanism's burden on parsing structure."
  },
  {
    icon: Lightbulb,
    title: "Batch Efficiency",
    description: "TOON is perfect for sending large batches of similar records (logs, search results, CSV-like data) to an LLM or receiving them from one efficiently."
  }
];

interface EducationalSectionProps {
  isDashboard?: boolean;
}

export default function EducationalSection({ isDashboard }: EducationalSectionProps) {
  if (isDashboard) {
    return (
      <>
        {reasons.slice(0, 4).map((reason, index) => (
          <div key={index} className="flex flex-col gap-2 p-1 group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-ink transition-colors duration-300">
                <reason.icon className="w-4 h-4" />
              </div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-white group-hover:text-accent transition-colors">
                {reason.title}
              </h4>
            </div>
            <p className="text-[12px] text-slate-400 leading-relaxed font-medium md:pl-[44px]">
              {reason.description}
            </p>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {reasons.map((reason, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="panel-card p-8 group hover:bg-slate-50 transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-300">
            <reason.icon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold mb-3 tracking-tight">{reason.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">
            {reason.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
