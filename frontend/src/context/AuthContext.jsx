import React, { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, signup as apiSignup } from '@services/api'
import apiClient from '@services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for stored token
        const token = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')
        if (token && savedUser) {
            setUser(JSON.parse(savedUser))
            // Set default header
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const data = await apiLogin(email, password)
            localStorage.setItem('token', data.access_token)
            localStorage.setItem('user', JSON.stringify({ name: data.user_name, email: data.user_email }))
            setUser({ name: data.user_name, email: data.user_email })
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
            return { success: true }
        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.message || 'Login failed'
            return { success: false, error: errorMessage }
        }
    }

    const signup = async (name, email, password) => {
        try {
            const data = await apiSignup(name, email, password)
            localStorage.setItem('token', data.access_token)
            localStorage.setItem('user', JSON.stringify({ name: data.user_name, email: data.user_email }))
            setUser({ name: data.user_name, email: data.user_email })
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
            return { success: true }
        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.message || 'Signup failed'
            return { success: false, error: errorMessage }
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        delete apiClient.defaults.headers.common['Authorization']
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
