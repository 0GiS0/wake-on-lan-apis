const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    app = express(),
    httpServer = require('http').Server(app),
    find = require('local-devices'),
    wol = require('wol');

httpServer.listen(9090, function() {
    console.log('listening on *:9090');
});

// const corsOptions = {
//     origin: 'http://localhost:3000'
// };

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(cors(corsOptions));
app.use(cors());

app.get('/devices', function(req, res) {

    find().then(function(devices) {
        console.dir(devices);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(devices));
    });
});

app.post('/check-if-it-is-awake', function(req, res) {
    find().then(function(devices) {
        let result = devices.filter(device => device.mac == req.body.mac);
        console.log(result);
        if (result.length > 0)
            res.send(true);
        else
            res.send(false);
    });
});

app.post('/wakeup', function(req, res) {
    console.log(req.body);
    wol.wake(req.body.mac, function(error, result) {
        if (error) {
            res.send(JSON.stringify({ error: error }));
        }
        console.log('wok.wake resutl: ' + result);
        res.send(result);
    });
});