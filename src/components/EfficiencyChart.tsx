import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

interface EfficiencyChartProps {
  jsonTokens: number;
  toonTokens: number;
}

export default function EfficiencyChart({ jsonTokens, toonTokens }: EfficiencyChartProps) {
  const data = [
    { name: 'JSON', tokens: jsonTokens, fill: '#EF4444' },
    { name: 'TOON', tokens: toonTokens, fill: '#10B981' },
  ];

  const savings = jsonTokens - toonTokens;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 700 }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
            contentStyle={{ borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '12px' }}
          />
          <Bar dataKey="tokens" radius={[0, 2, 2, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
