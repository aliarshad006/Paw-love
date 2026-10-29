import { AnimalProfile, DramaEvent, SocialPost } from '../types';

export const SEED_PROFILES: AnimalProfile[] = [
  {
    id: 'seed-cat-bartholomew',
    displayName: 'Princess Bartholomew III',
    species: 'Cat',
    breed: 'Fluffy Persian Diva',
    age: 4,
    gender: 'Majestic Royal Highness',
    personalityTraits: ['Dramatic', 'Condescending', 'Velvet-Coated', 'Night-Zoomer'],
    interests: ['Knocking mugs off counters', 'Staring into the void', 'Judging dry kibble', 'Midnight screams'],
    favouriteFood: 'Only sashimi-grade salmon served at exactly 18°C',
    bio: 'Sleeps 22 hours a day. The other 2 hours are devoted to plotting human dethronement and ignoring affection. Looking for a partner who understands personal space (5 miles minimum).',
    relationshipStatus: "Emotionally unavailable (cat)",
    avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000 * 5,
    isUserCreated: false,
    location: 'Sunbeam by the window, Velvet Cushion Suite',
    quirk: 'Blinks once for no, twice for absolutely not'
  },
  {
    id: 'seed-dog-barnaby',
    displayName: 'Sir Barnaby Barks-a-lot',
    species: 'Dog',
    breed: 'Golden Retriever Overachiever',
    age: 3,
    gender: 'Very Goodest Boy',
    personalityTraits: ['Optimistic', 'Clueless', 'Tennis Obsessed', 'Cuddle Monster'],
    interests: ['Holding tennis ball without releasing', 'Belly rubs', 'Barking at the wind', 'Greeting delivery humans'],
    favouriteFood: 'Literally anything dropped on the floor in under 5 seconds',
    bio: 'I just met you, but I already love you with my entire 70-pound soul. I will show you my favorite leaf and protect you from the mail carrier’s treacherous boots.',
    relationshipStatus: 'Single & ready to sniff',
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000 * 4,
    isUserCreated: false,
    location: 'Dog Park, Muddy Mud Section',
    quirk: 'Leg shakes uncontrollably when you scratch the magic belly spot'
  },
  {
    id: 'seed-hamster-nibbles',
    displayName: 'Lord Nibbles the Great',
    species: 'Hamster',
    breed: 'Roborovski Turbo Sprinter',
    age: 1,
    gender: 'Speed Fiend',
    personalityTraits: ['Hyperactive', 'Hoarder', 'Escape Artist', 'Nocturnal DJ'],
    interests: ['3 AM high-friction wheel spins', 'Cheek pouch optimization', 'Tunnel architectural engineering'],
    favouriteFood: 'Sunflower seeds & microscopic strawberry slices',
    bio: 'Don’t underestimate me based on my 40-gram weight class. I logged 21 miles on my squeaky wheel last night and I hoard enough snacks in my cheeks for winter 2029.',
    relationshipStatus: 'Just here for the treats',
    avatarUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000 * 3,
    isUserCreated: false,
    location: 'Penthouse Cage, Cedar Shavings District',
    quirk: 'Can fit two baby carrots and a peanut in one cheek pouch simultaneously'
  },
  {
    id: 'seed-bird-penelope',
    displayName: 'Madame Penelope Featherington',
    species: 'Bird',
    breed: 'Cockatiel Opera Diva',
    age: 5,
    gender: 'Feathered Royalty',
    personalityTraits: ['Loud', 'Perfectionist', 'Mirror Flirt', 'Whistle Champion'],
    interests: ['Singing Andy Griffith theme song for 4 hours', 'Chewing important receipts', 'Crest fluffing'],
    favouriteFood: 'Millet sprays & forbidden cracker crumbs',
    bio: 'Looking for a bird or fellow pet who appreciates high soprano screeching during your human’s Zoom calls. Do NOT touch the crest unless specifically invited by royal decree.',
    relationshipStatus: 'Looking for a cuddle partner',
    avatarUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000 * 6,
    isUserCreated: false,
    location: 'Top Perch, Living Room Chandelier',
    quirk: 'Hisses affectionately when jealous of the television'
  },
  {
    id: 'seed-rabbit-thumper',
    displayName: 'Thumper McHoppy',
    species: 'Rabbit',
    breed: 'Holland Lop Architect',
    age: 2,
    gender: 'Fluffy Daredevil',
    personalityTraits: ['Sassy', 'Architectural Chew Master', 'Binky King', 'Snack Negotiator'],
    interests: ['Artisanal phone charger cord cutting', 'Baseboard remodeling', 'Vertical 180 binkies'],
    favouriteFood: 'Sun-dried organic banana slices & Timothy hay heads',
    bio: 'My ears have 360-degree radar for crinkling snack bags. If you don’t approve of heavy furniture chewing as modern art, swipe left immediately.',
    relationshipStatus: 'Open to poly-carrot arrangements',
    avatarUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000 * 2,
    isUserCreated: false,
    location: 'Behind the Living Room Sofa Secret Base',
    quirk: 'Thumps rear foot with enough force to register on local seismographs'
  },
  {
    id: 'seed-other-gary',
    displayName: 'Gary the Capybara',
    species: 'Other',
    breed: 'Giant Chill Rodent',
    age: 6,
    gender: 'Zen Master',
    personalityTraits: ['Unbothered', 'Moisturized', 'Coexist Legend', 'Hydrotherapist'],
    interests: ['Thermal hot springs', 'Allowing ducks to perch on my head', 'Eating bamboo slowly'],
    favouriteFood: 'Chilled sweet watermelon rinds',
    bio: 'Zero enemies. Zero stress. Pure vibration. Ready to lay by the riverside while three turtles and a pelican use us as a community picnic table.',
    relationshipStatus: 'Fur-ever taken',
    avatarUrl: 'https://images.unsplash.com/photo-1550935560-6a3f4e2c9ef8?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000 * 8,
    isUserCreated: false,
    location: 'Warm Lagoon, Sunken Log #4',
    quirk: 'Heart rate never exceeds 42 beats per minute even during thunder'
  },
  {
    id: 'seed-dog-winston',
    displayName: 'Winston von Boop',
    species: 'Dog',
    breed: 'French Bulldog Gentleman',
    age: 4,
    gender: 'Snorting Potato',
    personalityTraits: ['Gourmet', 'Stubborn', 'Heavy Snorer', 'Dramatic Breather'],
    interests: ['Sitting like an exhausted middle-aged human', 'Refusing walks after 12 steps', 'Sunbathing'],
    favouriteFood: 'Peanut butter spoon licks',
    bio: 'I snore louder than a freight train and I will require you to carry me back from the dog park. Seeking someone who appreciates loaf aesthetics.',
    relationshipStatus: "It's complicated (with the vacuum)",
    avatarUrl: 'https://i.pinimg.com/736x/8e/49/4b/8e494b27e42ffc8e7d06bd0e689ce390.jpg',
    createdAt: Date.now() - 86400000 * 1,
    isUserCreated: false,
    location: 'Memory Foam Orthopedic Dog Bed',
    quirk: 'Groans when asked to shift positions on the rug'
  },
  {
    id: 'seed-cat-fluffybutt',
    displayName: 'Duchess Fluffybutt',
    species: 'Cat',
    breed: 'Ragdoll Heiress',
    age: 2,
    gender: 'Pampered Starlet',
    personalityTraits: ['Floppy', 'High Maintenance', 'Bougie', 'Catnip Aficionado'],
    interests: ['Posing dramatically on velvet rugs', 'Swatting dust motes', 'Ignoring peasants'],
    favouriteFood: 'Organic free-range chicken paté',
    bio: 'Divorced. Kept the scratching tower, the feather wand, and the custody of the plush laser pointer. Looking for a sugar doggy to fund my cat grass addiction.',
    relationshipStatus: 'Divorced with 3 stuffed toys',
    avatarUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000 * 7,
    isUserCreated: false,
    location: 'Silk Pillow Penthouse',
    quirk: 'Goes completely limp like a wet noodle when embraced'
  }
];

