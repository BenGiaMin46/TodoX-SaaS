import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * ProductivityChart Component
 * Visualizes task completion trends over the last 7 days.
 */
const ProductivityChart = ({ data }) => {
    return (
        <div className="w-full h-[200px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#475569', fontSize: 10, fontWeight: 800 }}
                        dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            color: '#fff',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ color: '#818cf8', textTransform: 'uppercase' }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#818cf8" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        animationBegin={500}
                        animationDuration={2000}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProductivityChart;
