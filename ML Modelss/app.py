from flask import Flask, request, jsonify
import pandas as pd
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load all required models and encoders
with open('ML models/disease_prediction_model.pkl', 'rb') as f:
    disease_model = pickle.load(f)

with open('ML models/prognosis_encoder.pkl', 'rb') as f:
    prognosis_encoder = pickle.load(f)

with open('ML models/model.pkl', 'rb') as f:
    specialist_model = pickle.load(f)

with open('ML models/label_encoder.pkl', 'rb') as f:
    specialist_encoder = pickle.load(f)

with open('ML models/symptom_columns.pkl', 'rb') as f:
    symptom_columns = pickle.load(f)

def prepare_input_data(symptoms):
    """Prepare input DataFrame from symptoms list"""
    input_df = pd.DataFrame(0, index=[0], columns=symptom_columns)
    for symptom in symptoms:
        symptom_key = symptom.lower().replace(' ', '_')
        if symptom_key in input_df.columns:
            input_df[symptom_key] = 1
    return input_df

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        if 'symptoms' not in data or not data['symptoms']:
            return jsonify({'error': 'No symptoms provided'}), 400

        # Prepare input data
        input_df = prepare_input_data(data['symptoms'])
        matched_symptoms = [s.replace('_', ' ') for s in input_df.columns if input_df[s].iloc[0] == 1]

        # Disease prediction
        disease_pred = disease_model.predict(input_df)
        disease_probs = disease_model.predict_proba(input_df)
        disease_name = prognosis_encoder.inverse_transform(disease_pred)[0]
        disease_confidence = round(np.max(disease_probs) * 100, 2)
        
        # Get top 3 diseases
        top3_indices = np.argsort(disease_probs)[0][-3:][::-1]
        top3_diseases = prognosis_encoder.inverse_transform(top3_indices)
        top3_confidences = [round(disease_probs[0][i]*100, 2) for i in top3_indices]

        # Specialist recommendation
        specialist_pred = specialist_model.predict(input_df)
        specialist_probs = specialist_model.predict_proba(input_df)
        specialist_name = specialist_encoder.inverse_transform(specialist_pred)[0]
        specialist_confidence = round(np.max(specialist_probs) * 100, 2)

        return jsonify({
            'diagnosis': {
                'primary_prediction': disease_name,
                'confidence': disease_confidence,
                'top3_predictions': [
                    {'disease': d, 'confidence': c} 
                    for d, c in zip(top3_diseases, top3_confidences)
                ]
            },
            'recommendation': {
                'specialist': specialist_name,
                'confidence': specialist_confidence
            },
            'matched_symptoms': matched_symptoms
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)