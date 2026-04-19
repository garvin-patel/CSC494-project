from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)

# MongoDB Connection
MONGO_URI = "mongodb+srv://garvinpatel78_db_user:iYT9yylBDTS91sv4@smart-parking.r6mkjci.mongodb.net/?appName=smart-parking"
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["smart_parking"]
spots_collection = db["spots"]
readings_collection = db["readings"]

# ESP32 sends data here
@app.route('/update', methods=['POST'])
def update_spot():
    data = request.get_json()
    spot_id = data.get('spot_id', 'A1')
    distance = data.get('distance_cm', 0)
    status = "OCCUPIED" if distance < 50 else "AVAILABLE"

    # Save to MongoDB
    spots_collection.update_one(
        {"spot_id": spot_id},
        {"$set": {
            "spot_id": spot_id,
            "status": status,
            "distance_cm": distance,
            "last_updated": datetime.now().strftime("%H:%M:%S")
        }},
        upsert=True
    )

    readings_collection.insert_one({
        "spot_id": spot_id,
        "distance_cm": distance,
        "status": status,
        "timestamp": datetime.now()
    })

    print(f"Spot {spot_id}: {status} ({distance}cm)")
    return jsonify({"message": "Updated!", "status": status})

# Dashboard reads data here
@app.route('/status', methods=['GET'])
def get_status():
    spots = list(spots_collection.find({}, {"_id": 0}))
    total = len(spots)
    occupied = sum(1 for s in spots if s["status"] == "OCCUPIED")
    available = total - occupied
    return jsonify({
        "spots": spots,
        "total": total,
        "occupied": occupied,
        "available": available
    })

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Smart Parking API is running!"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)