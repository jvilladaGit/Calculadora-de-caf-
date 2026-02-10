import { useState, useEffect } from 'react';
import {
  Coffee,
  DollarSign,
  Package,
  Download,
  Briefcase,
  TrendingUp,
  FileText,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { calculateProfitability } from './calculos';
import { generateExecutiveSummary } from './utils/reportGenerator';
import type {
  CoffeeInput,
  ConsumablesInput,
  SalesInput,
  CapitalInput,
  FixedCostsInput,
  ProfitabilityResult
} from './types';

// Components
import { Card, CardHeader } from './components/ui/Card';
import { NumberInput } from './components/ui/NumberInput';
import { Stat, BreakdownRow } from './components/ui/Stat';
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs';
import { ProgressBar } from './components/ui/ProgressBar';
import { CostBreakdownChart } from './components/charts/CostBreakdownChart';
import { RevenueChart } from './components/charts/RevenueChart';
import { PieChart, BarChart, User, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  // --- STATE ---
  const [coffee, setCoffee] = useState<CoffeeInput>({
    gramsPerCup: 18,
    pricePerKg: 60000,
  });

  const [consumables, setConsumables] = useState<ConsumablesInput>({
    cupCost: 350,
    stirrerCost: 50,
    sugarCost: 100,
  });

  const [sales, setSales] = useState<SalesInput>({
    pricePerCup: 5000,
    cupsPerDay: 50,
    daysPerMonth: 26,
  });

  const [capital, setCapital] = useState<CapitalInput>({
    totalInvestment: 20000000,
  });

  const [fixedCosts, setFixedCosts] = useState<FixedCostsInput>({
    totalMonthlyFixed: 2000000,
  });

  const [results, setResults] = useState<ProfitabilityResult>(
    calculateProfitability(coffee, consumables, sales, capital, fixedCosts)
  );

  const [reportText, setReportText] = useState<string>('');
  const [showCharts, setShowCharts] = useState(false);

  // Auth State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const newResults = calculateProfitability(coffee, consumables, sales, capital, fixedCosts);
    setResults(newResults);
    setReportText(generateExecutiveSummary(newResults, sales, capital));
  }, [coffee, consumables, sales, capital, fixedCosts]);

  // --- HANDLERS ---
  const handleCoffeeChange = (field: keyof CoffeeInput, value: string) => {
    setCoffee(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleConsumablesChange = (field: keyof ConsumablesInput, value: string) => {
    setConsumables(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleSalesChange = (field: keyof SalesInput, value: string) => {
    setSales(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleCapitalChange = (field: keyof CapitalInput, value: string) => {
    setCapital(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleFixedCostsChange = (field: keyof FixedCostsInput, value: string) => {
    setFixedCosts(prev => ({ ...prev, [field]: Number(value) }));
  };

  // --- FORMATTERS ---
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const handleDownload = async () => {
    const element = document.getElementById('profit-projection');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#0a0a0a', // Match theme bg
        scale: 2, // Better resolution
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'proyeccion-rentabilidad-cafe.png';
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleSaveProjection = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const { saveProjection } = await import('./lib/projectionService');
      const projectionName = `Proyección ${new Date().toLocaleDateString('es-CO')}`;

      await saveProjection(projectionName, {
        coffee,
        consumables,
        sales,
        capital,
        fixedCosts,
        results: {
          netMonthlyProfit: results.netMonthlyProfit,
          roiMonths: results.roiMonths,
          breakEvenPoint: results.breakEvenPoint,
        },
      });

      alert('✅ Proyección guardada exitosamente');
    } catch (error: any) {
      console.error('Error saving projection:', error);
      alert('❌ Error al guardar: ' + error.message);
    }
  };

  if (!user) {
    return (
      <>
        <LandingPage onStart={() => setIsAuthModalOpen(true)} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="layout">
      {/* --- HEADER --- */}
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="logo-container">
            <Coffee size={32} className="logo-icon" />
            <h1>Calculadora de rentabilidad de tazas de café</h1>
          </div>

          <div>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={handleSaveProjection}
                  style={{
                    background: 'var(--accent)', color: '#000', border: 'none',
                    padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                    fontWeight: '600', fontSize: '0.9rem'
                  }}
                >
                  Guardar Proyección
                </button>
                {user.email === import.meta.env.VITE_ADMIN_EMAIL && (
                  <button
                    onClick={() => setShowAdmin(true)}
                    style={{
                      background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                      padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                      fontWeight: '500', fontSize: '0.85rem'
                    }}
                  >
                    Admin
                  </button>
                )}
                <span style={{ fontSize: '0.9rem', color: '#888' }}>{user.email?.split('@')[0]}</span>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="icon-button"
                  title="Cerrar Sesión"
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', color: '#fff' }}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  background: 'var(--accent)', color: '#000', border: 'none',
                  padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                  fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <User size={18} />
                <span>Guardar / Login</span>
              </button>
            )}
          </div>
        </div>
        <p className="subtitle" style={{ maxWidth: '800px', lineHeight: '1.5', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          * Estos cálculos son estimaciones basadas en los valores ingresados. Para determinar la rentabilidad neta real del negocio, es necesario considerar costos fijos adicionales tales como: arrendamientos, depreciación de equipos, servicios públicos, mantenimiento y salarios.
        </p>
      </header>

      <main className="main-content">
        {/* --- LEFT COLUMN: INPUTS (TABBED) --- */}
        <div className="inputs-column">

          <TabsRoot defaultValue="sales">
            <TabsList>
              <TabsTrigger value="sales">Ventas</TabsTrigger>
              <TabsTrigger value="coffee">Café</TabsTrigger>
              <TabsTrigger value="consumables">Insumos</TabsTrigger>
              <TabsTrigger value="operation">Operación</TabsTrigger>
            </TabsList>

            {/* Tab: Sales (Main Drivers) */}
            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <TrendingUp size={20} />
                  <h2>Proyección de Ventas</h2>
                </CardHeader>
                <div className="input-row">
                  <NumberInput
                    label="Precio por Taza (COP)"
                    value={sales.pricePerCup}
                    onChange={(v) => handleSalesChange('pricePerCup', v)}
                    step={100}
                    slider
                    min={1000}
                    max={15000}
                  />
                </div>
                <div className="input-row">
                  <NumberInput
                    label="Tazas por Día"
                    value={sales.cupsPerDay}
                    onChange={(v) => handleSalesChange('cupsPerDay', v)}
                    slider
                    min={1}
                    max={500}
                  />
                  <NumberInput
                    label="Días por Mes"
                    value={sales.daysPerMonth}
                    onChange={(v) => handleSalesChange('daysPerMonth', v)}
                    slider
                    min={1}
                    max={31}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Tab: Coffee */}
            <TabsContent value="coffee">
              <Card>
                <CardHeader>
                  <Package size={20} />
                  <h2>Métricas del Café</h2>
                </CardHeader>
                <div className="input-row">
                  <NumberInput
                    label="Precio por Kg (COP)"
                    value={coffee.pricePerKg}
                    onChange={(v) => handleCoffeeChange('pricePerKg', v)}
                    step={1000}
                  />
                  <NumberInput
                    label="Gramos por Taza"
                    value={coffee.gramsPerCup}
                    onChange={(v) => handleCoffeeChange('gramsPerCup', v)}
                    suffix="g"
                    slider
                    min={7}
                    max={25}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Tab: Consumables */}
            <TabsContent value="consumables">
              <Card>
                <CardHeader>
                  <Package size={20} />
                  <h2>Costo de Insumos</h2>
                </CardHeader>
                <div className="input-row three-col">
                  <NumberInput
                    label="Vaso"
                    value={consumables.cupCost}
                    onChange={(v) => handleConsumablesChange('cupCost', v)}
                  />
                  <NumberInput
                    label="Mezclador"
                    value={consumables.stirrerCost}
                    onChange={(v) => handleConsumablesChange('stirrerCost', v)}
                  />
                  <NumberInput
                    label="Azúcar"
                    value={consumables.sugarCost}
                    onChange={(v) => handleConsumablesChange('sugarCost', v)}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Tab: Operation */}
            <TabsContent value="operation">
              <Card>
                <CardHeader>
                  <Briefcase size={20} />
                  <h2>Inversión y Gastos Fijos</h2>
                </CardHeader>
                <div className="input-row">
                  <NumberInput
                    label="Inversión Inicial Total"
                    value={capital.totalInvestment}
                    onChange={(v) => handleCapitalChange('totalInvestment', v)}
                    suffix="COP"
                    step={1000000}
                  />
                  <NumberInput
                    label="Gastos Fijos Mensuales"
                    value={fixedCosts.totalMonthlyFixed}
                    onChange={(v) => handleFixedCostsChange('totalMonthlyFixed', v)}
                    suffix="COP"
                    step={100000}
                  />
                </div>
              </Card>
            </TabsContent>

          </TabsRoot>
        </div>

        {/* --- RIGHT COLUMN: RESULTS --- */}
        <div className="results-column">
          <Card id="profit-projection" className="result-card sticky">
            <CardHeader style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <DollarSign size={24} />
                <h2>Ganancia Mensual Neta</h2>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="icon-button"
                  title={showCharts ? "Ver Métricas" : "Ver Gráficos"}
                  style={{
                    background: showCharts ? 'var(--accent)' : 'transparent',
                    color: showCharts ? '#000' : 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {showCharts ? <BarChart size={20} /> : <PieChart size={20} />}
                </button>
                <button
                  onClick={handleDownload}
                  className="icon-button"
                  title="Descargar imagen"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <Download size={20} />
                </button>
              </div>
            </CardHeader>

            <div className="primary-result">
              <span className="sc-currency">$</span>
              <span className="value">{formatNumber(results.netMonthlyProfit)}</span>
              <span className="period">/ mes (Neta)</span>
            </div>

            <div className="divider"></div>

            {/* Visual KPI: Break Even Progress */}
            <ProgressBar
              value={sales.cupsPerDay * sales.daysPerMonth}
              max={Math.max(results.breakEvenPoint * 1.5, sales.cupsPerDay * sales.daysPerMonth)}
              label="Progreso hacia Punto de Equilibrio"
              subLabel={`${Math.round((sales.cupsPerDay * sales.daysPerMonth / results.breakEvenPoint) * 100)}% Cubierto`}
              color={results.netMonthlyProfit >= 0 ? 'var(--accent)' : 'var(--error, #ff4d4d)'}
            />

            {showCharts ? (
              <div className="charts-container" style={{ marginTop: '1rem' }}>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textAlign: 'center' }}>Distribución de Costos</h3>
                <CostBreakdownChart
                  coffeeCost={results.monthlyCoffeeCost}
                  consumablesCost={results.monthlyConsumablesCost}
                  fixedCosts={fixedCosts.totalMonthlyFixed}
                  netProfit={results.netMonthlyProfit}
                />

                <div style={{ margin: '1.5rem 0' }} />

                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textAlign: 'center' }}>Ingresos vs. Costos</h3>
                <RevenueChart
                  revenue={results.monthlyRevenue}
                  totalCosts={results.monthlyCosts + fixedCosts.totalMonthlyFixed}
                />
              </div>
            ) : (
              <>
                <div className="secondary-metrics">
                  <Stat
                    label="ROI (Retorno)"
                    value={results.roiMonths === Infinity ? '∞' : `${results.roiMonths.toFixed(1)} meses`}
                    isHighlight
                  />
                  <Stat label="Punto de Equilibrio" value={`${Math.ceil(results.breakEvenPoint)} tazas/mes`} />
                  <Stat label="Margen Bruto" value={`${results.marginPercent.toFixed(1)}%`} />
                </div>

                <div className="monthly-breakdown">
                  <BreakdownRow label="Ingresos Totales" value={formatCurrency(results.monthlyRevenue)} />
                  <BreakdownRow label="Costos Variables" value={formatCurrency(results.monthlyCosts)} isNegative />
                  <BreakdownRow label="Gastos Fijos" value={formatCurrency(fixedCosts.totalMonthlyFixed)} isNegative />
                </div>
              </>
            )}


            {/* Executive Summary Report */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                <FileText size={16} />
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resumen Ejecutivo</h3>
              </div>
              <p style={{
                fontSize: '0.9rem',
                lineHeight: '1.6',
                color: 'var(--text-muted)'
              }}>
                {reportText}
              </p>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Ganancia Bruta (Antes de fijos): {formatCurrency(results.monthlyProfit)}
              </p>
            </div>

          </Card>
        </div>
      </main>

    </div>
  );
}

export default App;
