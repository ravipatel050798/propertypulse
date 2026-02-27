from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import datetime
import random

app = Flask(__name__)
# Enable CORS for the React frontend
CORS(app)

def generate_property_data():
    properties = [
        "Moose Hotel & Suites", "Banff Caribou Lodge", "Hotel Canoe & Suites", 
        "Hidden Ridge Resort", "Banff Rocky Mountain Resort", "Fox Hotel & Suites",
        "Banff Ptarmigan Inn", "The Rundlestone Lodge", "Tunnel Mountain Resort",
        "Irwin's Mountain Inn", "Red Carpet Inn", "The Dorothy Motel",
        "Otter Hotel", "Paradise Lodge & Bungalows", "Pocaterra Inn (Canmore)", 
        "Rocky Mountain Ski Lodge"
    ]
    
    prop_cats = {
        "Moose Hotel & Suites": "Luxury/Suites",
        "Banff Caribou Lodge": "Mid-Range",
        "Hotel Canoe & Suites": "Luxury/Suites",
        "Hidden Ridge Resort": "Resort/Condo",
        "Banff Rocky Mountain Resort": "Resort/Condo",
        "Fox Hotel & Suites": "Mid-Range",
        "Banff Ptarmigan Inn": "Mid-Range",
        "The Rundlestone Lodge": "Mid-Range",
        "Tunnel Mountain Resort": "Resort/Condo",
        "Irwin's Mountain Inn": "Budget/Motel",
        "Red Carpet Inn": "Budget/Motel",
        "The Dorothy Motel": "Budget/Motel",
        "Otter Hotel": "Mid-Range",
        "Paradise Lodge & Bungalows": "Resort/Condo",
        "Pocaterra Inn (Canmore)": "Mid-Range",
        "Rocky Mountain Ski Lodge": "Budget/Motel"
    }
    
    np.random.seed(int(datetime.now().timestamp() / 86400)) # Change daily for demo
    
    data = []
    
    for prop in properties:
        cat = prop_cats[prop]
        location = "Canmore, AB" if "Canmore" in prop or prop == "Rocky Mountain Ski Lodge" else "Banff, AB"
        rooms = int(np.random.randint(40, 200))
        occupancy = round(np.random.uniform(45.0, 92.0))
        adr = round(np.random.uniform(150.0, 550.0))
        guest_score = round(np.random.uniform(7.8, 9.6), 1)
        
        revpar = round((occupancy / 100) * adr)
        monthly_rev = int(rooms * revpar * 30)
        
        health_score = round(
            (occupancy / 100 * 30) + 
            ((revpar / 550) * 30) + 
            ((guest_score / 10) * 25) + 
            (15)
        )
        health_score = min(100, health_score)

        data.append({
            "id": prop.replace(" ", "-").lower(),
            "name": prop,
            "location": location,
            "category": cat,
            "rooms": rooms,
            "occupancy": occupancy,
            "adr": adr,
            "revpar": revpar,
            "revenue": monthly_rev,
            "guest_score": guest_score,
            "health_score": health_score
        })
        
    return data

def generate_ai_insights(properties):
    # Sort for analysis
    sorted_by_health = sorted(properties, key=lambda x: x['health_score'])
    sorted_by_rev = sorted(properties, key=lambda x: x['revenue'], reverse=True)
    
    lowest = sorted_by_health[0]
    highest = sorted_by_rev[0]
    
    return [
        {
            "id": "alert-1",
            "type": "operational",
            "title": "Health Score Alert",
            "message": f"{lowest['name']} is showing a depressed Health Score ({lowest['health_score']}). While ADR is holding at ${lowest['adr']}, occupancy has dipped to {lowest['occupancy']}%.",
            "recommendation": "Activate a flash sale targeted at the Calgary drive-market for the upcoming weekend."
        },
        {
            "id": "alert-2",
            "type": "revenue",
            "title": "Revenue Optimizer",
            "message": f"{highest['name']} is generating ${highest['revenue']:,} this month with {highest['occupancy']}% occupancy.",
            "recommendation": "The AI pricing engine recommends lifting ADR by 8% for remaining inventory this month."
        },
        {
            "id": "alert-3",
            "type": "trend",
            "title": "Portfolio Trend Detected",
            "message": "Analysis of booking channels indicates a 22% shift from OTA (Expedia/Booking) to Direct across 'Mid-Range' properties over the last 14 days.",
            "recommendation": "Shift $5,000 in ad spend away from Expedia towards direct Google Hotel Ads."
        }
    ]

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    props = generate_property_data()
    
    total_rev = sum(p['revenue'] for p in props)
    avg_occ = round(sum(p['occupancy'] for p in props) / len(props))
    avg_adr = round(sum(p['adr'] for p in props) / len(props))
    avg_health = round(sum(p['health_score'] for p in props) / len(props))
    
    insights = generate_ai_insights(props)
    
    return jsonify({
        "status": "success",
        "timestamp": datetime.now().isoformat(),
        "kpi": {
            "total_revenue": total_rev,
            "avg_occupancy": avg_occ,
            "avg_adr": avg_adr,
            "avg_health": avg_health
        },
        "properties": props,
        "insights": insights
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
