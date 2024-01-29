import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useController, useXR } from "@react-three/xr";
import { BallCollider, RapierCollider, RapierRigidBody, RigidBody, RigidBodyAutoCollider } from "@react-three/rapier";

import * as THREE from "three";


export interface JointColliderProps {
    name: string;
    joint: THREE.XRJointSpace;
    colliderType?: RigidBodyAutoCollider;
    ccd?: boolean;
    friction?: number;
    restitution?: number;
}
export const JointCollider = ({name, joint, ...props} : JointColliderProps) => {
    const bodyRef = useRef<RapierRigidBody>(null!);
    const colliderRef = useRef<RapierCollider>(null!);

    const position = useRef<THREE.Vector3>(new THREE.Vector3());
    const quaternion = useRef<THREE.Quaternion>(new THREE.Quaternion());
    const scale = useRef<THREE.Vector3>(new THREE.Vector3(1, 1, 1));

    useFrame((state, delta, xrFrame) => {
        if(!bodyRef.current) return;

        joint.matrixWorld.decompose(position.current, quaternion.current, scale.current);

        // We use setNextKinematic... so interaction with other bodies is handled correctly
        bodyRef.current.setNextKinematicTranslation(position.current);
        bodyRef.current.setNextKinematicRotation(quaternion.current);
    });

    return (
        <RigidBody {...props}
            ref={bodyRef}
            type={"kinematicPosition"}
            colliders={props.colliderType}
            ccd={props.ccd}
            friction={props.friction}
            restitution={props.restitution}
        >
            <BallCollider ref={colliderRef} args={[joint.jointRadius || 0.01]} />
        </RigidBody>
    );
}

/////

export interface HandPhysicsProps {
    handedness: XRHandedness;
    colliderType?: RigidBodyAutoCollider;
    ccd?: boolean;
    friction?: number;
    restitution?: number;
}
export const HandPhysics = ({
    handedness,
    colliderType = "ball",
    ccd = true,
    friction = 0.75,
    restitution = 0.1
} : HandPhysicsProps) => {
    const [jointNames, setJointNames] = useState<Array<XRHandJoint>>([]);
    const [jointPoses, setJointPoses] = useState<Array<THREE.XRJointSpace>>([]);

    const isHandTracking = useXR((state) => state.isHandTracking);
    const controller = useController(handedness);

    useEffect(() => {
        if(isHandTracking && controller) {
            const hand = controller.hand;
            let names : Array<XRHandJoint> = [];
            let poses : Array<THREE.XRJointSpace> = [];

            for(let name in hand.joints) {
                const jointName = name as XRHandJoint;
                const pose = hand.joints[jointName];
                if(pose) {
                    names.push(jointName);
                    poses.push(pose);
                }
            }

            setJointNames(names);
            setJointPoses(poses);
        }
        else {
            setJointNames([]);
            setJointPoses([]);
        }
    }, [isHandTracking, controller]);

    return (
        <>
            {jointPoses.map((pose, i) => {
                return<JointCollider
                    key={i}
                    name={jointNames[i]}
                    joint={pose}
                    colliderType={colliderType}
                    ccd={ccd}
                    friction={friction}
                    restitution={restitution}
                />
            })}
        </>
  );
};
