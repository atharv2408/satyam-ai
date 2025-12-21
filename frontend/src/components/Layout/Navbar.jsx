import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Repeat, ChevronDown } from 'lucide-react'
import { NAV_LINKS, APP_CONFIG } from '@constants'
import Button from '@components/UI/Button'
import { useAuth } from '@context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ onChatClick }) => {
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()

    const [isScrolled, setIsScrolled] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            setIsScrolled(currentScrollY > 50)
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                setIsHidden(true)
            } else {
                setIsHidden(false)
            }
            setLastScrollY(currentScrollY)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    const handleLogout = () => {
        logout()
        setIsUserMenuOpen(false)
        setIsMobileMenuOpen(false)
        navigate('/')
    }

    const handleSwitchAccount = () => {
        logout()
        setIsUserMenuOpen(false)
        navigate('/login')
    }

    const navbarClasses = `
    navbar fixed top-0 left-0 right-0 z-[200] transition-all duration-300
    ${isScrolled ? 'scrolled bg-black/95 backdrop-blur-xl py-2 border-b border-gold-500/10' : 'py-4'}
    ${isHidden ? 'hidden -translate-y-full' : ''}
  `

    return (
        <nav className={navbarClasses}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2">
                    <span className="text-2xl">⚖️</span>
                    <span className="font-serif text-xl font-semibold text-gold-500 tracking-wider">
                        {APP_CONFIG.NAME}
                    </span>
                </a>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <li key={link.name}>
                            <a
                                href={link.href}
                                className="nav-link text-sm font-medium text-gray-300 hover:text-gold-500 transition-colors"
                            >
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden md:flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-full border border-gold-500/20 bg-gold-500/5 hover:bg-gold-500/10 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center text-black font-bold text-sm">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="text-sm text-gold-500 font-medium max-w-[100px] truncate">
                                    {user?.name?.split(' ')[0]}
                                </span>
                                <ChevronDown size={14} className={`text-gold-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* User Dropdown */}
                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-64 bg-black/95 border border-gold-500/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                                    >
                                        <div className="p-4 border-b border-white/10">
                                            <p className="text-white font-medium truncate">{user?.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            <button
                                                onClick={handleSwitchAccount}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                <Repeat size={16} />
                                                Switch Account
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <a
                            href="/login"
                            className="px-6 py-3 text-base font-semibold text-gold-500 hover:text-white transition-colors"
                        >
                            Login
                        </a>
                    )}

                    <Button onClick={onChatClick} size="sm">
                        Start Legal Chat
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 text-gold-500"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gold-500/10"
                    >
                        <div className="px-6 py-4 space-y-4">
                            {isAuthenticated && (
                                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center text-black font-bold">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{user?.name}</p>
                                        <p className="text-xs text-gray-400">{user?.email}</p>
                                    </div>
                                </div>
                            )}

                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block text-gray-300 hover:text-gold-500 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}

                            <Button onClick={onChatClick} className="w-full mt-4">
                                Start Legal Chat
                            </Button>

                            {isAuthenticated ? (
                                <div className="space-y-2 pt-2">
                                    <button
                                        onClick={handleSwitchAccount}
                                        className="w-full flex items-center justify-center gap-2 py-2 text-gray-300 border border-white/10 rounded-lg hover:bg-white/5"
                                    >
                                        <Repeat size={16} /> Switch Account
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 py-2 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/10"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <a
                                    href="/login"
                                    className="block w-full text-center py-2 text-gold-500 font-semibold border border-gold-500/20 rounded-full mt-2"
                                >
                                    Login
                                </a>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

export default Navbar
