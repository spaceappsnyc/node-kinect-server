var socket, websocket, render, scene, camera, renderer, geometry, material, shape, height, width, previousMouseEvent, leftButtonDown, videoElement;

videoElement = document.querySelector('#video');
width = 640;
height = 480;
//socket = io.connect('http://localhost:9876');

websocket = require('websocket-stream');
socket = new WebSocket('ws://localhost:3000');

// socket.onmessage = function (event) {
//   console.log(event.data);
// };



document.body.onmousemove = function (event) {
    var deltaX, deltaY;
    if (shape && leftButtonDown) {
        previousMouseEvent = previousMouseEvent || event;
        deltaX = event.x - previousMouseEvent.x;
        deltaY = event.y - previousMouseEvent.y;
        shape.rotation.y += deltaX * 0.001;
        shape.rotation.x += deltaY * 0.001;
        previousMouseEvent = event;
    }
};

document.body.onmousewheel = function (event) {
    event.preventDefault();
    if (event.wheelDeltaY) {
        camera.position.z += event.wheelDeltaY > 0 ? 10 : -10;
    }
};

document.body.onmousedown = function (event) {
    leftButtonDown = event.which === 1;
    previousMouseEvent = undefined;
};

document.body.onmouseup = function (event) {
    leftButtonDown = false;
};

render = function (depth) {
  //Variable Instantiations
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
  material = new THREE.MeshBasicMaterial({
      //map : THREE.ImageUtils.loadTexture('video.png'),
      color : 0xff0000,
      wireframe : true,
      transparent: true, 
      opacity: 0.10
  });

  shape = new THREE.Mesh(geometry, material);
  shape.doubleSided = true;
  shape.overdraw = true;

  scene.add(shape);

  shape.rotation.y += 0;

  camera.position.z = 400;
  renderer.setClearColor(0x00000, 1);
  renderer.setSize( window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  (function render () {
  
      renderer.render(scene, camera);
      requestAnimationFrame(render);
  })();
};

render();

// socket.on('frame', function (data) {
//   for (var i = 0; i < geometry.vertices.length; i++) {
//     geometry.vertices[i].z = data.depth[i] * -.25;  
//   };
//   // shape.material.map = THREE.ImageUtils.loadTexture('video.png');
//   // shape.material.needsUpdate = true;
  
//   shape.geometry.verticesNeedUpdate = true;
//   renderer.render(scene, camera);

//   console.log(geometry.vertices.length, data.depth.length);
// });

// socket.on('data', function (buffer) {

//   var count, property, map, i;


//     // for (var i = 0; i < geometry.vertices.length; i++) {
//     //   geometry.vertices[i].z = map[i] * -.25;  
//     // };

//     //shape.geometry.verticesNeedUpdate = true;

//     map =[];

//     depth = new Uint8Array(buffer);

//     for (i = 0; i <= depth.length; i = i + 2) {
//       map.push(parseInt((depth[i] | depth[i + 1] << 8), 10));
//       geometry.vertices[i].z = map[i] * -.25;
//     }

//     for (var i = 0; i < geometry.vertices.length; i++) {
//       geometry.vertices[i].z = map[i] * -.25;  
//     };


//     shape.geometry.verticesNeedUpdate = true;

//     // map = [];

//     // for (i = 0; i <= buffer.length; i = i + 2) {
//     //   map.push(parseInt((buffer[i] | buffer[i + 1] << 8), 10));
//     // }

   

//   //renderer.render(scene, camera);

//   //var depth, video, frame;
//   // frame = data.split('|');
//   // video = frame[0];
//   // depth = frame[1];

//   // if(video){
//   //   videoElement.setAttribute('src', 'data:image/png;base64, ' + video);
//   // }
// });

socket.onmessage = function (event) {

    var depth, video, frame;
    // frame = event.data.split('|');
    // video = frame[0];
    // depth = frame[1];

    // console.log(frame.length, video.length, depth.length);
    depth = event.data.split(',');

    // map = [];

    // for (i = 0; i <= buffer.length; i = i + 2) {
    //   map.push(parseInt((buffer[i] | buffer[i + 1] << 8), 10));
    // }

    for (var i = 0; i < geometry.vertices.length; i++) {
      geometry.vertices[i].z = depth[i] * -.25;  
    };

    shape.geometry.verticesNeedUpdate = true;

  //renderer.render(scene, camera);

  
  // if(video){
  //   videoElement.setAttribute('src', 'data:image/png;base64, ' + video);
  // }
};

// socket.on('end', function(){
//   console.log("stream ended");
//   socket.close();
// });