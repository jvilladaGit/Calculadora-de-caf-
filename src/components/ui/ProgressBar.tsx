interface ProgressBarProps {
    value: number;
    max: number;
    label: string;
    subLabel?: string;
    color?: string;
}

export function ProgressBar({ value, max, label, subLabel, color = 'var(--accent)' }: ProgressBarProps) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className="progress-container" style={{ margin: '1rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{subLabel}</span>
            </div>
            <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: color,
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: '4px'
                }} />
            </div>
        </div>
    );
}
