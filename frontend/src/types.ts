export interface Property {
    id: string;
    name: string;
    location: string;
    category: string;
    revenue: number;
    occupancy: number;
    adr: number;
    revpar: number;
    health_score: number;
    target?: number;
    progress?: number;
    isOnTrack?: boolean;
}

export interface KPI {
    total_revenue: number;
    avg_occupancy: number;
    avg_adr: number;
    avg_health: number;
}

export interface Insight {
    type: string;
    title: string;
    message: string;
    recommendation: string;
}

export interface SystemData {
    kpi: KPI;
    properties: Property[];
    insights: Insight[];
}
