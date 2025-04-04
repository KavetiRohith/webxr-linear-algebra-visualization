import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import { useLinePlaneStore } from "./store";
import { Vector3, Quaternion, Raycaster } from "three";

export const DragControls = () => {
  const {
    objects,
    selectedObjectId,
    updateObjectPosition,
    updateObjectRotation,
  } = useLinePlaneStore();
  const { controllers } = useXR();
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<"move" | "rotate" | null>(null);
  const [startControllerPosition, setStartControllerPosition] =
    useState<Vector3 | null>(null);
  const [startObjectPosition, setStartObjectPosition] =
    useState<Vector3 | null>(null);
  const raycaster = useRef(new Raycaster());

  useFrame(() => {
    if (!isDragging || !selectedObjectId || !controllers.length) return;

    const controller = controllers[0];
    const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
    if (!selectedObject || !startControllerPosition || !startObjectPosition)
      return;

    // Get controller position and calculate movement delta
    const controllerPosition = new Vector3().setFromMatrixPosition(
      controller.controller.matrixWorld,
    );
    const delta = new Vector3().subVectors(
      controllerPosition,
      startControllerPosition,
    );

    if (dragType === "move") {
      // Update object position
      updateObjectPosition(
        selectedObjectId,
        startObjectPosition.clone().add(delta),
      );
    } else if (dragType === "rotate") {
      // Calculate rotation based on controller movement
      // This is a simplified rotation that could be improved
      const rotX = delta.y * 2;
      const rotY = delta.x * 2;
      const currentObject = objects.find((obj) => obj.id === selectedObjectId);

      if (currentObject) {
        const newRotation = currentObject.rotation.clone();
        newRotation.x += rotX;
        newRotation.y += rotY;
        updateObjectRotation(selectedObjectId, newRotation);
      }
    }
  });

  // Listen for controller button events to start/stop dragging
  useEffect(() => {
    const handleSelectStart = (event: any) => {
      if (!selectedObjectId) return;

      const controller = event.target;
      const controllerPosition = new Vector3().setFromMatrixPosition(
        controller.matrixWorld,
      );

      // Determine if we're grabbing a handle and what type
      // This would need raycasting logic in a real implementation
      const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
      if (selectedObject) {
        setIsDragging(true);
        setDragType("move"); // Default to move
        setStartControllerPosition(controllerPosition);
        setStartObjectPosition(selectedObject.position.clone());
      }
    };

    const handleSelectEnd = () => {
      setIsDragging(false);
      setDragType(null);
      setStartControllerPosition(null);
      setStartObjectPosition(null);
    };

    // Add and remove event listeners
    controllers.forEach((controller) => {
      controller.controller.addEventListener("selectstart", handleSelectStart);
      controller.controller.addEventListener("selectend", handleSelectEnd);
    });

    return () => {
      controllers.forEach((controller) => {
        controller.controller.removeEventListener(
          "selectstart",
          handleSelectStart,
        );
        controller.controller.removeEventListener("selectend", handleSelectEnd);
      });
    };
  }, [controllers, selectedObjectId, objects]);

  return null; // This component doesn't render anything
};
