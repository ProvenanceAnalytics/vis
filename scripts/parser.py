import json
import csv
import os
import shutil
import time
import stat

output_file_path = '/var/lib/neo4j/import/output.csv'

# Check if file exists and delete it
if os.path.isfile(output_file_path):
    os.remove(output_file_path)

# Original file path
file_path = r'/tmp/provenance2.json'

# Check if original file exists and is not empty
if not os.path.exists(file_path):
    print(f'Error: {file_path} does not exist')
elif os.path.getsize(file_path) == 0:
    print(f'Error: {file_path} is empty')
else:
    print(f'{file_path} exists and is not empty')

os.chmod(file_path, stat.S_IRUSR | stat.S_IWUSR)

# Define a path for the temporary file
temp_file_path = '/home/ubuntu/temp_provenance2.json'

# Check if temp file exists, if yes, change its permissions
if os.path.exists(temp_file_path):
    os.chmod(temp_file_path, stat.S_IWUSR | stat.S_IRUSR)

# Copy the content of the original file to the temporary file
shutil.copy(file_path, temp_file_path)
time.sleep(3)

# Check if the copy was successful
if not os.path.exists(temp_file_path):
    print(f'Error: failed to copy {file_path} to {temp_file_path}')
elif os.path.getsize(temp_file_path) == 0:
    print(f'Error: {temp_file_path} is empty after copying')
else:
    print(f'Successfully copied {file_path} to {temp_file_path}')

# Print the size of the original file and the temporary file
print(f'Size of {file_path}: {os.path.getsize(file_path)} bytes')
print(f'Size of {temp_file_path}: {os.path.getsize(temp_file_path)} bytes')


# Read the JSON data from temp file
with open(temp_file_path, 'r+') as file:
    lines = file.readlines()

    # Remove the last line (truncate the list)
    lines = lines[:-1]

    # Add a closing square bracket in the next line
    lines.append(']')

    # Write the modified JSON data back to the temp file
    file.seek(0)  # Move the file pointer to the start of the file
    file.writelines(lines)
    file.truncate()  # Delete any content after the current file position

# Load JSON data from modified temp file
with open(temp_file_path, 'r') as file:
    data_json = file.read()

# Remove the temporary file
#os.remove(temp_file_path)

data = json.loads(data_json)

# Limit data to the first 1000 records
data = data[:1000]

# Open (or create) a CSV file
with open('/var/lib/neo4j/import/output.csv', 'w', newline='') as csvfile:
    fieldnames = set()

    # Generate fieldnames
    for entry in data:
        for key in entry:
            if key == 'annotations':
                for sub_key in entry[key]:
                    fieldnames.add(f'annotations_{sub_key}')
            else:
                fieldnames.add(key)

    # Initialize writer
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # Write headers
    writer.writeheader()

    # Write data
    for entry in data:
        row = {}
        for key in entry:
            if key == 'annotations':
                for sub_key in entry[key]:
                    row[f'annotations_{sub_key}'] = entry[key][sub_key]
            else:
                row[key] = entry[key]
        writer.writerow(row)

# Write completion status to a file
with open("/home/ubuntu/parser_done.txt", "w") as file:
    file.write("Parsing completed.")
