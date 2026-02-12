import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CostBreakdownChartProps {
    coffeeCost: number;
    consumablesCost: number;
    fixedCosts: number;
    netProfit: number;
}

export function CostBreakdownChart({
    coffeeCost,
    consumablesCost,
    fixedCosts,
    netProfit
}: CostBreakdownChartProps) {

    // Ensure netProfit is not negative for the chart (or handle loss separately)
    const profitValue = Math.max(0, netProfit);

    const data = [
        { name: 'Café', value: coffeeCost, color: '#8B4513' }, // SaddleBrown
        { name: 'Insumos', value: consumablesCost, color: '#D2691E' }, // Chocolate
        { name: 'Fijos', value: fixedCosts, color: '#A0522D' }, // Sienna
        { name: 'Ganancia', value: profitValue, color: '#228B22' }, // ForestGreen (or Theme Accent)
    ].filter(item => item.value > 0);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => formatCurrency(Number(value))}
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
