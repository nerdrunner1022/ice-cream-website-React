import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const MODEL_URL = new URL(
  '../models/source/e540a019-b079-4501-9c33-8dd9f35ba1a4.glb',
  import.meta.url
).href;

interface HeroIceCreamModelProps {
  className?: string;
  onReady?: () => void;
  onError?: () => void;
}

export default function HeroIceCreamModel({
  className = '',
  onReady,
  onError,
}: HeroIceCreamModelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onReadyRef.current = onReady;
    onErrorRef.current = onError;
  }, [onReady, onError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const context =
      canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    if (!context) {
      const error = new Error('WebGL is unavailable in this browser.');
      console.error('Unable to initialize the hero ice cream model.', error);
      onErrorRef.current?.();
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        context,
        alpha: true,
        antialias: true,
      });
    } catch (error) {
      console.error('Unable to initialize the hero ice cream model.', error);
      onErrorRef.current?.();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    scene.add(new THREE.HemisphereLight(0xffead1, 0x28180f, 2.2));

    const keyLight = new THREE.DirectionalLight(0xffd9a8, 3.5);
    keyLight.position.set(-3, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.8);
    fillLight.position.set(4, 1, 3);
    scene.add(fillLight);

    let disposed = false;
    let model: THREE.Group | null = null;
    let modelRadius = 0;
    let animationFrame = 0;

    const fitCamera = (): void => {
      if (!modelRadius) return;
      const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const horizontalHalfFov = Math.atan(
        Math.tan(verticalHalfFov) * camera.aspect
      );
      const halfFov = Math.min(verticalHalfFov, horizontalHalfFov);
      camera.position.z = (modelRadius / Math.sin(halfFov)) * 0.94;
    };

    const resize = (): void => {
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      fitCamera();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const disposeModel = (object: THREE.Object3D): void => {
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.dispose();
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value instanceof THREE.Texture) value.dispose();
          });
          material.dispose();
        });
      });
    };

    new GLTFLoader().load(
      MODEL_URL,
      (gltf) => {
        if (disposed || canvasRef.current !== canvas) {
          disposeModel(gltf.scene);
          return;
        }

        model = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const largestDimension = Math.max(size.x, size.y, size.z);
        if (!largestDimension) {
          console.error('The hero ice cream model has no measurable dimensions.');
          disposeModel(model);
          model = null;
          onErrorRef.current?.();
          return;
        }

        const scale = 2.5 / largestDimension;
        modelRadius = bounds.getBoundingSphere(new THREE.Sphere()).radius * scale;
        model.scale.setScalar(scale);
        model.position.copy(center).multiplyScalar(-scale);
        scene.add(model);
        fitCamera();
        onReadyRef.current?.();
      },
      undefined,
      (error) => {
        console.error('Unable to load the hero ice cream model.', error);
        onErrorRef.current?.();
      }
    );

    let isVisible = false;
    const render = (time: number): void => {
      if (disposed || !isVisible) {
        animationFrame = 0;
        return;
      }
      if (model) {
        model.rotation.y = -0.35 + time * 0.00008;
        model.rotation.x = -0.08 + Math.sin(time / 1800) * 0.035;
        model.rotation.z = -Math.PI / 12;
      }
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(render);
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationFrame) {
        animationFrame = requestAnimationFrame(render);
      } else if (!isVisible && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    }, { rootMargin: '100px' });
    visibilityObserver.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      if (model) disposeModel(model);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Rotating chocolate and vanilla ice cream cone"
      className={`pointer-events-none absolute ${className}`}
    />
  );
}
