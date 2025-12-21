// API Configuration
export const API_CONFIG = {
    BASE_URL: '/api',
    CHAT_ENDPOINT: '/rag',
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 120000,
}

// App Configuration
export const APP_CONFIG = {
    NAME: import.meta.env.VITE_APP_NAME || 'SATYAM AI',
    TAGLINE: import.meta.env.VITE_APP_TAGLINE || 'Truth. Justice. Intelligence.',
    DESCRIPTION: 'Delivering accurate, explainable, and constitutionally grounded legal insights through trusted AI.',
}

// Navigation Links
export const NAV_LINKS = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
]

// Features Data
export const FEATURES = [
    {
        id: 'constitution',
        icon: 'Shield',
        title: 'Indian Law & Constitution',
        description: 'Deep understanding of the Constitution of India, fundamental rights, directive principles, and the complete Indian legal framework.',
        highlights: ['All Constitutional Articles', 'IPC, CrPC, CPC Coverage', 'State & Central Acts'],
    },
    {
        id: 'verified',
        icon: 'CheckCircle',
        title: 'Verified Legal Sources',
        description: 'Trained exclusively on authentic legal documents, Supreme Court judgments, High Court rulings, and government gazettes.',
        highlights: ['Supreme Court Database', 'High Court Judgments', 'Official Gazette Records'],
    },
    {
        id: 'explainable',
        icon: 'HelpCircle',
        title: 'Explainable AI Reasoning',
        description: 'Every response comes with clear citations, legal references, and step-by-step reasoning you can verify and trust.',
        highlights: ['Citation References', 'Logical Breakdown', 'Precedent Linking'],
    },
    {
        id: 'privacy',
        icon: 'Lock',
        title: 'Privacy-First & Secure',
        description: 'Your legal queries are encrypted and never stored. Complete confidentiality with enterprise-grade security.',
        highlights: ['End-to-End Encryption', 'No Data Retention', 'GDPR Compliant'],
    },
    {
        id: 'users',
        icon: 'Users',
        title: 'Built for Everyone',
        description: 'Designed for citizens, law students, legal professionals, and anyone seeking to understand their rights.',
        highlights: ['Simple Language Mode', 'Professional Mode', 'Multi-language Support'],
    },
    {
        id: 'realtime',
        icon: 'Clock',
        title: 'Real-time Updates',
        description: 'Stay current with the latest amendments, new judgments, and evolving legal interpretations.',
        highlights: ['Live Legal Updates', 'Amendment Alerts', 'New Judgment Feed'],
    },
]





// Chat Suggestions
export const CHAT_SUGGESTIONS = [
    'What are my fundamental rights?',
    'Explain Article 21',
    'How to file an RTI?',
]

// Floating Text Fragments
export const FLOATING_FRAGMENTS = [
    { text: 'Article 14', x: '10%', y: '20%', delay: 0 },
    { text: 'समानता', x: '85%', y: '30%', delay: 2 },
    { text: 'Justice', x: '15%', y: '70%', delay: 4 },
    { text: 'स्वतंत्रता', x: '80%', y: '75%', delay: 6 },
    { text: 'Article 21', x: '50%', y: '85%', delay: 8 },
    { text: 'Equality', x: '25%', y: '45%', delay: 10 },
    { text: 'धर्म', x: '70%', y: '15%', delay: 12 },
]

// Footer Links
export const FOOTER_LINKS = {
    product: [
        { name: 'Features', href: '#features' },
        { name: 'Legal Chat', href: '#chatbot' },
        { name: 'API Access', href: '#' },
        { name: 'Pricing', href: '#' },
    ],
    resources: [
        { name: 'Documentation', href: '#' },
        { name: 'Legal Database', href: '#' },
        { name: 'Case Studies', href: '#' },
        { name: 'Blog', href: '#' },
    ],
    company: [
        { name: 'About Us', href: '#about' },
        { name: 'Careers', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Contact', href: '#' },
    ],
    legal: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Disclaimer', href: '#' },
        { name: 'Cookie Policy', href: '#' },
    ],
}
