var mousePosition = require('touch-position')()
var drawTriangles = require('draw-triangles-2d')
var createApp = require('canvas-fit-loop')

// get a Canvas2D context
var ctx = require('2d-context')()
var canvas = ctx.canvas
document.body.appendChild(canvas)

// get some cool colours
var colors = require('array-range')(100).map(function () {
  var hue = Math.random() * 260
  return 'hsl(' + hue.toFixed(15) + ', 50%, 50%)'
})

// set up our 3D camera
var camera = require('../')({
  fov: Math.PI / 4,
  near: 0.01,
  far: 100
})

// get a 3D mesh (any simplicial complex will work)
var icosphere = require('icosphere')(1)
var time = 0

// create a full-screen render loop for our canvas
var app = createApp(canvas).start()
app.on('tick', function (dt) {
  time += dt / 1000

  // viewport bounds
  var width = app.shape[0],
    height = app.shape[1]
  var viewport = [0, 0, width, height]

  ctx.clearRect(0, 0, width, height)

  // rotate our camera around center on XZ plane
  var orbit = 3.5
  var x = Math.cos(time / 4) * orbit
  var z = Math.sin(time / 4) * orbit
  camera.identity()
  camera.translate([x, 0, z])
  camera.lookAt([0, 0, 0])
  camera.viewport = viewport

  // update camera matrices !
  camera.update()

  // project the 3D points into 2D screen-space
  var positions = icosphere.positions.map(function (point) {
    return camera.project(point)
  })

  // now draw each line with some cool color
  icosphere.cells.forEach(function (cell, i) {
    drawTriangle(cell, positions, i, false)
  })

  // get a ray from the mouse position
  var mouse = [ mousePosition[0], height - mousePosition[1] ]
  var ray = camera.createPickingRay(mouse)

  // find the first intersected face and draw it, filled
  for (var i = 0; i < icosphere.cells.length; i++) {
    var cell = icosphere.cells[i]
    var hit = ray.intersectsTriangleCell(cell, icosphere.positions)
    if (hit) {
      drawTriangle(cell, positions, i, true)
      break
    }
  }
})

function drawTriangle (cell, positions, index, fill) {
  ctx.beginPath()
  ctx.lineCap = 'round'
  ctx.lineWidth = 1
  ctx.fillStyle = ctx.strokeStyle = colors[index % colors.length]
  drawTriangles(ctx, positions, icosphere.cells, index, index + 1)
  if (fill) ctx.fill()
  else ctx.stroke()
}
