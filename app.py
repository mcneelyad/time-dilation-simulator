from flask import Flask, render_template, request, jsonify
import math
from scipy import constants

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/simulate', methods=['GET'])
def simulate():
    try:
        # Get parameters from the query string
        velocity = float(request.args.get('v', 0))    # velocity in m/s
        t0 = float(request.args.get('t0', 1))    # proper time in seconds

    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid parameters provided.'}), 400

    # Ensure velocity is less than the speed of light
    if abs(velocity) >= constants.speed_of_light:
        return jsonify({'error': 'Velocity must be less than the speed of light.'}), 400

    # Calculate Lorentz factor: gamma = 1 / sqrt(1 - (v^2 / c^2))
    gamma = 1 / math.sqrt(1 - (velocity**2) / (constants.speed_of_light**2))
    dilated_time = gamma * t0

    return jsonify({
        'gamma': gamma,
        'dilated_time': dilated_time
    })

if __name__ == '__main__':
    app.run(debug=True)