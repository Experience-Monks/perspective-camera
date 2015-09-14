// could be modularized...
var cross = require('gl-vec3/cross')
var sub = require('gl-vec3/subtract')
var normalize = require('gl-vec3/normalize')
var copy = require('gl-vec3/copy')
var dot = require('gl-vec3/dot')
var scale = require('gl-vec3/scale')

var tmp = [0, 0, 0]
var epsilon = 0.000000001

// modifies direction & up vectors in place
module.exports = function (direction, up, position, target) {
  sub(tmp, target, position)
  normalize(tmp, tmp)
  var isZero = tmp[0] === 0 && tmp[1] === 0 && tmp[2] === 0
  if (!isZero) {
    var d = dot(tmp, up)
    if (Math.abs(d - 1) < epsilon) { // collinear
      scale(up, direction, -1)
    } else if (Math.abs(d + 1) < epsilon) { // collinear opposite
      copy(up, direction)
    }
    copy(direction, tmp)

    // normalize up vector
    cross(tmp, direction, up)
    normalize(tmp, tmp)

    cross(up, tmp, direction)
    normalize(up, up)
  }
}
