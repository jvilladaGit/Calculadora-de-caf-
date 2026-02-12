import { supabase } from './supabase';

export interface LeadEntry {
    id: string;
    user_id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    data_consent: boolean | null;
    projection_name: string;
    data: any;
    net_monthly_profit: number | null;
    roi_months: number | null;
    created_at: string;
}

export async function getAllLeads(): Promise<LeadEntry[]> {
    const { data, error } = await supabase
        .from('admin_leads_view')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getLeadsSummary() {
    const { data, error } = await supabase
        .from('admin_leads_view')
        .select('*');

    if (error) throw error;

    const leads = data || [];
    const uniqueUsers = new Set(leads.map(l => l.user_id));

    return {
        totalLeads: uniqueUsers.size,
        totalProjections: leads.length,
        leads,
    };
}
