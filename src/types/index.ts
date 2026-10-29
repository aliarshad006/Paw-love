export type StandardSpecies =
  | 'Dog' | 'Cat' | 'Rabbit' | 'Hamster' | 'Bird' | 'Lion' | 'Tiger' | 'Zebra'
  | 'Elephant' | 'Giraffe' | 'Monkey' | 'Fox' | 'Wolf' | 'Bear' | 'Penguin'
  | 'Duck' | 'Chicken' | 'Crocodile' | 'Snake' | 'Turtle' | 'Frog' | 'Dolphin'
  | 'Shark' | 'Whale' | 'Horse' | 'Cow' | 'Goat' | 'Sheep' | 'Deer' | 'Panda'
  | 'Koala' | 'Kangaroo' | 'Owl' | 'Eagle' | 'Parrot' | 'Butterfly' | 'Dragon' | 'Other';

export type Species = StandardSpecies | string;

export type StandardRelationshipStatus =
  | 'Single and fabulous'
  | 'Looking for love'
  | 'Just here for friends'
  | 'It\'s complicated'
  | 'Emotionally unavailable'
  | 'Happily matched'
  | 'Not sure yet'
  | 'Single & ready to sniff'
  | 'Looking for a cuddle partner'
  | 'Fur-ever taken';

export type RelationshipStatus = StandardRelationshipStatus | string;

export interface AnimalProfile {
  id: string;
  displayName: string;
  species: Species;
  breed?: string;
  age: number; // in human years or pet years
  gender: string; // e.g., "Good Boy", "Good Girl", "Majestic Being", "Feathered Royalty", "Little Dude"
  personalityTraits: string[];
  interests: string[];
  favouriteFood: string;
  bio: string;
  relationshipStatus: RelationshipStatus;
  avatarUrl: string;
  photoUrl?: string;
  photoUrls?: string[];
  createdAt: number;
  isUserCreated: boolean;
  ownerUid?: string;
  location?: string;
  quirk?: string;
}

export interface LikeRecord {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  timestamp: number;
  isMutual?: boolean;
}

export interface MatchRecord {
  id: string;
  profileIds: [string, string];
  profiles: {
    [profileId: string]: {
      id: string;
      displayName: string;
      species: Species;
      avatarUrl: string;
      bio: string;
    };
  };
  matchedAt: number;
  lastMessageSnippet?: string;
  lastMessageTimestamp?: number;
}

export interface FriendRequest {
  id: string;
  fromProfileId: string;
  toProfileId: string;
  fromProfile: AnimalProfile;
  toProfile: AnimalProfile;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
  isSimulated?: boolean;
  sticker?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: {
    [profileId: string]: {
      id: string;
      displayName: string;
      species: Species;
      avatarUrl: string;
      relationshipStatus?: string;
    };
  };
  updatedAt: number;
  lastMessageText?: string;
  lastMessageSenderId?: string;
  lastMessage?: ChatMessage;
  deletedAt?: number;
  unreadCount?: {
    [profileId: string]: number;
  };
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorSpecies: Species;
  content: string;
  likes: number;
  userLiked?: boolean;
  timestamp: number;
  commentsCount: number;
  dramaTag?: 'Spicy' | 'Wholesome' | 'Betrayal' | 'Treat Theft' | 'Zoomies' | 'Nap Alert';
  photoUrl?: string;
}

export interface DramaEvent {
  id: string;
  headline: string;
  description: string;
  tag: 'Breaking' | 'Gossip' | 'Scandal' | 'Love Alert' | 'Petty Court';
  timestamp: number;
  reactionsCount: number;
  userReacted?: boolean;
  participants: string[];
}

export interface AppNotification {
  id: string;
  type: 'match' | 'friend_request' | 'message' | 'drama' | 'like';
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  relatedId?: string;
  linkToTab?: string;
}
