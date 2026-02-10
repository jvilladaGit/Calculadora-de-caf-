import type {
    CoffeeInput,
    ConsumablesInput,
    SalesInput,
    CapitalInput,
    FixedCostsInput,
    ProfitabilityResult
} from './types';

export const calculateProfitability = (
    coffee: CoffeeInput,
    consumables: ConsumablesInput,
    sales: SalesInput,
    capital: CapitalInput,
    fixedCosts: FixedCostsInput
): ProfitabilityResult => {
    // 1. Cost of Coffee per Cup
    // (Price per Kg / 1000) * Grams per Cup
    const coffeeCostPerCup = (coffee.pricePerKg / 1000) * coffee.gramsPerCup;

    // 2. Total Cost per Cup
    // Coffee + Cup + Stirrer + Sugar
    const consumablesCostPerCup = consumables.cupCost + consumables.stirrerCost + consumables.sugarCost;
    const costPerCup = coffeeCostPerCup + consumablesCostPerCup;

    // 3. Gross Profit per Cup
    const profitPerCup = sales.pricePerCup - costPerCup;

    // 4. Margin Percentage
    // Avoid division by zero
    const marginPercent = sales.pricePerCup > 0
        ? (profitPerCup / sales.pricePerCup) * 100
        : 0;

    // 5. Monthly Totals (Gross)
    const totalCupsPerMonth = sales.cupsPerDay * sales.daysPerMonth;
    const monthlyRevenue = totalCupsPerMonth * sales.pricePerCup;

    const monthlyCoffeeCost = totalCupsPerMonth * coffeeCostPerCup;
    const monthlyConsumablesCost = totalCupsPerMonth * consumablesCostPerCup;
    const variableCosts = monthlyCoffeeCost + monthlyConsumablesCost;

    const monthlyGrossProfit = monthlyRevenue - variableCosts;

    // 6. Net Profit (Phase 2)
    const netMonthlyProfit = monthlyGrossProfit - fixedCosts.totalMonthlyFixed;

    // 7. ROI (Phase 2)
    // If net profit is <= 0, ROI is infinite or undefined (represented as Infinity here)
    const roiMonths = netMonthlyProfit > 0
        ? capital.totalInvestment / netMonthlyProfit
        : Infinity;

    // 8. Break Even Point (Phase 2)
    // Fixed Costs / Profit per Cup = Number of cups needed to cover fixed costs
    const breakEvenPoint = profitPerCup > 0
        ? fixedCosts.totalMonthlyFixed / profitPerCup
        : Infinity;

    return {
        costPerCup,
        profitPerCup,
        marginPercent,
        monthlyProfit: monthlyGrossProfit,
        monthlyRevenue,
        monthlyCosts: variableCosts,
        netMonthlyProfit,
        roiMonths,
        breakEvenPoint,
        monthlyCoffeeCost,
        monthlyConsumablesCost
    };
};
