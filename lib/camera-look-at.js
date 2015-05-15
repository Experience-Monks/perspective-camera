// could be modularized...
var cross = require('gl-vec3/cross')
var sub = require('gl-vec3/subtract')
var normalize = require('gl-vec3/normalize')
var copy = require('gl-vec3/copy')

var tmp = [0, 0, 0]

// modifies direction & up vectors in place
module.exports = function (direction, up, position, target) {
  copy(direction, target)

  sub(direction, direction, position)
  normalize(direction, direction)

  // right vector
  cross(tmp, direction, up)
  normalize(tmp, tmp)

  // up vector
  cross(up, tmp, direction)
  normalize(up, up)
}
