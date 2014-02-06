var server = require('http').createServer(handler).listen(3000);
var WebSocketServer = require('ws').Server
var websocket = require('websocket-stream')
var wss = new WebSocketServer({server: someHTTPServer})
wss.on('connection', function(ws) {
  var stream = websocket(ws)
  fs.createReadStream('bigdata.json').pipe(stream)
})