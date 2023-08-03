const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const url = require('url');

// Function to update status
function updateStatus() {
    const status = "Application status: OK\nUpdated at: " + new Date();
    fs.writeFile('/home/ubuntu/status.txt', status, err => {
        if (err) {
            console.log('Error writing to status file', err);
        } else {
            console.log('Successfully wrote to status file');
        }
    });
}

// Update status every 2 seconds
setInterval(updateStatus, 2000);

// Websocket Server
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

// HTTP Server for Status
http.createServer(function (req, res) {
  if (url.parse(req.url, true).pathname === '/status') {
    fs.readFile('/home/ubuntu/status.txt', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'});
      res.write(data);
      res.end();
    });
  }
}).listen(8081);

