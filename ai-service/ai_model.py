from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    soil_moisture = data['soil_moisture']
    temperature = data['temperature']
    humidity = data['humidity']

    # Simple rule-based prediction
    if soil_moisture < 40 and temperature > 30:
        prediction = "Irrigation Needed"
    else:
        prediction = "No Irrigation Required"

    return jsonify({"prediction": prediction})

if __name__ == "__main__":
    app.run(port=6000)