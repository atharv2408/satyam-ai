import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Sparkles, Stars } from '@react-three/drei'

const GlobalBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] bg-black pointer-events-none">
            {/* Deep Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020202] via-[#0a0a0a] to-[#020202]" />

            <Canvas camera={{ position: [0, 0, 1] }}>
                <Sparkles
                    count={300}
                    scale={10}
                    size={2}
                    speed={0.4}
                    opacity={0.5}
                    color="#FDE047"
                />
                <Stars
                    radius={50}
                    depth={50}
                    count={2000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={0.5}
                />
            </Canvas>
        </div>
    )
}

export default GlobalBackground
