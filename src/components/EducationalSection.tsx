import { Lightbulb, Zap, Database, BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';

const reasons = [
  {
    icon: <Database className="w-6 h-6 text-orange-500" />,
    title: "Key Redundancy",
    description: "In JSON, keys are repeated for every single object in an array. In a dataset of 1000 users, the word \"email\" is sent 1000 times. TOON sends it exactly once."
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-blue-500" />,
    title: "LLM Context Window",
    description: "LLMs have limited context windows. Every bracket, quote, and colon in JSON consumes tokens that could otherwise be used for actual data or logic."
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: "Structural Noise",
    description: "Braces {} and brackets [] contribute significant token overhead. TOON uses minimal separators which reduces the attention mechanism's burden on parsing structure."
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-purple-500" />,
    title: "When to use TOON?",
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
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              {/* Simplified icons for dashboard footer */}
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">{reason.title}</h4>
            </div>
            <p className="text-[11px] text-white/50 leading-tight">
              {reason.description}
            </p>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {reasons.map((reason, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="mb-4">{reason.icon}</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{reason.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {reason.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
