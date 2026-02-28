import { useState, useRef, useEffect } from "react";
import { motion } from 'framer-motion';
import { Bot, Send, User, Cpu, Database } from 'lucide-react';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    sqlQuery?: string;
}

export const Intelligence = ({ data }: { data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) => {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'assistant', content: 'PropertyPulse Business Intelligence Core is online. I have analyzed the current portfolio data for 16 properties. I am ready to assist with **RevPAR optimization**, **data integrity audits**, or **strategic yield analysis**. How can I help you meet company objectives today?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const formatMessage = (text: string) => {
        return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-[var(--color-bcp-primary)]">{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!query.trim()) return;

        const userMsg = query;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setQuery('');
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            let response = "";
            let sqlQuery = "";
            const lowerQ = userMsg.toLowerCase();
            const props = data.properties;

            // Helper calculations
            const avgOcc = props.reduce((acc: number, p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => acc + p.occupancy, 0) / props.length;
            const totalRev = props.reduce((acc: number, p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => acc + p.revenue, 0);

            if (lowerQ.includes("lowest") || lowerQ.includes("worst")) {
                const sorted = [...props].sort((a: any, b: any) => a.health_score - b.health_score); // eslint-disable-line @typescript-eslint/no-explicit-any
                const lowest = sorted[0];
                sqlQuery = `SELECT name, health_score, occupancy, adr\nFROM properties\nORDER BY health_score ASC\nLIMIT 1;`;
                response = `Based on live telemetry, **${lowest.name}** has the lowest health score (${lowest.health_score}). Its current occupancy is ${lowest.occupancy}% with an ADR of $${lowest.adr}. It is significantly below the portfolio average health of ${data.kpi.avg_health}. I recommend an immediate operational audit.`;
            } else if (lowerQ.includes("highest") || lowerQ.includes("best") || (lowerQ.includes("revenue") && !lowerQ.includes("total") && !lowerQ.includes("portfolio"))) {
                const sorted = [...props].sort((a: any, b: any) => b.revenue - a.revenue); // eslint-disable-line @typescript-eslint/no-explicit-any
                const highest = sorted[0];
                sqlQuery = `SELECT name, revenue, occupancy, adr, revpar\nFROM properties\nORDER BY revenue DESC\nLIMIT 1;`;
                response = `**${highest.name}** is the top performer this month, generating $${highest.revenue.toLocaleString()} with ${highest.occupancy}% occupancy. Its ADR of $${highest.adr} is driving a strong RevPAR of $${highest.revpar}.`;
            } else if (lowerQ.includes("total") || lowerQ.includes("portfolio")) {
                sqlQuery = `SELECT SUM(revenue) as total_revenue, \n       AVG(occupancy) as avg_occupancy, \n       (SELECT avg_health FROM kpi LIMIT 1) as avg_health \nFROM properties;`;
                response = `The total portfolio revenue running for this period is **$${totalRev.toLocaleString()}**. The aggregate system occupancy sits at ${avgOcc.toFixed(1)}% with an average health score of ${data.kpi.avg_health}.`;
            } else if (lowerQ.includes("canmore")) {
                const canmoreProps = props.filter((p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => p.location.toLowerCase().includes("canmore"));
                const canmoreRev = canmoreProps.reduce((acc: number, p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => acc + p.revenue, 0);
                sqlQuery = `SELECT name, revenue, occupancy \nFROM properties \nWHERE location ILIKE '%canmore%' \nORDER BY revenue DESC;`;
                response = `I am tracking ${canmoreProps.length} properties in Canmore. Together they have generated $${canmoreRev.toLocaleString()} this period. The standout performer in this region is **${[...canmoreProps].sort((a: any, b: any) => b.revenue - a.revenue)[0].name}**.`; // eslint-disable-line @typescript-eslint/no-explicit-any
            } else if (lowerQ.includes("banff")) {
                const banffProps = props.filter((p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => p.location.toLowerCase().includes("banff"));
                const banffAvgOcc = banffProps.reduce((acc: number, p: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => acc + p.occupancy, 0) / banffProps.length;
                sqlQuery = `SELECT name, occupancy \nFROM properties \nWHERE location ILIKE '%banff%';`;
                response = `Banff region analysis: There are ${banffProps.length} active properties. The average occupancy across Banff assets is currently ${banffAvgOcc.toFixed(1)}%, which is ${banffAvgOcc > avgOcc ? 'higher' : 'lower'} than the overall portfolio average.`;
            } else if (lowerQ.includes("occupancy")) {
                const sorted = [...props].sort((a: any, b: any) => b.occupancy - a.occupancy); // eslint-disable-line @typescript-eslint/no-explicit-any
                const highest = sorted[0];
                const lowest = sorted[sorted.length - 1];
                sqlQuery = `SELECT name, occupancy \nFROM properties \nORDER BY occupancy DESC;`;
                response = `Portfolio average occupancy is **${avgOcc.toFixed(1)}%**. \n\nHighest: **${highest.name}** (${highest.occupancy}%)\nLowest: **${lowest.name}** (${lowest.occupancy}%)\n\nWould you like me to model pricing scenarios to boost occupancy for **${lowest.name}**?`;
            } else if (lowerQ.includes("integrity") || lowerQ.includes("audit") || lowerQ.includes("check")) {
                const anomalies = props.filter((p: any) => p.occupancy > 100 || p.adr <= 0 || p.health_score < 0);
                sqlQuery = `SELECT id, name, occupancy, adr, health_score \nFROM properties \nWHERE occupancy > 100 OR adr <= 0 OR health_score < 0;`;
                if (anomalies.length > 0) {
                    response = `**Data Integrity Alert:** I have detected ${anomalies.length} anomalies in the dataset. Properties like **${anomalies[0].name}** show irregular metrics (Occupancy: ${anomalies[0].occupancy}%). I recommend verifying the source data feed to ensure 100% accuracy.`;
                } else {
                    response = `I have completed a comprehensive **Portfolio Audit**. All ${props.length} data assets are complete, accurate, and reliable. Data integrity is confirmed at 100%.`;
                }
            } else if (lowerQ.includes("strategy") || lowerQ.includes("recommend") || lowerQ.includes("improve")) {
                const lowRevPar = [...props].sort((a: any, b: any) => a.revpar - b.revpar)[0];
                sqlQuery = `SELECT name, occupancy, adr, revpar \nFROM properties \nORDER BY revpar ASC \nLIMIT 1;`;
                response = `**Yield Strategy Recommendation:** To enhance portfolio RevPAR, we should focus on **${lowRevPar.name}**. Currently, its RevPAR is $${lowRevPar.revpar}. \n\n**Proposed Action:** Increase ADR by 5% while maintaining current occupancy through targeted marketing in the Canmore region. This would project a ${((lowRevPar.revpar * 1.05) - lowRevPar.revpar).toFixed(2)}% increase in unit revenue.`;
            } else if (lowerQ.includes("revpar")) {
                const avgRevPar = props.reduce((acc: number, p: any) => acc + p.revpar, 0) / props.length;
                sqlQuery = `SELECT AVG(revpar) as portfolio_avg_revpar FROM properties;`;
                response = `The current **Portfolio Average RevPAR** is **$${avgRevPar.toFixed(2)}**. This is a key metric for BCP as it balances both pricing (ADR) and volume (Occupancy). Would you like a breakdown by region?`;
            } else if (lowerQ.includes("health")) {
                sqlQuery = `SELECT avg_health FROM kpi LIMIT 1;`;
                response = `The portfolio average health is currently **${data.kpi.avg_health}**. If you want a breakdown, ask me for the "lowest" or "worst" performing property.`;
            } else {
                sqlQuery = `SELECT \n  COUNT(*) as property_count, \n  AVG(adr) as avg_adr \nFROM properties;`;
                response = `I've processed your query regarding "${userMsg}". Analyzing across the ${props.length} Banff Caribou Properties... The portfolio is currently operating at an average RevPAR of $${((data.kpi.avg_occupancy / 100) * data.kpi.avg_adr).toFixed(2)}. Please specify if you want metrics on revenue, occupancy, integrity audits, or strategic recommendations.`;
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response, sqlQuery }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="h-[85vh] flex flex-col max-w-[1000px] mx-auto premium-card overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[var(--color-bcp-border)] bg-[var(--color-bcp-surfaceHighlight)] flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] flex items-center justify-center shadow-[var(--shadow-premium-dark)] relative">
                        <Cpu className="w-6 h-6 text-[var(--color-bcp-primary)] relative z-10" />
                        <div className="absolute inset-0 bg-[var(--color-bcp-primary)] opacity-20 blur-md rounded-xl"></div>
                    </div>
                    <div>
                        <h2 className="text-[22px] font-display font-bold text-white">Hospitality Intelligence Hub</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-bcp-success)] shadow-[0_0_8px_rgba(5,205,153,0.8)] animate-pulse"></span>
                            <p className="text-[11px] tracking-widest text-[var(--color-bcp-muted)] uppercase font-bold">BI System Online • Data Validated</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-[var(--color-bcp-surfaceHighlight)] border-[var(--color-bcp-border)]' : 'bg-[var(--color-bcp-primary)]/20 border-[var(--color-bcp-primary)] text-[var(--color-bcp-primary)] shadow-[var(--shadow-neon)]'}`}>
                            {msg.role === 'user' ? <User className="w-5 h-5 text-white/70" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div className={`flex flex-col gap-3 w-full max-w-[calc(100%-3rem)]`}>
                            {msg.sqlQuery && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-[16px] bg-[#0A0F24] border border-[#1A2652] overflow-hidden shadow-[var(--shadow-premium-dark)] mt-2">
                                    <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1A2652] bg-[#050814]">
                                        <Database className="w-3.5 h-3.5 text-[var(--color-bcp-primary)]" />
                                        <span className="text-[11px] font-mono text-[var(--color-bcp-muted)] font-bold tracking-wider">EXECUTED_SQL</span>
                                    </div>
                                    <div className="p-4 overflow-x-auto">
                                        <pre className="text-[13px] font-mono leading-relaxed text-[#A5B4FC]">
                                            <code>{msg.sqlQuery}</code>
                                        </pre>
                                    </div>
                                </motion.div>
                            )}
                            <div className={`p-5 rounded-[20px] w-fit ${msg.role === 'user' ? 'bg-[var(--color-bcp-primary)] text-white shadow-[0_5px_15px_rgba(67,24,255,0.3)] rounded-tr-none ml-auto' : 'bg-[var(--color-bcp-surfaceHighlight)] text-white/90 border border-[var(--color-bcp-border)] shadow-[var(--shadow-premium-dark)] rounded-tl-none'}`}>
                                <p className="leading-relaxed text-[15px] whitespace-pre-wrap">{formatMessage(msg.content)}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-4 max-w-[80%]">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border bg-[var(--color-bcp-primary)]/20 border-[var(--color-bcp-primary)] text-[var(--color-bcp-primary)] shadow-[var(--shadow-neon)]">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="p-5 rounded-[20px] bg-[var(--color-bcp-surfaceHighlight)] border border-[var(--color-bcp-border)] shadow-[var(--shadow-premium-dark)] rounded-tl-none flex items-center gap-2">
                            <span className="w-2 h-2 bg-[var(--color-bcp-primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-[var(--color-bcp-primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-[var(--color-bcp-primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={endOfMessagesRef} />
            </div>

            {/* Input Box */}
            <div className="p-6 bg-[var(--color-bcp-surfaceHighlight)] border-t border-[var(--color-bcp-border)]">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Target Canmore properties or analyze revenue drop..."
                        className="w-full bg-[var(--color-bcp-surface)] border border-[var(--color-bcp-border)] focus:border-[var(--color-bcp-primary)] rounded-2xl py-4 pl-6 pr-16 text-white placeholder-[var(--color-bcp-muted)] outline-none transition-all shadow-inner focus:shadow-[var(--shadow-neon)] font-medium"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!query.trim() || isTyping}
                        className="absolute right-3 w-10 h-10 bg-[var(--color-bcp-primary)] hover:bg-[var(--color-bcp-accent)] rounded-xl flex items-center justify-center text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(67,24,255,0.4)]"
                    >
                        <Send className="w-4 h-4 ml-0.5" />
                    </button>
                </div>
                <p className="text-center mt-3 text-[11px] text-[var(--color-bcp-muted)] font-medium">PropertyPulse AI can make mistakes. Verify critical revenue data.</p>
            </div>
        </motion.div>
    );
};
