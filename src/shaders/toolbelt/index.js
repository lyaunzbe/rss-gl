import THREE from 'three'
var glslify = require('glslify')

export default function(){
  this.bump = {
    uniforms: THREE.UniformsUtils.merge( [
			{
        "texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"lightWidth"  : { type: "f", value: 3.5 },
				"lightBrightness"  : { type: "f", value: 1.0 }
			}
		]),
    vertexShader: glslify('./base.vert'),
    fragmentShader: glslify('./bump.frag')
  }
  this.pass = {
    uniforms: THREE.UniformsUtils.merge( [
			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }
			}
		]),
    vertexShader: glslify('./base.vert'),
    fragmentShader: glslify('./pass.frag')
  }
  this.colorize = {
    uniforms: THREE.UniformsUtils.merge( [
			{
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null }
			}
		]),
    vertexShader: glslify('./base.vert'),
    fragmentShader: glslify('./colorize.frag')
  }

  this.warp = {
    uniforms: THREE.UniformsUtils.merge( [
      {
        "texture"  : { type: "t", value: null },
        "mouse"  : { type: "v2", value: null },
        "resolution"  : { type: "v2", value: null },
        "time"  : { type: "f", value: null }
      }
    ]),
    vertexShader: glslify('./base.vert'),
    fragmentShader: glslify('./warp.frag')
  }

  this.emboss = {
    uniforms: THREE.UniformsUtils.merge( [
      {
        "texture"  : { type: "t", value: null },
        "mouse"  : { type: "v2", value: null },
        "resolution"  : { type: "v2", value: null },
        "time"  : { type: "f", value: null }
      }
    ]),
    vertexShader: glslify('./base.vert'),
    fragmentShader: glslify('./emboss.frag')
  }

  this.blur = {
    uniforms: THREE.UniformsUtils.merge( [
      {
        "texture"  : { type: "t", value: null },
        "mouse"  : { type: "v2", value: null },
        "resolution"  : { type: "v2", value: null },
        "time"  : { type: "f", value: null }
      }
    ]),
    vertexShader: glslify('./base.vert'),
    fragmentShader: glslify('./blur.frag')
  }

  this.diff = {
    uniforms: THREE.UniformsUtils.merge( [
      {
				"texture"  : { type: "t", value: null },
				"mouse"  : { type: "v2", value: null },
				"resolution"  : { type: "v2", value: null },
				"time"  : { type: "f", value: null },
				"texture2"  : { type: "t", value: null },
				"texture3"  : { type: "t", value: null }

			}
    ]),
    vertexShader: glslify('./base.vert'),
    fragmentShader: glslify('./diff.frag')
  }

  this.move = {
    uniforms: THREE.UniformsUtils.merge( [
      {
        "texture"  : { type: "t", value: null },
        "mouse"  : { type: "v2", value: null },
        "resolution"  : { type: "v2", value: null },
        "time"  : { type: "f", value: null }
      }
    ]),
    vertexShader: glslify('./base.vert'),
    fragmentShader: glslify('./move.frag')
  }

  this.oil = {
    uniforms: THREE.UniformsUtils.merge( [
      {
        "texture"  : { type: "t", value: null },
        "mouse"  : { type: "v2", value: null },
        "resolution"  : { type: "v2", value: null },
        "time"  : { type: "f", value: null }
      }
    ]),
    vertexShader: glslify('./base.vert'),
    fragmentShader: glslify('./oil.frag')
  }

  this.paint = {
    uniforms: THREE.UniformsUtils.merge( [
      {
        "texture"  : { type: "t", value: null },
        "mouse"  : { type: "v2", value: null },
        "resolution"  : { type: "v2", value: null },
        "time"  : { type: "f", value: null }
      }
    ]),
    vertexShader: glslify('./base.vert'),
    fragmentShader: glslify('./paint.frag')
  }
}
