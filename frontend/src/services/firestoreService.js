import { db, auth } from '../firebase'
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    doc,
    deleteDoc,
    serverTimestamp,
    updateDoc,
    limit
} from 'firebase/firestore'

const SESSIONS_COLLECTION = 'chat_sessions'
const MESSAGES_COLLECTION = 'messages'

// ... existing code ...

/**
 * Delete a session
 */
export const deleteSession = async (sessionId) => {
    try {
        const userId = auth.currentUser?.uid
        if (!userId) throw new Error("User must be logged in to delete")

        // 1. Delete session doc
        await deleteDoc(doc(db, SESSIONS_COLLECTION, sessionId))

        // 2. Delete associated messages (Batched delete recommended for production)
        // Must filter by userId to satisfy security rules
        const q = query(
            collection(db, MESSAGES_COLLECTION),
            where("sessionId", "==", sessionId),
            where("userId", "==", userId)
        )
        const snapshot = await getDocs(q)
        const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref))
        await Promise.all(deletePromises)

        return { success: true }
    } catch (error) {
        console.error("Error deleting session:", error)
        return { success: false, error: error.message }
    }
}
export const createNewSession = async (userId) => {
    try {
        const sessionRef = await addDoc(collection(db, SESSIONS_COLLECTION), {
            userId,
            title: 'New Chat',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })
        return { success: true, id: sessionRef.id, title: 'New Chat' }
    } catch (error) {
        console.error("Error creating session:", error)
        return { success: false, error: error.message }
    }
}

/**
 * Get all sessions for a user
 */
export const getUserSessions = async (userId) => {
    try {
        const q = query(
            collection(db, SESSIONS_COLLECTION),
            where("userId", "==", userId),
            orderBy("updatedAt", "desc")
        )
        const querySnapshot = await getDocs(q)
        const sessions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        return { success: true, data: sessions }
    } catch (error) {
        console.error("Error fetching sessions:", error)
        return { success: false, error: error.message }
    }
}

/**
 * Get messages for a session
 */
export const getSessionMessages = async (sessionId, userId) => {
    try {
        const q = query(
            collection(db, MESSAGES_COLLECTION),
            where("sessionId", "==", sessionId),
            where("userId", "==", userId),
            orderBy("createdAt", "asc")
        )
        const querySnapshot = await getDocs(q)
        const messages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamp to ISO string for frontend
            timestamp: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
        }))
        return { success: true, data: messages }
    } catch (error) {
        console.error("Error fetching messages:", error)
        return { success: false, error: error.message }
    }
}

/**
 * Save a message to Firestore
 */
export const saveMessage = async (userId, sessionId, role, content, references = []) => {
    try {
        // 1. Add message
        await addDoc(collection(db, MESSAGES_COLLECTION), {
            sessionId,
            userId,
            role, // 'user' or 'ai'
            content,
            references: JSON.stringify(references), // Store complex objects as string if needed, or array
            createdAt: serverTimestamp()
        })

        // 2. Update session timestamp & title (if "New Chat")
        const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId)

        // Fetch session to check current title
        const sessionSnap = await import('firebase/firestore').then(module => module.getDoc(sessionRef))

        const updates = {
            updatedAt: serverTimestamp()
        }

        // Check if we should update the title
        if (sessionSnap.exists() && role === 'user') {
            const currentTitle = sessionSnap.data().title
            if (currentTitle === 'New Chat') {
                // Truncate title to ~30 chars
                updates.title = content.length > 30 ? content.substring(0, 30) + '...' : content
            }
        }

        await updateDoc(sessionRef, updates)

        return { success: true }
    } catch (error) {
        console.error("Error saving message:", error)
        return { success: false, error: error.message }
    }
}


