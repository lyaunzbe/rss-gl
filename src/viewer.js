import THREE from 'three'
import loop from 'raf-loop'

import assign from 'object-assign'
import domready from 'domready'
import fitter from 'canvas-fit'

import FboMaterial from './fbo'
import Toolbelt from './shaders/toolbelt/index'
import loadVideo from './load-video'

var glslify = require('glslify')

const OrbitControls = require('three-orbit-controls')(THREE)

export default function(opt, canvasTexture) {

  let container = document.getElementById("container");

  let mouse = new THREE.Vector2();
  let mouseX, mouseY, unMappedMouseX, unMappedMouseY;
  opt = assign({}, opt)
  let time = 0;
  let vidTex;
  const dpr = Math.min(2, window.devicePixelRatio)
  const canvas = opt.canvas || document.createElement('canvas')
  const fit = fitter(canvas, window, dpr)
  let smoothedLevel = 0;

  const renderer = new THREE.WebGLRenderer(assign({
    canvas: canvas
  }, opt));
  const gl = renderer.getContext();

  container.appendChild(canvas);
  loadVideo('ye.mp4').then(function(vid){
      vidTex= new THREE.Texture( vid );
      vidTex.minFilter = THREE.LinearFilter;
      vidTex.magFilter = THREE.LinearFilter;
      vidTex.format = THREE.RGBFormat;
      vidTex.mapping = THREE.SphericalReflectionMapping;
  })

  let fbScene, fbCamera, fbRenderer, fbShaders, fbMaterial;

  let sceneRTT, cameraRTT, rtTexture, materialRTT;

  cameraRTT = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
  sceneRTT = new THREE.Scene();

  rtTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );
  materialRTT = new THREE.ShaderMaterial( {
  	uniforms: { "time": { type: "f", value: 0.0 },   "resolution"  : { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) } ,"texture":{ type: "t", value: vidTex }},
  	vertexShader: glslify('./shaders/main.vert'),
  	fragmentShader: glslify('./shaders/main.frag')
	});
  // console.log(materialRTT.uniforms.resolution.value);
  let plane = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight );

	let quad = new THREE.Mesh( plane, materialRTT );
	quad.position.z = -100;
	sceneRTT.add( quad );

  // let fboTex = new THREE.Texture(canvasTexture.canvas);
  // fboTex.needsUpdate = true;


  const app = loop(draw);


  // app.render = renderer.render.bind(renderer, scene, camera)

  //render each frame unless user wants to do it manually
  // if (opt.rendering !== false)
  //   app.on('render', app.render.bind(app))

  assign(app, {
    renderer,
    gl,
    canvas
  })

  window.addEventListener('resize', resize, false)
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  renderer.setClearColor(0xffffff, 1)

  process.nextTick(resize)
  fboInit();
  let noise = snoise();
  // noise.setAmplitude(5.0);
  // noise.setScale(2.0)

  return app

  function fboInit() {
    fbScene = new THREE.Scene();
    fbCamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
    fbCamera.position.set(0,0,0);

    fbRenderer = renderer;
    fbRenderer.setClearColor(0xffffff, 1.0);
    fbRenderer.setSize(window.innerWidth, window.innerHeight);
    // container.appendChild(fbRenderer.domElement);

    fbScene = new THREE.Scene();


    var toolbeltShaders = new Toolbelt();
    var toolbeltShadersB = new Toolbelt();
    fbShaders = [
        toolbeltShaders.emboss,
        toolbeltShaders.oil,
        toolbeltShaders.diff,
        toolbeltShadersB.emboss,
        toolbeltShadersB.oil,
        toolbeltShaders.emboss
    ];

    fbMaterial = new FboMaterial(fbRenderer, fbScene, fbCamera, rtTexture, fbShaders);
    fbMaterial.init();
  }

  function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
  }

  function onDocumentMouseMove( event ) {

  	mouse.x = ( event.clientX - window.innerWidth / 2 ) * 8;
  	mouse.y = ( event.clientY - window.innerHeight / 2 ) * 8;

      unMappedMouseX = (event.clientX );
      unMappedMouseY = (event.clientY );
      mouseX = map(unMappedMouseX, window.innerWidth, -1.0,1.0);
      mouseY = map(unMappedMouseY, window.innerHeight, -1.0,1.0);

      // console.log(fbMaterial);

      // for(var i = 0; i < fbMaterial.fbos.length; i++){
      //   // fbMaterial.material.uniforms.mouse.value = new THREE.Vector2(window.innerWidth, 0);
      // }
      // fbMaterial.fboCollection.forEach(function (fbo) {
        // fbo.mat.uniforms.mouse.value = new THREE.Vector2(mouseX, mouseY);

        // fbo.mat.uniforms.mouse.value = new THREE.Vector2(mouseX, mouseY);
      // });


  }
  function fboDraw () {
    time+=0.01;
    // for(var i = 0; i < fbMaterial.fbos.length; i++){
    //
    // }
    materialRTT.uniforms.time.value = time;
    smoothedLevel += (1 - smoothedLevel) *0.075;
    // materialRTT.uniforms.level.value = smoothedLevel;
    fbMaterial.fboCollection.forEach(function (fbo) {
      fbo.mat.uniforms.time.value = time;
      // console.log(noise.getVal(time));
      // fbo.mat.uniforms.mouse.value = new THREE.Vector2();
      // fbo.mat.uniforms.mouse.value = new THREE.Vector2(Math.sin(time/100.0), Math.sin(time/100.0));

      fbo.mat.uniforms.mouse.value = new THREE.Vector2(mouseX/10.0, mouseY/10.0);
      // fbMaterial.fbos[i].material.uniforms.mouse.value = new THREE.Vector2(0.0,0.0);
      // fbo.mat.uniforms.mouse.value = new THREE.Vector2(window.innerWidth, 0);

    });

    renderer.render( sceneRTT, cameraRTT, rtTexture, true );

    // fboTex.needsUpdate = true;

    fbMaterial.update();
    // fbMaterial.expand(1.002);
    fbRenderer.render(fbScene, fbCamera);

    fbMaterial.newFrame();
    fbMaterial.swap();
  }
  function draw () {
    vidTex.needsUpdate = true;
    app.emit('render')
    // canvasTexture.update();
    fboDraw();
  }

  function resize() {
    fit()
    const width = window.innerWidth
    const height = window.innerHeight
    const size = { width, height }

    fbRenderer.setSize(width, height)
    fbCamera.aspect = width / height
    fbCamera.updateProjectionMatrix()
  }


}
var snoise = function() {
    var MAX_VERTICES = 256;
    var MAX_VERTICES_MASK = MAX_VERTICES -1;
    var amplitude = 1;
    var scale = 1;

    var r = [];

    for ( var i = 0; i < MAX_VERTICES; ++i ) {
        r.push(Math.random());
    }

    var getVal = function( x ){
        var scaledX = x * scale;
        var xFloor = Math.floor(scaledX);
        var t = scaledX - xFloor;
        var tRemapSmoothstep = t * t * ( 3 - 2 * t );

        /// Modulo using &
        var xMin = xFloor & MAX_VERTICES_MASK;
        var xMax = ( xMin + 1 ) & MAX_VERTICES_MASK;

        var y = lerp( r[ xMin ], r[ xMax ], tRemapSmoothstep );

        return y * amplitude;
    };

    /**
    * Linear interpolation function.
    * @param a The lower integer value
    * @param b The upper integer value
    * @param t The value between the two
    * @returns {number}
    */
    var lerp = function(a, b, t ) {
        return a * ( 1 - t ) + b * t;
    };

    // return the API
    return {
        getVal: getVal,
        setAmplitude: function(newAmplitude) {
            amplitude = newAmplitude;
        },
        setScale: function(newScale) {
            scale = newScale;
        }
    };
};
