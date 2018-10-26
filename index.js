var express = require("express");
var app = express();
var sse = require("./middleware/sse");
var bodyParser = require("body-parser");

var connections = [];
// this is mimicking what would normally be a message broker like Redis
var votes = { yes: 0, no: 0 };
var clearIntervalId = null;

app.use(express.static("www"));
app.use(sse);
app.use(bodyParser.json()); // for parsing application/json

app.get("/", function(req, res) {
  res.sendFile("index.html");
});

app.get("/vote", function(req, res) {
  if (req.query.yes === "true") {
    votes.yes++;
  } else {
    votes.no++;
  }
  _sendToAllConnections(res, votes);
});

app.post("/multimessage", function(req, res) {
  console.log(req.body);

  _sendToAllConnections(res, req.body);
});

app.post("/event", function(req, res) {
  console.log(req.body);

  // the event as it is, is being defined by the client, we can control that in the backend
  if (req.body.event) {
    for (var i = 0; i < connections.length; i++) {
      connections[i].sseSendEvent(req.body.event, req.body.data);
    }
  }

  res.sendStatus(200);
});

// Hook in for the /stream
app.get("/stream", function(req, res) {
  res.sseSetup();
  // sent the current values to a newly connected client
  res.sseSend(votes);
  res.sseSendEvent('myEvent', 'initial connection test event data');

  clearIntervalId = setInterval(function() {
    res.sseHeartbeat();
  }, 30000);

  connections.push(res);
});

app.listen(3000, function() {
  console.log("Listening on port 3000...");
});

function _sendToAllConnections(res, data) {
  if (data) {
    for (var i = 0; i < connections.length; i++) {
      connections[i].sseSend(data);
    }
  }

  res.sendStatus(200);
}
