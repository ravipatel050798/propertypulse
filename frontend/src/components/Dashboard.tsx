
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Hotel, Target, Zap, ChevronDown, DownloadCloud } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--color-bcp-surface)]/90 backdrop-blur-xl border border-[var(--color-bcp-border)] p-5 rounded-[20px] shadow-[var(--shadow-premium-dark)]">
                <p className="font-display font-medium text-white mb-2">{label}</p>
                {payload.map((entry: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, index: number) => (
                    <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}` }}></span>
                        {entry.name}: <span className="font-bold ml-1 text-white">{entry.name === 'Revenue' ? `$${entry.value.toLocaleString()}` : entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const Dashboard = ({ data, onPropertySelect, onGenerateReport, onInitAI }: { data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, onPropertySelect: (id: string) => void, onGenerateReport: () => void, onInitAI: () => void }) => {

    const sortedProperties = useMemo(() => {
        if (!data || !data.properties) return [];
        return [...data.properties].sort((a, b) => b.revenue - a.revenue);
    }, [data]);

    if (!data || !data.kpi) return null;

    const kpis = [
        {
            label: 'Portfolio Revenue',
            value: `$${(data.kpi.total_revenue / 1000000).toFixed(2)}M`,
            trend: '+12.4%',
            isPositive: true,
            icon: DollarSign,
            color: 'text-[var(--color-bcp-primary)]',
            bgGlow: 'bg-[var(--color-bcp-primary)]',
            shadowColor: 'rgba(67, 24, 255, 0.4)'
        },
        {
            label: 'System Occupancy',
            value: `${data.kpi.avg_occupancy}%`,
            trend: '+3.2%',
            isPositive: true,
            icon: Hotel,
            color: 'text-[var(--color-bcp-accent)]',
            bgGlow: 'bg-[var(--color-bcp-accent)]',
            shadowColor: 'rgba(117, 81, 255, 0.4)'
        },
        {
            label: 'Average Daily Rate',
            value: `$${data.kpi.avg_adr}`,
            trend: '-1.4%',
            isPositive: false,
            icon: Activity,
            color: 'text-[var(--color-bcp-warning)]',
            bgGlow: 'bg-[var(--color-bcp-warning)]',
            shadowColor: 'rgba(255, 206, 32, 0.4)'
        },
        {
            label: 'Network Health',
            value: `${data.kpi.avg_health}`,
            trend: '+2.1 pts',
            isPositive: true,
            icon: Target,
            color: 'text-[var(--color-bcp-success)]',
            bgGlow: 'bg-[var(--color-bcp-success)]',
            shadowColor: 'rgba(5, 205, 153, 0.4)'
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 20 } }
    };

    const handleExportData = () => {
        if (!data || !data.properties) return;
        const headers = ['Property ID', 'Name', 'Location', 'Category', 'Revenue', 'Occupancy', 'ADR', 'RevPAR', 'Health Score'];
        const csvContent = [
            headers.join(','),
            ...data.properties.map((p: any) =>
                `"${p.id}","${p.name}","${p.location}","${p.category}",${p.revenue},${p.occupancy},${p.adr},${p.revpar},${p.health_score}`
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `BCP_Property_Data_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-20 max-w-[1400px] mx-auto"
        >
            {/* Header Area */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="px-3 py-1.5 rounded-lg bg-[var(--color-bcp-surface)] border border-[var(--color-bcp-border)] flex items-center gap-2 shadow-[var(--shadow-premium-dark)]">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-bcp-success)] animate-pulse shadow-[0_0_10px_rgba(5,205,153,0.8)]"></span>
                            <span className="text-[11px] font-bold tracking-widest text-white uppercase">Live System</span>
                        </div>
                        <p className="text-[var(--color-bcp-muted)] text-[11px] font-mono tracking-wider font-bold">ID: BCP-NX-782</p>
                    </div>
                    <h1 className="text-[44px] font-display font-bold text-white tracking-tight leading-tight">Property Intelligence</h1>
                    <p className="text-[var(--color-bcp-muted)] font-medium mt-1">Algorithmic analysis of portfolio performance.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleExportData} className="h-12 px-6 rounded-[14px] bg-[var(--color-bcp-surface)] hover:bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] shadow-[var(--shadow-premium-dark)] text-white text-sm font-bold transition-colors flex items-center gap-2">
                        <DownloadCloud className="w-5 h-5 text-[var(--color-bcp-muted)]" /> Export Data
                    </button>
                    <button onClick={onGenerateReport} className="h-12 px-6 rounded-[14px] bg-[var(--color-bcp-primary)] hover:bg-[var(--color-bcp-accent)] text-white text-sm font-bold shadow-[var(--shadow-neon)] transition-all">
                        Generate Report
                    </button>
                </div>
            </motion.div>

            {/* Hero KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <motion.div key={idx} variants={itemVariants} className="premium-card p-6 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                        {/* Subtle background glow for each card */}
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-[40px] opacity-20 ${kpi.bgGlow}`}></div>

                        <div className="flex justify-between items-start relative z-10">
                            <div className="p-3 rounded-xl bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] shadow-[var(--shadow-premium-dark)]">
                                <kpi.icon className={`w-6 h-6 ${kpi.color}`} style={{ filter: `drop-shadow(0 0 10px ${kpi.shadowColor})` }} />
                            </div>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-bold tracking-wide ${kpi.isPositive ? 'bg-[var(--color-bcp-success)]/10 text-[var(--color-bcp-success)]' : 'bg-[var(--color-bcp-warning)]/10 text-[var(--color-bcp-warning)]'}`}>
                                {kpi.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                                {kpi.trend}
                            </div>
                        </div>
                        <div className="relative z-10 mt-6">
                            <p className="text-[var(--color-bcp-muted)] text-[12px] font-bold uppercase tracking-widest mb-1.5">{kpi.label}</p>
                            <p className="text-[34px] font-display font-bold text-white tracking-tight leading-none">{kpi.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Charts */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Main Chart Card */}
                    <motion.div variants={itemVariants} className="premium-card p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-[22px] font-display font-bold text-white">Revenue Topography</h3>
                                <p className="text-[var(--color-bcp-muted)] text-sm mt-1 font-medium">Portfolio performance visualization across all active units.</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] text-white/80 text-sm font-bold hover:text-white transition-colors shadow-[var(--shadow-premium-dark)]">
                                This Month <ChevronDown className="w-4 h-4 text-[var(--color-bcp-primary)]" />
                            </button>
                        </div>

                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={sortedProperties} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} onClick={(e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
                                    if (e && e.activePayload && e.activePayload.length > 0) {
                                        onPropertySelect(e.activePayload[0].payload.id);
                                    }
                                }} className="cursor-pointer">
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-bcp-primary)" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="var(--color-bcp-primary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide domain={['auto', 'auto']} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-bcp-border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Revenue"
                                        stroke="var(--color-bcp-primary)"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                        activeDot={{ r: 8, fill: 'var(--color-bcp-primary)', stroke: '#fff', strokeWidth: 3, style: { filter: 'drop-shadow(0 0 12px rgba(67,24,255,0.8))' } }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Matrix Table */}
                    <motion.div variants={itemVariants} className="premium-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-[22px] font-display font-bold text-white">Property Matrix</h3>
                            <div className="px-3 py-1 bg-[var(--color-bcp-surfaceHighlight)] rounded-lg text-xs font-bold text-[var(--color-bcp-primary)] uppercase tracking-wider">Top 5 Performers</div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-[var(--color-bcp-border)]">
                                        <th className="pb-4 text-[11px] font-bold text-[var(--color-bcp-muted)] uppercase tracking-[0.15em]">Identifier</th>
                                        <th className="pb-4 text-[11px] font-bold text-[var(--color-bcp-muted)] uppercase tracking-[0.15em] text-right">Occupancy</th>
                                        <th className="pb-4 text-[11px] font-bold text-[var(--color-bcp-muted)] uppercase tracking-[0.15em] text-right">ADR</th>
                                        <th className="pb-4 text-[11px] font-bold text-[var(--color-bcp-muted)] uppercase tracking-[0.15em] text-right">Health Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[15px]">
                                    {sortedProperties.slice(0, 5).map((prop: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, i: number) => (
                                        <tr key={prop.id} onClick={() => onPropertySelect(prop.id)} className="cursor-pointer border-b border-[var(--color-bcp-border)] hover:bg-[var(--color-bcp-surfaceHighlight)] transition-colors group">
                                            <td className="py-5 text-white font-bold flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[var(--color-bcp-primary)] shadow-[var(--shadow-neon)]' : 'bg-[var(--color-bcp-muted)]'}`}></div>
                                                {prop.name}
                                            </td>
                                            <td className="py-5 text-right text-white/90 font-mono font-medium">{prop.occupancy}%</td>
                                            <td className="py-5 text-right text-white/90 font-mono font-medium">${prop.adr}</td>
                                            <td className="py-5 text-right">
                                                <div className="flex items-center justify-end gap-4">
                                                    <span className="font-mono font-bold text-white">{prop.health_score}</span>
                                                    <div className="w-24 h-2 bg-[var(--color-bcp-border)] rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-1000"
                                                            style={{
                                                                width: `${prop.health_score}%`,
                                                                backgroundColor: prop.health_score > 80 ? 'var(--color-bcp-success)' : prop.health_score > 65 ? 'var(--color-bcp-accent)' : 'var(--color-bcp-danger)',
                                                                boxShadow: `0 0 12px ${prop.health_score > 80 ? 'rgba(5,205,153,0.8)' : prop.health_score > 65 ? 'rgba(117,81,255,0.8)' : 'rgba(238,93,80,0.8)'}`
                                                            }}>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                </div>

                {/* Right Column: AI Terminal */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <div className="premium-card h-full p-8 border-t-[4px] border-t-[var(--color-bcp-primary)]">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 rounded-xl bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-[var(--shadow-premium-dark)]">
                                <Zap className="w-6 h-6 text-[var(--color-bcp-primary)] shadow-[var(--shadow-neon)]" />
                            </div>
                            <div>
                                <h2 className="text-[22px] font-display font-bold text-white">Neural Insights</h2>
                                <p className="text-[11px] tracking-widest text-[var(--color-bcp-success)] uppercase font-bold mt-1">Status: Operational</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6">
                            {data.insights.map((insight: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, i: number) => (
                                <div key={i} className="group cursor-pointer bg-[var(--color-bcp-surfaceHighlight)] rounded-[16px] p-5 border border-[var(--color-bcp-border)] hover:border-[var(--color-bcp-primary)] transition-all shadow-[var(--shadow-premium-dark)] hover:shadow-[var(--shadow-neon)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[10px] tracking-[0.2em] font-bold uppercase text-[var(--color-bcp-muted)]">{insight.type}</p>
                                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[var(--color-bcp-danger)] shadow-[0_0_10px_rgba(238,93,80,0.8)]' : i === 1 ? 'bg-[var(--color-bcp-success)] shadow-[0_0_10px_rgba(5,205,153,0.8)]' : 'bg-[var(--color-bcp-accent)] shadow-[0_0_10px_rgba(117,81,255,0.8)]'}`}></div>
                                    </div>

                                    <h4 className="text-white font-bold text-[17px] mb-2">{insight.title}</h4>
                                    <p className="text-[var(--color-bcp-muted)] text-[14px] font-medium leading-relaxed mb-5">{insight.message}</p>

                                    {/* Recommendation Block */}
                                    <div className="p-4 rounded-xl bg-[var(--color-bcp-surface)] border border-[var(--color-bcp-border)] border-l-4 border-l-[var(--color-bcp-primary)] flex items-start gap-3">
                                        <span className="mt-0.5 text-[var(--color-bcp-primary)]"><Zap className="w-4 h-4" /></span>
                                        <p className="text-[13.5px] text-white font-semibold leading-relaxed">{insight.recommendation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={onInitAI} className="w-full mt-8 py-4 rounded-[14px] bg-[var(--color-bcp-surfaceHighlight)] hover:bg-[var(--color-bcp-primary)] border border-[var(--color-bcp-border)] hover:border-[var(--color-bcp-primary)] text-white text-sm font-bold transition-all group overflow-hidden relative shadow-[var(--shadow-premium-dark)] hover:shadow-[var(--shadow-neon)]">
                            <span className="relative z-10 flex items-center justify-center gap-2">Initialize AI Query <ArrowUpRight className="w-5 h-5 text-[var(--color-bcp-muted)] group-hover:text-white transition-colors" /></span>
                        </button>

                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};
