import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
    MeshStandardMaterial,
    CylinderGeometry,
    TorusGeometry,
    SphereGeometry,
    BoxGeometry,
    ConeGeometry,
} from 'three'
import { useEmblemRotation } from '@hooks/useEmblemRotation'

// Gold Material Component
function GoldMaterial({ metalness = 0.9, roughness = 0.2 }) {
    return (
        <meshStandardMaterial
            color="#D4AF37"
            metalness={metalness}
            roughness={roughness}
            envMapIntensity={1.5}
        />
    )
}

// Dark Gold Material Component
function DarkGoldMaterial() {
    return (
        <meshStandardMaterial
            color="#B8860B"
            metalness={0.85}
            roughness={0.3}
        />
    )
}

// Scale of Justice Component
function ScaleOfJustice() {
    return (
        <group position={[0, 0, 0.1]}>
            {/* Central pillar */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.05, 0.08, 1.2, 16]} />
                <GoldMaterial />
            </mesh>

            {/* Horizontal beam */}
            <mesh position={[0, 0.7, 0]}>
                <boxGeometry args={[1.6, 0.06, 0.06]} />
                <GoldMaterial />
            </mesh>

            {/* Left pan */}
            <mesh position={[-0.7, 0.4, 0]}>
                <cylinderGeometry args={[0.25, 0.2, 0.08, 32]} />
                <DarkGoldMaterial />
            </mesh>

            {/* Right pan */}
            <mesh position={[0.7, 0.4, 0]}>
                <cylinderGeometry args={[0.25, 0.2, 0.08, 32]} />
                <DarkGoldMaterial />
            </mesh>

            {/* Chains */}
            {[-0.7, 0.7].map((x, i) => (
                <mesh key={i} position={[x, 0.55, 0]}>
                    <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
                    <GoldMaterial />
                </mesh>
            ))}
        </group>
    )
}

// Ashoka Wheel Component
function AshokaWheel() {
    const spokeCount = 24

    return (
        <group position={[0, -0.5, 0.15]} scale={0.6}>
            {/* Central hub */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
                <GoldMaterial />
            </mesh>

            {/* Spokes */}
            {Array.from({ length: spokeCount }).map((_, i) => {
                const angle = (i / spokeCount) * Math.PI * 2
                return (
                    <mesh
                        key={i}
                        position={[Math.cos(angle) * 0.35, Math.sin(angle) * 0.35, 0]}
                        rotation={[0, 0, angle + Math.PI / 2]}
                    >
                        <boxGeometry args={[0.02, 0.4, 0.02]} />
                        <GoldMaterial />
                    </mesh>
                )
            })}

            {/* Outer rim */}
            <mesh>
                <torusGeometry args={[0.55, 0.03, 8, 48]} />
                <GoldMaterial />
            </mesh>
        </group>
    )
}

// Lion Capital Symbol (Simplified)
function LionCapitalSymbol() {
    return (
        <group position={[0, 0, 0.1]} scale={0.8}>
            {/* Three stylized triangles representing lions */}
            {[-0.4, 0, 0.4].map((x, i) => (
                <mesh key={i} position={[x, 1.3, 0]} rotation={[0, 0, Math.PI]}>
                    <coneGeometry args={[0.15, 0.3, 4]} />
                    <GoldMaterial />
                </mesh>
            ))}

            {/* Capital base */}
            <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.6, 0.15, 32]} />
                <DarkGoldMaterial />
            </mesh>
        </group>
    )
}

// Text Ring Decorations
function TextRingDecorations() {
    const segmentCount = 12

    return (
        <group>
            {/* Decorative ring */}
            <mesh>
                <torusGeometry args={[2.0, 0.12, 8, 64]} />
                <DarkGoldMaterial />
            </mesh>

            {/* Segment markers */}
            {Array.from({ length: segmentCount }).map((_, i) => {
                const angle = (i / segmentCount) * Math.PI * 2
                return (
                    <mesh
                        key={i}
                        position={[Math.cos(angle) * 2.0, Math.sin(angle) * 2.0, 0]}
                    >
                        <sphereGeometry args={[0.03, 8, 8]} />
                        <meshStandardMaterial
                            color="#FFD700"
                            metalness={1}
                            roughness={0.1}
                            emissive="#FFD700"
                            emissiveIntensity={0.1}
                        />
                    </mesh>
                )
            })}
        </group>
    )
}

// Main Emblem Group
function EmblemGroup({ rotation, scrollProgress }) {
    const groupRef = useRef()
    const targetRotation = useRef({ x: 0, y: 0 })

    useFrame((state) => {
        if (groupRef.current) {
            // Smooth interpolation for rotation
            targetRotation.current.x += (rotation.x - targetRotation.current.x) * 0.05
            targetRotation.current.y += (rotation.y - targetRotation.current.y) * 0.05

            groupRef.current.rotation.x = targetRotation.current.x
            groupRef.current.rotation.y = targetRotation.current.y

            // Subtle floating animation
            groupRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime) * 0.05

            // Depth motion based on scroll
            groupRef.current.position.z = -scrollProgress * 0.5

            // Scale effect
            const scale = 1 - scrollProgress * 0.2
            groupRef.current.scale.setScalar(scale)
        }
    })

    return (
        <group ref={groupRef} position={[0, 0.5, 0]}>
            {/* Main circular base */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[2.5, 2.5, 0.15, 64]} />
                <GoldMaterial />
            </mesh>

            {/* Outer ring */}
            <mesh>
                <torusGeometry args={[2.6, 0.08, 16, 64]} />
                <GoldMaterial />
            </mesh>

            {/* Inner decorative ring */}
            <mesh>
                <torusGeometry args={[2.2, 0.05, 16, 64]} />
                <DarkGoldMaterial />
            </mesh>

            {/* Components */}
            <ScaleOfJustice />
            <AshokaWheel />
            <LionCapitalSymbol />
            <TextRingDecorations />
        </group>
    )
}

// Lighting Setup
function Lighting() {
    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <directionalLight position={[-5, 3, 3]} intensity={0.5} color="#D4AF37" />
            <directionalLight position={[0, -5, -5]} intensity={0.8} color="#FFD700" />
            <spotLight
                position={[0, 10, 0]}
                intensity={0.6}
                angle={Math.PI / 6}
                penumbra={0.3}
            />
        </>
    )
}

// Main Emblem3D Component
const Emblem3D = () => {
    const { rotation, scrollProgress } = useEmblemRotation()

    return (
        <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            }}
            dpr={Math.min(window.devicePixelRatio, 2)}
        >
            <Lighting />
            <EmblemGroup rotation={rotation} scrollProgress={scrollProgress} />
        </Canvas>
    )
}

export default Emblem3D
