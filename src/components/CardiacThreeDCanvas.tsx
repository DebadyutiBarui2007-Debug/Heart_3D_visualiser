import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PatientData } from '../types/cardio';

interface CardiacThreeDCanvasProps {
  patient: PatientData;
  autoRotate: boolean;
  showMyocardium: boolean;
  highlightLad: boolean;
  resetTrigger: number;
  onSelectVessel?: (vessel: 'LAD' | 'LCX' | 'RCA') => void;
}

export const CardiacThreeDCanvas: React.FC<CardiacThreeDCanvasProps> = ({
  patient,
  autoRotate,
  showMyocardium,
  highlightLad,
  resetTrigger,
  onSelectVessel,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const innerHeartRef = useRef<THREE.Mesh | null>(null);
  const wireHeartRef = useRef<THREE.Mesh | null>(null);
  const ladMeshRef = useRef<THREE.Mesh | null>(null);
  const lcxMeshRef = useRef<THREE.Mesh | null>(null);
  const rcaMeshRef = useRef<THREE.Mesh | null>(null);
  const stenosisRingRef = useRef<THREE.Mesh | null>(null);
  const stenosisGlowRef = useRef<THREE.Mesh | null>(null);
  const rcaStenosisRingRef = useRef<THREE.Mesh | null>(null);
  const lcxStenosisRingRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Dynamic Risk Color-Coding (Blueprint Page 4: <30% Green, 30-49% Yellow, >=50% Red)
  function createVesselMaterial(stenosisPercentage: number) {
    if (stenosisPercentage < 30) {
      // Low Risk (Green)
      return new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.25,
      });
    } else if (stenosisPercentage < 50) {
      // Moderate (Yellow / Amber)
      return new THREE.MeshStandardMaterial({
        color: 0xffab00,
        emissive: 0xff6d00,
        emissiveIntensity: 0.85,
        roughness: 0.2,
        metalness: 0.2,
      });
    } else {
      // Stenosis >= 50% (Arterial Red)
      return new THREE.MeshStandardMaterial({
        color: 0xff1744,
        emissive: 0xd50000,
        emissiveIntensity: 0.95,
        roughness: 0.1,
        metalness: 0.2,
      });
    }
  }

  // References for drag interaction
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 5.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x0e2a47, 2.0);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, 3.8, 25);
    cyanPoint.position.set(3, 4, 4);
    scene.add(cyanPoint);

    const magentaPoint = new THREE.PointLight(0xff0055, 4.2, 20);
    magentaPoint.position.set(-2, -2, 3);
    scene.add(magentaPoint);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    rimLight.position.set(-5, 6, -3);
    scene.add(rimLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    mainGroupRef.current = mainGroup;

    // 1. Anatomical Heart Geometry
    function createDeformedHeartGeometry(radius: number, detail: number) {
      const geo = new THREE.SphereGeometry(radius, detail, detail);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);
        let z = pos.getZ(i);

        // Cardiac Apex taper downwards and slight left tilt
        if (y < 0.3) {
          const taper = 1.0 - Math.abs(y) * 0.45;
          x *= taper;
          z *= taper;
          y *= 1.35;
          x -= 0.12 * (0.3 - y);
        } else {
          // Atria upper bulge
          const spread = 1.0 + Math.sin((y - 0.3) * 2.0) * 0.15;
          x *= spread;
        }

        // Ventricular sulcus groove
        if (x > -0.25 && x < 0.35 && z > 0.4) {
          z -= 0.18 * Math.cos((x - 0.05) * 4.5);
        }
        pos.setXYZ(i, x, y, z);
      }
      geo.computeVertexNormals();
      return geo;
    }

    const baseGeo = createDeformedHeartGeometry(1.22, 44);

    // Inner volume translucent body
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x051329,
      emissive: 0x02163b,
      specular: 0x38bdf8,
      shininess: 90,
      transparent: true,
      opacity: 0.85,
    });
    const innerHeart = new THREE.Mesh(baseGeo, innerMat);
    mainGroup.add(innerHeart);
    innerHeartRef.current = innerHeart;

    // Outer Luminescent Wireframe Cage
    const wireGeo = createDeformedHeartGeometry(1.235, 36);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const wireHeart = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireHeart);
    wireHeartRef.current = wireHeart;

    // 2. Vascular Materials
    const vesselMaterialCyan = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x0088cc,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.3,
    });

    const vesselMaterialRed = new THREE.MeshStandardMaterial({
      color: 0xff1744, // Critical Stenosis LAD
      emissive: 0xd50000,
      emissiveIntensity: 0.95,
      roughness: 0.1,
      metalness: 0.2,
    });

    const vesselMaterialAmber = new THREE.MeshStandardMaterial({
      color: 0xffab00, // Moderate LCX
      emissive: 0xff6d00,
      emissiveIntensity: 0.85,
      roughness: 0.2,
    });

    // Aorta Arch (Top Trunk)
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 0.95, 0.1),
      new THREE.Vector3(-0.05, 1.75, -0.05),
      new THREE.Vector3(0.55, 1.95, -0.28),
      new THREE.Vector3(0.95, 1.35, -0.45),
      new THREE.Vector3(0.98, 0.4, -0.5),
    ]);
    const aortaMesh = new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 40, 0.26, 18, false), vesselMaterialCyan);
    mainGroup.add(aortaMesh);

    // Pulmonary Trunk
    const pulmCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 0.85, 0.35),
      new THREE.Vector3(-0.35, 1.5, 0.2),
      new THREE.Vector3(-0.75, 1.7, -0.1),
    ]);
    const pulmMesh = new THREE.Mesh(new THREE.TubeGeometry(pulmCurve, 30, 0.2, 16, false), vesselMaterialCyan);
    mainGroup.add(pulmMesh);

    // LAD (Left Anterior Descending)
    const ladCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, 1.05, 0.82),
      new THREE.Vector3(-0.05, 0.55, 1.15),
      new THREE.Vector3(-0.14, 0.05, 1.25),
      new THREE.Vector3(-0.24, -0.5, 1.08),
      new THREE.Vector3(-0.2, -1.1, 0.7),
      new THREE.Vector3(-0.1, -1.5, 0.32),
    ]);
    const ladMesh = new THREE.Mesh(new THREE.TubeGeometry(ladCurve, 45, 0.075, 16, false), createVesselMaterial(patient.ladStenosis));
    mainGroup.add(ladMesh);
    ladMeshRef.current = ladMesh;

    // LAD Stenotic Lesion Glow Sphere & Pulsing Ring
    const stenosisGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xff0044 })
    );
    stenosisGlow.position.set(-0.14, 0.05, 1.28);
    mainGroup.add(stenosisGlow);
    stenosisGlowRef.current = stenosisGlow;

    const stenosisRing = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.26, 32),
      new THREE.MeshBasicMaterial({ color: 0xff1744, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    stenosisRing.position.copy(stenosisGlow.position);
    stenosisRing.position.z += 0.05;
    mainGroup.add(stenosisRing);
    stenosisRingRef.current = stenosisRing;

    // LCX (Left Circumflex)
    const lcxCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.15, 1.0, 0.7),
      new THREE.Vector3(-0.65, 0.7, 0.78),
      new THREE.Vector3(-1.15, 0.4, 0.3),
      new THREE.Vector3(-1.25, -0.05, -0.32),
      new THREE.Vector3(-0.95, -0.55, -0.65),
    ]);
    const lcxMesh = new THREE.Mesh(new THREE.TubeGeometry(lcxCurve, 40, 0.065, 16, false), createVesselMaterial(patient.lcxStenosis));
    mainGroup.add(lcxMesh);
    lcxMeshRef.current = lcxMesh;

    // LCX Stenosis Ring (adaptive for LCX >= 50%)
    const lcxStenosisRing = new THREE.Mesh(
      new THREE.RingGeometry(0.14, 0.22, 32),
      new THREE.MeshBasicMaterial({ color: 0xff1744, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    lcxStenosisRing.position.set(-0.65, 0.7, 0.78);
    lcxStenosisRing.visible = patient.lcxStenosis >= 50;
    mainGroup.add(lcxStenosisRing);
    lcxStenosisRingRef.current = lcxStenosisRing;

    // RCA (Right Coronary Artery)
    const rcaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.15, 1.0, 0.7),
      new THREE.Vector3(0.65, 0.65, 0.78),
      new THREE.Vector3(1.1, 0.25, 0.45),
      new THREE.Vector3(1.15, -0.35, 0.1),
      new THREE.Vector3(0.85, -0.9, -0.32),
      new THREE.Vector3(0.4, -1.25, -0.15),
    ]);
    const rcaMesh = new THREE.Mesh(new THREE.TubeGeometry(rcaCurve, 40, 0.065, 16, false), createVesselMaterial(patient.rcaStenosis));
    mainGroup.add(rcaMesh);
    rcaMeshRef.current = rcaMesh;

    // RCA Stenosis Ring (adaptive for RCA >= 50%)
    const rcaStenosisRing = new THREE.Mesh(
      new THREE.RingGeometry(0.14, 0.22, 32),
      new THREE.MeshBasicMaterial({ color: 0xff1744, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    rcaStenosisRing.position.set(0.65, 0.65, 0.78);
    rcaStenosisRing.visible = patient.rcaStenosis >= 50;
    mainGroup.add(rcaStenosisRing);
    rcaStenosisRingRef.current = rcaStenosisRing;

    // Thoracic Branching Tree Lines
    const thoracicCurves = [
      [new THREE.Vector3(-0.35, 1.5, 0.2), new THREE.Vector3(-1.2, 2.1, 0.4), new THREE.Vector3(-1.9, 2.5, 0.2), new THREE.Vector3(-2.6, 2.8, -0.2)],
      [new THREE.Vector3(-1.2, 2.1, 0.4), new THREE.Vector3(-1.6, 1.5, 0.1), new THREE.Vector3(-2.2, 1.1, -0.3)],
      [new THREE.Vector3(-1.9, 2.5, 0.2), new THREE.Vector3(-2.5, 2.1, 0.0), new THREE.Vector3(-3.0, 1.6, -0.4)],
      [new THREE.Vector3(0.55, 1.95, -0.28), new THREE.Vector3(1.3, 2.2, 0.3), new THREE.Vector3(2.0, 2.5, 0.1), new THREE.Vector3(2.7, 2.7, -0.3)],
      [new THREE.Vector3(1.3, 2.2, 0.3), new THREE.Vector3(1.7, 1.6, 0.0), new THREE.Vector3(2.3, 1.2, -0.4)],
      [new THREE.Vector3(2.0, 2.5, 0.1), new THREE.Vector3(2.6, 2.0, -0.1), new THREE.Vector3(3.1, 1.5, -0.5)],
      [new THREE.Vector3(-0.95, -0.55, -0.65), new THREE.Vector3(-1.8, -0.7, -0.2), new THREE.Vector3(-2.5, -1.2, -0.5)],
      [new THREE.Vector3(0.85, -0.9, -0.32), new THREE.Vector3(1.7, -1.0, -0.1), new THREE.Vector3(2.4, -1.5, -0.5)],
    ];

    const thoracicMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
    });

    thoracicCurves.forEach((pts) => {
      const c = new THREE.CatmullRomCurve3(pts);
      const m = new THREE.Mesh(new THREE.TubeGeometry(c, 24, 0.032, 10, false), thoracicMat);
      mainGroup.add(m);
    });

    // 3. Bio-Photonic Dust Particles
    const particleCount = 280;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pCol = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 6.5;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 6.0;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 4.0;

      if (Math.random() > 0.4) {
        pCol[i * 3] = 0.0;
        pCol[i * 3 + 1] = 0.85;
        pCol[i * 3 + 2] = 1.0;
      } else {
        pCol[i * 3] = 1.0;
        pCol[i * 3 + 1] = 0.1;
        pCol[i * 3 + 2] = 0.35;
      }
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.048,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse and Touch Interaction Handlers
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      if (mainGroupRef.current) {
        mainGroupRef.current.rotation.y += deltaX * 0.008;
        mainGroupRef.current.rotation.x += deltaY * 0.008;
        mainGroupRef.current.rotation.x = Math.max(-1.2, Math.min(1.2, mainGroupRef.current.rotation.x));
      }

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
      if (mainGroupRef.current) {
        mainGroupRef.current.rotation.y += deltaX * 0.008;
        mainGroupRef.current.rotation.x += deltaY * 0.008;
      }
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    domEl.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Cardiac systole/diastole beat cycle
      const hrSpeed = (patient.restingHr || 78) / 60 * 2.8;
      const beatPrimary = Math.sin(t * hrSpeed);
      const beatSecondary = Math.sin(t * hrSpeed + 0.5);
      const pulseScale = 1.0 + (beatPrimary > 0.65 ? Math.pow(beatPrimary, 4.0) * 0.055 : 0.0) + (beatSecondary > 0.8 ? 0.02 : 0.0);

      if (innerHeartRef.current) {
        innerHeartRef.current.scale.set(pulseScale, pulseScale * 1.025, pulseScale);
      }
      if (wireHeartRef.current) {
        wireHeartRef.current.scale.set(pulseScale * 1.015, pulseScale * 1.03, pulseScale * 1.015);
      }

      // Stenosis hotspot pulsing glow
      if (stenosisRingRef.current) {
        const ringScale = 1.0 + Math.sin(t * 6.5) * 0.38;
        stenosisRingRef.current.scale.set(ringScale, ringScale, 1.0);
        const mat = stenosisRingRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.45 + Math.sin(t * 6.5) * 0.45;
      }
      if (lcxStenosisRingRef.current && lcxStenosisRingRef.current.visible) {
        const ringScale = 1.0 + Math.sin(t * 6.5 + 1.0) * 0.38;
        lcxStenosisRingRef.current.scale.set(ringScale, ringScale, 1.0);
        const mat = lcxStenosisRingRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.45 + Math.sin(t * 6.5 + 1.0) * 0.45;
      }
      if (rcaStenosisRingRef.current && rcaStenosisRingRef.current.visible) {
        const ringScale = 1.0 + Math.sin(t * 6.5 + 2.0) * 0.38;
        rcaStenosisRingRef.current.scale.set(ringScale, ringScale, 1.0);
        const mat = rcaStenosisRingRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.45 + Math.sin(t * 6.5 + 2.0) * 0.45;
      }

      // Gentle auto rotation if active and user not dragging
      if (autoRotate && !isDraggingRef.current && mainGroupRef.current) {
        mainGroupRef.current.rotation.y += 0.006;
      }

      particles.rotation.y = t * 0.025;
      particles.rotation.x = Math.sin(t * 0.015) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      baseGeo.dispose();
      wireGeo.dispose();
    };
  }, [patient.restingHr]);

  // Handle dynamic visibility & highlight updates
  useEffect(() => {
    if (innerHeartRef.current) {
      innerHeartRef.current.visible = showMyocardium;
    }
  }, [showMyocardium]);

  useEffect(() => {
    if (stenosisRingRef.current && stenosisGlowRef.current) {
      stenosisRingRef.current.visible = highlightLad || patient.ladStenosis >= 50;
      stenosisGlowRef.current.visible = highlightLad || patient.ladStenosis >= 50;
    }
  }, [highlightLad, patient.ladStenosis]);

  // Dynamic vessel material update when stenosis percentages change
  useEffect(() => {
    if (ladMeshRef.current) {
      ladMeshRef.current.material = createVesselMaterial(patient.ladStenosis);
    }
    if (lcxMeshRef.current) {
      lcxMeshRef.current.material = createVesselMaterial(patient.lcxStenosis);
    }
    if (rcaMeshRef.current) {
      rcaMeshRef.current.material = createVesselMaterial(patient.rcaStenosis);
    }
    if (lcxStenosisRingRef.current) {
      lcxStenosisRingRef.current.visible = patient.lcxStenosis >= 50;
    }
    if (rcaStenosisRingRef.current) {
      rcaStenosisRingRef.current.visible = patient.rcaStenosis >= 50;
    }
  }, [patient.ladStenosis, patient.lcxStenosis, patient.rcaStenosis]);

  // Handle reset view trigger
  useEffect(() => {
    if (resetTrigger > 0 && mainGroupRef.current) {
      mainGroupRef.current.rotation.set(0, 0, 0);
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 0.4, 5.4);
      }
    }
  }, [resetTrigger]);

  return (
    <div className="relative w-full h-full cursor-grab active:cursor-grabbing select-none">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
