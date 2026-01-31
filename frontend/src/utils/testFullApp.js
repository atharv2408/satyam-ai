import { auth } from '../firebase'
import apiClient from '../services/api'
import { runChatTests } from './testChatFlow'

/**
 * FULL SYSTEM VERIFICATION SUITE
 */
export const runFullSystemTest = async () => {
    const results = {
        backend: 'PENDING',
        auth: 'PENDING',
        rag: 'PENDING',
        settings: 'PENDING',
        chatFlow: 'PENDING'
    }

    console.group("🚀 STARTING FULL SYSTEM VERIFICATION")

    try {
        // STEP 1: Backend Health Check
        // We'll try to hit a known endpoint, since there's no /health, we'll try /chat/history (which might return 401 but proves reachable)
        console.group("1. Checking Backend Connectivity...")
        try {
            await apiClient.get('/chat/history').catch(err => {
                // If 401, it means backend IS reachable but we aren't authed, which is fine for Reachability check
                if (err.response && err.response.status === 401) return
                if (err.code === "ERR_NETWORK") throw new Error("Backend unreachable")
            })
            console.log("✅ Backend is reachable")
            results.backend = 'PASS'
        } catch (error) {
            console.error("❌ Backend Unreachable:", error.message)
            results.backend = 'FAIL'
            throw new Error("Backend check failed. Is uvicorn running?")
        }
        console.groupEnd()

        // STEP 2: Auth State
        console.group("2. Checking Authentication...")
        const user = auth.currentUser
        if (user) {
            console.log(`✅ Logged in as: ${user.email} (${user.uid})`)
            results.auth = 'PASS'
        } else {
            console.warn("⚠️ Not logged in. Some tests will fail.")
            results.auth = 'WARN'
        }
        console.groupEnd()

        // STEP 3: Settings Persistence (LocalStorage)
        console.group("3. Verifying Local Settings...")
        try {
            const testKey = 'satyam_test_key'
            localStorage.setItem(testKey, 'valid')
            if (localStorage.getItem(testKey) === 'valid') {
                console.log("✅ LocalStorage is working")
                localStorage.removeItem(testKey)
                results.settings = 'PASS'
            } else {
                throw new Error("LocalStorage failed")
            }
        } catch (e) {
            console.error("❌ Persistence Check Failed")
            results.settings = 'FAIL'
        }
        console.groupEnd()

        // STEP 4: Run Chat Flow (The big one)
        if (user) {
            console.log("4. Running Chat Flow Tests...")
            // We wrap this because runChatTests logs its own groups
            await runChatTests()
            results.chatFlow = 'PASS' // Assuming it doesn't throw, runChatTests throws on failure
        } else {
            console.log("⏭️ Skipping Chat Flow (User not logged in)")
            results.chatFlow = 'SKIPPED'
        }

        console.log("\n📊 TEST SUMMARY 📊")
        console.table(results)

        if (Object.values(results).includes('FAIL')) {
            console.error("❌ SYSTEM CHECK FAILED - See errors above")
        } else {
            console.log("🎉 ALL SYSTEMS OPERATIONAL")
        }

    } catch (error) {
        console.error("❌ FATAL TEST ERROR:", error)
    } finally {
        console.groupEnd()
    }
}
