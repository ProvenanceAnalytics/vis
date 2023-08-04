const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const exec = require('child_process').exec;
const path = require('path');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(cors());

app.use(fileUpload());

app.post('/upload', function(req, res) {
    try {
        if (!req.files) {
            return res.status(500).send({ msg: "file is not found" });
        }
        const myFile = req.files.userScript;
        const filename = myFile.name;
        const filepath = path.join(__dirname, 'uploads', filename);

        myFile.mv(filepath, function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send({ msg: "Error occurred" });
            }

            // Command for starting SPADE
            const startSpadeCmd = 'sudo /home/ubuntu/SPADE/bin/spade start';

	    
            const removeFilterCmd = 'echo "remove filter 1" | nc localhost 19999';

            // Command for adding filter with the program name
            const addFilterCmd = `echo "add filter AddAnnotation position=1 program=${filename}" | nc localhost 19999`;

            // Command for running the program (assumed to be a shell command)
            const runProgramCmd =  `python3 ${filepath}`;

            // Command for stopping SPADE
            const stopSpadeCmd = 'sudo /home/ubuntu/SPADE/bin/spade stop';

            // Command for parsing the logs
            const parseCmd = 'sudo python3 /home/ubuntu/parser.py';

            // Commands for executing queries
            const queryCmds = [
                'cypher-shell -u neo4j -p @Andrew07 -f /home/ubuntu/query1.cql',
                'cypher-shell -u neo4j -p @Andrew07 -f /home/ubuntu/query2.cql',
                'cypher-shell -u neo4j -p @Andrew07 -f /home/ubuntu/query3.cql',
                'cypher-shell -u neo4j -p @Andrew07 -f /home/ubuntu/query4.cql'
            ];

            const commands = [startSpadeCmd, removeFilterCmd, addFilterCmd, runProgramCmd, stopSpadeCmd, parseCmd, ...queryCmds];

            executeCommands(commands, 0);

            return res.send({name: myFile.name, path: `/${myFile.name}`});
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "An error occurred during the upload." });
    }
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});

function executeCommands(commands, index) {
    if (index >= commands.length) {
        console.log('Finished executing commands.');
        return;
    }
    console.log(`Executing command: ${commands[index]}`);
    exec(commands[index], (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
        }
        if (stdout) {
            console.log(`Command stdout: ${stdout}`);
        }
        if (stderr) {
            console.error(`Command stderr: ${stderr}`);
        }
        executeCommands(commands, index + 1);
    });
}

