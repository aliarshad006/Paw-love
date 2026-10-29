import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Unsubscribe,
  Timestamp
} from 'firebase/firestore';
import { AnimalProfile, ChatMessage, Conversation, FriendRequest, MatchRecord, AppNotification, SocialPost } from '../types';

export const firebaseConfig = {
  apiKey: "AIzaSyB-j_BRaPmjTNeqYoY_psy0o7KVZV-8du0",
  authDomain: "paw-match-demo.firebaseapp.com",
  projectId: "paw-match-demo",
  storageBucket: "paw-match-demo.firebasestorage.app",
  messagingSenderId: "841860827291",
  appId: "1:841860827291:web:d12fccc0668efe5ab99e3e",
  measurementId: "G-3J3FBPMWRR"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn("Firebase initialization notice:", error);
}

export { app, auth, db };

export interface FirebaseConnectionStatus {
  isConfigured: boolean;
  isAuthenticated: boolean;
  uid: string | null;
  mode: 'cloud-firestore' | 'local-demo';
  errorDetails?: string | null;
}

/**
 * Initializes anonymous authentication in the background.
 * If anonymous sign-in is disabled in the Firebase Console, falls back gracefully.
 */
export async function initAnonymousAuth(): Promise<{ user: User | null; error: string | null }> {
  try {
    if (!auth) {
      return { user: null, error: 'Firebase Auth is not initialized' };
    }
    const current = auth.currentUser;
    if (current) {
      return { user: current, error: null };
    }
    const cred = await signInAnonymously(auth);
    return { user: cred.user, error: null };
  } catch (err: any) {
    console.warn("Firebase anonymous authentication notice (check Firebase Console -> Authentication -> Sign-in method -> Anonymous):", err);
    return { user: null, error: err?.message || 'Anonymous authentication unavailable' };
  }
}

/**
 * Save or update animal profile in Firestore
 */
export async function saveProfileToFirestore(profile: AnimalProfile): Promise<boolean> {
  if (!db) return false;
  try {
    const profileRef = doc(db, 'profiles', profile.id);
    await setDoc(profileRef, {
      ...profile,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn("Firestore saveProfile notice:", err);
    return false;
  }
}

/**
 * Fetch profile by ID
 */
export async function getProfileFromFirestore(profileId: string): Promise<AnimalProfile | null> {
  if (!db) return null;
  try {
    const profileRef = doc(db, 'profiles', profileId);
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      return snap.data() as AnimalProfile;
    }
    return null;
  } catch (err) {
    console.warn("Firestore getProfile notice:", err);
    return null;
  }
}

/**
 * Listen to real-time messages in a conversation
 */
export function subscribeToMessages(
  conversationId: string,
  onUpdate: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    return () => {};
  }

  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

    return onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          msgs.push({
            id: doc.id,
            conversationId,
            senderId: data.senderId,
            senderName: data.senderName,
            senderAvatar: data.senderAvatar,
            text: data.text,
            timestamp: typeof data.timestamp === 'number' ? data.timestamp : (data.timestamp?.toMillis ? data.timestamp.toMillis() : Date.now()),
            isSimulated: data.isSimulated ?? false,
            sticker: data.sticker
          });
        });
        onUpdate(msgs);
      },
      (err) => {
        console.warn("Real-time message subscription error (likely security rules or offline):", err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.warn("Failed to attach message listener:", err);
    return () => {};
  }
}

/**
 * Send a chat message
 */
