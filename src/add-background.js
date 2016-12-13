import THREE from 'three'

var glslify = require('glslify')

export default function(app) {
  let tex = new THREE.Texture(video);
	tex.needsUpdate = true;
  // tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
	tex.magFilter = THREE.LinearFilter;
	tex.format = THREE.RGBFormat;

  const resolution = new THREE.Vector2(app.width, app.height)
  const mat = new THREE.ShaderMaterial({
    vertexShader: glslify('./shaders/bg.vert'),
    fragmentShader: glslify('./shaders/bg.frag'),
    uniforms: {
      iResolution: { type: 'v2', value: resolution },
      iGlobalTime: { type: 'f', value: 0 },
      texture: {type: 't', value: tex}
    },
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide
  })
  const geom = new THREE.PlaneBufferGeometry(app.width, app.height)

  const mesh = new THREE.Mesh(geom, mat)
  console.log(mesh);
  app.scene.add(mesh);
  app.on('tick', dt => {
    tex.needsUpdate = true;
    // console.log(audio.analyser.waveform());
    mat.uniforms.iGlobalTime.value += dt/1000
    mat.uniforms.texture.value = tex;
    mesh.position.z = 100 +(Math.sin(mat.uniforms.iGlobalTime.value) * 500.0);
    mesh.position.x = 100 +(Math.cos(mat.uniforms.iGlobalTime.value) * 500.0);
    mesh.position.y = 100 +(Math.cos(mat.uniforms.iGlobalTime.value) * 500.0);

    app.camera.position.z = 2100 +(Math.cos(mat.uniforms.iGlobalTime.value) * 100.0);
  })

  app.on('resize', ({ width, height }) => {
    resolution.set(width, height)
  })
}
