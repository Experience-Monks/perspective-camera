var create = require('./camera-base')
var assign = require('object-assign')
var defined = require('defined')

var perspective = require('gl-mat4/perspective')
var lookAt4x4 = require('gl-mat4/lookAt')
var add = require('gl-vec3/add')

module.exports = function cameraPerspective (opt) {
  opt = opt || {}

  var camera = create(opt)
  camera.fov = defined(opt.fov, Math.PI / 4)
  camera.near = defined(opt.near, 0)
  camera.far = defined(opt.far, 100)

  var center = [0, 0, 0]

  var updateCombined = camera.update

  function update () {
    // see issue #1
    // (suggestions welcome)
    var near = Math.max(1e-5, camera.near)

    var aspect = camera.viewport[2] / camera.viewport[3]

    // build projection matrix
    perspective(camera.projection, camera.fov, aspect, near, camera.far)

    // build view matrix
    add(center, camera.position, camera.direction)
    lookAt4x4(camera.view, camera.position, center, camera.up)

    // update projection * view and invert
    updateCombined()
    return camera
  }

  // set it up initially from constructor options
  update()
  return assign(camera, {
    update: update
  })
}
