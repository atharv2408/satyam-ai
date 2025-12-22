import React, { useState } from 'react'
import {
    X,
    Moon,
    Sun,
    Monitor,
    Type,
    Download,
    Trash2,
    Languages,
    Shield,
    Smartphone,
    Settings
} from 'lucide-react'
import Button from '@components/UI/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat as useChatContext } from '@context/ChatContext'

const SettingsModal = ({ isOpen, onClose, messages, onClear }) => {
    const { settings, updateSettings } = useChatContext()
    const [activeTab, setActiveTab] = useState('general')

    if (!isOpen) return null

    const handleExport = () => {
        const historyText = messages
            .map(m => `${m.type === 'user' ? 'You' : 'Satyam AI'} (${new Date(m.timestamp).toLocaleString()}):\n${m.content}\n`)
            .join('\n---\n\n')

        const blob = new Blob([historyText], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `satyam-ai-chat-${new Date().toISOString().slice(0, 10)}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }



    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'data', label: 'Data & Privacy', icon: Shield }
    ]

    // Helper for Text Size Classes (Preview)
    const getTextSizePreview = (size) => {
        switch (size) {
            case 'small': return 'text-xs'
            case 'large': return 'text-lg'
            default: return 'text-sm'
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-[#0F0F0F] border border-gold-500/20 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gold-500/10 bg-black/40">
                        <h2 className="text-lg font-display text-white">Settings</h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex">
                        {/* Sidebar Tabs */}
                        <div className="w-1/3 border-r border-gold-500/10 bg-black/20 p-2 space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-gold-500/10 text-gold-500'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Panel Content */}
                        <div className="flex-1 p-4 bg-gradient-to-br from-[#0F0F0F] to-[#141414]">

                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    {/* Appearance */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Appearance</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['light', 'dark', 'system'].map((theme) => (
                                                <button
                                                    key={theme}
                                                    onClick={() => updateSettings({ theme })}
                                                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${settings.theme === theme
                                                        ? 'bg-gold-500/10 border-gold-500/50 text-gold-500'
                                                        : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {theme === 'light' && <Sun size={18} />}
                                                    {theme === 'dark' && <Moon size={18} />}
                                                    {theme === 'system' && <Monitor size={18} />}
                                                    <span className="text-[10px] capitalize">{theme}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Text Size */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Text Size</label>
                                        <div className="space-y-2">
                                            <div className="flex p-1 bg-black/40 rounded-lg border border-white/5">
                                                {['small', 'medium', 'large'].map((size) => (
                                                    <button
                                                        key={size}
                                                        onClick={() => updateSettings({ textSize: size })}
                                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-xs transition-all ${settings.textSize === size
                                                            ? 'bg-gold-500 text-black font-medium shadow-lg'
                                                            : 'text-gray-400 hover:text-white'
                                                            }`}
                                                    >
                                                        <span className={size === 'small' ? 'text-xs' : size === 'large' ? 'text-sm' : 'text-xs'}>Aa</span>
                                                        <span className="capitalize">{size}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <p className={`text-center text-gray-400 italic ${getTextSizePreview(settings.textSize)}`}>
                                                The quick brown fox jumps over the lazy dog.
                                            </p>
                                        </div>
                                    </div>


                                </div>
                            )}

                            {activeTab === 'data' && (
                                <div className="space-y-6">
                                    {/* Export */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Data Management</label>
                                        <button
                                            onClick={handleExport}
                                            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gold-500/10 rounded-lg text-gold-500 group-hover:text-gold-400">
                                                    <Download size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-200">Export Chat</p>
                                                    <p className="text-xs text-gray-500">Download formatted .txt</p>
                                                </div>
                                            </div>
                                        </button>


                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}



export default SettingsModal