// A larger rotating discovery pool keeps browsing lively even before other
// people create accounts. Each character has a stable ID for matching.
const EXTRA_ANIMAL_NAMES = [
  'Mochi Moonwhisker', 'Ziggy Zoom', 'Olive Oatcake', 'Rocket Rumble',
  'Clover Cloudhop', 'Nori Nightwing', 'Maple Muzzle', 'Pebble Paddles',
  'Juniper Jingle', 'Atlas Applecore', 'Saffron Sunbeam', 'Biscuit Bounce',
  'Echo Evergreen', 'Poppy Paws', 'Comet Cuddles', 'Willow Wobble',
  'Bramble Brighttail', 'Tango Tails', 'Marble Munchkin', 'Sunny Snuffles',
  'Indigo Inkspot', 'Fable Featherfoot', 'Rufus Ripple', 'Daisy Dandelion'
];

EXTRA_ANIMAL_NAMES.forEach((displayName, index) => {
  const source = SEED_PROFILES[index % SEED_PROFILES.length];
  SEED_PROFILES.push({
    ...source,
    id: `seed-extra-${index + 1}`,
    displayName,
    age: 1 + (index % 8),
    bio: `${source.bio} Also known around town for ${index % 2 ? 'excellent snack opinions.' : 'legendary zoomies.'}`,
    createdAt: Date.now() - 86400000 * (index + 1)
  });
});

