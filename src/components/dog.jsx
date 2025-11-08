import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  Suspense,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import {
  EffectComposer,
  SelectiveBloom,
  Selection,
  Select,
} from "@react-three/postprocessing";
import { Resizer, KernelSize } from "postprocessing";
import * as THREE from "three";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";

// -------------------- Config --------------------
const EMOJI_BURST = 14;
const zEmoji = -2.5;
const EMOJI_ROTATION = [0, Math.PI / -2, 0];

// -------------------- Helpers --------------------
const rand = (min, max) => min + Math.random() * (max - min);

function viewportAtDepth({ cameraZ, targetZ, fovDeg, aspect }) {
  const distance = cameraZ - targetZ;
  const fov = (fovDeg * Math.PI) / 180;
  const height = 2 * Math.tan(fov / 2) * distance;
  const width = height * aspect;
  return { width, height };
}

// -------------------- Dog (cursor-follow + base rotation API) --------------------
const Pluto = forwardRef(function Pluto(
  {
    basePosition = [-1, -6, 0],
    baseRotation = { x: 0, y: 45, z: 0 },
    scale = 15,
    maxYaw = THREE.MathUtils.degToRad(20),
    maxPitch = THREE.MathUtils.degToRad(10),
    parallax = 0.6,
    damp = 8.0,
  },
  apiRef
) {
  const { scene } = useGLTF("/models/pluto_model.glb");
  const outer = useRef();
  const inner = useRef();

  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handle = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      mouse.current.x = Math.max(-1, Math.min(1, nx));
      mouse.current.y = Math.max(-1, Math.min(1, ny));
    };
    window.addEventListener("pointermove", handle, { passive: true });
    return () => window.removeEventListener("pointermove", handle);
  }, []);

  useEffect(() => {
    if (!outer.current) return;
    outer.current.rotation.set(
      THREE.MathUtils.degToRad(baseRotation.x || 0),
      THREE.MathUtils.degToRad(baseRotation.y || 0),
      THREE.MathUtils.degToRad(baseRotation.z || 0)
    );
  }, [baseRotation]);

  const base = useMemo(() => new THREE.Vector3(...basePosition), [basePosition]);

  useFrame((_, dt) => {
    if (!inner.current || !outer.current) return;

    const mx = mouse.current.x;
    const my = mouse.current.y;

    const targetYaw = mx * maxYaw;
    const targetPitch = -my * maxPitch;

    inner.current.rotation.y = THREE.MathUtils.damp(inner.current.rotation.y, targetYaw, damp, dt);
    inner.current.rotation.x = THREE.MathUtils.damp(inner.current.rotation.x, targetPitch, damp, dt);

    const tx = base.x + mx * parallax;
    const ty = base.y + my * parallax * 0.6;

    outer.current.position.x = THREE.MathUtils.damp(outer.current.position.x, tx, damp, dt);
    outer.current.position.y = THREE.MathUtils.damp(outer.current.position.y, ty, damp, dt);
  });

  useImperativeHandle(apiRef, () => ({
    getRotationDeg: () => {
      const r = outer.current.rotation;
      return {
        x: THREE.MathUtils.radToDeg(r.x),
        y: THREE.MathUtils.radToDeg(r.y),
        z: THREE.MathUtils.radToDeg(r.z),
      };
    },
    setBaseRotationDeg: ({ x = 0, y = 0, z = 0 }) => {
      outer.current.rotation.set(
        THREE.MathUtils.degToRad(x),
        THREE.MathUtils.degToRad(y),
        THREE.MathUtils.degToRad(z)
      );
    },
  }));

  return (
    <group ref={outer} position={basePosition}>
      <group ref={inner}>
        <primitive object={scene} scale={scale} />
      </group>
    </group>
  );
});

