import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RevenueChartProps {
    revenue: number;
    totalCosts: number;
}

export function RevenueChart({ revenue, totalCosts }: RevenueChartProps) {

    const data = [
        { name: 'Costos', value: totalCosts },
        { name: 'Ventas', value: revenue },
    ];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        formatter={(value: number | undefined) => {
                            if (value === undefined) return ['0', ''];
                            return [
                                new Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP',
                                    maximumFractionDigits: 0
                                }).format(value),
                                ''
                            ];
                        }}
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    {/* Break Even Reference Line - Maybe too complex for a simple bar? Let's skip logic visually complications for now  */}
                    {/* <ReferenceLine y={breakEvenRevenue} label="P. Equilibrio" stroke="red" strokeDasharray="3 3" /> */}

                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.name === 'Ventas' ? (entry.value > totalCosts ? '#228B22' : '#888') : '#A0522D'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
