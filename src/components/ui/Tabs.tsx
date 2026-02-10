import { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface TabsContextType {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

interface TabsProps {
    defaultValue: string;
    children: ReactNode;
    className?: string;
}

export function Tabs({ defaultValue, children, className = '' }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    return (
        <div className={`tabs-container ${className}`}>
            {/* We pass state via props to children clone map or context if we had one. 
          For simplicity without Context API overhead for this small app: */}
            {Array.isArray(children)
                ? children.map((child: any) => ({
                    ...child,
                    props: { ...child.props, activeTab, setActiveTab }
                }))
                : children}
        </div>
    );
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function TabsRoot({ defaultValue, children, className = '' }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={`tabs-root ${className}`}>{children}</div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`tabs-list ${className}`}>{children}</div>;
}

export function TabsTrigger({ value, children, className = '' }: { value: string; children: ReactNode; className?: string }) {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsTrigger must be used within TabsRoot');

    const isActive = context.activeTab === value;

    return (
        <button
            className={`tabs-trigger ${isActive ? 'active' : ''} ${className}`}
            onClick={() => context.setActiveTab(value)}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value, children, className = '' }: { value: string; children: ReactNode; className?: string }) {
    const context = useContext(TabsContext);
    if (!context) throw new Error('TabsContent must be used within TabsRoot');

    if (context.activeTab !== value) return null;

    return <div className={`tabs-content ${className}`}>{children}</div>;
}
