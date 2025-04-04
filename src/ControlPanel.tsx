import { useEffect, useRef, useState } from "react";
import { Interactive, useXR } from "@react-three/xr";
import { Text } from "@react-three/drei";
import { useLinePlaneStore } from "./store";
import { Vector3, Group } from "three";

export const ControlPanel = () => {
    const { objects, selectedObjectId, addLine, addPlane, removeObject, toggleVisibility } = useLinePlaneStore();
    const { isPresenting, player } = useXR();
    const groupRef = useRef<Group>(null);

    // Position the control panel relative to the user
    useEffect(() => {
        if (isPresenting && groupRef.current && player) {
            // Position panel to the left side of the view
            groupRef.current.position.set(-0.5, 0, -0.8);
            groupRef.current.lookAt(player.position);
        }
    }, [isPresenting, player]);

    return (
        <group ref={groupRef}>
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[0.4, 0.6]} />
                <meshStandardMaterial color="#222244" opacity={0.7} transparent />
            </mesh>

            <Text position={[0, 0.25, 0.01]} fontSize={0.04} color="white">
                Linear Algebra Tools
            </Text>

            {/* Add Line button */}
            <Interactive onSelect={() => addLine()}>
                <group position={[0, 0.15, 0.01]}>
                    <mesh>
                        <planeGeometry args={[0.3, 0.06]} />
                        <meshStandardMaterial color="#4444aa" />
                    </mesh>
                    <Text position={[0, 0, 0.01]} fontSize={0.03} color="white">
                        Add Line
                    </Text>
                </group>
            </Interactive>

            {/* Add Plane button */}
            <Interactive onSelect={() => addPlane()}>
                <group position={[0, 0.05, 0.01]}>
                    <mesh>
                        <planeGeometry args={[0.3, 0.06]} />
                        <meshStandardMaterial color="#4444aa" />
                    </mesh>
                    <Text position={[0, 0, 0.01]} fontSize={0.03} color="white">
                        Add Plane
                    </Text>
                </group>
            </Interactive>

            {/* Delete button (only if an object is selected) */}
            {selectedObjectId && (
                <Interactive onSelect={() => removeObject(selectedObjectId)}>
                    <group position={[0, -0.05, 0.01]}>
                        <mesh>
                            <planeGeometry args={[0.3, 0.06]} />
                            <meshStandardMaterial color="#aa4444" />
                        </mesh>
                        <Text position={[0, 0, 0.01]} fontSize={0.03} color="white">
                            Delete Selected
                        </Text>
                    </group>
                </Interactive>
            )}

            {/* Toggle visibility button (only if an object is selected) */}
            {selectedObjectId && (
                <Interactive onSelect={() => toggleVisibility(selectedObjectId)}>
                    <group position={[0, -0.15, 0.01]}>
                        <mesh>
                            <planeGeometry args={[0.3, 0.06]} />
                            <meshStandardMaterial color="#44aa44" />
                        </mesh>
                        <Text position={[0, 0, 0.01]} fontSize={0.03} color="white">
                            Toggle Visibility
                        </Text>
                    </group>
                </Interactive>
            )}
        </group>
    );
};