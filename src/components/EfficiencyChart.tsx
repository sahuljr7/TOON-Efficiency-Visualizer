import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'motion/react';

interface EfficiencyChartProps {
  jsonTokens: number;
  toonTokens: number;
}

export default function EfficiencyChart({ jsonTokens, toonTokens }: EfficiencyChartProps) {
  const data = [
    { name: 'JSON', tokens: jsonTokens, fill: '#F43F5E' },
    { name: 'TOON', tokens: toonTokens, fill: '#10B981' },
  ];

  return (
    <div className="h-full w-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
          barCategoryGap="30%"
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            width={60}
            tick={{ fill: '#64748B', fontSize: 10, fontWeight: 800, letterSpacing: '0.05em' }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #E2E8F0', 
              fontSize: '11px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
            }}
          />
          <Bar 
            dataKey="tokens" 
            radius={[0, 8, 8, 0]} 
            barSize={24}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
