import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles, Icosahedron, Torus } from '@react-three/drei'
import * as THREE from 'three'

const GoldenMaterial = ({ wireframe = false, opacity = 1 }) => (
    <meshStandardMaterial
        color="#FDE047"
        roughness={0.4}
        metalness={0.8}
        emissive="#B8860B"
        emissiveIntensity={0.1}
        wireframe={wireframe}
        transparent
        opacity={opacity}
    />
)

function RotatingGeometry() {
    const meshRef = useRef()

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        meshRef.current.rotation.x = t * 0.1
        meshRef.current.rotation.y = t * 0.15
    })

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={meshRef} scale={1.2}>
                {/* Main Geometric Core */}
                <Icosahedron args={[1.5, 0]}>
                    <GoldenMaterial wireframe opacity={0.3} />
                </Icosahedron>

                {/* Inner Solid Core (Subtle) */}
                <Icosahedron args={[0.8, 0]}>
                    <meshStandardMaterial color="#B8860B" roughness={0.1} metalness={1} opacity={0.1} transparent />
                </Icosahedron>

                {/* Orbiting Ring */}
                <group rotation={[Math.PI / 3, 0, 0]}>
                    <Torus args={[2.2, 0.02, 16, 100]}>
                        <GoldenMaterial opacity={0.4} />
                    </Torus>
                </group>
            </group>
        </Float>
    )
}

const AuthBackground3D = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90" />

            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />

                {/* Visuals */}
                <RotatingGeometry />

                {/* Background Particles (Different form than Chat) */}
                <Sparkles
                    count={150}
                    scale={8}
                    size={2}
                    speed={0.3}
                    opacity={0.4}
                    color="#D4AF37"
                />
            </Canvas>
        </div>
    )
}

export default AuthBackground3D
