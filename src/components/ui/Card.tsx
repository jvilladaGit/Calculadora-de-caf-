import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string; // Allow extending classes
    id?: string;
}

export function Card({ children, className = '', id }: CardProps) {
    return (
        <section id={id} className={`card ${className}`}>
            {children}
        </section>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export function CardHeader({ children, className = '', style }: CardHeaderProps) {
    return (
        <div className={`card-header ${className}`} style={style}>
            {children}
        </div>
    );
}