// -------------------- Heart --------------------
function HeartInstance({ template, id, startPosition, startDelay = 0, onDie }) {
  const ref = useRef();
  const elapsed = useRef(0);
  const duration = 3;
  const cloned = useMemo(() => cloneSkeleton(template), [template]);

  useEffect(() => {
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        const m = child.material;
        if ("emissive" in m) {
          m.emissive = new THREE.Color("#ff2d55");
          m.emissiveIntensity = 2.5;
        }
        if ("toneMapped" in m) m.toneMapped = false;
        m.needsUpdate = true;
      }
    });
  }, [cloned]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    if (elapsed.current < startDelay) return;
    const t = (elapsed.current - startDelay) / duration;
    if (t >= 1) return onDie(id);
    const s = t <= 0.5 ? t * 2 : 2 - t * 2;
    ref.current.scale.set(s, s, s);
    ref.current.position.set(startPosition[0], startPosition[1] + t * 3, startPosition[2]);
  });

  return (
    <primitive
      ref={ref}
      object={cloned}
      position={startPosition}
      rotation={[0, Math.PI, 0]}
      scale={[0, 0, 0]}
    />
  );
}

// -------------------- Emoji --------------------
function EmojiInstance({ template, animations, id, startPosition, euler = [0, 0, 0], onDie }) {
  const ref = useRef();
  const elapsed = useRef(0);
  const duration = 2.4;

  const cloned = useMemo(() => cloneSkeleton(template), [template]);
  const { actions } = useAnimations(animations, cloned);

  useEffect(() => {
    const action = actions["Take 001"] || null;
    if (action) {
      action.reset().setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.fadeIn(0.2).play();
    }
    return () => action?.fadeOut(0.1);
  }, [actions]);

  useEffect(() => {
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        const m = child.material;
        if ("emissive" in m) {
          m.emissive = new THREE.Color("#ffd54a");
          m.emissiveIntensity = 0.8;
        }
        if ("toneMapped" in m) m.toneMapped = false;
        m.needsUpdate = true;
      }
    });
  }, [cloned]);

  useEffect(() => {
    if (ref.current) ref.current.rotation.set(euler[0], euler[1], euler[2]);
  }, [euler]);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current / duration;
    if (t >= 1) return onDie(id);
    const s = t <= 0.5 ? t * 2 : 2 - t * 2;
    ref.current.scale.set(s, s, s);
    const y = startPosition[1] + t * 1.5;
    ref.current.position.set(startPosition[0], y, startPosition[2]);
  });

  return (
    <primitive
      ref={ref}
      object={cloned}
      position={startPosition}
      scale={[0, 0, 0]}
      renderOrder={-2}
    />
  );
}

