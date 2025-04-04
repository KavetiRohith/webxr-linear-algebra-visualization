import { create } from "zustand";
import { Vector3, Euler, Matrix4 } from "three";
import { generateUUID } from "three/src/math/MathUtils";

export type MathObject = {
  id: string;
  type: "line" | "plane";
  position: Vector3;
  rotation: Euler;
  color: string;
  equation: string;
  visible: boolean;
};

type LinePlaneStoreState = {
  objects: MathObject[];
  selectedObjectId: string | null;
  addLine: (position?: Vector3, rotation?: Euler) => void;
  addPlane: (position?: Vector3, rotation?: Euler) => void;
  removeObject: (id: string) => void;
  updateObjectPosition: (id: string, position: Vector3) => void;
  updateObjectRotation: (id: string, rotation: Euler) => void;
  updateEquation: (id: string) => void;
  selectObject: (id: string | null) => void;
  toggleVisibility: (id: string) => void;
};

export const useLinePlaneStore = create<LinePlaneStoreState>((set, get) => ({
  objects: [],
  selectedObjectId: null,

  addLine: (position = new Vector3(0, 1, 0), rotation = new Euler()) => {
    const id = generateUUID();
    const line = {
      id,
      type: "line" as const,
      position: position.clone(),
      rotation: rotation.clone(),
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
      equation: "x = (0,0,0) + t·(1,0,0)",
      visible: true,
    };

    set((state) => ({
      objects: [...state.objects, line],
      selectedObjectId: id,
    }));

    get().updateEquation(id);
  },

  addPlane: (position = new Vector3(0, 1, 0), rotation = new Euler()) => {
    const id = generateUUID();
    const plane = {
      id,
      type: "plane" as const,
      position: position.clone(),
      rotation: rotation.clone(),
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
      equation: "0x + 0y + 1z = 0",
      visible: true,
    };

    set((state) => ({
      objects: [...state.objects, plane],
      selectedObjectId: id,
    }));

    get().updateEquation(id);
  },

  removeObject: (id) => {
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    }));
  },

  updateObjectPosition: (id, position) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, position: position.clone() } : obj
      ),
    }));
    get().updateEquation(id);
  },

  updateObjectRotation: (id, rotation) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, rotation: rotation.clone() } : obj
      ),
    }));
    get().updateEquation(id);
  },

  updateEquation: (id) => {
    const object = get().objects.find(obj => obj.id === id);
    if (!object) return;

    // Calculate equation based on position and rotation
    let equation = "";

    if (object.type === "line") {
      // Line equation: Point-direction form
      // x = origin + t * direction
      const direction = new Vector3(1, 0, 0).applyEuler(object.rotation).normalize();
      equation = `x = (${object.position.x.toFixed(1)}, ${object.position.y.toFixed(1)}, ${object.position.z.toFixed(1)}) + t·(${direction.x.toFixed(1)}, ${direction.y.toFixed(1)}, ${direction.z.toFixed(1)})`;
    } else {
      // Plane equation: ax + by + cz + d = 0
      // Normal vector is the z-axis transformed by rotation
      const normal = new Vector3(0, 0, 1).applyEuler(object.rotation).normalize();
      const d = -normal.dot(object.position);

      equation = `${normal.x.toFixed(2)}x + ${normal.y.toFixed(2)}y + ${normal.z.toFixed(2)}z + ${d.toFixed(2)} = 0`;
    }

    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, equation } : obj
      ),
    }));
  },

  selectObject: (id) => {
    set({ selectedObjectId: id });
  },

  toggleVisibility: (id) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, visible: !obj.visible } : obj
      ),
    }));
  },
}));