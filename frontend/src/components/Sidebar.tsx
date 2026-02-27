
import { LayoutDashboard, Target, Activity, Cpu, Network, Settings, ChevronRight } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onOpenSettings?: () => void;
}

export const Sidebar = ({ activeTab, setActiveTab, onOpenSettings }: SidebarProps) => {
    const navItems = [
        { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
        { id: 'intelligence', label: 'AI Intelligence', icon: Cpu },
        { id: 'performance', label: 'Performance Matrix', icon: Activity },
        { id: 'network', label: 'Property Network', icon: Network },
        { id: 'targets', label: 'Revenue Targets', icon: Target },
    ];

    return (
        <aside className="w-72 bg-[var(--color-bcp-surface)] border-r border-[var(--color-bcp-border)] h-full flex flex-col pt-10 pb-8 px-6 relative z-20 flex-shrink-0 shadow-[var(--shadow-premium-dark)]">
            {/* Logo Area */}
            <div className="flex items-center gap-4 mb-14 px-2">
                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[var(--color-bcp-primary)] to-[var(--color-bcp-accent)] p-[2px] shadow-[var(--shadow-neon)]">
                    <div className="w-full h-full bg-[var(--color-bcp-surface)] rounded-[12px] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                    </div>
                </div>
                <div>
                    <h1 className="text-white text-xl font-display font-bold tracking-wide">PropertyPulse</h1>
                    <p className="text-[var(--color-bcp-primary)] text-[11px] tracking-[0.2em] font-bold mt-0.5">ENTERPRISE CORE</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-3">
                <p className="text-[11px] font-bold tracking-[0.15em] text-[var(--color-bcp-muted)] uppercase mb-5 px-2">Platform Modules</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`nav-item w-full ${isActive ? 'active' : ''}`}
                        >
                            <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`} />
                            <span className={`text-[15px] tracking-wide ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                            {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white/50" />}
                        </button>
                    );
                })}
            </nav>

            {/* Footer User Profile */}
            <div className="mt-auto">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-bcp-border)] to-transparent mb-6"></div>
                <div className="flex items-center gap-4 px-2">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-bcp-surfaceHighlight)] border-2 border-[var(--color-bcp-border)] flex items-center justify-center relative shadow-[var(--shadow-premium-dark)]">
                        <span className="text-[var(--color-bcp-primary)] text-sm font-display font-bold">VP</span>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--color-bcp-success)] rounded-full border-2 border-[var(--color-bcp-surface)] shadow-[0_0_10px_rgba(5,205,153,0.5)]"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-[15px] font-bold truncate">VP Finance</p>
                        <p className="text-[var(--color-bcp-muted)] text-xs font-medium truncate mt-0.5">Banff Caribou Properties</p>
                    </div>
                    <button onClick={onOpenSettings} className="text-[var(--color-bcp-muted)] hover:text-white transition-colors bg-[var(--color-bcp-surfaceHighlight)] p-2 rounded-lg hover:bg-[var(--color-bcp-primary)]">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};
