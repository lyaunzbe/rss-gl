import THREE from 'three'
import assign from 'object-assign'

export default function(path, opt={}) {
  return new Promise((resolve, reject) => {
    THREE.TextureLoader(path, undefined, 
      tex => {
        assign(tex, opt)
        resolve(tex)
      },
      () => {
        reject(new Error(`could not load image ${path}`))
      })
  })
}
