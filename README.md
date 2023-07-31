Project: Provenance Data Visualization
This project is about running a SPADE program on an EC2 instance that collects provenance data, parses it, uploads it to a Neo4j database, and finally visualizes the data on a website using Neovis.js. We also display the output of the terminal from the EC2 instance on the website.

Getting Started
Prerequisites
An AWS account with configured access to EC2 instances.
Node.js installed on your local machine.
Neo4j database server running on a separate server or locally.
A web server to serve the HTML and JavaScript files.
SPADE program installed on the EC2 instance.
The necessary Python scripts for parsing and queries.
Steps to Set Up
Starting the EC2 Instance: Use the provided start button on the webpage to start an EC2 instance. The instance is configured with a startup script that will automatically execute a series of commands.

SPADE and Hello-world Program: The startup script first starts the SPADE program, then runs the hello-world program. SPADE collects provenance data from the hello-world program.

Provenance Data Parsing: Once SPADE finishes collecting the provenance data, the startup script runs a parser which converts the provenance data into a .csv format.

Uploading to Neo4j Database: The startup script then runs a set of queries to upload the parsed data into a Neo4j database. Please note that the Neo4j database must be running and accessible from the EC2 instance.

Visualizing Data: The webpage uses Neovis.js to visualize the nodes and relationships in the Neo4j database. You should be able to see the data once the uploading process completes.

Terminal Output: The output of the EC2 instance terminal is displayed on the webpage using a WebSocket connection. It updates in real-time as the startup script runs.

Usage
Open the webpage and click the start button to launch the EC2 instance and begin the data collection, parsing, and upload process.
Watch the terminal output on the webpage to monitor the progress of the startup script.
Once the upload process is complete, the data in the Neo4j database will be visualized on the webpage using Neovis.js.
Please note: SPADE and Neo4j cannot be run at the same time due to system limitations, therefore, the startup script manages the stopping and starting of these services as necessary.
