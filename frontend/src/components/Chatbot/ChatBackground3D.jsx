import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text, Stars, Sparkles, Torus } from '@react-three/drei'
import * as THREE from 'three'

// Premium Golden Material Helper
const GoldenMaterial = ({ opacity = 1, transparent = false, wireframe = false }) => (
    <meshStandardMaterial
        color="#D4AF37"
        roughness={0.2}
        metalness={0.9}
        envMapIntensity={1}
        emissive="#B8860B"
        emissiveIntensity={0.2}
        transparent={transparent}
        opacity={opacity}
        wireframe={wireframe}
    />
)

// Floating Legal Symbol Component with Default Font
function LegalSymbol({ symbol, position, rotation, scale, floatingRange = [-0.1, 0.1] }) {
    const meshRef = useRef()

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        meshRef.current.rotation.x = rotation[0] + Math.sin(t * 0.3) * 0.05
        meshRef.current.rotation.y = rotation[1] + Math.cos(t * 0.2) * 0.05
    })

    return (
        <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.5}
            floatingRange={floatingRange}
        >
            <group position={position} rotation={rotation} scale={scale} ref={meshRef}>
                <Text
                    fontSize={1}
                    letterSpacing={-0.05}
                    anchorX="center"
                    anchorY="middle"
                // Removed custom font URL to ensure reliability
                >
                    {symbol}
                    <GoldenMaterial />
                </Text>
            </group>
        </Float>
    )
}

// Geometric Abstract "Pillar" or "Scroll"
function AbstractShape({ position, rotation, scale }) {
    return (
        <Float speed={1} rotationIntensity={0.4} floatIntensity={0.4}>
            <group position={position} rotation={rotation} scale={scale}>
                {/* Abstract Pillar/Column Ring */}
                <Torus args={[0.6, 0.05, 16, 32]}>
                    <GoldenMaterial />
                </Torus>
                {/* Inner Wireframe Geometry */}
                <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                    <octahedronGeometry args={[0.4, 0]} />
                    <GoldenMaterial wireframe transparent opacity={0.3} />
                </mesh>
            </group>
        </Float>
    )
}

// Background Particles
function GoldenDust() {
    return (
        <Sparkles
            count={100}
            scale={12}
            size={4}
            speed={0.4}
            opacity={0.8}
            color="#FFD700"
        />
    )
}

function Scene() {
    return (
        <group>
            {/* Central Focal Point (Subtle) */}
            <pointLight position={[0, 0, 5]} intensity={2} color="#FFD700" distance={15} />

            {/* Floating Symbols scattered in depth */}
            <LegalSymbol
                symbol="§"
                position={[-2.5, 1, -2]}
                rotation={[0, 0.2, 0]}
                scale={2.5}
            />

            <LegalSymbol
                symbol="¶"
                position={[3, -1.5, -4]}
                rotation={[0, -0.3, 0.1]}
                scale={2}
            />

            {/* Added Abstract Shapes for more visual interest */}
            <AbstractShape position={[-3.5, -2, -3]} rotation={[0.5, 0.5, 0]} scale={1.5} />
            <AbstractShape position={[3.5, 2, -5]} rotation={[-0.5, 0.5, 0]} scale={1.2} />

            <LegalSymbol
                symbol="⚖"
                position={[0, 0, -6]} // Centered in background
                rotation={[0, 0, 0]}
                scale={4}
            />

            {/* Atmospheric Particles */}
            <GoldenDust />

            <Stars
                radius={100}
                depth={50}
                count={2000}
                factor={3}
                saturation={0}
                fade
                speed={0.5}
            />
        </group>
    )
}

const ChatBackground3D = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]">
            {/* Lighter Overlay Gradient */}
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#000000]/20 to-[#000000]/70 z-10" />

            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.5 }}
                dpr={[1, 2]}
            >
                <ambientLight intensity={0.5} />
                <spotLight
                    position={[10, 10, 10]}
                    angle={0.2}
                    penumbra={1}
                    intensity={1.5}
                    color="#FFFEFA"
                />
                <pointLight position={[-10, -5, -10]} intensity={0.8} color="#B8860B" />

                <Scene />

                <fog attach="fog" args={['#050505', 5, 30]} />
            </Canvas>
        </div>
    )
}

export default ChatBackground3D
