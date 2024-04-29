import csv

# Function to count unique values in a column
def count_unique_values(csv_file, column_name):
    unique_values = set()
    with open(csv_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # print(row['Shop name'])
            if column_name in row:
                # print(row['Shop name'])
                unique_values.add(row[column_name])
    print(unique_values)
    return len(unique_values)

# Path to the CSV file
csv_file = 'maindata-apr24.csv'

# Column name for which to count unique values
column_name = 'Shop name'

# Count unique values
unique_count = count_unique_values(csv_file, column_name)
print(f"Number of unique values in column '{column_name}': {unique_count}")
