import { Coffee, ArrowRight } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            color: '#fff',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <div style={{
                background: 'rgba(212, 163, 115, 0.1)',
                padding: '2rem',
                borderRadius: '50%',
                marginBottom: '2rem',
                border: '1px solid rgba(212, 163, 115, 0.2)'
            }}>
                <Coffee size={64} color="var(--accent)" />
            </div>

            <h1 style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                Calculadora de Rentabilidad
            </h1>

            <p style={{
                fontSize: '1.2rem',
                color: '#888',
                maxWidth: '600px',
                marginBottom: '3rem',
                lineHeight: 1.6
            }}>
                Descubre el potencial real de tu negocio de café.
                Calcula costos, márgenes, punto de equilibrio y ROI en segundos.
                <br /><br />
                <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                    * Acceso gratuito con registro previo.
                </span>
            </p>

            <button
                onClick={onStart}
                style={{
                    background: 'var(--accent)',
                    color: '#000',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    padding: '1rem 2rem',
                    borderRadius: '50px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 4px 20px rgba(212, 163, 115, 0.3)',
                    transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                Comenzar Ahora <ArrowRight size={20} />
            </button>

            <div style={{
                marginTop: '4rem',
                display: 'flex',
                gap: '2rem',
                color: '#444',
                fontSize: '0.9rem'
            }}>
                <span>✓ Cálculos Precisos</span>
                <span>✓ Proyecciones Financieras</span>
                <span>✓ Gráficos Visuales</span>
            </div>
        </div>
    );
}