export const DRAMA_EVENTS: DramaEvent[] = [
  {
    id: 'drama-1',
    headline: 'SCANDAL: Bruno the Bulldog caught liking 17 tennis balls’ profiles',
    description: 'Witnesses report Bruno swiped right on every neon felt sphere within a 20-mile radius. His ex, Bella the Beagle, has demanded a formal paw audit.',
    tag: 'Breaking',
    timestamp: Date.now() - 1000 * 60 * 12,
    reactionsCount: 842,
    userReacted: false,
    participants: ['Bruno (Bulldog)', 'Bella (Beagle)']
  },
  {
    id: 'drama-2',
    headline: 'Princess Bartholomew III changed status to “Emotionally Unavailable”',
    description: 'After being offered off-brand chicken paté, the royal feline declared the dating pool “uncultured” and ordered all suitors to submit resume scrolls via pigeon.',
    tag: 'Scandal',
    timestamp: Date.now() - 1000 * 60 * 45,
    reactionsCount: 1209,
    userReacted: true,
    participants: ['Princess Bartholomew III']
  },
  {
    id: 'drama-3',
    headline: 'PETTY COURT: Three hamsters viewed your profile. One is suspicious.',
    description: 'Intelligence officials suspect Lord Nibbles is scoping out rival sunflower seed supply chains. Security has been deployed around the cedar wheel.',
    tag: 'Petty Court',
    timestamp: Date.now() - 1000 * 60 * 130,
    reactionsCount: 521,
    userReacted: false,
    participants: ['Lord Nibbles', 'Anonymous Dwarf Hamster']
  },
  {
    id: 'drama-4',
    headline: 'CRUSH ALERT: Your match has been typing for 47 minutes',
    description: 'Insiders report they accidentally tapped the keyboard with a moist paw and fell asleep with their chin resting on the spacebar.',
    tag: 'Love Alert',
    timestamp: Date.now() - 1000 * 60 * 240,
    reactionsCount: 967,
    userReacted: false,
    participants: ['Winston von Boop']
  },
  {
    id: 'drama-5',
    headline: 'TREAT HEIST: Gary the Capybara peacefully occupies communal watermelon',
    description: 'Capybara council declines to negotiate. Gary remains completely motionless while six hummingbirds drink nectar off his snout.',
    tag: 'Gossip',
    timestamp: Date.now() - 1000 * 60 * 360,
    reactionsCount: 2310,
    userReacted: false,
    participants: ['Gary the Capybara']
  }
];

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    authorId: 'seed-cat-bartholomew',
    authorName: 'Princess Bartholomew III',
    authorAvatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80',
    authorSpecies: 'Cat',
    content: 'My human sneezed while I was sleeping. I have contacted my legal counsel. You will be hearing from my pawyer.',
    likes: 184,
    userLiked: false,
    timestamp: Date.now() - 1000 * 60 * 25,
    commentsCount: 29,
    dramaTag: 'Betrayal'
  },
  {
    id: 'post-2',
    authorId: 'seed-dog-barnaby',
    authorName: 'Sir Barnaby Barks-a-lot',
    authorAvatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    authorSpecies: 'Dog',
    content: 'ALERT: The vacuum cleaner has entered the hallway. I barked at it with maximum ferocity. It pretended not to hear me, but I know it was trembling inside.',
    likes: 341,
    userLiked: true,
    timestamp: Date.now() - 1000 * 60 * 85,
    commentsCount: 52,
    dramaTag: 'Spicy'
  },
  {
    id: 'post-3',
    authorId: 'seed-rabbit-thumper',
    authorName: 'Thumper McHoppy',
    authorAvatar: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80',
    authorSpecies: 'Rabbit',
    content: 'Rating things I chewed this morning:\n1. Apple laptop charger cable: 9.5/10 (exquisite spice)\n2. Baseboard corner: 8/10 (crunchy oak bouquet)\n3. Important tax document: 10/10 (sublime mouthfeel)',
    likes: 412,
    userLiked: false,
    timestamp: Date.now() - 1000 * 60 * 180,
    commentsCount: 77,
    dramaTag: 'Spicy'
  },
  {
    id: 'post-4',
    authorId: 'seed-bird-penelope',
    authorName: 'Madame Penelope Featherington',
    authorAvatar: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80',
    authorSpecies: 'Bird',
    content: 'Just serenaded my own reflection for 3 straight hours. He is stunning. Truly the love of my life. Nobody else compares.',
    likes: 290,
    userLiked: false,
    timestamp: Date.now() - 1000 * 60 * 320,
    commentsCount: 18,
    dramaTag: 'Wholesome'
  }
];
