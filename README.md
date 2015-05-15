# perspective-camera

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

[![demo-image](http://i.imgur.com/anR1By6.png)](http://jam3.github.io/perspective-camera/)

[demo](http://jam3.github.io/perspective-camera/) - [source](demo/canvas.js)

A high-level 3D perspective camera with a familiar and convenient interface, built from modular pieces.

```js
var createCamera = require('perspective-camera')

var camera = createCamera({
  fov: Math.PI/4,
  near: 0.01,
  far: 100,
  viewport: [0, 0, width, height]
})

//set up our camera
camera.translate([ x, y, z ])
camera.lookAt([ 0, 0, 0 ])
camera.update()

//do some 3D hit-testing
var ray = camera.createPickingRay(mouseInput)

if (ray.intersectsSphere(center, radius)) {
  console.log("Mouse hit 3D sphere!")
}
```

See [demo/canvas.js](demo/canvas.js) for a full example, using Canvas2D.

## Usage

[![NPM](https://nodei.co/npm/perspective-camera.png)](https://www.npmjs.com/package/perspective-camera)

#### `camera = createCamera([opts])`

Creates a new camera with options:

- `fov` field of view in radians, default `Math.PI / 4`
- `far` the far range, default `100`
- `near` the near range, default `1 / 100`
- `position` the camera position, default `[0, 0, 0]`
- `direction` the camera direction, default `[0, 0, -1]`
- `up` the camera up vector, default `[0, 1, 0]`
- `viewport` the screen-space viewport bounds, default `[-1, -1, 1, 1]`

The `viewport` is used to determine the aspect ratio of the projection, as well as projecting and ray-picking.

## methods

#### `camera.update()`

Updates the camera projection and view matrices from the camera's current state (position, direction, viewport, etc). 

#### `camera.identity()`

Resets the `position`, `direction`, `up`, `projection` and `view` values to their identity; the defaults described in the constructor.

#### `camera.translate(vec3)`

Translates this camera's `position` by the given `vec3`.

#### `camera.lookAt(vec3)`

Updates the `direction` and `up` to look at the given `vec3` target.

#### `camera.project(vec3)`

[Projects](https://github.com/Jam3/camera-project) the world space 3D point `vec3` into 2D screen-space based on this camera's `viewport` bounds. Returns a new `vec4` point with `z` and `w` components representing the computed depth (similar to `gl_FragCoord`).

#### `camera.unproject(vec3)`

[Unprojects](https://github.com/Jam3/camera-unproject) the screen-space point into 3D world-space. The Z of the screen-space point is between 0 (near plane) and 1 (far plane).

#### `camera.createPickingRay(vec2)`

Creates a new picking ray from the 2D screen-space `vec2` point (i.e. the mouse).

The ray is an instance of [ray-3d](https://github.com/Jam3/ray-3d), and it can be used for hit-testing.

```js
var ray = camera.createPickingRay(mouse)
if (ray.intersectsSphere(center, radius))
  console.log("Hit!")
```

## properties

#### `camera.viewport`

A `[x, y, width, height]` array defining the viewport in screen space.

#### `camera.projection`, `camera.view`

The 4x4 projection and view matrices, computed after a call to `update()`. 

#### `camera.position`, `camera.direction`, `camera.up`

The current position, direction, and up vectors.

## See Also

- [camera-unproject](https://www.npmjs.com/package/camera-unproject)
- [camera-project](https://www.npmjs.com/package/camera-project)
- [camera-picking-ray](https://www.npmjs.com/package/camera-picking-ray)
- [ray-3d](https://www.npmjs.com/package/ray-3d)
- [ray-sphere-intersection](https://www.npmjs.com/package/ray-sphere-intersection)
- [ray-plane-intersection](https://www.npmjs.com/package/ray-plane-intersection)
- [ray-triangle-intersection](https://www.npmjs.com/package/ray-triangle-intersection)

## License

MIT, see [LICENSE.md](http://github.com/Jam3/perspective-camera/blob/master/LICENSE.md) for details.
