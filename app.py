from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app)

# Load the trained model and label encoder
model = pickle.load(open("finalized_model.sav", "rb"))
encoder = pickle.load(open("label_encoder.pkl", "rb"))

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No input data provided"}), 400
        
        # Convert soil type to numerical value using the encoder
        soil_type_numeric = encoder.transform([data["soil_type"]])[0]

        # Prepare input data
        features = np.array([[  
            data["rainfall"],
            data["temperature"],
            soil_type_numeric,
            data["area"]
        ]])

        prediction = model.predict(features)
        return jsonify({"predicted_yield": round(prediction[0], 2)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