// -------------------- Scene --------------------
export default function DogScene() {
  // Static values are declared outside state/memo hooks
  const dogFace = useMemo(() => [1, 1.5, 0], []);
  const heartOffset = useMemo(() => [-0.35, 0, 0], []);

  const [hearts, setHearts] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [clickCount, setClickCount] = useState(0);

  // FIX: Declaring the light refs with useRef()
  const ambientRef = useRef();
  const dirRef = useRef();

  // FIX: Memoizing the light array for SelectiveBloom to prevent infinite loop
  const stableLights = useMemo(() => [ambientRef, dirRef], []);

  const heartTemplate = useGLTF("/models/heart.glb").scene;
  const emojiGLTF = useGLTF("/models/emoji_smiling.glb");
  const emojiTemplate = emojiGLTF.scene;
  const emojiAnimations = emojiGLTF.animations;

  // Track last click position for pulse center
  const lastClick = useRef({ x: 50, y: 50 });

  const getRandomViewportPos = useCallback(() => {
    const cameraZ = 10;
    const fovDeg = 50;
    const aspect = window.innerWidth / window.innerHeight;
    const { width, height } = viewportAtDepth({ cameraZ, targetZ: zEmoji, fovDeg, aspect });
    const marginX = 0.2 * width;
    const marginY = 0.2 * height;
    const x = rand(-width / 2 + marginX, width / 2 - marginX);
    const y = rand(-height / 2 + marginY, height / 2 - marginY);
    return [x, y, zEmoji];
  }, []);

  // Memoize state setters for the cleanup functions
  const removeHeart = useCallback((id) => setHearts((p) => p.filter((h) => h.id !== id)), [setHearts]);
  const removeEmoji = useCallback((id) => setEmojis((p) => p.filter((e) => e.id !== id)), [setEmojis]);

  // FIX: Click logic moved inside the stable useEffect
  useEffect(() => {
    // Define the core spawn logic that uses functional state updates
    const spawn = () => {
      const h1 = crypto.randomUUID?.() ?? `${Date.now()}-h1`;
      const h2 = crypto.randomUUID?.() ?? `${Date.now()}-h2`;
      
      setHearts((p) => [
        ...p,
        { id: h1, pos: dogFace, delay: 0.0 },
        {
          id: h2,
          pos: [
            dogFace[0] + heartOffset[0],
            dogFace[1] + heartOffset[1],
            dogFace[2] + heartOffset[2],
          ],
          delay: 0.3,
        },
      ]);
  
      const burst = Array.from({ length: EMOJI_BURST }, (_, i) => ({
        id: crypto.randomUUID?.() ?? `${Date.now()}-e${i}`,
        pos: getRandomViewportPos(),
        euler: EMOJI_ROTATION,
      }));
      setEmojis((p) => [...p, ...burst]);
  
      setClickCount((n) => n + 1);
  
      // Dispatch pulse event with click position
      window.dispatchEvent(
        new CustomEvent("pluto-pulse", {
          detail: { x: lastClick.current.x, y: lastClick.current.y },
        })
      );
    };

    // Define the event handler
    const handler = (e) => {
      if (e.button !== 0) return;
      
      // Store click position
      lastClick.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
      
      // Execute the spawn logic
      spawn();
    };
    
    // Register listener only once on mount
    window.addEventListener("pointerdown", handler, { passive: true });
    
    // Cleanup on unmount
    return () => window.removeEventListener("pointerdown", handler);
  // Dependencies are the static values used inside the effect's logic
  }, [dogFace, heartOffset, getRandomViewportPos]); 

  const dogRef = useRef(null);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <Canvas
        gl={{ alpha: true, premultipliedAlpha: false }}
        onCreated={(state) => state.gl.setClearColor(0x000000, 0)}
        camera={{ position: [0, 4, 10], fov: 50 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <ambientLight ref={ambientRef} intensity={0.7} />
        <directionalLight ref={dirRef} position={[-5, 10, 7]} intensity={1} />

        <Suspense fallback={null}>
          <Selection>
            <EffectComposer>
              <SelectiveBloom
                lights={stableLights}
                intensity={1.1}
                luminanceThreshold={0.9}
                luminanceSmoothing={0.02}
                kernelSize={KernelSize.LARGE}
                width={Resizer.AUTO_SIZE}
                height={Resizer.AUTO_SIZE}
              />
            </EffectComposer>

            <Select enabled>
              {hearts.map((h) => (
                <HeartInstance
                  key={h.id}
                  id={h.id}
                  template={heartTemplate}
                  startPosition={h.pos}
                  startDelay={h.delay}
                  onDie={removeHeart}
                />
              ))}
            </Select>

            {emojis.map((e) => (
              <EmojiInstance
                key={e.id}
                id={e.id}
                template={emojiTemplate}
                animations={emojiAnimations}
                startPosition={e.pos}
                euler={e.euler}
                onDie={removeEmoji}
              />
            ))}

            <Pluto
              ref={dogRef}
              basePosition={[-1, -6, 0]}
              baseRotation={{ x: 0, y: 45, z: 0 }}
              scale={15}
              maxYaw={THREE.MathUtils.degToRad(20)}
              maxPitch={THREE.MathUtils.degToRad(10)}
              parallax={0.6}
              damp={8}
            />
          </Selection>
        </Suspense>
      </Canvas>
    </div>
  );
}