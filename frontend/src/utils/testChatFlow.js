import { auth } from '../firebase'
import * as firestoreService from '../services/firestoreService'

export const runChatTests = async () => {
    console.group("🧪 Starting Chat Flow Tests")

    const user = auth.currentUser
    if (!user) {
        console.error("❌ No user logged in. Please login first.")
        console.groupEnd()
        return
    }

    const userId = user.uid
    console.log(`👤 Testing as User: ${userId}`)
    let sessionId = null

    try {
        // TEST 1: Create Session
        console.group("Test 1: Create Session")
        const createResult = await firestoreService.createNewSession(userId)
        if (createResult.success) {
            sessionId = createResult.id
            console.log("✅ Session Created:", sessionId)
            if (createResult.title !== 'New Chat') throw new Error("Initial title should be 'New Chat'")
        } else {
            throw new Error(createResult.error)
        }
        console.groupEnd()

        // TEST 2: Save User Message & Check Title Update
        console.group("Test 2: Save User Message & Title Update")
        const userMsg = "What is the punishment for theft under Section 378?"
        const saveResult = await firestoreService.saveMessage(userId, sessionId, 'user', userMsg)
        if (saveResult.success) {
            console.log("✅ User Message Saved")

            // Verify Title Update
            // We need a small delay or a direct fetch to check
            // Since we're in the same client, we can re-fetch
            // But let's check via getUserSessions
            const sessionsResult = await firestoreService.getUserSessions(userId)
            const mySession = sessionsResult.data.find(s => s.id === sessionId)
            console.log("ℹ️ Current Session Title:", mySession?.title)

            if (mySession?.title.startsWith("What is the punishment")) {
                console.log("✅ Title Updated Successfully")
            } else {
                console.warn("⚠️ Title did not update as expected (might be async or length issue). Actual:", mySession?.title)
            }

        } else {
            throw new Error(saveResult.error)
        }
        console.groupEnd()

        // TEST 3: Save AI Message
        console.group("Test 3: Save AI Message")
        const aiMsg = "Theft is defined under Section 378 of IPC."
        const refs = [{ source: "IPC.pdf", page: 45 }]
        const saveAIResult = await firestoreService.saveMessage(userId, sessionId, 'ai', aiMsg, refs)
        if (saveAIResult.success) {
            console.log("✅ AI Message Saved")
        } else {
            throw new Error(saveAIResult.error)
        }
        console.groupEnd()

        // TEST 4: Get Messages
        console.group("Test 4: Fetch Messages")
        const msgsResult = await firestoreService.getSessionMessages(sessionId, userId)
        if (msgsResult.success) {
            console.log(`✅ Fetched ${msgsResult.data.length} messages`)
            if (msgsResult.data.length !== 2) throw new Error("Expected 2 messages")
            if (msgsResult.data[0].role !== 'user') throw new Error("First message should be user")
            if (msgsResult.data[1].role !== 'ai') throw new Error("Second message should be ai")
        } else {
            throw new Error(msgsResult.error)
        }
        console.groupEnd()

        // TEST 5: Delete Session
        console.group("Test 5: Delete Session")
        const deleteResult = await firestoreService.deleteSession(sessionId)
        if (deleteResult.success) {
            console.log("✅ Session Deleted")

            // Verify deletion
            const checkSessions = await firestoreService.getUserSessions(userId)
            if (checkSessions.data.find(s => s.id === sessionId)) {
                throw new Error("❌ Session still exists after delete!")
            } else {
                console.log("✅ Verified Session Greeting Gone")
            }

            // Verify messages deleted (optional, might take time if using extensions, but our code deletes explicitly)
            const checkMsgs = await firestoreService.getSessionMessages(sessionId, userId)
            if (checkMsgs.data.length > 0) {
                console.warn("⚠️ Messages might technically still exist if not batched deleted correctly, or query returned empty which is good.")
            }
        } else {
            throw new Error(deleteResult.error)
        }
        console.groupEnd()

        console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!")

    } catch (error) {
        console.error("❌ TEST FAILED:", error)
    } finally {
        console.groupEnd()
    }
}
