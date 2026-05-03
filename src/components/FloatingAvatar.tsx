import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera } from '@react-three/drei';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import * as THREE from 'three';

function AvatarMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scrollYProgress } = useScroll();

  // Color transforms based on scroll
  const colorTransform = useTransform(
    scrollYProgress, 
    [0, 0.25, 0.5, 0.75, 1], 
    ["#2dd4bf", "#f97316", "#2dd4bf", "#f97316", "#2dd4bf"]
  );
  const emissiveTransform = useTransform(
    scrollYProgress, 
    [0, 0.25, 0.5, 0.75, 1], 
    ["#0d9488", "#c2410c", "#0d9488", "#c2410c", "#0d9488"]
  );

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.015;
      
      // Look at mouse/cursor subtly
      const mouseX = (state.mouse.x * Math.PI) / 10;
      const mouseY = (state.mouse.y * Math.PI) / 10;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -mouseY, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouseX, 0.1);

      // Update material color manually for performance
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.color.set(colorTransform.get());
      material.emissive.set(emissiveTransform.get());
    }
  });

  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <Sphere 
        ref={meshRef} 
        args={[1, 64, 64]} 
      >
        <MeshDistortMaterial
          color="#2dd4bf"
          speed={4}
          distort={0.4}
          radius={1}
          roughness={0.1}
          metalness={0.8}
          emissive="#0d9488"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
}

export default function FloatingAvatar() {
  const { scrollYProgress } = useScroll();
  
  // Animate position across the screen based on scroll
  const xBase = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.8, 1], ['85%', '15%', '80%', '20%', '50%']);
  const yBase = useTransform(scrollYProgress, [0, 0.3, 0.6, 0.8, 1], ['20%', '40%', '60%', '80%', '95%']);
  
  const springConfig = { damping: 30, stiffness: 100 };
  const x = useSpring(xBase, springConfig);
  const y = useSpring(yBase, springConfig);
  
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.8, 1.2, 0.9, 1.5, 1]);
  
  // Backgound glow color shifting to match the avatar
  const glowColor = useTransform(
    scrollYProgress, 
    [0, 0.25, 0.5, 0.75, 1], 
    ["rgba(45, 212, 191, 0.2)", "rgba(249, 115, 22, 0.2)", "rgba(45, 212, 191, 0.2)", "rgba(249, 115, 22, 0.2)", "rgba(45, 212, 191, 0.2)"]
  );

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        translateX: '-50%',
        translateY: '-50%',
        width: '800px',
        height: '800px',
        zIndex: -1,
        backgroundColor: glowColor,
        filter: 'blur(120px) brightness(1.2)',
        pointerEvents: 'none',
        scale,
        opacity: useTransform(scrollYProgress, [0, 0.1], [0.3, 0.6]),
        mixBlendMode: 'screen' 
      }}
      className="hidden md:block pointer-events-none"
    >
      <Canvas style={{ pointerEvents: 'none' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={3} />
        <AvatarMesh />
      </Canvas>
    </motion.div>
  );
}
