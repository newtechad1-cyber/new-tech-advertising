import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = '/brand/free-ai-guy-web-motions.glb';
const POSTER_URL = '/brand/free-ai-guy-approved-portrait.webp';

const CLIP_BY_MOTION = {
  hello: 'hello_wave',
  listening: 'listening',
  explaining: 'explaining',
  next_step: 'next_step',
};

THREE.Cache.enabled = true;

function disposeMaterial(material) {
  for (const value of Object.values(material)) {
    if (value?.isTexture) value.dispose();
  }
  material.dispose?.();
}

export default function FreeAIGuyAvatar({
  motion = 'idle',
  className = '',
  label = 'Free AI Guy',
  decorative = false,
}) {
  const mountRef = useRef(null);
  const runtimeRef = useRef(null);
  const motionRef = useRef(motion);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  motionRef.current = motion;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let cancelled = false;
    let renderer;
    let resizeObserver;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch {
      setFailed(true);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.className = 'block h-full w-full';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 100);
    const hemiLight = new THREE.HemisphereLight(0xe5f3ff, 0x071427, 2.3);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    const fillLight = new THREE.DirectionalLight(0xb8dcff, 1.35);
    keyLight.position.set(2.5, 4, 3.5);
    fillLight.position.set(-3, 2, 2);
    scene.add(hemiLight, keyLight, fillLight);

    const runtime = {
      action: null,
      clock: new THREE.Clock(false),
      frameId: 0,
      mixer: null,
      clips: new Map(),
      play: () => {},
    };
    runtimeRef.current = runtime;

    const render = () => renderer.render(scene, camera);
    const cancelFrame = () => {
      if (runtime.frameId) cancelAnimationFrame(runtime.frameId);
      runtime.frameId = 0;
    };
    const tick = () => {
      if (!runtime.action || !runtime.mixer) {
        runtime.frameId = 0;
        return;
      }
      runtime.mixer.update(runtime.clock.getDelta());
      render();
      runtime.frameId = requestAnimationFrame(tick);
    };
    const startFrame = () => {
      cancelFrame();
      runtime.clock.start();
      tick();
    };
    const playMotion = (nextMotion) => {
      if (!runtime.mixer) return;

      cancelFrame();
      runtime.mixer.stopAllAction();
      runtime.mixer.setTime(0);
      runtime.action = null;

      const clipName = CLIP_BY_MOTION[nextMotion];
      const clip = clipName ? runtime.clips.get(clipName) : null;
      if (!clip) {
        setIsAnimating(false);
        render();
        return;
      }

      setIsAnimating(true);
      const action = runtime.mixer.clipAction(clip);
      action.reset();
      action.enabled = true;
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = false;
      action.play();
      runtime.action = action;
      startFrame();
    };
    runtime.play = playMotion;

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
    };
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', resize);
    } else {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
    }

    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (cancelled) return;

        const model = gltf.scene;
        model.traverse((node) => {
          if (node.isMesh) node.frustumCulled = false;
        });
        scene.add(model);

        const beforeFit = new THREE.Box3().setFromObject(model);
        const beforeSize = beforeFit.getSize(new THREE.Vector3());
        const scale = 1.72 / Math.max(beforeSize.y, 0.01);
        model.scale.multiplyScalar(scale);

        const scaledBox = new THREE.Box3().setFromObject(model);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        model.position.x -= scaledCenter.x;
        model.position.y -= scaledBox.min.y;
        model.position.z -= scaledCenter.z;

        const fittedBox = new THREE.Box3().setFromObject(model);
        const fittedSize = fittedBox.getSize(new THREE.Vector3());

        // Keep active gestures at a useful upper-body distance instead of
        // framing the whole character from head to shoes.
        const focusHeight = fittedBox.min.y + fittedSize.y * 0.62;
        const distance = Math.max(fittedSize.y * 1.42, 2.42);
        camera.position.set(0, focusHeight, distance);
        camera.lookAt(0, focusHeight, 0);

        const mixer = new THREE.AnimationMixer(model);
        runtime.mixer = mixer;
        for (const clip of gltf.animations) runtime.clips.set(clip.name, clip);
        mixer.addEventListener('finished', (event) => {
          if (runtime.action !== event.action) return;
          event.action.stop();
          runtime.action = null;
          setIsAnimating(false);
          render();
        });

        resize();
        setReady(true);
        playMotion(motionRef.current);
      },
      undefined,
      () => {
        if (!cancelled) {
          setFailed(true);
          setIsAnimating(false);
        }
      },
    );

    return () => {
      cancelled = true;
      cancelFrame();
      resizeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      scene.traverse((node) => {
        if (!node.isMesh) return;
        node.geometry?.dispose();
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.filter(Boolean).forEach(disposeMaterial);
      });
      renderer.dispose();
      renderer.forceContextLoss?.();
      renderer.domElement.remove();
      if (runtimeRef.current === runtime) runtimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    runtimeRef.current?.play(motion);
  }, [motion]);

  const rootClass = ['relative overflow-hidden', className].filter(Boolean).join(' ');
  const showAnimatedModel = ready && !failed && isAnimating;

  return (
    <div
      className={rootClass}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      {!decorative && <span className="sr-only">{label}</span>}
      <img
        src={POSTER_URL}
        alt=""
        aria-hidden="true"
        className={['absolute inset-0 h-full w-full origin-top scale-125 object-cover object-[center_15%] transition-opacity duration-200', showAnimatedModel ? 'opacity-0' : 'opacity-100'].join(' ')}
      />
      {!failed && (
        <div
          ref={mountRef}
          className={['pointer-events-none absolute inset-0 transition-opacity duration-150', showAnimatedModel ? 'opacity-100' : 'opacity-0'].join(' ')}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
