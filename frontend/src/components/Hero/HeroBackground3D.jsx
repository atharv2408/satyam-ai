import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Sparkles, Icosahedron, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Premium Golden Material
const GoldMaterial = ({ wireframe = false, opacity = 1 }) => (
    <meshStandardMaterial
        color="#FDE047" // Lighter gold for visibility
        emissive="#B45309"
        emissiveIntensity={0.2}
        metalness={1}
        roughness={0.1}
        wireframe={wireframe}
        transparent={opacity < 1}
        opacity={opacity}
    />
)

function GoldenLattice() {
    return (
        <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.2}>
            {/* Main Outer Structure */}
            <mesh rotation={[0, 0, Math.PI / 4]}>
                <icosahedronGeometry args={[4, 1]} />
                <GoldMaterial wireframe opacity={0.15} />
            </mesh>

            {/* Inner Core */}
            <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.5}>
                <icosahedronGeometry args={[4, 0]} />
                <GoldMaterial wireframe opacity={0.3} />
            </mesh>
        </Float>
    )
}

function FloatingCrystal({ position, rotation, scale }) {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group position={position} rotation={rotation} scale={scale}>
                <mesh>
                    <octahedronGeometry args={[0.5, 0]} />
                    <MeshDistortMaterial
                        color="#FFD700"
                        envMapIntensity={1}
                        clearcoat={1}
                        clearcoatRoughness={0}
                        metalness={0.5}
                        distort={0.4}
                        speed={2}
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            </group>
        </Float>
    )
}

// Background Particles
function GoldenDust() {
    return (
        <Sparkles
            count={500}
            scale={20}
            size={5}
            speed={0.6}
            opacity={1}
            color="#FEF08A" // Light yellow/gold
        />
    )
}

function Scene() {
    return (
        <group>
            {/* Central Focal Point */}
            <pointLight position={[0, 0, 0]} intensity={1} color="#FFD700" distance={10} />

            <GoldenLattice />

            {/* Floating Geometric Accents representing nodes of law/data */}
            <FloatingCrystal position={[-4, 2, -2]} rotation={[0, 0.5, 0]} scale={1.5} />
            <FloatingCrystal position={[4, -2, -3]} rotation={[0.5, 0, 0]} scale={1.2} />
            <FloatingCrystal position={[0, 3, -5]} rotation={[0, 0, 0.5]} scale={2} />
            <FloatingCrystal position={[-3, -3, -1]} rotation={[0.5, 0.5, 0]} scale={0.8} />

            <GoldenDust />

            <Stars
                radius={50}
                depth={50}
                count={3000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />
        </group>
    )
}

const HeroBackground3D = () => {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#050505] via-[#0f0f0f] to-[#050505]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold-900/10 via-transparent to-transparent z-10 pointer-events-none" />

            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.4} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.5}
                    penumbra={1}
                    intensity={2}
                    color="#FFFEFA"
                />
                <pointLight position={[-10, -5, -5]} intensity={1} color="#B8860B" />

                <Scene />

                <fog attach="fog" args={['#050505', 5, 25]} />
            </Canvas>
        </div>
    )
}

export default HeroBackground3D
