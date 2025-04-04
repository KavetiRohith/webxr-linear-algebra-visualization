import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Interactive } from "@react-three/xr";
import { useLinePlaneStore } from "./store";
import { Vector3, Euler, Mesh, Group } from "three";

interface MathPlaneProps {
    id: string;
    position: Vector3;
    rotation: Euler;
    color: string;
    isSelected: boolean;
}

export const MathPlane = ({ id, position, rotation, color, isSelected }: MathPlaneProps) => {
    const groupRef = useRef<Group>(null);
    const planeRef = useRef<Mesh>(null);
    const { selectObject, updateObjectPosition, updateObjectRotation } = useLinePlaneStore();
    const [isDragging, setIsDragging] = useState(false);
    const [dragType, setDragType] = useState<"move" | "rotate" | null>(null);
    const [startPosition, setStartPosition] = useState<Vector3 | null>(null);
    const [startRotation, setStartRotation] = useState<Euler | null>(null);

    // Update the visual representation of the plane
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.position.copy(position);
            groupRef.current.rotation.copy(rotation);
        }
    });

    const handleSelect = () => {
        selectObject(id);
    };

    const handleMove = (e: any) => {
        setIsDragging(true);
        setDragType("move");
        setStartPosition(e.controller.controller.position.clone());
    };

    const handleRelease = () => {
        setIsDragging(false);
        setDragType(null);
        setStartPosition(null);
        setStartRotation(null);
    };

    return (
        <Interactive onSelect={handleSelect} onSelectStart={handleMove} onSelectEnd={handleRelease}>
            <group ref={groupRef}>
                {/* Plane representation */}
                <mesh ref={planeRef}>
                    <planeGeometry args={[1, 1]} />
                    <meshStandardMaterial
                        color={color}
                        opacity={isSelected ? 0.7 : 0.4}
                        transparent
                        side={2} // DoubleSide
                    />
                </mesh>

                {/* Handle for moving */}
                <mesh position={[0, 0, 0]} onClick={() => setDragType("move")}>
                    <sphereGeometry args={[0.03]} />
                    <meshStandardMaterial color={isSelected ? "#ffffff" : color} />
                </mesh>

                {/* Handle for rotating */}
                <mesh position={[0.4, 0.4, 0]} onClick={() => setDragType("rotate")}>
                    <boxGeometry args={[0.05, 0.05, 0.05]} />
                    <meshStandardMaterial color={isSelected ? "#ffff00" : color} />
                </mesh>
            </group>
        </Interactive>
    );
};