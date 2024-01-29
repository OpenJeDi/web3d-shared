# web3d-shared
Code related to 3D and XR web development that could be useful for others

## React Components

Reusable code for use with the *React* framework.

### Hand Physics

A simple component that handles collisions with the hand joints. Uses:
* `@react-three/fiber` for useFrame
* `@react-three/xr` for useXR and useController
* `@react-three/rapier` for everything related to physics

Short demonstration video: https://www.youtube.com/shorts/xgTx9lm-t_U

Put the `HandPhysics` component under the Rapier `Physics` component, for each hand separately.

### Room Geometry + Room Mesh

A component that generates fixed physics colliders for the meshes detected by WebXR

Put the `RoomGeometry` component under the Rapier `Physics` component
