
# Provenance Data Visualization

This project is about running a SPADE program on an EC2 instance that collects provenance data, parses it, uploads it to a Neo4j database, and finally visualizes the data on a website using Neovis.js.


## Prerequisites
###### An Amazon AWS account
###### VSCode or an IDE of your choice
###### PuTTY or SSH of your choice
###### t2 medium instance
## Overview 
The website will consist of a start button which will start an EC2 instance with Ubuntu, SPADE, and Node installed. The instance will then run a startup script which will run a program which creates a file named hello-world. The creation of this file will create provenance which SPADE will capture. That provenance, which is in a JSON format, will get parsed into a CSV file. That CSV file will be used with Cypher Queries to be sent to a Neo4j database. The queries will establish nodes and relationships which will be viewable with our usage of Neovis. The website will have a display of the database, with nodes and relationships being easilly viewable. Each node and relationship will have its own information. The information will be viewable with a hover over the chosen piece. The website will also have a box where the user can submit cypher queries of their own to manipulate the visulization how they find suit with a stablization button as the graph does have interesting physics. Below the graph will be a output of the virtual machine. The output shows the startup script in action. Finally there is a stop button to turn off the instance.
## Getting Started
First we start with a basic html file in VSCode. To do this, we make a new file and name it what you would like as long as it ends with .html. Looking at our layout, we need a button that start a virtual machine. We can achieve that with the AWS services. We will use an API gateway and a Lambda function. In our HTML file we should first start with a title as such: `<title>Visualization Pipline</title>`. Then we start with `<head>`. Then we will create a button using `<button id="start-button">Start EC2 Instance</button>`. Now that we have a button we will switch over to AWS.
## AWS Start Instance
Log into the AWS service and head over to the management console. We will first visit EC2 to establish our instance. Search for "EC2" and click the first result. Then click on instances and in the top right click on launch instances. Name it whatever you want and in the Application and OS images you will want to select Ubuntu in the Quick Start tab. For the Instance type we will use a t2.medium. You will want to create a key pair so that we can access the virtual machine. Click the create a key pair button and choose your name. Then we will use an RSA pair with .ppk so that we can use PuTTY. Click create key pair. We will create a new security group so that we can customize what connections we allow into and out of the instance. In the storage section will we change the storage to 30 GiB of gp3. Also a medium sized instance is required for this project. Then we will click launch instance. Head back to the EC2 dashboard and instead of clicking on Instances, we will head over to elastic IPs. In the top right, click allocate elastic IP address. Leave everything to defualt and click allocate. Then click on the IP address you just created and in the top right click allocate elastic IP address. Allocate it to an instance and select your instance. Leave everything else to default and click associate. Now that we have our EC2 instance set up with an elastic IP address we can head back over to our management console. Search for Lambda and click on it. Then click on create function. We will use Author from scratch. Name it and select Python 3.11 as our Runtime. Also we will change the execution role. Select "Create a new role with basic Lambda permissions". Then we create the function. We need to give this role permissions so we head back to the AWS management console. Search for "IAM" and click on it. Scroll down and click on roles. Click on the role that was created. Scroll down and look for add permissions. Click attach polices and you will attach these policies: "CloudWatchLogsFullAccess" , "AmazonEC2FullAccess", "AmazonEC2RoleforSSM", "AmazonSSMManagedInstanceCore". We need to take a quick detour. Head to your EC2 management console and select the box beside your instance. Click on the actions button and then security and then modify IAM role. Select the role that you just created. Once you are finished, head back to Lambda in the managment console. Click on the function that you created. You should be taken to the functions configuration. Scroll down to code and implement this code snippet instead of the default.
 ```python
import json
import boto3

def lambda_handler(event, context):
    ec2 = boto3.client('ec2', region_name='us-east-2')
    instance_id = 'i-#########'  # replace with your instance ID

    response = ec2.start_instances(InstanceIds=[instance_id])
    
    print(f'Success, instance started : {response}')
    
    # You can add your 'Hello, World!' message here
    message = 'Hello, World!'
    
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
        },
        'body': json.dumps({'response': str(response), 'message': message})
    }

    

```
Next you will want to deploy these changes. Before testing we must change a setting. Click on the configuration tab and head over to the general configuration tab. Click edit and set the timeout to 14 minutes and 59 seconds. Save the changes and deploy again. Finally test the code and the result should be as such 
``` 
Test Event Name
2

Response
{
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
  },
  "body": "{\"response\": \"{'StartingInstances': [{'CurrentState': {'Code': 16, 'Name': 'running'}, 'InstanceId': 'i-03a8f6870f096c78e', 'PreviousState': {'Code': 16, 'Name': 'running'}}], 'ResponseMetadata': {'RequestId': 'cea71881-e38c-4621-9982-e7c363552136', 'HTTPStatusCode': 200, 'HTTPHeaders': {'x-amzn-requestid': 'cea71881-e38c-4621-9982-e7c363552136', 'cache-control': 'no-cache, no-store', 'strict-transport-security': 'max-age=31536000; includeSubDomains', 'content-type': 'text/xml;charset=UTF-8', 'content-length': '580', 'date': 'Tue, 01 Aug 2023 16:53:39 GMT', 'server': 'AmazonEC2'}, 'RetryAttempts': 0}}\", \"message\": \"Hello, World!\"}"
}

Function Logs
START RequestId: 930bf327-3202-4314-a1f2-2495aba5383c Version: $LATEST
Success, instance started : {'StartingInstances': [{'CurrentState': {'Code': 16, 'Name': 'running'}, 'InstanceId': 'i-03a8f6870f096c78e', 'PreviousState': {'Code': 16, 'Name': 'running'}}], 'ResponseMetadata': {'RequestId': 'cea71881-e38c-4621-9982-e7c363552136', 'HTTPStatusCode': 200, 'HTTPHeaders': {'x-amzn-requestid': 'cea71881-e38c-4621-9982-e7c363552136', 'cache-control': 'no-cache, no-store', 'strict-transport-security': 'max-age=31536000; includeSubDomains', 'content-type': 'text/xml;charset=UTF-8', 'content-length': '580', 'date': 'Tue, 01 Aug 2023 16:53:39 GMT', 'server': 'AmazonEC2'}, 'RetryAttempts': 0}}
END RequestId: 930bf327-3202-4314-a1f2-2495aba5383c
REPORT RequestId: 930bf327-3202-4314-a1f2-2495aba5383c	Duration: 2530.24 ms	Billed Duration: 2531 ms	Memory Size: 128 MB	Max Memory Used: 87 MB	Init Duration: 258.24 ms

Request ID
930bf327-3202-4314-a1f2-2495aba5383c 
``` 
Now that our lambda function is set up, we must have a trigger that will start the function. Head back to the management console and search for the API gateway service. Click on the orange button Create API. Scroll down to the REST API option. We will use the first one which has this description "Develop a REST API where you gain complete control over the request and response along with API management capabilities." Click build and leave everything as is except for the endpoint type. Change it to regional. Click Create API. This should take you to its configuration. You should see a button that says Actions. Click that and select Create Method. Click the drop down in the small box that was created. Select GET and click the small check mark. Another screen will appear and you will leave everything the same except you will check off the "Use Lambda Proxy integration" box. You will also put the name of the lambda function you made in the previous step. Next you will click the Actions button again and click enable CORS to allow our website to use the API. Leave everything the same and click the blue button that says "Enable CORS and replace exisiting CORS headers". Click on the "Yes, replace exisiting values" button when it pops up. Next click the Actions button again and click "Deploy API". Create a new deployment stage and name it what you would like and select it as the stage. Once you deploy it, an invoke URL will be given which you will use later in the HTML code.
## Configuring the security group
Head over to your management console and go to EC2. On the left there should be a navigation pane which you will scroll down and select security groups. You will click on the security group that is related to your instance which you can view in the ec2 management console right before you click your instance. You will scroll down to inbound rules and click edit. Allow these following Ports with TCP and Anywhere IPV4 as the source: 7687, 7474, 19998, 29998, 19999, 8080, and 7473.
## Building the start button
Once we have our lambda function setup with our API gateway. We head back to our html file and add this code:
 ``` 
<script>
$("#start-button").click(function() {
            $.get("API-INVOKE-URL-HERE", function(data, status){
                console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                $('#terminal-output').append("Data: " + JSON.stringify(data) + "\nStatus: " + status + "\n");
            });
        });
<script>        
```
You can now test out your button by clicking it and going over to the EC2 management console and clicking on your instance and seeing the state. If you see pending... the instance is booting up and Running means that its up and ready to go.
## AWS Stop Instance
Now that we can start the instance, we need a way to stop it. We will follow the exact same steps we took with the lambda function and the API gateway, except this time we will change the code in the lambda function and when building the lambda function, for the default execution role, we will select the one we created back when we made the button for the start function. This is the updated code we will use in the lambda function: 
```
import boto3

def lambda_handler(event, context):
    ec2 = boto3.resource('ec2')
    instance_id = 'i-##########' 
    instance = ec2.Instance(instance_id)
    response = instance.stop()
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True,
        },
        'body': str(response)
    }
```
Make sure to deploy the changes and test it out. The output should be:
```
Test Event Name
23

Response
{
  "statusCode": 200,
  "headers": {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  },
  "body": "{'StoppingInstances': [{'CurrentState': {'Code': 64, 'Name': 'stopping'}, 'InstanceId': 'i-################', 'PreviousState': {'Code': 16, 'Name': 'running'}}], 'ResponseMetadata': {'RequestId': '019ee49a-b905-4903-9acf-3abec2f9ea53', 'HTTPStatusCode': 200, 'HTTPHeaders': {'x-amzn-requestid': '019ee49a-b905-4903-9acf-3abec2f9ea53', 'cache-control': 'no-cache, no-store', 'strict-transport-security': 'max-age=31536000; includeSubDomains', 'content-type': 'text/xml;charset=UTF-8', 'content-length': '579', 'date': 'Tue, 01 Aug 2023 21:12:17 GMT', 'server': 'AmazonEC2'}, 'RetryAttempts': 0}}"
}

Function Logs
START RequestId: 50cf827d-d734-4cbc-b00c-3baa8b7efb71 Version: $LATEST
END RequestId: 50cf827d-d734-4cbc-b00c-3baa8b7efb71
REPORT RequestId: 50cf827d-d734-4cbc-b00c-3baa8b7efb71	Duration: 3179.47 ms	Billed Duration: 3180 ms	Memory Size: 128 MB	Max Memory Used: 88 MB	Init Duration: 303.49 ms

Request ID
50cf827d-d734-4cbc-b00c-3baa8b7efb71
```
Now go back to your html file, in the script section, and add this code, and make sure to replace the invoke URL with yours.
```
$("#stop-button").click(function() {
            $.get("https://ixw1yl1i34.execute-api.us-east-2.amazonaws.com/prod2", function(data, status){
                console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                $('#terminal-output').append("Data: " + JSON.stringify(data) + "\nStatus: " + status + "\n");
            });
        });
```
Now that we can start the instance with a button we must set up the machine.
## Setting up the Virtual Machine
Now we are going to use that .ppk file we created when we made the key pair during our creation of the instance. Open PuTTy and you should be in session. You will put your Public IPv4 DNS of the instance in the Host Name box. Then in the navigation pane click on connection, then expand SSH, then expand Auth, and finally click on credentials. Use the file that you created during the instance creation labeled with .ppk. Before you click open, head back over to Session and put a name in the saved sessions box and click save. Now we do not need to repeat this process when accessing the virtual machine in the future. Click open and enter the virtual machine. Now we will set up the virtual machine. 
### Inside the virtual machine
First we will need to install SPADE. Run these commands
```
sudo apt-get update
sudo apt-get -y upgrade

sudo add-apt-repository -y ppa:openjdk-r/ppa
sudo apt-get update

sudo apt-get install -y openjdk-11-jdk

sudo apt-get install -y auditd bison clang cmake curl flex fuse git ifupdown libaudit-dev libfuse-dev linux-headers-`uname -r` lsof pkg-config unzip uthash-dev
git clone https://github.com/ashish-gehani/SPADE.git

cd SPADE
./configure
make
```
Once SPADE is installed we must configure it. We should be in the SPADE directory. Run these commands:
```
cd bin 
nano spade 
```
Now that we are in the configuration file scroll down untill you see these lines:
```
JVMARGS="-server -Xms8G -Xmx16G"
JVMARGSDEBUG="-server -Xms8G -Xmx16G -XX:+UseConcMarkSweepGC"
```
Change them to this to decrease the heap size: 
``` 
JVMARGS="-server -Xms1G -Xmx2G"
JVMARGSDEBUG="-server -Xms1G -Xmx2G -XX:+UseConcMarkSweepGC"
```
Save the file with Ctrl + O and exit with Ctrl + X. Now that SPADE is ready to launch we should test it. Head back to the SPADE directory with `cd ..` and run `./bin/spade start` SPADE should start with a PID. Now we must add our filters and storages and reporters. Run `./bin/spade control` Now that we are in the control we can configure SPADE. We will first add a storage with `add storage JSON output=/tmp/provenance2.json` and we will add a filter to track only the hello-world program with `add filter AddAnnotation position=1 program=hello-world` Finally we will add a reporter with `add reporter Audit` Before we see the data in action we must configure the Linux audit. Run `sudo -i` to run everything as root. First run `nano /etc/audit/rules.d/audit.rules` We will be taken to a file in which we much change the value of `--backlog_wait_time` to 300 instead of the default 600000. Ctrl + O to save this configuration and Ctrl + X to exit. Next run `nano /etc/audit/auditd.conf` Change this value `flush` to `SYNC` and `freq` to 5000. Save and exit the file. Now we can start SPADE. Run `exit` to get out of root. We need to also make the hello-world program so we must run `nano hello-world` and write the code: 
``` 
print('hello, world!')
```
Save the file and exit. Now head over to the SPADE directory `cd SPADE` and start SPADE with `./bin/spade start`. Run `cd ..` and then `python3 hello-world` then `cd SPADE` and then `./bin/spade stop`. Now we should be able to see the provenance created with `nano /tmp/provenance2.json`. Now that SPADE is ready to track hello-world we can move on to the Neo4j database install.
### Installing Neo4j
Head back over to the home directory with `cd` and run these commands:
```
apt install apt-transport-https ca-certificates curl software-properties-common -y

sudo curl -fsSL https://debian.neo4j.com/neotechnology.gpg.key | sudo apt-key add -

sudo add-apt-repository "deb https://debian.neo4j.com stable 4.1"

sudo apt install neo4j -y

sudo systemctl enable neo4j.service

systemctl status neo4j.service

```
Running these commands will install the Neo4j database onto your virtual machine and start it with the status being displayed. We must allow the database to have remote connection to display it on our website and we will do that with these commands:
```
cd 

sudo nano /etc/neo4j/neo4j.conf
```
Now that we are in the configuration file we will change these lines. Remove the # in `dbms.default_listen_address=0.0.0.0`
and remove the # in `dbms.connector.bolt.listen_address=:7687`
Save the changes and exit the file. Restart the Neo4j service to implement the changes `sudo systemctl restart neo4j`
The server will be turned on with our startup script. We must log into the database to set the username and password. We will do this by running `cypher-shell` Set the username and password but make sure to remember them. The default username is neo4j and the default password is neo4j. Once you type in these credentials, neo4j will ask you to choose a new password which you will have to store. Now that we have set up the database we can create the queries to be used to fill up the database. Head back over to the main directory with `cd` and make four files with 
```
nano query1.cql
nano query2.cql
nano query3.cql
nano query4.cql
```
In query1.cql the contents will be:
```
MATCH (n)
DETACH DELETE n;
```
In query2.cql the contents will be:
```
CREATE INDEX index_name FOR (n:Process) ON (n.id);
```
In query3.cql the contents will be:
```
LOAD CSV WITH HEADERS FROM "file:///output.csv" AS row
WITH row
WHERE row.id IS NOT NULL
MERGE (p:Process {id: row.id})
SET p += row;
```
In query4.cql the contents will be: 
```
USING PERIODIC COMMIT 200
LOAD CSV WITH HEADERS FROM "file:///output.csv" AS row
WITH row.id AS id, row.from AS from, row.to AS to, row.type AS type, row.`annot>
WHERE from IS NOT NULL AND to IS NOT NULL
MERGE (f:Process {id: from})
MERGE (t:Process {id: to})
MERGE (f)-[r:RELATIONSHIP {type: type, eventId: event_id, time: time}]->(t);
```
You will save and exit all of these files. Now that the queries are ready, we must import that parser. In the home directory `cd` we will make a new file with `nano parser.py` and fill it with 
```
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
```
Save the file and exit. Now we must set up another server on the instance. 
### Setting up the output log in the backend
Run `cd` and `nano server.js` Fill it with:
```
const fs = require('fs');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');

  let fileStream = fs.createReadStream('/home/ubuntu/output.txt', {encoding: 'utf8'});

  // Send existing file content
  fileStream.on('data', function(chunk) {
    ws.send(chunk);
  });

  // Update the fileStream whenever new data is written to the file
  fs.watch('/home/ubuntu/output.txt', (eventType, filename) => {
    if (eventType === 'change') {
      const newData = fs.readFileSync('/home/ubuntu/output.txt', {encoding: 'utf8'});
      ws.send(newData.slice(fileStream.bytesRead));
      fileStream = fs.createReadStream('/home/ubuntu/output.txt', {encoding: 'utf8', start: fileStream.bytesRead});
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

```
Save the file and exit.
##### We must install the required services for this to run. Run `cd` then 
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
```
Then 
```
sudo npm install chokidar
sudo npm install ws
sudo apt install awscli -y
npm init -y
npm install aws-sdk
```
We must also configure our role. Run `aws configure` and a few prompts will come up with information you can find in the IAM management console. Head over to IAM in the management console and click on users. Create a user and click next, then click the attach polices option and you will want to attach these policies: `AmazonEC2FullAccess` and click next. Then create user, and then click on the user you just created. Click on the security credentials tab and scroll down to access key and click create access key. Click the command line interface option and then next. Then click create access key. Scroll down and you should see the information that the instance is asking for. The default region can also be seen in the instance configuration. Look in the top right and it should be the tab to the left of your username. Click it and it should tell you what region you are. Leave the last prompt blank by clicking enter. Once it is configured we move onto the next step.
Now we want this server which captures the output log of the terminal to start when the instance is booted. This can be achieved. Run `sudo nano /etc/systemd/system/websocket.service` Now paste this into the file 
```
[Unit]
Description=Node.js Server Script

[Service]
ExecStart=/usr/bin/node /home/ubuntu/server.js
Restart=always
User=ubuntu
Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=/home/ubuntu/

[Install]
WantedBy=multi-user.target
```
Save and exit the file. Then run `sudo systemctl daemon-reload` so that the instance sees the new service. Run `sudo systemctl start websocket` to run the service and `sudo systemctl enable websocket` to make sure it runs when the instance boots. Finally run `sudo systemctl status websocket` to ensure it is running. Now that the Node server is running we can switch back to the HTML file and prepare everything.
## Setting up the Website
Head back to your html file and in the script add this 
```
let socket = new WebSocket("ws://INSTANCE.IP.ADDRESS:8080");

        socket.onopen = function(e) {
            console.log("[open] Connection established");
            $('#terminal-output').append("[open] Connection established\n");
        };

        socket.onmessage = function(event) {
            console.log(`[message] Data received from server: ${event.data}`);
            document.getElementById('output').innerText = event.data;
        };
        socket.onmessage = function(event) {
            console.log(`Data received from server: ${event.data}`);
            $('#terminal-output').append(`Data received from server: ${event.data}\n`);
            };

        socket.onclose = function(event) {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                console.log('[close] Connection died');
            }
        };

        socket.onerror = function(error) {
            console.log(`[error] ${error.message}`);
        };
```
Also above your script make sure to actually display the output with:
```
<div id="terminal-output"></div>
<pre id="output"></pre>
```
Now that everything is ready in the instance we can add the Neovis tools. In the script add this 
```
var viz;

        function draw() {
            var config = {
                containerId: "viz",
                neo4j: {
                    serverUrl: "bolt://18.223.165.183:7687",
                    serverUser: "neo4j",
                    serverPassword: "@Andrew07"
                },
                labels:  {
                Activity: {
                    label: "prov_type",
                    [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                        function: {
								title: NeoVis.objectToTitleHtml
							},
						}
                },
                
                Process: {
                    label: "prov_type",
                    [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                        function: {
								title: NeoVis.objectToTitleHtml
							},
						}
                },
                

 
                
            },
            relationships: {
    RELATIONSHIP: {
        label: "RELATIONSHIP",
        [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
                title: NeoVis.objectToTitleHtml
            }
        },
        static: {
            color: "#000000",
            font: {
                background: "none",
                strokeWidth: "0",
                color: "#f9dc73"
            }
        }
    },
},
initialCypher: "MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100"
};

            viz = new NeoVis.default(config);
            viz.render();
            console.log(viz);
        }
```
To display this aswell, add this above the script 
```
<body onload="draw()">
<div id="viz"></div>
```
To add the cypher query option add these parts.

In the same spot as the start and stop buttons: 
```
<textarea rows="4" cols="50" id="cypher"></textarea>
<button id="reload">Submit</button>
<button id="stabilize">Stabilize</button>
```
To make these buttons work add this into the script: 
```
 $("#reload").click(function () {
            var cypher = $("#cypher").val();
            if (cypher.length > 3) {
                viz.renderWithCypher(cypher);
            } else {
                console.log("reload");
                viz.reload();
            }
        });

        $("#stabilize").click(function () {
            viz.stabilize();
        });
```
Now you can add your own configuration and design of the website at the start of your file with `<style>`. If you would like to use mine:
```
<!DOCTYPE html>
<html>
<head>
    <title>Visualization Pipline</title>
    <style type="text/css">
        body {
            font: 16pt Arial;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
        }

        #viz {
            width: 700px;
            height: 400px;
            border: 1px solid blue;
            font: 22pt Arial;
            background-color: rgb(232, 161, 161);
        }

        #terminal-output {
            width: 400px; 
            height: 200px;
            font-size: 12px; 
            word-wrap: break-word; 
            border: 1px solid black;
            overflow-y: auto;
        }

        .control-panel {
            display: flex;
            gap: 10px;
        }
    </style>
```
# Full HTML Code
If at any point the placement of the code seems to not make sense, here is the full HTML code. Remember to replace your invoke URL and your instance IP.
```
<!DOCTYPE html>
<html>
<head>
    <title>Visualization Pipline</title>
    <style type="text/css">
        body {
            font: 16pt Arial;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
        }

        #viz {
            width: 700px;
            height: 400px;
            border: 1px solid blue;
            font: 22pt Arial;
            background-color: rgb(232, 161, 161);
        }

        #terminal-output {
            width: 400px; 
            height: 200px;
            font-size: 12px; 
            word-wrap: break-word; 
            border: 1px solid black;
            overflow-y: auto;
        }

        .control-panel {
            display: flex;
            gap: 10px;
        }
    </style>

    <script type="text/javascript" src="https://unpkg.com/neovis.js@2.0.2"></script>
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"
        integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
        crossorigin="anonymous"></script>
</head>
<body onload="draw()">
    <div class="control-panel">
        <button id="start-button">Start EC2 Instance</button>
        <button id="stop-button">Stop EC2 Instance</button>
        <textarea rows="4" cols="50" id="cypher"></textarea>
        <button id="reload">Submit</button>
        <button id="stabilize">Stabilize</button>
    </div>
    <div id="viz"></div>
    <div id="terminal-output"></div>
    <pre id="output"></pre>

    <script>
        var viz;

        function draw() {
            var config = {
                containerId: "viz",
                neo4j: {
                    serverUrl: "bolt://INSTANCE.IP.ADDRESS:7687",
                    serverUser: "neo4j",
                    serverPassword: "REPLACE-WITH-YOUR-PASSWORD"
                },
                labels:  {
                Activity: {
                    label: "prov_type",
                    [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                        function: {
								title: NeoVis.objectToTitleHtml
							},
						}
                },
                
                Process: {
                    label: "prov_type",
                    [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                        function: {
								title: NeoVis.objectToTitleHtml
							},
						}
                },
                

 
                
            },
            relationships: {
    RELATIONSHIP: {
        label: "RELATIONSHIP",
        [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
            function: {
                title: NeoVis.objectToTitleHtml
            }
        },
        static: {
            color: "#000000",
            font: {
                background: "none",
                strokeWidth: "0",
                color: "#f9dc73"
            }
        }
    },
},
initialCypher: "MATCH (n)-[r]->(m) RETURN n,r,m LIMIT 100"
};

            viz = new NeoVis.default(config);
            viz.render();
            console.log(viz);
        }
        
        $("#start-button").click(function() {
            $.get("YOUR-START-BUTTON-INVOKE-URL", function(data, status){
                console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                $('#terminal-output').append("Data: " + JSON.stringify(data) + "\nStatus: " + status + "\n");
            });
        });

        $("#stop-button").click(function() {
            $.get("YOUR-STOP-BUTTON-INVOKE-URL", function(data, status){
                console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                $('#terminal-output').append("Data: " + JSON.stringify(data) + "\nStatus: " + status + "\n");
            });
        });

        let socket = new WebSocket("ws://INSTANCE-IP-ADDRESS:8080");

        socket.onopen = function(e) {
            console.log("[open] Connection established");
            $('#terminal-output').append("[open] Connection established\n");
        };

        socket.onmessage = function(event) {
            console.log(`[message] Data received from server: ${event.data}`);
            document.getElementById('output').innerText = event.data;
        };
        socket.onmessage = function(event) {
            console.log(`Data received from server: ${event.data}`);
            $('#terminal-output').append(`Data received from server: ${event.data}\n`);
            };

        socket.onclose = function(event) {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                console.log('[close] Connection died');
            }
        };

        socket.onerror = function(error) {
            console.log(`[error] ${error.message}`);
        };

        $("#reload").click(function () {
            var cypher = $("#cypher").val();
            if (cypher.length > 3) {
                viz.renderWithCypher(cypher);
            } else {
                console.log("reload");
                viz.reload();
            }
        });

        $("#stabilize").click(function () {
            viz.stabilize();
        });
    </script>
</body>
</html>
```
Finally we must also create our startup file. Head over to the home directory with `cd` and create a new directory `mkdir scripts` and a new file with `nano startup.sh`. Now that we are in the startup file we can put these commands in it. 
```
#!/bin/bash
# node /home/ubuntu/server.js &

# exec > /home/ubuntu/output.txt 2>&1
> /home/ubuntu/output.txt

# This is a startup script

# Turn on Neo4j
echo "Turning off Neo4j database..." >> /home/ubuntu/output.txt
sudo service neo4j start

echo "deleting past data" >> /home/ubuntu/output.txt
sudo rm -rf /var/lib/neo4j/import/output.csv

# Start SPADE
echo "Starting SPADE..." >> /home/ubuntu/output.txt
sudo /home/ubuntu/SPADE/bin/spade start

sleep 7 >> /home/ubuntu/output.txt

sudo python3 /home/ubuntu/hello-world

sleep 3

# Turn off SPADE
echo "Turning off SPADE..." >> /home/ubuntu/output.txt
sudo /home/ubuntu/SPADE/bin/spade stop
sleep 7 >> /home/ubuntu/output.txt


echo "Waiting a few seconds..." >> /home/ubuntu/output.txt
echo 5 >> /home/ubuntu/output.txt

# Run your parser here.
echo "Running the parser..." >> /home/ubuntu/output.txt
sudo python3 /home/ubuntu/parser.py >> /home/ubuntu/output.txt

# Turn on Neo4j
echo "Turning on Neo4j database...">> /home/ubuntu/output.txt
#sudo service neo4j start

#wait for system to turn on
echo "Waiting 12 seconds..." >> /home/ubuntu/output.txt
sleep 12

#connect to database
# Execute the .cql queries

# execute query1.cql
echo "Executing query1.cql..." >> /home/ubuntu/output.txt
cypher-shell -u neo4j -p @Andrew07 -f /home/ubuntu/query1.cql >> /home/ubuntu/output.txt

# execute query2.cql
echo "Executing query2.cql..." >> /home/ubuntu/output.txt
cypher-shell -u neo4j -p @Andrew07 -f /home/ubuntu/query2.cql >> /home/ubuntu/output.txt

# execute query3.cql
echo "Executing query3.cql..." >> /home/ubuntu/output.txt
cypher-shell -u neo4j -p @Andrew07 -f /home/ubuntu/query3.cql >> /home/ubuntu/output.txt

# execute query4.cql
echo "Executing query4.cql..." >> /home/ubuntu/output.txt
cypher-shell -u neo4j -p @Andrew07 -f /home/ubuntu/query4.cql >> /home/ubuntu/output.txt

echo "Done" >> /home/ubuntu/output.txt
```
Now we must make this a service as well so that it will start on boot. Head over to `sudo nano /etc/systemd/system/startup.service` and enter this information:
```
[Unit]
Description=Startup Script

[Service]
ExecStart=/home/ubuntu/scripts/startup.sh
Restart=on-failure
User=ubuntu
Group=nogroup
Environment=PATH=/usr/bin:/usr/local/bin
WorkingDirectory=/home/ubuntu/scripts/

[Install]
WantedBy=multi-user.target
```
Now save the file and exit. Now we need to give ownership of the startup.sh script to the Ubuntu user and make it executable:
```
sudo chown ubuntu:ubuntu /home/ubuntu/scripts/startup.sh
chmod +x /home/ubuntu/scripts/startup.sh
```
Let systemd know there is a new service:
```
sudo systemctl daemon-reload
```
Enable your service to be run at startup:

```
sudo systemctl enable startup
```
You can start it immediately (without rebooting) with:
```
sudo systemctl start startup
```
To check the status of your service:
```
sudo systemctl status startup
```
Now that our startup is ready, the project should be finished.

