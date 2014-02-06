var
  //packages
  kinect, fs, __, io, connect, http, Png, BufferStream, WebSocketServer, websocket, wss,

  //functions
  readFile, startServer, listenFrame, saveFrame,

  //local variables  
  context, depth, logged, stream, frameStream, testData, port, server, fps, frameCount, videoFrameCount, depthFrameCount, mapstring, imagestring;

//Package Instantiations
//var app = require('http').createServer(handler).listen(3000);
__ = require('underscore');
fs = require('fs');
kinect = require('kinect');

connect = require('connect');
server = require('http').createServer(connect().use(connect.static(__dirname))).listen(3000);
//io = require('socket.io').listen(server);
//server = require('http').createServer(handler).listen(3000);

Png = require('png').Png;
BufferStream = require('bufferstream');
WebSocketServer = require('ws').Server
websocket = require('websocket-stream');
wss = new WebSocketServer({server: server});

frameStream = new BufferStream();

function handler (req, res) {
  if(req.url === "/"){
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
          if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
          }
          res.writeHead(200);
          res.end(data);
        });
  }
  else{
    fs.readFile(__dirname + req.url, function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading ' +req.url);
      }
      res.writeHead(200);
      res.end(data);
    });
  }
}
// wss.on('open', function () {
//   console.log('foo');
// });
//io.set('log level', 0);

//set frames per second
fps = 2;
frameCount = 0;
videoFrameCount = 0;
depthFrameCount = 0;


//Function Instantiations
readFile = function () {
  testData = fs.readFileSync('data.txt', {encoding : 'utf8'}).split(',');
};

//readFile();

saveFrame = function (path, data) {
  fs.writeFile(path, data, function (error) {
    if (error) {
      console.log(error);
    } else {
      console.log(path + 'has been saved!');
    }
  });
}



listenFrame = function (socket) {
  if(!context){
    context = kinect();
  }
  context.start('depth');
  //context.start('video');
  //context.led("yellow");
  console.log('Listening for frames.');
  context.resume();

  setInterval(function(){
  if(mapstring) {
    socket.send(mapstring);
  }
},250);

  context.on('depth', function (buffer) {
    var count, property, map, i;

    //frameStream.write(buffer);

    map = [];

    depthFrameCount++;

    for (i = 0; i <= buffer.length; i = i + 2) {
      map.push(parseInt((buffer[i] | buffer[i + 1] << 8), 10));
    }

    mapstring = map.toString();
    //socket.send(map, {binary:true});
    //socket.send(mapstring);
    //frameStream.write(mapstring);

    // depth = map;
    // //socket.send({name : 'frame', data : 1});
    // //socket.emit('frame', { depth: map });

    // if (!logged) {
    //   logged = true;
    //   console.log(map);
    //   console.log(map.length);

    //   saveFrame('depth.txt', map);
    // }

  });

  context.on('video', function (buffer) {
    var image, png;
    videoFrameCount++;
    video = buffer;



    //if(socket){
      //console.log('video', videoFrameCount);
      png = new Png(video, 640, 480, 'rgb');
      image = png.encodeSync();

      imagestring = image.toString('binary');
      //socket.emit('video', image.toString('base64'));
      //socket.emit('video', {frameCount : videoFrameCount, data : image.toString('base64')});
      //socket.send({name : 'frame', data : image.toString('base64')}, {binary: true});
      //socket.send(image.toString('base64') + '|' + 'depth.toString()');
      //frameStream.write(image.toString('base64') + '|' + 'depth.toString()');
      //frameStream.write('foo');
      //fs.writeFileSync('./video.png', image.toString('binary'), 'binary');
    //}


  });
}

wss.on('connection', function(ws) {
  
  var stream = websocket(ws);
  frameStream.pipe(stream);
  console.log("connection made");
  ws.on('close', function() {
    if(context){
      context.pause();
    }
    //stream.writable=false;
    console.log('closed socket');
  });
  listenFrame(ws);

});

// io.sockets.on('connection', function (socket) {

//   listenFrame(socket);
//   console.log('connected');

//   // setInterval(function () {

//   //   frameCount++;

//   //   if (video) {
//   //     png = new Png(video, 640, 480, 'rgb');
//   //     image = png.encodeSync();
//   //     fs.writeFileSync('video.png', image.toString('binary'), 'binary');
//   //   }

//   //   console.log('frame ' + frameCount);
//   //   socket.emit('frame', { depth : depth});

//   // }, 1000 / fps);
// });

