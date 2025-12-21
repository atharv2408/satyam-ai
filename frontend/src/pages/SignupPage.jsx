import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Lock, AlertCircle } from 'lucide-react'
import Button from '@components/UI/Button'
import { useAuth } from '@context/AuthContext'

const SignupPage = () => {
    const navigate = useNavigate()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)
        const result = await signup(formData.name, formData.email, formData.password)
        setIsLoading(false)

        if (result.success) {
            navigate('/chat')
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-gold-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="absolute top-0 left-0 p-6 z-20">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>
            </header>

            <div className="flex-1 flex items-center justify-center p-6 z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white/[0.02] border border-gold-500/10 p-8 rounded-2xl backdrop-blur-sm"
                >
                    <div className="text-center mb-8">
                        <span className="text-4xl mb-4 block">🏛️</span>
                        <h1 className="font-serif text-3xl text-white mb-2">Create Account</h1>
                        <p className="text-gray-400">Join SATYAM AI for legal intelligence</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                            <AlertCircle size={18} />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full bg-black/50 border border-gold-500/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-gold-500 transition-colors outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full bg-black/50 border border-gold-500/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-gold-500 transition-colors outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    className="w-full bg-black/50 border border-gold-500/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-gold-500 transition-colors outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-300">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    className="w-full bg-black/50 border border-gold-500/20 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:border-gold-500 transition-colors outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>

                    <p className="text-center mt-6 text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-gold-500 hover:text-gold-400 font-medium">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default SignupPage
