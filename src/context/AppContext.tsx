import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  AnimalProfile,
  MatchRecord,
  FriendRequest,
  ChatMessage,
  Conversation,
  SocialPost,
  DramaEvent,
  AppNotification
} from '../types';
import { SEED_PROFILES, DRAMA_EVENTS, INITIAL_POSTS } from '../data/seedProfiles';
import {
  initAnonymousAuth,
  saveProfileToFirestore,
  getProfileFromFirestore,
  subscribeToMessages,
  subscribeToConversations,
  sendChatMessage,
  getOrCreateConversation,
  auth,
  db
} from '../lib/firebase';
import { collection, doc, setDoc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { getSession, profileIdFor, deleteAccountEverywhere } from '../lib/accounts';

export type AppTab =
  | 'welcome'
  | 'how-it-works'
  | 'create-profile'
  | 'discover'
  | 'matches'
  | 'chat'
  | 'circle'
  | 'drama'
  | 'profile'
  | 'settings';

interface AppContextType {
  currentProfile: AnimalProfile | null;
  setCurrentProfile: (profile: AnimalProfile | null) => void;
  allProfiles: AnimalProfile[];
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  likedProfileIds: string[];
  passedProfileIds: string[];
  setPassedProfileIds: React.Dispatch<React.SetStateAction<string[]>>;
  matches: MatchRecord[];
  friendRequests: FriendRequest[];
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  activeChatPartner: AnimalProfile | null;
  chatMessages: ChatMessage[];
  dramaEvents: DramaEvent[];
  posts: SocialPost[];
  notifications: AppNotification[];
  unreadNotificationCount: number;
  unreadMessageCount: number;
  latestMatchModal: { match: MatchRecord; partner: AnimalProfile } | null;
  closeMatchModal: () => void;
  firebaseStatus: {
    isConfigured: boolean;
    isAuthenticated: boolean;
    uid: string | null;
    mode: 'cloud-firestore' | 'local-demo';
    errorDetails?: string | null;
  };
  saveProfile: (profileData: Omit<AnimalProfile, 'id' | 'createdAt' | 'isUserCreated' | 'ownerUid'> & { id?: string }) => Promise<AnimalProfile>;
  likeProfile: (profile: AnimalProfile) => Promise<void>;
  passProfile: (profileId: string) => void;
  sendFriendRequest: (profile: AnimalProfile) => Promise<void>;
  respondToFriendRequest: (requestId: string, accept: boolean) => Promise<void>;
  sendMessage: (text: string, sticker?: string) => Promise<void>;
  deleteChat: (conversationId: string) => Promise<void>;
  startChatWithProfile: (partnerProfile: AnimalProfile) => void;
  createPost: (content: string, dramaTag?: SocialPost['dramaTag'], photoUrl?: string) => void;
  togglePostLike: (postId: string) => void;
  reactToDrama: (dramaId: string) => void;
  markNotificationsAsRead: () => void;
  resetDemoCharacter: () => void;
  deleteCurrentProfile: () => void;
  retryFirebaseAuth: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USER = getSession() || 'guest';
const STORAGE_KEYS = {
  CURRENT_PROFILE: `ruffluck_${USER}_current_profile`,
  LIKED_IDS: `ruffluck_${USER}_liked_ids`,
  PASSED_IDS: `ruffluck_${USER}_passed_ids`,
  MATCHES: `ruffluck_${USER}_matches`,
  FRIEND_REQUESTS: `ruffluck_${USER}_friend_requests`,
  LOCAL_MESSAGES: `ruffluck_${USER}_local_messages`,
  POSTS: `ruffluck_${USER}_posts`,
  DRAMA: `ruffluck_${USER}_drama`,
  NOTIFICATIONS: `ruffluck_${USER}_notifications`
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Current user profile
  const [currentProfile, setCurrentProfileState] = useState<AnimalProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_PROFILE);
      return saved ? 'discover' : 'welcome';
    } catch {
      return 'welcome';
    }
  });

  // Firebase status
  const [firebaseStatus, setFirebaseStatus] = useState<AppContextType['firebaseStatus']>({
    isConfigured: true,
    isAuthenticated: false,
    uid: null,
    mode: 'local-demo',
    errorDetails: null
  });

  // Discovered profiles (seed + real user created profiles)
  const [allProfiles, setAllProfiles] = useState<AnimalProfile[]>(SEED_PROFILES);

  // Swiping state
  const [likedProfileIds, setLikedProfileIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKED_IDS) || '[]');
    } catch {
      return [];
    }
  });

  const [passedProfileIds, setPassedProfileIds] = useState<string[]>(() => {
    // Passes are intentionally session-only: refreshing starts the discovery
    // loop again instead of permanently removing an animal.
    return [];
  });

  // Matches
  const [matches, setMatches] = useState<MatchRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MATCHES) || '[]');
    } catch {
      return [];
    }
  });

  // Friend Requests
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FRIEND_REQUESTS) || '[]');
    } catch {
      return [];
    }
  });

  // Conversations & Messages
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [localMessagesStore, setLocalMessagesStore] = useState<Record<string, ChatMessage[]>>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCAL_MESSAGES) || '{}');
    } catch {
      return {};
    }
  });

  // Social posts & Drama
  const [posts, setPosts] = useState<SocialPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [dramaEvents, setDramaEvents] = useState<DramaEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRAMA);
      return saved ? JSON.parse(saved) : DRAMA_EVENTS;
    } catch {
      return DRAMA_EVENTS;
    }
  });

  // In-app Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'welcome-notif',
          type: 'drama',
          title: 'Welcome to Ruff Luck! 💔',
          body: 'Create your pet profile, match with other pets, and collect breakup certificates.',
          timestamp: Date.now() - 1000 * 60 * 2,
          read: false
        }
      ];
    } catch {
      return [];
    }
  });

  // Match celebration modal state
  const [latestMatchModal, setLatestMatchModal] = useState<{ match: MatchRecord; partner: AnimalProfile } | null>(null);

  // Sync state to local storage helper
  const setCurrentProfile = (profile: AnimalProfile | null) => {
    setCurrentProfileState(profile);
    if (profile) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PROFILE, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_PROFILE);
    }
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKED_IDS, JSON.stringify(likedProfileIds));
  }, [likedProfileIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FRIEND_REQUESTS, JSON.stringify(friendRequests));
  }, [friendRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRAMA, JSON.stringify(dramaEvents));
  }, [dramaEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOCAL_MESSAGES, JSON.stringify(localMessagesStore));
  }, [localMessagesStore]);

  // Initialize Firebase Auth
  const initFirebase = useCallback(async () => {
    const { user, error } = await initAnonymousAuth();
    if (user) {
      setFirebaseStatus({
        isConfigured: true,
        isAuthenticated: true,
        uid: user.uid,
        mode: 'cloud-firestore',
        errorDetails: null
      });
    } else {
      setFirebaseStatus({
        isConfigured: true,
        isAuthenticated: false,
        uid: null,
        mode: 'local-demo',
        errorDetails: error || 'Anonymous Auth not enabled in Firebase Console'
      });
    }
  }, []);

  useEffect(() => {
    initFirebase();
  }, [initFirebase]);

  // Returning on a new device: pull this account's profile back from the cloud
  useEffect(() => {
    if (USER !== 'guest' && !currentProfile && firebaseStatus.mode === 'cloud-firestore') {
      getProfileFromFirestore(profileIdFor(USER)).then((p) => { if (p) setCurrentProfile(p); });
    }
  }, [firebaseStatus.mode]);

  // Real-time listener for Firestore profiles:
  // When another animal (e.g. Princess Mittens) creates a profile in another browser,
  // it automatically appears in Bruno's Discover list!
  useEffect(() => {
    if (firebaseStatus.mode === 'cloud-firestore' && db) {
      const unsub = onSnapshot(collection(db, 'profiles'), (snapshot) => {
        const cloudProfiles: AnimalProfile[] = [];
        snapshot.forEach((docSnap) => {
          cloudProfiles.push({ id: docSnap.id, ...docSnap.data() } as AnimalProfile);
        });

        // Keep demo animals available and let cloud profiles replace duplicates.
        setAllProfiles(() => {
          const profilesById = new Map(SEED_PROFILES.map((profile) => [profile.id, profile]));
          cloudProfiles.forEach((profile) => profilesById.set(profile.id, profile));
          return Array.from(profilesById.values());
        });
      }, (err) => {
        console.warn("Notice: Firestore profiles snapshot listener error:", err.message);
      });
      return () => unsub();
    }
  }, [firebaseStatus.mode]);

  // Real-time listener for Matches in Firestore
  useEffect(() => {
    if (firebaseStatus.mode === 'cloud-firestore' && db && currentProfile) {
      const q = query(
        collection(db, 'matches'),
        where('profileIds', 'array-contains', currentProfile.id)
      );
      const unsub = onSnapshot(q, (snapshot) => {
        const cloudMatches: MatchRecord[] = [];
        snapshot.forEach((d) => {
          cloudMatches.push({ id: d.id, ...d.data() } as MatchRecord);
        });
        if (cloudMatches.length > 0) {
          setMatches((prev) => {
            const merged = [...cloudMatches];
            prev.forEach((m) => {
              if (!merged.some((cm) => cm.id === m.id)) {
                merged.push(m);
              }
            });
            return merged;
          });
        }
      }, (err) => {
        console.warn("Notice: Firestore matches listener:", err.message);
      });
      return () => unsub();
    }
  }, [firebaseStatus.mode, currentProfile]);

  // Conversations are also the inbox index. Without this listener, a pet who
  // receives the first text in a new conversation has no way to open it.
  useEffect(() => {
    if (firebaseStatus.mode !== 'cloud-firestore' || !currentProfile) return;
    return subscribeToConversations(currentProfile.id, (nextConversations) => {
      setConversations(nextConversations);
      setLocalMessagesStore((previous) => {
        const next = { ...previous };
        nextConversations.forEach((conversation) => {
          const message = conversation.lastMessage;
          if (!message || message.senderId === currentProfile.id) return;
          const existing = next[conversation.id] || [];
          if (!existing.some((item) => item.id === message.id)) {
            next[conversation.id] = [...existing, message];
          }
        });
        return next;
      });
      nextConversations.forEach((conversation) => {
        if (!conversation.lastMessageText || !conversation.lastMessageSenderId || conversation.lastMessageSenderId === currentProfile.id || conversation.lastMessageSenderId === 'system') return;
        const senderId = conversation.lastMessageSenderId;
        const senderName = conversation.participants[senderId]?.displayName || 'Someone';
        const notificationId = `message-${conversation.id}-${conversation.updatedAt}`;
        setNotifications((previous) => previous.some((notice) => notice.id === notificationId) ? previous : [{
          id: notificationId,
          type: 'message',
          title: `New message from ${senderName}`,
          body: conversation.lastMessageText || '',
          timestamp: conversation.updatedAt || Date.now(),
          read: false,
          relatedId: conversation.id,
          linkToTab: 'chat'
        }, ...previous]);
      });
    });
  }, [firebaseStatus.mode, currentProfile]);

  // Requests are stored in Firestore so the recipient receives them on any
  // device, rather than only in the sender's browser.
  useEffect(() => {
    if (firebaseStatus.mode !== 'cloud-firestore' || !db || !currentProfile) return;
    return onSnapshot(query(collection(db, 'friendRequests'), where('toProfileId', '==', currentProfile.id)), (snapshot) => {
      const incoming = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as FriendRequest));
      setFriendRequests((previous) => {
        const outgoing = previous.filter((request) => request.fromProfileId === currentProfile.id);
        return [...outgoing.filter((request) => !incoming.some((item) => item.id === request.id)), ...incoming];
      });
      incoming.filter((request) => request.status === 'pending' && request.fromProfileId !== currentProfile.id).forEach((request) => {
        setNotifications((previous) => previous.some((notice) => notice.id === `friend-request-${request.id}`) ? previous : [{
          id: `friend-request-${request.id}`,
          type: 'friend_request',
          title: `${request.fromProfile.displayName} sent you a friend request`,
          body: 'Open Matches & Pack to respond.',
          timestamp: request.createdAt,
          read: false,
          relatedId: request.id,
          linkToTab: 'matches'
        }, ...previous]);
      });
    });
  }, [firebaseStatus.mode, currentProfile]);

  useEffect(() => {
    if (firebaseStatus.mode !== 'cloud-firestore' || !db || !currentProfile) return;
    return onSnapshot(query(collection(db, 'likes'), where('toProfileId', '==', currentProfile.id)), (snapshot) => {
      snapshot.docs.forEach((item) => {
        const like = item.data() as { fromProfileId: string; timestamp: number };
        const sender = allProfiles.find((profile) => profile.id === like.fromProfileId);
        if (!sender) return;
        setNotifications((previous) => previous.some((notice) => notice.id === `like-${item.id}`) ? previous : [{
          id: `like-${item.id}`,
          type: 'like',
          title: `${sender.displayName} likes you`,
          body: 'Open Discover or Matches to see what happens next.',
          timestamp: like.timestamp || Date.now(),
          read: false,
          relatedId: sender.id,
          linkToTab: 'matches'
        }, ...previous]);
      });
    });
  }, [firebaseStatus.mode, currentProfile, allProfiles]);

  // Real-time message listener for active conversation
  // Automatically loads new real incoming messages through Firestore
  useEffect(() => {
    if (!activeConversationId) {
      setChatMessages([]);
      return;
    }

    if (firebaseStatus.mode === 'cloud-firestore' && db) {
      const unsub = subscribeToMessages(
        activeConversationId,
        (msgs) => {
          // A failed or delayed Firestore write must not erase a message that
          // was already sent in this browser. Cloud messages replace matching
          // local IDs once they arrive, while unsynced messages remain visible.
          const messagesById = new Map(
            (localMessagesStore[activeConversationId] || []).map((message) => [message.id, message])
          );
          msgs.forEach((message) => messagesById.set(message.id, message));
          setChatMessages(Array.from(messagesById.values()).sort((a, b) => a.timestamp - b.timestamp));
        },
        () => {
          // If Firestore read fails, fallback to local session messages
          setChatMessages(localMessagesStore[activeConversationId] || []);
        }
      );
      return () => unsub();
    } else {
      // Local Demo Mode
      setChatMessages(localMessagesStore[activeConversationId] || []);
    }
  }, [activeConversationId, firebaseStatus.mode, localMessagesStore]);

  // Helper to add in-app notification
  const addNotification = (
    type: AppNotification['type'],
    title: string,
    body: string,
    relatedId?: string,
    linkToTab?: string
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      title,
      body,
      timestamp: Date.now(),
      read: false,
      relatedId,
      linkToTab
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Save/Create Profile
  const saveProfile = async (
    profileData: Omit<AnimalProfile, 'id' | 'createdAt' | 'isUserCreated' | 'ownerUid'> & { id?: string }
  ): Promise<AnimalProfile> => {
    const profileId = profileData.id || (USER !== 'guest' ? profileIdFor(USER) : `profile-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`);
    const fullProfile: AnimalProfile = {
      ...profileData,
      id: profileId,
      createdAt: Date.now(),
      isUserCreated: true,
      ownerUid: firebaseStatus.uid || 'anonymous-local-user'
    };

    setCurrentProfile(fullProfile);

    // Update in local state
    setAllProfiles((prev) => {
      const idx = prev.findIndex((p) => p.id === fullProfile.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = fullProfile;
        return copy;
      }
      return [fullProfile, ...prev];
    });

    // Save to Firestore if available
    if (firebaseStatus.mode === 'cloud-firestore') {
      await saveProfileToFirestore(fullProfile);
    }

    // Add drama alert about the new pet in town!
    const newDrama: DramaEvent = {
      id: `drama-${Date.now()}`,
      headline: `NEW ARRIVAL: ${fullProfile.displayName} the ${fullProfile.species} has joined RUFF LUCK!`,
      description: `Locals reported immediate excitement. Status: "${fullProfile.relationshipStatus}". Favorite food: "${fullProfile.favouriteFood}".`,
      tag: 'Breaking',
      timestamp: Date.now(),
      reactionsCount: 1,
      userReacted: false,
      participants: [fullProfile.displayName]
    };
    setDramaEvents((prev) => [newDrama, ...prev]);

    return fullProfile;
  };

  const pushDrama = (tag: DramaEvent['tag'], headline: string, description: string, participants: string[]) => {
    setDramaEvents((prev) => [{ id: `drama-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, headline, description, tag, timestamp: Date.now(), reactionsCount: 0, userReacted: false, participants }, ...prev]);
  };

  const createMatchFromRequest = async (first: AnimalProfile, second: AnimalProfile) => {
    const id = `match_${[first.id, second.id].sort().join('_')}`;
    const match: MatchRecord = {
      id,
      profileIds: [first.id, second.id],
      profiles: Object.fromEntries([first, second].map((profile) => [profile.id, {
        id: profile.id, displayName: profile.displayName, species: profile.species, avatarUrl: profile.avatarUrl, bio: profile.bio
      }])),
      matchedAt: Date.now(),
      lastMessageSnippet: 'Your connection request was accepted. Start chatting!',
      lastMessageTimestamp: Date.now()
    };
    setMatches((previous) => previous.some((item) => item.id === id) ? previous : [match, ...previous]);
    if (firebaseStatus.mode === 'cloud-firestore' && db) await setDoc(doc(db, 'matches', id), match, { merge: true });
  };

  // Like profile & Mutual match algorithm
  const likeProfile = async (targetProfile: AnimalProfile) => {
    if (!currentProfile) return;
    if (likedProfileIds.includes(targetProfile.id)) return;

    setLikedProfileIds((prev) => [...prev, targetProfile.id]);
    pushDrama('Love Alert', `${currentProfile.displayName} swiped right on ${targetProfile.displayName}`, 'Hearts were involved. Nobody has thought about the consequences.', [currentProfile.displayName, targetProfile.displayName]);

    // Check mutual match condition:
    // 1. Seed animals enthusiastically match for demo delight.
    // 2. Real user-created animals match if both like each other in Firestore or local session.
    const isSeed = !targetProfile.isUserCreated;
    let isMutual = isSeed;

    if (firebaseStatus.mode === 'cloud-firestore' && db) {
      try {
        // Record this like in Firestore
        await setDoc(doc(db, 'likes', `${currentProfile.id}_${targetProfile.id}`), {
          fromProfileId: currentProfile.id,
          toProfileId: targetProfile.id,
          timestamp: Date.now()
        });

        // Check if the target user has liked current user
        const reciprocalLikeSnap = await getDoc(doc(db, 'likes', `${targetProfile.id}_${currentProfile.id}`));
        if (reciprocalLikeSnap.exists()) {
          isMutual = true;
        }
      } catch (e) {
        console.warn("Firestore like recording notice:", e);
      }
    }

    if (isMutual) {
      const matchId = `match_${[currentProfile.id, targetProfile.id].sort().join('_')}`;
      const newMatch: MatchRecord = {
        id: matchId,
        profileIds: [currentProfile.id, targetProfile.id],
        profiles: {
          [currentProfile.id]: {
            id: currentProfile.id,
            displayName: currentProfile.displayName,
            species: currentProfile.species,
            avatarUrl: currentProfile.avatarUrl,
            bio: currentProfile.bio
          },
          [targetProfile.id]: {
            id: targetProfile.id,
            displayName: targetProfile.displayName,
            species: targetProfile.species,
            avatarUrl: targetProfile.avatarUrl,
            bio: targetProfile.bio
          }
        },
        matchedAt: Date.now(),
        lastMessageSnippet: "You both smelled mutual interest! Start chatting.",
        lastMessageTimestamp: Date.now()
      };

      pushDrama('Petty Court', `${currentProfile.displayName} and ${targetProfile.displayName} are officially matched`, 'Experts give it 11 minutes. A breakup certificate is on its way.', [currentProfile.displayName, targetProfile.displayName]);
      setMatches((prev) => {
        if (prev.some((m) => m.id === matchId)) return prev;
        return [newMatch, ...prev];
      });

      // Also persist match to Firestore so both users see the match live
      if (firebaseStatus.mode === 'cloud-firestore' && db) {
        try {
          await setDoc(doc(db, 'matches', matchId), newMatch, { merge: true });
          await getOrCreateConversation(currentProfile, targetProfile);
        } catch (e) {
          console.warn("Notice: Firestore match save:", e);
        }
      }

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F472B6', '#C084FC', '#FBBF24', '#FB7185']
        });
      } catch {
        // Safe if confetti fails
      }

      // Show match modal
      setLatestMatchModal({ match: newMatch, partner: targetProfile });

      // Add notification
      addNotification(
        'match',
        `🐾 Paw-fect Match with ${targetProfile.displayName}!`,
        `${targetProfile.displayName} the ${targetProfile.species} matched with you! Send a real message to start chatting.`,
        targetProfile.id,
        'matches'
      );
      // NOTE: NO scripted/fake incoming message generated! Real messages only!
    }
  };

  const passProfile = (profileId: string) => {
    setPassedProfileIds((prev) => prev.includes(profileId) ? prev : [...prev, profileId]);
  };

  const sendFriendRequest = async (targetProfile: AnimalProfile) => {
    if (!currentProfile) return;
    const reqId = `req_${currentProfile.id}_${targetProfile.id}`;
    if (friendRequests.some((r) => r.id === reqId)) return;

    const newReq: FriendRequest = {
      id: reqId,
      fromProfileId: currentProfile.id,
      toProfileId: targetProfile.id,
      fromProfile: currentProfile,
      toProfile: targetProfile,
      status: 'pending',
      createdAt: Date.now()
    };

    setFriendRequests((prev) => [...prev, newReq]);
    addNotification(
      'friend_request',
      `Friend Paw sent to ${targetProfile.displayName}`,
      `Waiting for ${targetProfile.displayName} to sniff and accept.`,
      targetProfile.id
    );

    if (firebaseStatus.mode === 'cloud-firestore' && db) {
      try {
        await setDoc(doc(db, 'friendRequests', reqId), newReq, { merge: true });
      } catch (error) {
        console.warn('Friend request saved locally because cloud delivery failed:', error);
      }
    }

    // Auto-accept after 3 seconds for seed demo animals
    if (!targetProfile.isUserCreated) {
      setTimeout(() => {
        setFriendRequests((prev) =>
          prev.map((r) => (r.id === reqId ? { ...r, status: 'accepted' as const } : r))
        );
        void createMatchFromRequest(currentProfile, targetProfile);
        addNotification(
          'friend_request',
          `🎉 ${targetProfile.displayName} accepted your friend paw!`,
          `You and ${targetProfile.displayName} are now best fur-friends on Ruff Luck!`,
          targetProfile.id,
          'matches'
        );
      }, 2500);
    }
  };

  const respondToFriendRequest = async (requestId: string, accept: boolean) => {
    const request = friendRequests.find((item) => item.id === requestId);
    setFriendRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: accept ? 'accepted' : 'rejected' } : r))
    );
    if (firebaseStatus.mode === 'cloud-firestore' && db) {
      try {
        await setDoc(doc(db, 'friendRequests', requestId), { status: accept ? 'accepted' : 'rejected' }, { merge: true });
      } catch (error) {
        console.warn('Friend request response saved locally because cloud delivery failed:', error);
      }
    }
    if (accept && request && currentProfile) await createMatchFromRequest(currentProfile, request.fromProfile);
  };

  // Start chat with a specific profile
  const startChatWithProfile = async (partnerProfile: AnimalProfile) => {
    if (!currentProfile) return;
    const convId = [currentProfile.id, partnerProfile.id].sort().join('_');

    if (firebaseStatus.mode === 'cloud-firestore') {
      await getOrCreateConversation(currentProfile, partnerProfile);
    }

    setConversations((prev) => prev.some((conversation) => conversation.id === convId) ? prev : [{
      id: convId,
      participantIds: [currentProfile.id, partnerProfile.id],
      participants: {
        [currentProfile.id]: currentProfile,
        [partnerProfile.id]: partnerProfile
      },
      updatedAt: Date.now(),
      lastMessageText: 'Paw connected! Start chatting.',
      lastMessageSenderId: 'system'
    }]);

    setActiveConversationId(convId);
    setActiveTab('chat');
  };

  // REAL MESSAGING:
  // Saves the message into Firestore and local store.
  // NO scripted or automatic chatbot replies!
  const sendMessage = async (text: string, sticker?: string) => {
    if (!currentProfile || !activeConversationId) return;
    const cleanText = text.trim();
    if (!cleanText) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: activeConversationId,
      senderId: currentProfile.id,
      senderName: currentProfile.displayName,
      senderAvatar: currentProfile.avatarUrl,
      text: cleanText,
      timestamp: Date.now(),
      sticker,
      isSimulated: firebaseStatus.mode === 'local-demo'
    };

    // Optimistically update local message list
    setChatMessages((prev) => [...prev, newMessage]);
    setLocalMessagesStore((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMessage]
    }));

    // If connected to Firestore, send through Firestore real-time collection
    if (firebaseStatus.mode === 'cloud-firestore') {
      try {
        // Ensure the receiver has a conversation-index document before the
        // first message is written, so it appears in their inbox immediately.
        const partner = allProfiles.find((profile) =>
          profile.id !== currentProfile.id &&
          activeConversationId === [currentProfile.id, profile.id].sort().join('_')
        );
        if (partner) await getOrCreateConversation(currentProfile, partner);
        await sendChatMessage(activeConversationId, {
          id: newMessage.id,
          conversationId: activeConversationId,
          senderId: currentProfile.id,
          senderName: currentProfile.displayName,
          senderAvatar: currentProfile.avatarUrl,
          text: cleanText,
          sticker,
          isSimulated: false
        });
      } catch (err) {
        console.warn("Failed to send message to cloud Firestore, kept in local session:", err);
      }
    }
    // Real messages only: do NOT simulate or auto-generate replies!
  };

  const deleteChat = async (conversationId: string) => {
    setActiveConversationId((active) => active === conversationId ? null : active);
    setChatMessages((previous) => activeConversationId === conversationId ? [] : previous);
    setConversations((previous) => previous.filter((conversation) => conversation.id !== conversationId));
    setLocalMessagesStore((previous) => {
      const next = { ...previous };
      delete next[conversationId];
      return next;
    });
    // Removing the conversation summary removes it from both inboxes. Existing
    // immutable message records are left intact by the Firestore rules.
    if (firebaseStatus.mode === 'cloud-firestore' && db) {
      try {
        await setDoc(doc(db, 'conversations', conversationId), { deletedAt: Date.now() }, { merge: true });
      } catch (error) {
        console.warn('Chat was removed from this device only:', error);
      }
    }
  };

  // Helper to determine active chat partner from activeConversationId
  const activeChatPartner: AnimalProfile | null = React.useMemo(() => {
    if (!activeConversationId || !currentProfile) return null;
    // Profile IDs may include underscores (for example `u_someone`), so do not
    // split the deterministic conversation ID to locate its other participant.
    const knownProfile = allProfiles.find((profile) =>
      profile.id !== currentProfile.id &&
      activeConversationId === [currentProfile.id, profile.id].sort().join('_')
    );
    if (knownProfile) return knownProfile;

    const conversation = conversations.find((item) => item.id === activeConversationId);
    const partnerId = conversation?.participantIds.find((id) => id !== currentProfile.id);
    return partnerId ? (conversation?.participants[partnerId] as AnimalProfile || null) : null;
  }, [activeConversationId, currentProfile, allProfiles, conversations]);

  const createPost = (content: string, dramaTag: SocialPost['dramaTag'] = 'Spicy', photoUrl?: string) => {
    if (!currentProfile) return;
    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorId: currentProfile.id,
      authorName: currentProfile.displayName,
      authorAvatar: currentProfile.avatarUrl,
      authorSpecies: currentProfile.species,
      content,
      likes: 1,
      userLiked: true,
      timestamp: Date.now(),
      commentsCount: 0,
      dramaTag,
      photoUrl
    };
    setPosts((prev) => [newPost, ...prev]);
    addNotification('drama', 'Post published to Friend Circle!', `Your update "${content.slice(0, 30)}..." is now live in Friend Circle.`);
  };

  const togglePostLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const liked = !p.userLiked;
          return {
            ...p,
            userLiked: liked,
            likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      })
    );
  };

  const reactToDrama = (dramaId: string) => {
    setDramaEvents((prev) =>
      prev.map((d) => {
        if (d.id === dramaId) {
          const reacted = !d.userReacted;
          return {
            ...d,
            userReacted: reacted,
            reactionsCount: reacted ? d.reactionsCount + 1 : d.reactionsCount - 1
          };
        }
        return d;
      })
    );
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const closeMatchModal = () => {
    setLatestMatchModal(null);
  };

  const resetDemoCharacter = () => {
    setCurrentProfile(null);
    setLikedProfileIds([]);
    setPassedProfileIds([]);
    setMatches([]);
    setFriendRequests([]);
    setLocalMessagesStore({});
    setChatMessages([]);
    setActiveConversationId(null);
    setActiveTab('welcome');
  };

  const deleteCurrentProfile = async () => {
    if (confirm('Delete your account and pet profile forever? This cannot be undone.')) {
      await deleteAccountEverywhere();
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const unreadMessageCount = 0;

  return (
    <AppContext.Provider
      value={{
        currentProfile,
        setCurrentProfile,
        allProfiles,
        activeTab,
        setActiveTab,
        likedProfileIds,
        passedProfileIds,
        setPassedProfileIds,
        matches,
        friendRequests,
        conversations,
        activeConversationId,
        setActiveConversationId,
        activeChatPartner,
        chatMessages,
        dramaEvents,
        posts,
        notifications,
        unreadNotificationCount,
        unreadMessageCount,
        latestMatchModal,
        closeMatchModal,
        firebaseStatus,
        saveProfile,
        likeProfile,
        passProfile,
        sendFriendRequest,
        respondToFriendRequest,
        sendMessage,
        deleteChat,
        startChatWithProfile,
        createPost,
        togglePostLike,
        reactToDrama,
        markNotificationsAsRead,
        resetDemoCharacter,
        deleteCurrentProfile,
        retryFirebaseAuth: initFirebase
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
