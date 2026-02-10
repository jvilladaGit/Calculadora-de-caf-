interface StatProps {
    label: string;
    value: string;
    isHighlight?: boolean;
}

export function Stat({ label, value, isHighlight = false }: StatProps) {
    return (
        <div className="metric-item">
            <span className="label">{label}</span>
            <span className={`value ${isHighlight ? 'highlight' : ''}`}>{value}</span>
        </div>
    );
}

interface BreakdownRowProps {
    label: string;
    value: string;
    isNegative?: boolean;
}

export function BreakdownRow({ label, value, isNegative = false }: BreakdownRowProps) {
    return (
        <div className={`breakdown-row ${isNegative ? 'minus' : ''}`}>
            <span>{label}</span>
            <span>{isNegative ? '-' : ''}{value}</span>
        </div>
    );
}
