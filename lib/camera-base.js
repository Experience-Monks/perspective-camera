var assign = require('object-assign')
var Ray = require('ray-3d')

var cameraProject = require('camera-project')
var cameraUnproject = require('camera-unproject')
var cameraLookAt = require('./camera-look-at')
var cameraPickRay = require('camera-picking-ray')

var add = require('gl-vec3/add')
var multiply4x4 = require('gl-mat4/multiply')
var invert4x4 = require('gl-mat4/invert')
var identity4x4 = require('gl-mat4/identity')
var setVec3 = require('gl-vec3/set')

// this could also be useful for a orthographic camera
module.exports = function cameraBase (opt) {
  opt = opt || {}

  var camera = {
    projection: identity4x4([]),
    view: identity4x4([]),
    position: opt.position || [0, 0, 0],
    direction: opt.direction || [0, 0, -1],
    up: opt.up || [0, 1, 0],
    viewport: opt.viewport || [ -1, -1, 1, 1 ],
    projView: identity4x4([]),
    invProjView: identity4x4([])
  }

  function update () {
    multiply4x4(camera.projView, camera.projection, camera.view)
    var valid = invert4x4(camera.invProjView, camera.projView)
    if (!valid) {
      throw new Error('camera projection * view is non-invertible')
    }
  }

  function lookAt (target) {
    cameraLookAt(camera.direction, camera.up, camera.position, target)
    return camera
  }

  function identity () {
    setVec3(camera.position, 0, 0, 0)
    setVec3(camera.direction, 0, 0, -1)
    setVec3(camera.up, 0, 1, 0)
    identity4x4(camera.view)
    identity4x4(camera.projection)
    identity4x4(camera.projView)
    identity4x4(camera.invProjView)
    return camera
  }

  function translate (vec) {
    add(camera.position, camera.position, vec)
    return camera
  }

  function createPickingRay (mouse) {
    var ray = new Ray()
    cameraPickRay(ray.origin, ray.direction, mouse, camera.viewport, camera.invProjView)
    return ray
  }

  function project (point) {
    return cameraProject([], point, camera.viewport, camera.projView)
  }

  function unproject (point) {
    return cameraUnproject([], point, camera.viewport, camera.invProjView)
  }

  return assign(camera, {
    translate: translate,
    identity: identity,
    lookAt: lookAt,
    createPickingRay: createPickingRay,
    update: update,
    project: project,
    unproject: unproject
  })
}