export async function sendChatMessage(
  conversationId: string,
  message: Omit<ChatMessage, 'timestamp'> & { timestamp?: number }
): Promise<string | null> {
  if (!db) return null;
  try {
    const messagesRef = collection(db, 'conversations', conversationId, 'messages');
    // Use the client message ID as the document ID. This makes the optimistic
    // local message and the cloud message the same record instead of allowing
    // the snapshot to replace a just-sent message with an empty list.
    const messageRef = doc(messagesRef, message.id);
    // Firestore rejects `undefined` fields. Plain text has no sticker, while
    // sticker sends do, which previously made only sticker messages succeed.
    const messagePayload: Record<string, unknown> = {
      ...message,
      timestamp: Date.now(),
      createdAt: serverTimestamp()
    };
    if (!message.sticker) delete messagePayload.sticker;
    await setDoc(messageRef, messagePayload);
    const lastMessage: Record<string, unknown> = { ...message, timestamp: Date.now() };
    if (!message.sticker) delete lastMessage.sticker;

    // Also update the parent conversation document. `setDoc(..., merge)` is
    // intentional: an update can fail when a conversation was opened while
    // offline, leaving the receiver with a message subcollection but no inbox
    // entry to discover it.
    const convRef = doc(db, 'conversations', conversationId);
    await setDoc(convRef, {
      lastMessageText: message.text,
      lastMessageSenderId: message.senderId,
      updatedAt: Date.now(),
      // Keep the complete latest message on the conversation document as a
      // delivery fallback for the recipient's inbox.
      lastMessage
    }, { merge: true });

    return messageRef.id;
  } catch (err) {
    console.warn("Firestore sendChatMessage notice:", err);
    return null;
  }
}

/**
 * Listen to user conversations
 */
export function subscribeToConversations(
  profileId: string,
  onUpdate: (conversations: Conversation[]) => void
): Unsubscribe {
  if (!db) return () => {};

  try {
    const convsRef = collection(db, 'conversations');
    const q = query(convsRef, where('participantIds', 'array-contains', profileId));

    return onSnapshot(q, (snapshot) => {
      const convs: Conversation[] = [];
      snapshot.forEach((doc) => {
        convs.push({ id: doc.id, ...doc.data() } as Conversation);
      });
      // Sort by updatedAt descending
      convs.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      onUpdate(convs.filter((conversation) => !conversation.deletedAt));
    }, (err) => {
      console.warn("Conversations listener notice:", err);
    });
  } catch (err) {
    console.warn("Failed to subscribe to conversations:", err);
    return () => {};
  }
}

/**
 * Create or get conversation between two profiles
 */
export async function getOrCreateConversation(
  profileA: AnimalProfile,
  profileB: AnimalProfile
): Promise<string | null> {
  if (!db) return null;
  try {
    // Deterministic ID for 1-on-1 chats to avoid duplicate conversations
    const convId = [profileA.id, profileB.id].sort().join('_');
    const convRef = doc(db, 'conversations', convId);
    const snap = await getDoc(convRef);

    if (!snap.exists()) {
      await setDoc(convRef, {
        id: convId,
        participantIds: [profileA.id, profileB.id],
        participants: {
          [profileA.id]: {
            id: profileA.id,
            displayName: profileA.displayName,
            species: profileA.species,
            avatarUrl: profileA.avatarUrl,
            relationshipStatus: profileA.relationshipStatus
          },
          [profileB.id]: {
            id: profileB.id,
            displayName: profileB.displayName,
            species: profileB.species,
            avatarUrl: profileB.avatarUrl,
            relationshipStatus: profileB.relationshipStatus
          }
        },
        updatedAt: Date.now(),
        lastMessageText: "Paw connected! Start chatting.",
        lastMessageSenderId: 'system'
      });
    }
    return convId;
  } catch (err) {
    console.warn("Error creating conversation in Firestore:", err);
    return null;
  }
}

// ---- Ruff Luck account helpers (username + password, no email) ----
export async function saveUserDoc(username: string, hash: string): Promise<boolean> {
  if (!db) return false;
  try { await setDoc(doc(db, 'users', username), { username, hash, updatedAt: Date.now() }); return true; } catch { return false; }
}
export async function getUserDoc(username: string): Promise<{ hash: string } | null> {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'users', username));
    return snap.exists() ? { hash: String((snap.data() as any).hash) } : null;
  } catch { return null; }
}
export async function deleteUserDoc(username: string): Promise<void> {
  if (!db) return;
  try { await deleteDoc(doc(db, 'users', username)); } catch {}
}
export async function deleteProfileFromFirestore(profileId: string): Promise<void> {
  if (!db) return;
  try { await deleteDoc(doc(db, 'profiles', profileId)); } catch {}
}
