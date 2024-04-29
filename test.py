import csv
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate('lmaoded-57eda-firebase-adminsdk-z2j4h-70144ff6f4.json')
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()

# Function to get field types from user
def get_field_types(row):
    field_types = {}
    for field in row:
        field_type = input(f"Is field '{field}' a string (s) or a number (n)? ").lower()
        while field_type not in ['s', 'n']:
            print("Invalid input. Please enter 's' for string or 'n' for number.")
            field_type = input(f"Is field '{field}' a string (s) or a number (n)? ").lower()
        field_types[field] = field_type
    return field_types

# Function to add a document to Firestore
def add_document(collection_name, field_names, field_types, row):
    document_data = {}
    for field_name, value in zip(field_names, row):
        field_type = field_types[field_name]
        if field_type == 'n':
            try:
                document_data[field_name] = int(value) if value else 0
            except ValueError:
                try:
                    document_data[field_name] = float(value) if value else 0.0
                except ValueError:
                    print(f"Error: Value '{value}' for field '{field_name}' is not a valid number.")
                    return "Error"
        else:
            document_data[field_name] = value if value else ''
    try:
        db.collection(collection_name).add(document_data)
        return "OK"
    except Exception as e:
        print(f"Error adding document to Firestore: {e}")
        return "Error"

# Path to your CSV file
csv_file = 'maindata.csv'

# Collection name in Firestore
collection_name = 'shop_real'

# Read CSV file
with open(csv_file, newline='') as csvfile:
    reader = csv.reader(csvfile)
    # Get field names from the first row
    field_names = next(reader)
    # Get field types from user
    field_types = get_field_types(field_names)
    # Iterate over remaining rows
    for row in reader:
        result = add_document(collection_name, field_names, field_types, row)
        print(f"Adding row: {result}")
