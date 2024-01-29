import { Matrix4, Vector3, Quaternion, WebXRManager } from 'three';

// Supported XR modules (from https://immersive-web.github.io/webxr-samples/report/)
export const xrModules = [
	{
	  name: 'WebXR Device API (core)',
	  url: 'https://immersive-web.github.io/webxr/',
	  supported: 'xr' in window.navigator,
	},
	{
	  name: 'WebXR Gamepads',
	  url: 'https://immersive-web.github.io/webxr-gamepads-module/',
  	  // @ts-ignore
	  supported: 'gamepad' in (window.XRInputSource?.prototype || {})
	},
	{
	  name: 'WebXR Augmented Reality',
	  url: 'https://immersive-web.github.io/webxr-ar-module/',
  	  // @ts-ignore
  	  supported: 'environmentBlendMode' in (window.XRSession?.prototype || {})
	},
	{
	  name: 'WebXR Hit Test',
	  url: 'https://immersive-web.github.io/hit-test/',
  	  // @ts-ignore
	  supported: 'requestHitTestSource' in (window.XRSession?.prototype || {})
	},
	{
	  name: 'WebXR DOM Overlays',
	  url: 'https://immersive-web.github.io/dom-overlays/',
	  // @ts-ignore
	  supported: 'domOverlayState' in (window.XRSession?.prototype || {})
	},
	{
	  name: 'WebXR Layers',
	  url: 'https://immersive-web.github.io/layers/',
	  supported: 'XRProjectionLayer' in window
	},
	{
	  name: 'WebXR Anchors',
	  url: 'https://immersive-web.github.io/anchors/',
	  // @ts-ignore
	  supported: 'createAnchor' in (window.XRFrame?.prototype || {})
	},
	{
	  name: 'WebXR Lighting Estimation',
	  url: 'https://immersive-web.github.io/lighting-estimation/',
	  // @ts-ignore
	  supported: 'requestLightProbe' in (window.XRSession?.prototype || {})
	},
	{
	  name: 'WebXR Hand Input',
	  url: 'https://www.w3.org/TR/webxr-hand-input/',
	  // @ts-ignore
	  supported: 'hand' in (window.XRInputSource?.prototype || {})
	},
	{
		name: "WebXR Depth Sensing",
		url: "https://immersive-web.github.io/depth-sensing/",
		// @ts-ignore
		supported: "getDepthInformation" in (window.XRFrame?.prototype || {})
	},
	{
		name: "WebXR Mesh Detection",
		url: "https://immersive-web.github.io/real-world-meshing/",
		// @ts-ignore
		supported: "detectedMeshes" in (window.XRFrame?.prototype || {})
	},
	{
		name: "System Keyboard",
		url: "https://developer.oculus.com/documentation/web/webxr-keyboard/",
		// @ts-ignore
		supported: 'isSystemKeyboardSupported' in (window.XRSession?.prototype || {})
	}
];

const tempVec3 = new Vector3();

interface Transform {
	position: Vector3;
	quaternion: Quaternion;
}
export const getTransform = (xrSpace: XRSpace, xrManager: WebXRManager): Transform | null => {
	const frame = xrManager.getFrame();
	if(!frame) return null;

	const refSpace = xrManager.getReferenceSpace();
	if(!refSpace) return null;

	const pose = frame.getPose(xrSpace, refSpace);
	if(!pose) return null;

	const position = new Vector3();
	const quaternion = new Quaternion();
	new Matrix4()
		.fromArray(pose.transform.matrix)
		.decompose(position, quaternion, tempVec3);

	return {
		position,
		quaternion
	};
}
