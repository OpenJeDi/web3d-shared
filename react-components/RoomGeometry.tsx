import { RoomMesh } from './RoomMesh';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

export const RoomGeometry = () => {
    const [xrMeshes, setXrMeshes] = useState<Array<XRMesh>>([]);
    const meshKeys = useRef<Map<XRMesh, number>>(new Map());
    const nextKey = useRef(0);

    useFrame((state, deltaTime, xrFrame) => {
        if (!state.gl.xr.isPresenting || !xrFrame) {
            setXrMeshes([]);
            return;
        }

        // @ts-ignore TODO Remove when XRFrame type is more complete (pull request submitted and approved)
        const detectedMeshes = xrFrame.detectedMeshes as XRMeshSet;
        if (!detectedMeshes) {
            setXrMeshes([]);
            return;
        }

        // We have to make sure the same mesh keeps the same key,
        // so we cannot just use the mesh' index in the array
        for(let mesh of detectedMeshes) {
            if(!meshKeys.current.has(mesh)) {
                meshKeys.current.set(mesh, nextKey.current++);
            }
        }
        for(let mesh of meshKeys.current.keys()) {
            if(!detectedMeshes.has(mesh)) {
                meshKeys.current.delete(mesh);
            }
        }

        const currentMeshes = Array.from(detectedMeshes);
        setXrMeshes(currentMeshes);
    });

    // Clean up
    useEffect(() => {
        return () => {
            setXrMeshes([]);
            meshKeys.current.clear();
        };
    }, []);

    return (
        <group>
            {xrMeshes.map((xrMesh) => (
                <RoomMesh key={meshKeys.current.get(xrMesh)} xrMesh={xrMesh} />
            ))}
        </group>
    )
};
