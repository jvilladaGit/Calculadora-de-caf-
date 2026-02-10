import type { ProfitabilityResult, SalesInput, CapitalInput } from '../types';

export const generateExecutiveSummary = (
    results: ProfitabilityResult,
    sales: SalesInput,
    capital: CapitalInput
): string => {
    const { netMonthlyProfit, roiMonths, breakEvenPoint, marginPercent } = results;
    const { cupsPerDay } = sales;
    const { totalInvestment } = capital;

    const isProfitable = netMonthlyProfit > 0;
    const cupsGap = cupsPerDay * 26 - breakEvenPoint; // Assuming 26 days based on input default, but ideally passed or calculated

    let summary = '';

    // 1. Profitability Status
    if (isProfitable) {
        summary += `✅ **El negocio es rentable.** Estás generando una ganancia neta mensual de **${formatCurrency(netMonthlyProfit)}** con un margen del **${marginPercent.toFixed(1)}%**. `;
    } else {
        summary += `⚠️ **Atención:** Actualmente la operación genera pérdidas mensuales de **${formatCurrency(Math.abs(netMonthlyProfit))}**. `;
    }

    // 2. ROI & Break Even
    if (isProfitable && roiMonths !== Infinity) {
        summary += `Recuperarás tu inversión inicial de **${formatCurrency(totalInvestment)}** en aproximadamente **${roiMonths.toFixed(1)} meses**. `;
    } else if (!isProfitable) {
        summary += `No es posible calcular el retorno de inversión dado que no hay utilidades. `;
    }

    // 3. Operational Insight
    if (cupsGap > 0) {
        summary += `Estás vendiendo **${Math.floor(cupsGap)} tazas** por encima de tu punto de equilibrio, lo que te da un margen de seguridad operativo.`;
    } else {
        summary += `Necesitas vender **${Math.ceil(Math.abs(cupsGap))} tazas adicionales al mes** solo para cubrir tus costos fijos y no perder dinero.`;
    }

    return summary;
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(value);
};
