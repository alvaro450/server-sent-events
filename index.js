var express = require('express');
var app = express();
var sse = require('./middleware/sse')

var connections = [];
var votes = {yes: 0, no: 0};

app.use(express.static('www'));
app.use(sse);

app.get('/', function(req, res) {
    res.sendFile('index.html');
})

app.get('/vote', function(req, res) {
  if (req.query.yes === "true") votes.yes++
  else votes.no++

  for(var i = 0; i < connections.length; i++) {
    connections[i].sseSend(votes)
  }

  res.sendStatus(200)
})

// Hook in for the /stream
app.get('/stream', function(req, res) {
  res.sseSetup()
  res.sseSend(votes)
  connections.push(res)
})

app.listen(3000, function() {
  console.log('Listening on port 3000...')
})