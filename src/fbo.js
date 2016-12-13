import THREE from 'three'
var glslify = require('glslify')

class fboObject {
  constructor (shader) {
    this.shader = shader;
    this.objectScene = new THREE.Scene();

    this.rt = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
      });

    this.mat = new THREE.ShaderMaterial({
      uniforms: this.shader.uniforms,
      vertexShader: this.shader.vertexShader,
      fragmentShader: this.shader.fragmentShader
    });
    this.geo = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.mesh.position.set(0, 0, 0);

    this.objectScene.add(this.mesh);
  }

  render(renderer, camera){
    renderer.render(this.objectScene, camera, this.rt, true);
  }
}


export default class fboMat{
  constructor (renderer, scene, camera, texture, shaders) {
    this.renderer = renderer;
    this.matScene = scene;
    this.camera = camera;
    this.tex = texture;

    this.tex.minFilter = THREE.LinearFilter;
    this.tex.magFilter = THREE.LinearFilter;

    shaders.forEach(function (shader, index) {
      this['shader'+ (index+1)] = shader;
    }.bind(this));

    this.mesh;
    this.fboCollection = [];

    this.init();
  }

  init () {
    this.fboCollection = this.packFBOs();
    this.fboCollection.forEach(function (fbo, i) {
      fbo.mat.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    })

    this.fboA.mat.uniforms.texture.value = this.fboDiff.rt;

    this.mainMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: this.shader6.uniforms,
      vertexShader: this.shader6.vertexShader,
      fragmentShader: this.shader6.fragmentShader,
      side: 2
    });

    this.mainMat.uniforms["texture"].value = this.fboC.rt;
    this.mainMat.uniforms["texture"].minFilter = this.mainMat.uniforms["texture"].magFilter = THREE.LinearFilter;
    this.mainMat.uniforms["resolution"].value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    this.mainMat.uniforms["mouse"].value = new THREE.Vector2(window.innerWidth, 0);

    this.mainGeo = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 0);
    this.mainMesh = new THREE.Mesh(this.mainGeo, this.mainMat);
    this.mainMesh.position.set(0,0,0);
    this.matScene.add(this.mainMesh);
    console.log(this)
  }

  packFBOs(shaders) {
    this.fboA = new fboObject(this.shader1);
    this.fboA.mat.uniforms.texture.value = this.tex;

    this.fboB = new fboObject(this.shader2);
    this.fboB.mat.uniforms.texture.value = this.fboA.rt;

    this.fboDiff = new fboObject(this.shader3);
    this.fboDiff.mat.uniforms.texture.value = this.fboA.rt;
    this.fboDiff.mat.uniforms.texture2.value = this.fboB.rt;
    this.fboDiff.mat.uniforms.texture3.value = this.tex;

    this.fboC = new fboObject(this.shader4);
    this.fboC.mat.uniforms.texture.value = this.fboDiff.rt;

    this.fboD = new fboObject(this.shader5);
    this.fboD.mat.uniforms.texture.value = this.fboC.rt;

    return [this.fboA, this.fboB, this.fboDiff, this.fboC, this.fboD];
  }

  resize() {
    this.fboCollection.forEach(function (fbo) {
      fbo.mat.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
    });
  }

  update() {
    this.fboB.render(this.renderer, this.camera);
    this.fboDiff.render(this.renderer, this.camera);
    this.fboC.render(this.renderer, this.camera);
    this.fboD.render(this.renderer, this.camera);
  }
  expand(scl) {
    this.fboDiff.mesh.scale.set(scl,scl,scl);
  }
  newFrame() {
    this.fboA.render(this.renderer, this.camera);
  }
  swap(){
    var swap = this.fboC.rt;
    this.fboC.rt = this.fboA.rt;
    this.fboA.rt = swap;
  }
}
