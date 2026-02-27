
import { useMemo } from 'react';
import { motion } from 'framer-motion';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--color-bcp-surface)]/90 backdrop-blur border border-[var(--color-bcp-border)] p-4 rounded-xl shadow-[var(--shadow-premium-dark)]">
                <p className="font-display font-medium text-white mb-2">{label}</p>
                <p className="text-sm font-bold text-[var(--color-bcp-primary)]">
                    {payload[0].name}: {payload[0].name === 'RevPAR' ? `$${payload[0].value}` : payload[0].value}
                </p>
            </div>
        );
    }
    return null;
};

export const Performance = ({ data, onPropertySelect }: { data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, onPropertySelect: (id: string) => void }) => {

    const sortedByHealth = useMemo(() => {
        if (!data || !data.properties) return [];
        return [...data.properties].sort((a, b) => b.health_score - a.health_score);
    }, [data]);

    const sortedByRevPAR = useMemo(() => {
        if (!data || !data.properties) return [];
        return [...data.properties].sort((a, b) => b.revpar - a.revpar);
    }, [data]);

    if (!data) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 200 } }
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-20 max-w-[1400px] mx-auto">
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <h1 className="text-[44px] font-display font-bold text-white tracking-tight leading-tight">Performance Matrix</h1>
                    <p className="text-[var(--color-bcp-muted)] font-medium mt-1">Cross-portfolio benchmarking and health analytics.</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Health Leaderboard */}
                <motion.div variants={itemVariants} className="premium-card p-8">
                    <h3 className="text-[22px] font-display font-bold text-white mb-6">Operational Health Index</h3>
                    <div className="space-y-4">
                        {sortedByHealth.slice(0, 8).map((prop: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, i: number) => (
                            <div key={prop.id} onClick={() => onPropertySelect(prop.id)} className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] hover:border-[var(--color-bcp-primary)] cursor-pointer transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="text-xl font-display font-bold text-[var(--color-bcp-muted)] w-6">{i + 1}</div>
                                    <div>
                                        <h4 className="text-white font-bold group-hover:text-[var(--color-bcp-primary)] transition-colors">{prop.name}</h4>
                                        <p className="text-xs text-[var(--color-bcp-muted)] uppercase tracking-wider font-bold mt-1">{prop.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xl font-mono font-bold ${prop.health_score >= 80 ? 'text-[var(--color-bcp-success)]' : prop.health_score >= 65 ? 'text-[var(--color-bcp-accent)]' : 'text-[var(--color-bcp-danger)]'}`}>
                                        {prop.health_score}
                                    </div>
                                    <div className="text-[10px] text-[var(--color-bcp-muted)] uppercase tracking-widest mt-1">Score</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* RevPAR Chart */}
                <motion.div variants={itemVariants} className="premium-card p-8 flex flex-col">
                    <h3 className="text-[22px] font-display font-bold text-white mb-2">RevPAR Leaders</h3>
                    <p className="text-[var(--color-bcp-muted)] text-sm mb-8 font-medium">Revenue Per Available Room normalized across the portfolio.</p>
                    <div className="flex-1 min-h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sortedByRevPAR.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }} onClick={(e: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
                                if (e && e.activePayload && e.activePayload.length > 0) onPropertySelect(e.activePayload[0].payload.id);
                            }} className="cursor-pointer">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="var(--color-bcp-muted)" fontSize={12} tickLine={false} axisLine={false} width={120} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-bcp-surfaceHighlight)' }} />
                                <Bar dataKey="revpar" name="RevPAR" radius={[0, 4, 4, 0]}>
                                    {sortedByRevPAR.slice(0, 10).map((_: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index < 3 ? 'var(--color-bcp-primary)' : 'var(--color-bcp-muted)'}
                                            style={{ filter: index < 3 ? 'drop-shadow(0 0 8px rgba(67,24,255,0.6))' : 'none' }} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
