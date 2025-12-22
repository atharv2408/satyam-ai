import React from 'react'
import { Twitter, Linkedin, Github } from 'lucide-react'
import { APP_CONFIG, FOOTER_LINKS } from '@constants'

const Footer = () => {
    const socialLinks = [
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Github, href: '#', label: 'GitHub' },
    ]

    return (
        <footer id="contact" className="footer bg-charcoal border-t border-gold-500/10">
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 pb-12 border-b border-white/5">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">⚖️</span>
                            <span className="font-serif text-2xl font-semibold text-gold-500 tracking-wider">
                                {APP_CONFIG.NAME}
                            </span>
                        </div>
                        <p className="font-serif text-sm text-gold-500/80 tracking-widest uppercase mb-4">
                            {APP_CONFIG.TAGLINE}
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            AI-powered legal intelligence for India, built on constitutional
                            values and the principle of सत्यमेव जयते.
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                            <div key={category}>
                                <h4 className="font-serif text-white mb-4 capitalize">{category}</h4>
                                <ul className="space-y-2">
                                    {links.map((link) => (
                                        <li key={link.name}>
                                            <a
                                                href={link.href}
                                                className="text-sm text-gray-500 hover:text-gold-500 transition-colors"
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <p className="text-sm text-gray-600">
                            © {new Date().getFullYear()} {APP_CONFIG.NAME}. All rights reserved.
                        </p>
                        <span className="hidden md:block text-gray-700">•</span>
                        <p className="text-sm text-gray-500 font-medium tracking-wide">
                            Created by <span className="text-gold-500/80 hover:text-gold-500 transition-colors cursor-default">Atharv Munj</span>
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                        {socialLinks.map(({ icon: Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="social-link w-10 h-10 flex items-center justify-center bg-white/5 rounded-lg text-gray-400 hover:bg-gold-500 hover:text-black transition-all"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
