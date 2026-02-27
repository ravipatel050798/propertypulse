import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--color-bcp-surface)]/90 backdrop-blur border border-[var(--color-bcp-border)] p-4 rounded-xl shadow-[var(--shadow-premium-dark)]">
                <p className="font-display font-medium text-white mb-2">{label}</p>
                {payload.map((entry: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, index: number) => (
                    <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color, boxShadow: `0 0 10px ${entry.color}` }}></span>
                        {entry.name}: <span className="font-bold ml-1 text-white">${entry.value.toLocaleString()}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const Targets = ({ data }: { data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => {
    // Generate mock target data based on actual revenue
    const targetData = useMemo(() => {
        if (!data) return [];
        return data.properties.map((p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, i: number) => {
            // Deterministic randomize target to be slightly above or below current revenue
            const seed = p.revenue + i;
            const pseudoRandom = (Math.sin(seed) * 10000) - Math.floor(Math.sin(seed) * 10000);
            const target = p.revenue * (1 + (pseudoRandom * 0.4 - 0.15));
            const progress = (p.revenue / target) * 100;
            return {
                ...p,
                target: Math.round(target),
                progress: Math.min(100, progress),
                isOnTrack: progress >= 95
            };
        }).sort((a: any, b: any) => b.target - a.target); // eslint-disable-line @typescript-eslint/no-explicit-any
    }, [data]);

    const portfolioTarget = targetData.reduce((acc: number, p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => acc + p.target, 0);
    const portfolioRevenue = targetData.reduce((acc: number, p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => acc + p.revenue, 0);
    const portfolioProgress = (portfolioRevenue / portfolioTarget) * 100;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200 } }
    };

    if (!data) return null;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-20 max-w-[1400px] mx-auto">
            {/* Header Area */}
            <motion.div variants={itemVariants} className="flex flex-col justify-between items-start gap-2 mb-8">
                <h1 className="text-[44px] font-display font-bold text-white tracking-tight leading-tight">Revenue Targets</h1>
                <p className="text-[var(--color-bcp-muted)] font-medium">Tracking fiscal performance against Q3 portfolio objectives.</p>
            </motion.div>

            {/* Portfolio Summary Card */}
            <motion.div variants={itemVariants} className="premium-card p-8 border-t-[4px] border-t-[var(--color-bcp-accent)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] shadow-[var(--shadow-premium-dark)]">
                                <Target className="w-6 h-6 text-[var(--color-bcp-accent)] shadow-[var(--shadow-neon)]" />
                            </div>
                            <h2 className="text-[22px] font-display font-bold text-white">Global Portfolio Target</h2>
                        </div>
                        <div className="flex items-end gap-4">
                            <p className="text-[48px] font-display font-bold text-white leading-none">${(portfolioRevenue / 1000000).toFixed(2)}M</p>
                            <p className="text-[var(--color-bcp-muted)] text-lg mb-1 font-medium">/ ${(portfolioTarget / 1000000).toFixed(2)}M</p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <div className="flex justify-between items-end mb-3">
                            <p className="text-[var(--color-bcp-muted)] text-sm font-bold uppercase tracking-widest">Pacing Goal</p>
                            <p className="text-white font-display font-bold text-2xl">{portfolioProgress.toFixed(1)}%</p>
                        </div>
                        <div className="w-full h-4 bg-[var(--color-bcp-surfaceHighlight)] rounded-full overflow-hidden border border-[var(--color-bcp-border)] shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-[var(--color-bcp-primary)] to-[var(--color-bcp-accent)] rounded-full relative"
                                style={{ width: `${portfolioProgress}%` }}
                            >
                                <div className="absolute top-0 right-0 w-8 h-full bg-white/30 blur-[4px]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Target Visualization Chart */}
            <motion.div variants={itemVariants} className="premium-card p-8">
                <h3 className="text-[22px] font-display font-bold text-white mb-2">Target vs. Actuals by Asset</h3>
                <p className="text-[var(--color-bcp-muted)] text-sm mb-8 font-medium">Comparative analysis of generated revenue versus algorithmic projections.</p>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={targetData.slice(0, 10)} margin={{ top: 20, right: 0, left: 20, bottom: 0 }}>
                            <XAxis dataKey="name" stroke="var(--color-bcp-muted)" fontSize={11} tickLine={false} axisLine={false} dy={10} interval={0} angle={-30} textAnchor="end" height={60} />
                            <YAxis yAxisId="left" hide domain={[0, 'auto']} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-bcp-surfaceHighlight)' }} />

                            <Bar yAxisId="left" dataKey="revenue" name="Current Revenue" radius={[4, 4, 0, 0]} barSize={40}>
                                {targetData.slice(0, 10).map((_: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, index: number) => (
                                    <Cell key={`cell-${index}`} fill="var(--color-bcp-primary)" />
                                ))}
                            </Bar>

                            <Line yAxisId="left" type="monotone" dataKey="target" name="Target Objective" stroke="var(--color-bcp-accent)" strokeWidth={3} dot={{ r: 6, fill: 'var(--color-bcp-surface)', stroke: 'var(--color-bcp-accent)', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Individual Property Tracking Matrix */}
            <motion.div variants={itemVariants} className="premium-card p-8">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[22px] font-display font-bold text-white">Asset Pacing Breakdown</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {targetData.map((prop: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => (
                        <div key={prop.id} className="p-5 rounded-2xl bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-white font-bold text-lg">{prop.name}</h4>
                                    <p className="text-[10px] text-[var(--color-bcp-muted)] font-bold uppercase tracking-[0.2em] mt-1">{prop.category}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {prop.isOnTrack ? (
                                        <div className="px-3 py-1 rounded-full bg-[var(--color-bcp-success)]/10 text-[var(--color-bcp-success)] border border-[var(--color-bcp-success)]/20 flex items-center gap-1.5 text-xs font-bold">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> On Target
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1 rounded-full bg-[var(--color-bcp-warning)]/10 text-[var(--color-bcp-warning)] border border-[var(--color-bcp-warning)]/20 flex items-center gap-1.5 text-xs font-bold">
                                            <AlertCircle className="w-3.5 h-3.5" /> Deficit
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4 flex items-end gap-3">
                                <span className="text-2xl font-display font-bold text-white">${prop.revenue.toLocaleString()}</span>
                                <span className="text-[var(--color-bcp-muted)] text-sm font-medium mb-1">/ ${prop.target.toLocaleString()}</span>
                            </div>

                            <div className="w-full h-2 bg-[var(--color-bcp-border)] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${prop.isOnTrack ? 'bg-[var(--color-bcp-success)]' : 'bg-[var(--color-bcp-warning)]'}`}
                                    style={{ width: `${prop.progress}%`, boxShadow: prop.isOnTrack ? '0 0 10px rgba(5,205,153,0.5)' : '0 0 10px rgba(255,206,32,0.5)' }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

        </motion.div>
    );
};
