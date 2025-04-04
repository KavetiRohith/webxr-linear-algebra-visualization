import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line } from "@react-three/drei";
import { Vector3, Group } from "three";

export const CoordinateSystem = () => {
    const groupRef = useRef<Group>(null);

    // Create a fixed coordinate system with origin
    return (
        <group ref={groupRef}>
            {/* Origin point */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.03]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>

            {/* X-axis (red) */}
            <Line
                points={[
                    [0, 0, 0],
                    [1, 0, 0],
                ]}
                color="red"
                lineWidth={2}
            />
            <Text position={[1.1, 0, 0]} fontSize={0.05} color="red">
                X
            </Text>

            {/* Y-axis (green) */}
            <Line
                points={[
                    [0, 0, 0],
                    [0, 1, 0],
                ]}
                color="green"
                lineWidth={2}
            />
            <Text position={[0, 1.1, 0]} fontSize={0.05} color="green">
                Y
            </Text>

            {/* Z-axis (blue) */}
            <Line
                points={[
                    [0, 0, 0],
                    [0, 0, 1],
                ]}
                color="blue"
                lineWidth={2}
            />
            <Text position={[0, 0, 1.1]} fontSize={0.05} color="blue">
                Z
            </Text>

            {/* Grid (optional) */}
            <gridHelper args={[2, 20, "#444444", "#222222"]} />
        </group>
    );
};