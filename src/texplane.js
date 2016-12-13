import THREE from 'three'
var glslify = require('glslify')


export default class texPlane {
  constructor(scene, camera, texture, texture2, speed, size) {
    this.scene = scene;
	  this.camera = camera;
	  this.texture = texture;
	  this.speed = speed;
    this.size = size;
    this.position;
    this.geometry = new THREE.PlaneBufferGeometry(this.size.x, this.size.y, 100, 100);

		this.material = new THREE.ShaderMaterial({
      uniforms: {
        "textureA":{ type: "t", value: texture },
        "textureB":{ type: "t", value: texture2 },
        "time": { type: "f", value: 0.0 },
        "resolution"  : { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
        "mouse"  : { type: "v2", value: new THREE.Vector2(window.innerWidth/2, (window.innerHeight/2) - 800)},
        "level"  : { type: "f", value: 1.5 },
        "lightWidth"  : { type: "f", value: 0.55 },
				"lightBrightness"  : { type: "f", value: 0.25 }
      },
      side: THREE.DoubleSide,
      vertexShader: glslify('./shaders/main.vert'),
      fragmentShader: glslify('./shaders/fakenormalmap.frag')
		})
		this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.setPosition({x:0, y:0, z:0});
  }

  update(position, rotation) {
    if (position) {
      this.setPosition(new THREE.Vector3(
        this.mesh.position.x + position.x,
        this.mesh.position.y + position.y,
        this.mesh.position.z + position.z ));
    }
    if (rotation) {
      this.setRotation(new THREE.Vector3(
        this.mesh.rotation.x + rotation.x,
        this.mesh.rotation.y + rotation.y,
        this.mesh.rotation.z + rotation.z ));
    }
  }

  setPosition (position) {
    this.position = position;
    this.mesh.position.x = position.x;
    this.mesh.position.y = position.y;
    this.mesh.position.z = position.z;
  }

  setRotation (rotation) {
    this.mesh.rotation.x = rotation.x;
    this.mesh.rotation.y = rotation.y;
    this.mesh.rotation.z = rotation.z;
  }
}
