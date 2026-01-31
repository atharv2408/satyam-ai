import React, { createContext, useContext, useState, useEffect } from 'react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth'
import { auth } from '../firebase'
import apiClient from '@services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser)

            if (currentUser) {
                // Get ID token and set header
                const token = await currentUser.getIdToken()
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`

                // Store minimal info if needed for other parts of app that read localStorage
                // though it's better to rely on context
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify({
                    name: currentUser.displayName,
                    email: currentUser.email
                }))
            } else {
                delete apiClient.defaults.headers.common['Authorization']
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }

            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            return { success: true }
        } catch (error) {
            console.error("Login Error:", error)
            const errorMessage = error.message || 'Login failed'
            // Map common firebase errors to user friendly messages if needed
            return { success: false, error: errorMessage }
        }
    }

    const signup = async (name, email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)

            // Update profile with name
            await updateProfile(userCredential.user, {
                displayName: name
            })

            return { success: true }
        } catch (error) {
            console.error("Signup Error:", error)
            const errorMessage = error.message || 'Signup failed'
            return { success: false, error: errorMessage }
        }
    }

    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error("Logout Error:", error)
        }
    }

    const value = {
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
