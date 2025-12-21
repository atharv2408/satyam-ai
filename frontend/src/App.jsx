import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Loader from '@components/Layout/Loader'
import ProtectedRoute from '@components/Layout/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation()

    useEffect(() => {
        // Simulate initial loading only on first visit
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 2500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="app bg-black min-h-screen">
            <AnimatePresence mode="wait">
                {isLoading && <Loader key="loader" />}
            </AnimatePresence>

            {!isLoading && (
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/chat" element={
                        <ProtectedRoute>
                            <ChatPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            )}
        </div>
    )
}

export default App
