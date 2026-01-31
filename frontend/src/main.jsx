import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ChatProvider } from '@context/ChatContext'
import { AuthProvider } from '@context/AuthContext'
import '@styles/index.css'
import ErrorBoundary from './components/ErrorBoundary'
import { runChatTests } from './utils/testChatFlow'
import { runFullSystemTest } from './utils/testFullApp'

// Expose test functions to window
window.runChatTests = runChatTests
window.runFullSystemTest = runFullSystemTest

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <ChatProvider>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                </ChatProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
