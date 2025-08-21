from flask import Flask, render_template, request, jsonify
import random
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/toss', methods=['POST'])
def toss_coin():
    data = request.get_json()
    toss_count = data.get('tossCount', 1)
    
    results = {
        'heads': 0,
        'tails': 0,
        'history': []
    }
    
    for _ in range(toss_count):
        result = 'H' if random.random() < 0.5 else 'T'
        if result == 'H':
            results['heads'] += 1
        else:
            results['tails'] += 1
        results['history'].append(result)
    
    return jsonify(results)

if __name__ == '__main__':
    # Create the required directories if they don't exist
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static/css', exist_ok=True)
    os.makedirs('static/js', exist_ok=True)
    
    app.run(debug=True)