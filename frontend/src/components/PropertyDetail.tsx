import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Building, Activity, DollarSign, Hotel, Target, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--color-bcp-surface)]/90 backdrop-blur border border-[var(--color-bcp-border)] p-4 rounded-xl shadow-[var(--shadow-premium-dark)]">
                <p className="font-display font-medium text-white mb-2">{label}</p>
                {payload.map((entry: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, index: number) => (
                    <p key={index} className="text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}` }}></span>
                        {entry.name}: <span className="font-bold ml-1 text-white">{entry.name === 'Revenue' ? `$${Number(entry.value).toLocaleString()}` : entry.value + '%'}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const PropertyDetail = ({ propertyId, data, onBack }: { propertyId: string, data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, onBack: () => void }) => {
    const property = data.properties.find((p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => p.id === propertyId);

    // Mock historical data for the specific property
    const historicalData = useMemo(() => {
        const chartData: { name: string; Occupancy: number; Revenue: number }[] = [];
        if (!property) return chartData;
        const now = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            // deterministic randomize around current stats
            const seed = property.adr + i;
            const pseudoRandom = (Math.sin(seed) * 10000) - Math.floor(Math.sin(seed) * 10000);
            const occ = Math.min(100, Math.max(30, property.occupancy + (pseudoRandom * 20 - 10)));
            const rev = property.adr * occ;
            chartData.push({
                name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                Occupancy: Math.round(occ),
                Revenue: Math.round(rev)
            });
        }
        return chartData;
    }, [property]);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200 } }
    };

    const generateReport = () => {
        document.body.classList.add('printing-pdf');
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                document.body.classList.remove('printing-pdf');
            }, 500);
        }, 100);
    };

    return (
        <motion.div id="property-export-content" variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-20 max-w-[1400px] mx-auto min-h-full">
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <button onClick={onBack} className="flex items-center gap-2 text-[var(--color-bcp-muted)] hover:text-white transition-colors mb-4 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Back to Command Center
                    </button>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="px-3 py-1.5 rounded-lg bg-[var(--color-bcp-surface)] border border-[var(--color-bcp-border)] flex items-center gap-2">
                            <Building className="w-4 h-4 text-[var(--color-bcp-primary)]" />
                            <span className="text-[11px] font-bold tracking-widest text-[#A3AED0] uppercase">{property.category}</span>
                        </div>
                    </div>
                    <h1 className="text-[44px] font-display font-bold text-white tracking-tight leading-tight">{property.name}</h1>
                    <p className="text-[var(--color-bcp-muted)] font-medium mt-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> Property Specific Telemetry</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={generateReport} className="h-12 px-6 rounded-[14px] bg-[var(--color-bcp-surfaceHighlight)] hover:bg-[var(--color-bcp-primary)] border border-[var(--color-bcp-border)] hover:border-[var(--color-bcp-primary)] shadow-[var(--shadow-premium-dark)] text-white text-sm font-bold transition-all flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[var(--color-bcp-muted)] group-hover:text-white" /> Download PDF Report
                    </button>
                </div>
            </motion.div>

            {/* Property KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Current Occupancy', value: `${property.occupancy}%`, icon: Hotel, color: 'text-[var(--color-bcp-primary)]', bg: 'bg-[var(--color-bcp-primary)]', shadow: 'rgba(67, 24, 255, 0.4)' },
                    { label: 'Average Daily Rate', value: `$${property.adr}`, icon: DollarSign, color: 'text-[var(--color-bcp-accent)]', bg: 'bg-[var(--color-bcp-accent)]', shadow: 'rgba(117, 81, 255, 0.4)' },
                    { label: 'RevPAR', value: `$${property.revpar}`, icon: Activity, color: 'text-[var(--color-bcp-success)]', bg: 'bg-[var(--color-bcp-success)]', shadow: 'rgba(5, 205, 153, 0.4)' },
                    { label: 'Health Score', value: property.health_score, icon: Target, color: 'text-[var(--color-bcp-warning)]', bg: 'bg-[var(--color-bcp-warning)]', shadow: 'rgba(255, 206, 32, 0.4)' },
                ].map((kpi, idx) => (
                    <motion.div key={idx} variants={itemVariants} className="premium-card p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
                        <div className="flex justify-between items-start relative z-10">
                            <div className="p-3 rounded-xl bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] shadow-[var(--shadow-premium-dark)]">
                                <kpi.icon className={`w-6 h-6 ${kpi.color}`} style={{ filter: `drop-shadow(0 0 10px ${kpi.shadow})` }} />
                            </div>
                        </div>
                        <div className="relative z-10 mt-6">
                            <p className="text-[var(--color-bcp-muted)] text-[12px] font-bold uppercase tracking-widest mb-1.5">{kpi.label}</p>
                            <p className="text-[34px] font-display font-bold text-white tracking-tight leading-none">{kpi.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={itemVariants} className="premium-card p-8">
                    <h3 className="text-[22px] font-display font-bold text-white mb-2">30-Day Revenue Trend</h3>
                    <p className="text-[var(--color-bcp-muted)] text-sm mb-8 font-medium">Daily generated revenue over the last month.</p>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={historicalData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-bcp-primary)" stopOpacity={0.6} />
                                        <stop offset="95%" stopColor="var(--color-bcp-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="var(--color-bcp-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} minTickGap={20} />
                                <YAxis hide domain={['auto', 'auto']} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-bcp-border)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area
                                    type="monotone" dataKey="Revenue" stroke="var(--color-bcp-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorRev2)"
                                    activeDot={{ r: 8, fill: 'var(--color-bcp-primary)', stroke: '#fff', strokeWidth: 3, style: { filter: 'drop-shadow(0 0 12px rgba(67,24,255,0.8))' } }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="premium-card p-8">
                    <h3 className="text-[22px] font-display font-bold text-white mb-2">Occupancy Volatility</h3>
                    <p className="text-[var(--color-bcp-muted)] text-sm mb-8 font-medium">Daily occupancy percentage variations.</p>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={historicalData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-bcp-border)" />
                                <XAxis dataKey="name" stroke="var(--color-bcp-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} minTickGap={20} />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-bcp-surfaceHighlight)' }} />
                                <Bar dataKey="Occupancy" fill="var(--color-bcp-accent)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};