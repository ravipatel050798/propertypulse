import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, FileText, Share2, Server } from 'lucide-react';

export const Network = ({ data, onPropertySelect }: { data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, onPropertySelect: (id: string) => void }) => {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

    const regions = useMemo(() => {
        const acc: Record<string, any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */> = {};
        if (!data) return acc;
        data.properties.forEach((p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
            const loc = (p.location || 'Central Datacenter').split(',')[0].trim();
            if (!acc[loc]) acc[loc] = [];
            acc[loc].push(p);
        });
        return acc;
    }, [data]);

    const regionKeys = Object.keys(regions);

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

    if (!data) return null;

    return (
        <motion.div id="network-export-content" variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-20 max-w-[1400px] mx-auto min-h-full">
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="px-3 py-1.5 rounded-lg bg-[var(--color-bcp-surface)] border border-[var(--color-bcp-border)] flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-[var(--color-bcp-primary)]" />
                            <span className="text-[11px] font-bold tracking-widest text-[#A3AED0] uppercase">System Architecture</span>
                        </div>
                    </div>
                    <h1 className="text-[44px] font-display font-bold text-white tracking-tight leading-tight">Network Topology</h1>
                    <p className="text-[var(--color-bcp-muted)] font-medium mt-1">Live interconnectivity mapping of the BCP asset portfolio across geographic clusters.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={generateReport} className="h-12 px-6 rounded-[14px] bg-[var(--color-bcp-surfaceHighlight)] hover:bg-[var(--color-bcp-primary)] border border-[var(--color-bcp-border)] hover:border-[var(--color-bcp-primary)] shadow-[var(--shadow-premium-dark)] text-white text-sm font-bold transition-all flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[var(--color-bcp-muted)] group-hover:text-white" /> Export Network Map PDF
                    </button>
                </div>
            </motion.div>

            {/* Simulated Node Map UI */}
            <motion.div variants={itemVariants} className="premium-card p-8 min-h-[600px] relative overflow-hidden flex flex-col md:flex-row gap-8">
                {/* Background Grid & Particles */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>

                    {/* Pulsing Core Node in center background */}
                    <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[var(--color-bcp-primary)] rounded-full blur-[120px] opacity-10 animate-pulse"></div>
                </div>

                {/* Left Side: Server Clusters */}
                <div className="relative z-10 w-full md:w-1/3 space-y-6">
                    <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                        <Server className="w-5 h-5 text-[var(--color-bcp-accent)]" />
                        Regional Clusters
                    </h3>

                    {regionKeys.map((region) => {
                        const regionProps = regions[region];
                        const isActive = selectedRegion === region || selectedRegion === null;
                        const avgHealth = Math.round(regionProps.reduce((acc, p) => acc + p.health_score, 0) / regionProps.length);

                        return (
                            <motion.div
                                key={region}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                                className={`p-5 rounded-2xl border cursor-pointer backdrop-blur-md transition-all duration-300 ${isActive
                                    ? 'bg-[var(--color-bcp-surfaceHighlight)] opacity-90 border-[var(--color-bcp-primary)] shadow-[0_0_20px_rgba(67,24,255,0.3)]'
                                    : 'bg-[var(--color-bcp-surface)] opacity-50 border-[var(--color-bcp-border)]'
                                    }`}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-white font-bold text-lg">{region} Datacenter</h4>
                                    <span className="w-2 h-2 rounded-full bg-[var(--color-bcp-success)] shadow-[0_0_10px_rgba(5,205,153,0.8)] animate-pulse"></span>
                                </div>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <span className="text-[var(--color-bcp-muted)]">{regionProps.length} Connected Nodes</span>
                                    <span className={`px-2 py-0.5 rounded-md ${avgHealth >= 80 ? 'bg-[rgba(5,205,153,0.2)] text-[var(--color-bcp-success)]' : 'bg-[rgba(255,206,32,0.2)] text-[var(--color-bcp-warning)]'}`}>
                                        Avg Health: {avgHealth}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Right Side: Nodes Graphic Representation */}
                <div className="relative z-10 w-full md:w-2/3 border-l border-[rgba(42,54,101,0.5)] pl-8 flex items-center">
                    <AnimatePresence mode="popLayout">
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.properties
                                .filter((p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => selectedRegion === null || (p.location || 'Central Datacenter').includes(selectedRegion))
                                .map((prop: any /* eslint-disable-line @typescript-eslint/no-explicit-any */, idx: number) => (
                                    <motion.div
                                        key={prop.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        onClick={() => onPropertySelect(prop.id)}
                                        className="group relative cursor-pointer"
                                    >
                                        {/* Connection Lines Simulation (CSS hack for visual effect) */}
                                        <div className="absolute top-1/2 -left-8 w-8 h-[1px] bg-gradient-to-r from-[var(--color-bcp-primary)] to-transparent opacity-50 hidden sm:block"></div>

                                        <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.8)] backdrop-blur-xl border border-[var(--color-bcp-border)] hover:border-[var(--color-bcp-primary)] shadow-[var(--shadow-premium-dark)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(67,24,255,0.2)]">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="w-8 h-8 rounded-lg bg-[var(--color-bcp-surfaceHighlight)] flex items-center justify-center">
                                                    <Building className="w-4 h-4 text-[var(--color-bcp-primary)]" />
                                                </div>
                                                <div className={`text-[10px] px-2 py-1 rounded font-bold ${prop.health_score >= 80 ? 'bg-[rgba(5,205,153,0.1)] text-[var(--color-bcp-success)]' : prop.health_score >= 65 ? 'bg-[rgba(255,206,32,0.1)] text-[var(--color-bcp-warning)]' : 'bg-[rgba(238,93,80,0.1)] text-[var(--color-bcp-danger)]'}`}>
                                                    SYS {prop.health_score}
                                                </div>
                                            </div>

                                            <h4 className="text-white font-bold text-sm truncate mb-1">{prop.name}</h4>

                                            <div className="flex justify-between items-center text-xs text-[var(--color-bcp-muted)]">
                                                <span>REV: ${(prop.revenue / 1000).toFixed(0)}k</span>
                                                <span>OCC: {prop.occupancy}%</span>
                                            </div>

                                            {/* Micro Data Transfer Animation */}
                                            <div className="absolute -bottom-1 left-4 right-4 h-[2px] bg-[var(--color-bcp-surfaceHighlight)] overflow-hidden rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1/3 h-full bg-[var(--color-bcp-primary)] shadow-[0_0_8px_var(--color-bcp-primary)] rounded-full animate-[ping_2s_infinite]"></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                        </div>
                    </AnimatePresence>
                </div>
            </motion.div>

        </motion.div>
    );
};
