from flask import Flask, jsonify
from google.cloud import firestore

app = Flask(__name__)
db = firestore.Client()
@app.route('/api/data', methods=['GET'])
def get_data():
    data_ref = db.collection('main')
    docs = data_ref.stream()
    data = []
    for doc in docs:
        data.append(doc.to_dict())
    print(data)
    return jsonify(data)
