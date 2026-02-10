export interface CoffeeInput {
    gramsPerCup: number;
    pricePerKg: number;
}

export interface ConsumablesInput {
    cupCost: number;     // Costo del vaso promediado
    stirrerCost: number; // Costo del mezclador
    sugarCost: number;   // Costo del azúcar (sobre)
}

export interface SalesInput {
    pricePerCup: number;
    cupsPerDay: number;
    daysPerMonth: number;
}

export interface CapitalInput {
    totalInvestment: number; // Inversión inicial total (Equipos + Adecuaciones)
}

export interface FixedCostsInput {
    totalMonthlyFixed: number; // Total gastos fijos (Arriendo + Nómina + Servicios)
}

export interface ProfitabilityResult {
    costPerCup: number;
    profitPerCup: number;
    marginPercent: number;
    monthlyProfit: number; // Gross Profit
    monthlyRevenue: number;
    monthlyCosts: number;  // Variable Costs

    // Phase 2 Metrics
    netMonthlyProfit: number; // Monthly Profit - Fixed Costs
    roiMonths: number;        // Total Investment / Net Monthly Profit
    breakEvenPoint: number;   // Fixed Costs / Profit Per Cup (cups/month)

    // Phase 4 Details
    monthlyCoffeeCost: number;
    monthlyConsumablesCost: number;
}
