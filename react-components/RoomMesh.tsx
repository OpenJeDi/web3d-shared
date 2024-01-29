import { getTransform } from './xr-util';
import React, { useState, useEffect, useRef } from 'react';
import { Mesh, MeshBasicMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';


interface RoomMeshProps {
  xrMesh: XRMesh;
}

export const RoomMesh: React.FC<RoomMeshProps> = ({ xrMesh/*, xrManager*/ }) => {
  const rigidBodyRef = React.useRef<RapierRigidBody>(null);
  const meshRef = React.useRef<Mesh>(null);
  const [lastUpdate, setLastUpdate] = useState(xrMesh.lastChangedTime);
  const meshMaterial = useRef(new MeshBasicMaterial({ color: "lightblue", wireframe: true }));

  useFrame((state, delta, xrFrame) => {
    const xrManager = state.gl.xr;
    if (!xrMesh || !xrManager || !meshRef.current) return;
    if(!rigidBodyRef.current) return;

    const transform = getTransform(xrMesh.meshSpace, xrManager);
    if(!transform) return;

    rigidBodyRef.current.setTranslation(transform.position, false);
    rigidBodyRef.current.setRotation(transform.quaternion, false);
  });

  useEffect(() => {
    console.log('Room mesh updated');

    // Update only if lastChangedTime has actually changed
    if (xrMesh.lastChangedTime !== lastUpdate) {
      setLastUpdate(xrMesh.lastChangedTime);

    }
  }, [xrMesh.lastChangedTime]);

  // Trigger re-render by using lastUpdate in the key prop
  // Note: for some reaon, xrMesh.indices is defined as a Float32Array, but it is actually an Uint16Array (pull request submitted and approved)
  return (
    <RigidBody key={lastUpdate} ref={rigidBodyRef} type='fixed' colliders={"trimesh"} includeInvisible>
      <mesh ref={meshRef}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={xrMesh.vertices}
            count={xrMesh.vertices.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            array={xrMesh.indices as any}
            count={xrMesh.indices.length}
            itemSize={1}
          />
        </bufferGeometry>

        <meshBasicMaterial attach="material" color="lightblue" wireframe />

      </mesh>
    </RigidBody>
  );
};
