import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'

// Layout Components
import Navbar from '@components/Layout/Navbar'
import Footer from '@components/Layout/Footer'

// Section Components
import Hero from '@components/Hero/Hero'
import Features from '@components/Features/Features'
import About from '@components/About/About'


// Fixed Background Components
import Emblem3D from '@components/Hero/Emblem3D'
import Particles from '@components/Hero/Particles'
import FloatingText from '@components/Hero/FloatingText'

// UI Components
import FloatingChatButton from '@components/UI/FloatingChatButton'

const LandingPage = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()

    const handleStartChat = () => {
        if (!isAuthenticated) {
            navigate('/login')
        } else {
            navigate('/chat')
        }
    }

    return (
        <div className="landing-page bg-black relative min-h-screen">
            <Navbar onChatClick={handleStartChat} />

            {/* Fixed Background Layer (Emblem + Particles) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Emblem3D />
                <Particles />
                <FloatingText />
            </div>

            {/* Vertical Scroll Layout */}
            <main className="relative z-10 flex flex-col">
                <Hero onStartChat={handleStartChat} />
                <Features />
                <About />

            </main>

            <Footer />

            <FloatingChatButton
                onClick={handleStartChat}
                isHidden={false}
            />
        </div>
    )
}

export default LandingPage
