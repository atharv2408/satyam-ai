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


// UI Components
import FloatingChatButton from '@components/UI/FloatingChatButton'

const LandingPage = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [isFooterVisible, setIsFooterVisible] = React.useState(false)

    const handleStartChat = () => {
        if (!isAuthenticated) {
            navigate('/login')
        } else {
            navigate('/chat')
        }
    }

    React.useEffect(() => {
        const handleScroll = () => {
            const footer = document.getElementById('contact')
            if (footer) {
                const rect = footer.getBoundingClientRect()
                const windowHeight = window.innerHeight
                // Check if footer is visible in the viewport
                if (rect.top <= windowHeight) {
                    setIsFooterVisible(true)
                } else {
                    setIsFooterVisible(false)
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="landing-page relative min-h-screen">
            <Navbar onChatClick={handleStartChat} />



            {/* Legacy Background Removed - Using GlobalBackground.jsx */}


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
