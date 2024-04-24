import json
import csv

# Load JSON data from file
with open('dataset.json', 'r') as json_file:
    json_data = json.load(json_file)

# CSV filename
csv_filename = 'queries.csv'

# Extract input and query data
data_rows = [(entry['input'], entry['query']) for entry in json_data]

# Write data to CSV file
with open(csv_filename, 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['Input', 'Query'])  # Write header
    writer.writerows(data_rows)  # Write data rows

print(f"CSV file '{csv_filename}' has been created successfully.")
