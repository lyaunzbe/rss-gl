const glslify = require('glslify');

let loadTexture = require('./src/load-texture');
const OrbitControls = require('three-orbit-controls')(THREE);

var capturer = new CCapture( { format: 'webm',
    framerate: 60,
    verbose: true} );

let canvas;

var texloader = new THREE.TextureLoader();
let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
renderer.autoClear = true;

renderer.autoClearDepth = true;
renderer.autoClearColor = false;
renderer.autoClearSencil = true;
let camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000);
let start;
let time = 0;

let m1,m2,m3;

let currentTime = Date.now();
// let controls = new OrbitControls(camera);
// controls.enabled = true;
var light;

let unMappedMouseX, unMappedMouseY, mouseX, mouseY;

// let capturer = new CCapture( { framerate: 60, format: 'webm' , quality: 100} );



renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xC774E8, 1.0);

document.body.appendChild( renderer.domElement );
window.addEventListener('resize', resize, false);

document.addEventListener('mousemove', onDocumentMouseMove, false );
document.addEventListener('keydown', onKey, false );

let grate;
let bg;
let mainTex;
texloader.load('UV_Grid_Sm.jpg', function (tex){
  console.log('tex done');
  mainTex = tex;
  mainTex.needsUpdate = true;
  init();
})
// setInterval(function(){
//   renderer.autoClearColor = true;
//   setTimeout(function(){
//     renderer.autoClearColor = false;
//
//   }, 500);
//
// }, 500);
function init() {
  var loader = new THREE.OBJLoader();
  // loadTexture('tex3.jpg').then(function(tex3){
  //
  //   console.log('YO')

  loader.load('sculptA.obj', function(obj){
    let geo = obj;
    var ambient = new THREE.AmbientLight( 0x101030 );
          scene.add( ambient );

          light = new THREE.PointLight( 0xFFFFFF , 2, 10 );
          light.position.set( -1, -1, -1 );
          scene.add( light );


    let mat =  new THREE.ShaderMaterial({
      uniforms:
      // uniforms: THREE.UniformsUtils.merge([
      //   THREE.UniformsLib['lights'],
        {
        "texture" : {type:"t", value: mainTex},
        "time": { type: "f", value: 0.0 },
        "resolution"  : { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        "mouse"  : { type: "v2", value: new THREE.Vector2(window.innerWidth/2, (window.innerHeight/2))}
      },
    // ]),
      // lights: true,

      vertexShader: glslify('./src/shaders/toolbelt/base.vert'),
      fragmentShader: glslify('./src/shaders/main.frag')
		});
    obj.traverse( function ( child ) {

        if ( child instanceof THREE.Mesh ) {

          child.material = mat;

        }

      } );


    grate = obj;
    console.log(grate)
    // grate.scale.set(2.05,2.05,2.05)
    grate.scale.x = 0.01;
    grate.scale.y = 0.01;
    grate.scale.z = 0.01;

    grate.rotation.x = Math.PI/2;
    grate.rotation.y = Math.PI/2;
//     var light = new THREE.AmbientLight( 0x404040 );
//     scene.add( light );

    // grate.position.x += 3.0;
    var box = new THREE.Box3().setFromObject( grate );
    box.center( grate.position ); // this re-sets the mesh position
    grate.position.multiplyScalar( - 1 );
    var pivot = new THREE.Group();
    scene.add( pivot );
    pivot.add( grate );


    //geometry
    let gmaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: true
    });
    let g1 = new THREE.OctahedronGeometry(10,1);
    m1 = new THREE.Mesh(g1, gmaterial);
    scene.add(m1);


    let g2 = new THREE.OctahedronGeometry(6,0);
    m2 = new THREE.Mesh(g2, gmaterial);
    scene.add(m2);


    // scene.add(grate);
    // camera.position.z = 15;

    camera.rotation.x = 1.0644435063405207;
    camera.rotation.y = 0.0027068520889566273;
    camera.rotation.z = -0.004880858970287054;

    camera.position.x = -0.0584695225576675;
    camera.position.y = -11.07897992673286
    camera.position.z = 5.5317195082480115;
    var texture = new THREE.Texture( generateTexture() );
    texture.needsUpdate = true; // important!
    bg = new THREE.Mesh(new THREE.PlaneGeometry(250, 250, 1, 1), new THREE.MeshBasicMaterial({ map: texture, opacity: 0.01, transparent: true}));
    bg.position.z = -80;
    bg.rotation.x = 1
    scene.add(bg);
    // var axisHelper = new THREE.AxisHelper( 5 );
    // scene.add( axisHelper );

    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // var cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );
    render();
        });
        // })

}


function resize() {
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
  unMappedMouseX = event.clientX;
  unMappedMouseY = event.clientY;
  mouseX = map(unMappedMouseX, 0, window.innerWidth, -1.0,1.0);
  mouseY = map(unMappedMouseY, 0, window.innerHeight, -1.0,1.0);

}

function onKey(event) {
  if (event.keyCode === 77) {
    console.log(camera.rotation);
    console.log(camera.position);
  }


  if (event.keyCode == "82") {
      capturer.start();
    }
  if (event.keyCode == "84") {
      capturer.stop();
      capturer.save();
  }
}
function render(){
  time+=0.01;
  console.log(6*Math.abs(mouseX));
  grate.children[0].material.uniforms.time.value = time;
  grate.children[0].material.uniforms.mouse.value =  new THREE.Vector2(mouseX, mouseY);
  let x;
  if(mouseX) {
    x = mouseX
  } else {
    x = 0;
  }
  grate.rotation.y += 0.1/(6*Math.max(Math.abs(x), 0.2));
  bg.material.opacity = 0.05;
  m1.rotation.y -= 0.1/(10.0*Math.max(Math.abs(x), 0.2));
  m2.rotation.z -= 0.1/(10.0*Math.max(Math.abs(x), 0.2));
  m2.position.y = -2 ;


  camera.updateProjectionMatrix();
  if (mouseX && mouseY){
    camera.fov = Math.max(35, Math.abs(mouseX*mouseY)*100.0);

  }

  camera.position.x = 0.0 + Math.sin(time)*0.01;

  renderer.render(scene, camera);
  requestAnimationFrame( render );
}


function map(value, leftMin, leftMax, rightMin, rightMax) {
  let leftSpan = leftMax - leftMin;
  let rightSpan = rightMax - rightMin;
  let valueScaled = parseFloat(value - leftMin) / parseFloat(leftSpan);
  return rightMin + (valueScaled * rightSpan);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
    let highlightedNumber = Math.random() * parseFloat(max - min) + parseFloat(min);
    return highlightedNumber;
};

function generateTexture() {

	var size = 512;

	// create canvas
	canvas = document.createElement( 'canvas' );
	canvas.width = size;
	canvas.height = size;

	// get context
	var context = canvas.getContext( '2d' );

	// draw gradient
	context.rect( 0, 0, size, size );
	var gradient = context.createLinearGradient( 0, 0, size, size );
	gradient.addColorStop(0, '#FF00FF'); // light blue
	gradient.addColorStop(1, '#00FFFF'); // dark blue
	context.fillStyle = gradient;
	context.fill();

	return canvas;

}
