import { supabase } from './supabase';

export interface ProjectionData {
    coffee: {
        gramsPerCup: number;
        pricePerKg: number;
    };
    consumables: {
        cupCost: number;
        stirrerCost: number;
        sugarCost: number;
    };
    sales: {
        pricePerCup: number;
        cupsPerDay: number;
        daysPerMonth: number;
    };
    capital: {
        totalInvestment: number;
    };
    fixedCosts: {
        totalMonthlyFixed: number;
    };
    results: {
        netMonthlyProfit: number;
        roiMonths: number;
        breakEvenPoint: number;
    };
}

export async function saveProjection(name: string, data: ProjectionData) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be authenticated to save projections');
    }

    const { data: projection, error } = await supabase
        .from('projections')
        .insert({
            user_id: user.id,
            name,
            data,
            net_monthly_profit: data.results.netMonthlyProfit,
            roi_months: data.results.roiMonths === Infinity ? null : data.results.roiMonths,
        })
        .select()
        .single();

    if (error) throw error;
    return projection;
}

export async function getUserProjections() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
        .from('projections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function loadProjection(id: string) {
    const { data, error } = await supabase
        .from('projections')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}
