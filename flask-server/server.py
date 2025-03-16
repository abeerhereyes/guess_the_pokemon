from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/data')
def home():
    try:
        df = pd.read_csv('./pokemon.csv')
        random_row = df.sample(n=1)
        pokemon_name = random_row['Name'].values[0]
        type1 = random_row['Type 1'].values[0]
        type2 = random_row['Type 2'].values[0]
        generation = int(random_row['Generation'].values[0])
        if pd.isna(type2):
            type2 = "None"
        content = {
            'pokemon_name': pokemon_name,
            'type1': type1,
            'type2': type2,
            'generation': generation,
        }
        return jsonify(content)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=1212)
