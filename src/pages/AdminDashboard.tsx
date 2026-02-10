import { useState, useEffect } from 'react';
import { getAllLeads, type LeadEntry } from '../lib/adminService';
import { Users, ArrowLeft, TrendingUp, Mail, Calendar, DollarSign, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
    onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
    const [leads, setLeads] = useState<LeadEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeads = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllLeads();
            setLeads(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const uniqueUsers = new Set(leads.map(l => l.email));

    const formatCurrency = (value: number | null) => {
        if (value === null) return 'N/A';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            color: '#fff',
            padding: '2rem',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                maxWidth: '1200px',
                margin: '0 auto 2rem auto',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={onBack}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: 'none',
                            color: '#fff',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Panel de Administración</h1>
                        <p style={{ fontSize: '0.85rem', color: '#888' }}>Gestión de leads y proyecciones</p>
                    </div>
                </div>

                <button
                    onClick={fetchLeads}
                    style={{
                        background: 'var(--accent)',
                        color: '#000',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <RefreshCw size={16} />
                    Actualizar
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
                maxWidth: '1200px',
                margin: '0 auto 2rem auto',
            }}>
                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', marginBottom: '0.5rem' }}>
                        <Users size={18} />
                        <span style={{ fontSize: '0.85rem' }}>Usuarios Registrados</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{uniqueUsers.size}</div>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', marginBottom: '0.5rem' }}>
                        <TrendingUp size={18} />
                        <span style={{ fontSize: '0.85rem' }}>Proyecciones Guardadas</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{leads.length}</div>
                </div>
            </div>

            {/* Leads Table */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
            }}>
                <div style={{
                    padding: '1rem 1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}>
                    <Mail size={18} color="#888" />
                    <h2 style={{ fontSize: '1rem', fontWeight: '600' }}>Leads Registrados</h2>
                </div>

                {loading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                        Cargando leads...
                    </div>
                ) : error ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#ff4d4d' }}>
                        Error: {error}
                    </div>
                ) : leads.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#888' }}>
                        No hay leads registrados aún. Los usuarios aparecerán aquí cuando guarden proyecciones.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '0.9rem',
                        }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', color: '#888', fontWeight: '500' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Mail size={14} /> Email
                                        </div>
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#888', fontWeight: '500' }}>Escenario</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#888', fontWeight: '500' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <DollarSign size={14} /> Ganancia Neta
                                        </div>
                                    </th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#888', fontWeight: '500' }}>ROI</th>
                                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', color: '#888', fontWeight: '500' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <Calendar size={14} /> Fecha
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.map((lead) => (
                                    <tr
                                        key={lead.id}
                                        style={{
                                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                                            transition: 'background 0.2s',
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '0.75rem 1.5rem', fontWeight: '500' }}>
                                            {lead.email}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', color: '#aaa' }}>
                                            {lead.projection_name}
                                        </td>
                                        <td style={{
                                            padding: '0.75rem 1rem',
                                            textAlign: 'right',
                                            color: (lead.net_monthly_profit ?? 0) >= 0 ? 'var(--accent)' : '#ff4d4d',
                                            fontWeight: '600',
                                        }}>
                                            {formatCurrency(lead.net_monthly_profit)}
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#aaa' }}>
                                            {lead.roi_months ? `${Number(lead.roi_months).toFixed(1)} meses` : '∞'}
                                        </td>
                                        <td style={{ padding: '0.75rem 1.5rem', textAlign: 'right', color: '#666', fontSize: '0.85rem' }}>
                                            {formatDate(lead.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
