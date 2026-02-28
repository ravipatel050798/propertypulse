export const MOCK_DATA = {
    "kpi": {
        "avg_health": 74.2,
        "total_revenue": 45000000,
        "revenue_growth": 12.4,
        "avg_occupancy": 70.1,
        "avg_adr": 324
    },
    "properties": [
        {
            "id": "banff-caribou",
            "name": "Banff Caribou Lodge & Spa",
            "category": "Hotel",
            "location": "Banff",
            "health_score": 85,
            "occupancy": 82,
            "adr": 350,
            "revenue": 5200000,
            "revpar": 287,
            "coordinates": { "lat": 51.183, "lng": -115.560 },
            "recent_events": [
                { "type": "target_hit", "message": "Revenue target Q1 achieved", "timestamp": "2h ago" },
                { "type": "alert", "message": "HVAC maintenance required in Spa", "timestamp": "1d ago" }
            ]
        },
        {
            "id": "moose-hotel",
            "name": "Moose Hotel and Suites",
            "category": "Premium Hotel",
            "location": "Banff",
            "health_score": 92,
            "occupancy": 88,
            "adr": 420,
            "revenue": 7800000,
            "revpar": 369,
            "coordinates": { "lat": 51.179, "lng": -115.568 }
        },
        {
            "id": "fox-hotel",
            "name": "Fox Hotel and Suites",
            "category": "Hotel",
            "location": "Banff",
            "health_score": 78,
            "occupancy": 75,
            "adr": 280,
            "revenue": 3100000,
            "revpar": 210,
            "coordinates": { "lat": 51.181, "lng": -115.565 }
        },
        {
            "id": "hidden-ridge",
            "name": "Hidden Ridge Resort",
            "category": "Resort",
            "location": "Banff",
            "health_score": 88,
            "occupancy": 72,
            "adr": 310,
            "revenue": 2800000,
            "revpar": 223,
            "coordinates": { "lat": 51.190, "lng": -115.545 }
        },
        {
            "id": "rocky-mountain",
            "name": "Rocky Mountain Resort",
            "category": "Resort",
            "location": "Banff",
            "health_score": 65,
            "occupancy": 55,
            "adr": 240,
            "revenue": 1900000,
            "revpar": 132,
            "coordinates": { "lat": 51.195, "lng": -115.540 }
        }
    ],
    "targets": {
        "q1": { "target": 12000000, "actual": 12500000 },
        "q2": { "target": 15000000, "actual": 14200000 },
        "q3": { "target": 22000000, "actual": 18300000, "projected": 23000000 },
        "q4": { "target": 18000000, "actual": 0 }
    },
    "insights": [
        {
            "id": "alert-1",
            "type": "operational",
            "title": "Yield Strategy Note",
            "message": "RevPAR is currently tracking 4.8% above the baseline across the Banff portfolio. ADR stability is contributing to high information quality.",
            "recommendation": "Review Canmore regional metrics for secondary growth opportunities."
        },
        {
            "id": "alert-2",
            "type": "data_integrity",
            "title": "Audit Complete",
            "message": "The automated data integrity audit has cleared all active property assets. No missing RevPAR or occupancy identifiers detected.",
            "recommendation": "Maintain weekly autonomous audits to ensure reporting reliability."
        }
    ]
};
