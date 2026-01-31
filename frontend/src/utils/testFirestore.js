import { db, auth } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/**
 * Tests Firestore connection by attempting to write and read a test document
 * for the currently logged-in user.
 */
export const testFirestoreConnection = async () => {
    const user = auth.currentUser;

    if (!user) {
        console.error("Firestore Test: No user logged in. Please log in first.");
        return { success: false, message: "User not logged in" };
    }

    console.log(`Firestore Test: Starting test for user ${user.uid}...`);
    const testDocRef = doc(db, "users", user.uid, "test", "connection");

    try {
        // 1. Write Test
        const timestamp = new Date().toISOString();
        await setDoc(testDocRef, {
            connected: true,
            timestamp: timestamp,
            email: user.email
        });
        console.log("Firestore Test: ✅ Write successful!");

        // 2. Read Test
        const docSnap = await getDoc(testDocRef);
        if (docSnap.exists()) {
            console.log("Firestore Test: ✅ Read successful!", docSnap.data());
            return { success: true, message: "Firestore is connected and rules are working!" };
        } else {
            console.error("Firestore Test: ❌ Write succeeded but document not found?");
            return { success: false, message: "Write succeeded but read failed" };
        }

    } catch (error) {
        console.error("Firestore Test: ❌ Failed!", error);
        if (error.code === 'permission-denied') {
            console.error("Firestore Test: Permission Denied. Check your Security Rules.");
        }
        return { success: false, error: error };
    }
};
