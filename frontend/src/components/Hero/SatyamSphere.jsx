import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Torus, Float, Stars } from '@react-three/drei'

const SatyamSphereContent = () => {
    const sphereRef = useRef()
    const outerRingRef = useRef()
    const innerRingRef = useRef()

    useFrame((state) => {
        const time = state.clock.getElapsedTime()

        // Rotate rings
        if (outerRingRef.current) {
            outerRingRef.current.rotation.x = time * 0.2
            outerRingRef.current.rotation.y = time * 0.1
        }
        if (innerRingRef.current) {
            innerRingRef.current.rotation.x = -time * 0.2
            innerRingRef.current.rotation.z = time * 0.1
        }
    })

    return (
        <group scale={1.2}>
            <Float
                speed={2} // Animation speed
                rotationIntensity={0.5} // xyz rotation intensity
                floatIntensity={0.5} // Up/down float intensity
            >
                {/* Main Liquid Gold Sphere */}
                <Sphere args={[1, 64, 64]} ref={sphereRef}>
                    <MeshDistortMaterial
                        color="#D4AF37" // Gold
                        attach="material"
                        distort={0.4} // Strength, 0 disables the effect (default=1)
                        speed={2} // Speed (default=1)
                        roughness={0.2}
                        metalness={0.9}
                    />
                </Sphere>

                {/* Inner Glowing Ring */}
                <Torus args={[1.4, 0.02, 16, 100]} ref={innerRingRef}>
                    <meshStandardMaterial
                        color="#FFD700"
                        emissive="#FFD700"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.6}
                    />
                </Torus>

                {/* Outer Tech Ring */}
                <Torus args={[1.8, 0.01, 16, 100]} ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial
                        color="#FFF"
                        emissive="#FFF"
                        emissiveIntensity={0.2}
                        transparent
                        opacity={0.3}
                    />
                </Torus>
            </Float>

            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D4AF37" />
        </group>
    )
}

const SatyamSphere = () => {
    return (
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <SatyamSphereContent />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    )
}

export default SatyamSphere
