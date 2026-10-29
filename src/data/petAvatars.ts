export interface AnimalSpeciesInfo {
  name: string;
  emoji: string;
  category: 'Pets & Small' | 'Wild Mammals' | 'Birds' | 'Aquatic & Reptiles' | 'Farm' | 'Mythical & Other';
  defaultPhotoUrl: string;
}

export const ANIMAL_SPECIES_CATALOG: AnimalSpeciesInfo[] = [
  // Pets & Small
  { name: 'Dog', emoji: '🐶', category: 'Pets & Small', defaultPhotoUrl: 'https://i.pinimg.com/736x/8e/49/4b/8e494b27e42ffc8e7d06bd0e689ce390.jpg' },
  { name: 'Cat', emoji: '🐱', category: 'Pets & Small', defaultPhotoUrl: 'https://www.meme-arsenal.com/memes/76a736a1f1c02395c1b2d157b9afb92d.jpg' },
  { name: 'Rabbit', emoji: '🐰', category: 'Pets & Small', defaultPhotoUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80' },
  { name: 'Hamster', emoji: '🐹', category: 'Pets & Small', defaultPhotoUrl: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=400&q=80' },
  { name: 'Fox', emoji: '🦊', category: 'Pets & Small', defaultPhotoUrl: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=400&q=80' },

  // Wild Mammals
  { name: 'Lion', emoji: '🦁', category: 'Wild Mammals', defaultPhotoUrl: 'https://i.ibb.co/vx3kcbS1/Regal-Lion-at-the-Futuristic-Gala.png' },
  { name: 'Tiger', emoji: '🐯', category: 'Wild Mammals', defaultPhotoUrl: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=400&q=80' },
  { name: 'Zebra', emoji: '🦓', category: 'Wild Mammals', defaultPhotoUrl: 'https://images.unsplash.com/photo-1526095179574-86e545346ae6?auto=format&fit=crop&w=400&q=80' },
  { name: 'Elephant', emoji: '🐘', category: 'Wild Mammals', defaultPhotoUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&q=80' },
  { name: 'Giraffe', emoji: '🦒', category: 'Wild Mammals', defaultPhotoUrl: 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?auto=format&fit=crop&w=400&q=80' },
  { name: 'Monkey', emoji: '🐵', category: 'Wild Mammals', defaultPhotoUrl: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=400&q=80' },
  { name: 'Wolf', emoji: '🐺', category: 'Wild Mammals', defaultPhotoUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Bear', emoji: '🐻', category: 'Wild Mammals', defaultPhotoUrl: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=400&q=80' },
  { name: 'Panda', emoji: '🐼', category: 'Wild Mammals', defaultPhotoUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Koala', emoji: '🐨', category: 'Wild Mammals', defaultPhotoUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=400&q=80' },
  { name: 'Kangaroo', emoji: '🦘', category: 'Wild Mammals', defaultPhotoUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=400&q=80' },

  // Birds
  { name: 'Bird', emoji: '🦜', category: 'Birds', defaultPhotoUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80' },
  { name: 'Parrot', emoji: '🦜', category: 'Birds', defaultPhotoUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80' },
  { name: 'Penguin', emoji: '🐧', category: 'Birds', defaultPhotoUrl: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=400&q=80' },
  { name: 'Duck', emoji: '🦆', category: 'Birds', defaultPhotoUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80' },
  { name: 'Chicken', emoji: '🐔', category: 'Birds', defaultPhotoUrl: 'https://tse2.mm.bing.net/th/id/OIP.RBlxHbVcYkDipo9zMhp7XwHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
  { name: 'Owl', emoji: '🦉', category: 'Birds', defaultPhotoUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Eagle', emoji: '🦅', category: 'Birds', defaultPhotoUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=400&q=80' },

  // Aquatic & Reptiles
  { name: 'Dolphin', emoji: '🐬', category: 'Aquatic & Reptiles', defaultPhotoUrl: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=400&q=80' },
  { name: 'Shark', emoji: '🦈', category: 'Aquatic & Reptiles', defaultPhotoUrl: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=400&q=80' },
  { name: 'Whale', emoji: '🐋', category: 'Aquatic & Reptiles', defaultPhotoUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=400&q=80' },
  { name: 'Turtle', emoji: '🐢', category: 'Aquatic & Reptiles', defaultPhotoUrl: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=400&q=80' },
  { name: 'Frog', emoji: '🐸', category: 'Aquatic & Reptiles', defaultPhotoUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=400&q=80' },
  { name: 'Crocodile', emoji: '🐊', category: 'Aquatic & Reptiles', defaultPhotoUrl: 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=400&q=80' },
  { name: 'Snake', emoji: '🐍', category: 'Aquatic & Reptiles', defaultPhotoUrl: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=400&q=80' },

  // Farm
  { name: 'Horse', emoji: '🐴', category: 'Farm', defaultPhotoUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80' },
  { name: 'Cow', emoji: '🐮', category: 'Farm', defaultPhotoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=400&q=80' },
  { name: 'Goat', emoji: '🐐', category: 'Farm', defaultPhotoUrl: 'https://static.independent.co.uk/2023/06/20/22/20-effd27c6211b4deeb6748ba03276d4fc.jpg' },
  { name: 'Sheep', emoji: '🐑', category: 'Farm', defaultPhotoUrl: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?auto=format&fit=crop&w=400&q=80' },
  { name: 'Deer', emoji: '🦌', category: 'Farm', defaultPhotoUrl: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=400&q=80' },

  // Mythical & Other
  { name: 'Butterfly', emoji: '🦋', category: 'Mythical & Other', defaultPhotoUrl: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=400&q=80' },
  { name: 'Dragon', emoji: '🐉', category: 'Mythical & Other', defaultPhotoUrl: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&w=400&q=80' },
  { name: 'Capybara', emoji: '🦫', category: 'Mythical & Other', defaultPhotoUrl: 'https://images.unsplash.com/photo-1550935560-6a3f4e2c9ef8?auto=format&fit=crop&w=400&q=80' },
  { name: 'Other', emoji: '🐾', category: 'Mythical & Other', defaultPhotoUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=400&q=80' }
];

export interface AvatarOption {
  id: string;
  species: string;
  name: string;
  url: string;
  emoji: string;
}

export const PRESET_AVATARS: AvatarOption[] = [
  // Cats
  {
    id: 'cat-persian-fluff',
    species: 'Cat',
    name: 'Fluffy Royalty',
    emoji: '🐱',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cat-orange-tabby',
    species: 'Cat',
    name: 'One Brain Cell Tabby',
    emoji: '🐈',
    url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cat-tuxedo',
    species: 'Cat',
    name: 'Dapper Tuxedo',
    emoji: '🎩',
    url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80'
  },
  // Dogs
  {
    id: 'dog-golden-retriever',
    species: 'Dog',
    name: 'Golden Joy',
    emoji: '🐕',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'dog-french-bulldog',
    species: 'Dog',
    name: 'Frenchie Snort',
    emoji: '🐶',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'dog-shiba-inu',
    species: 'Dog',
    name: 'Doge Supreme',
    emoji: '🦊',
    url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=400&q=80'
  },
  // Rabbits & Small
  {
    id: 'rabbit-holland-lop',
    species: 'Rabbit',
    name: 'Flop Lop',
    emoji: '🐰',
    url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'hamster-pouch-master',
    species: 'Hamster',
    name: 'Pouch Stuffer',
    emoji: '🐹',
    url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=400&q=80'
  },
  // Birds
  {
    id: 'bird-cockatiel-crest',
    species: 'Bird',
    name: 'Screaming Crest',
    emoji: '🦜',
    url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80'
  },
  // Wild & Majestic
  {
    id: 'lion-king',
    species: 'Lion',
    name: 'King Roar',
    emoji: '🦁',
    url: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'tiger-stripes',
    species: 'Tiger',
    name: 'Striped Majesty',
    emoji: '🐯',
    url: 'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'zebra-speed',
    species: 'Zebra',
    name: 'Zebra Zuckerberg',
    emoji: '🦓',
    url: 'https://images.unsplash.com/photo-1526095179574-86e545346ae6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'elephant-grand',
    species: 'Elephant',
    name: 'Gentle Giant',
    emoji: '🐘',
    url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'panda-chill',
    species: 'Panda',
    name: 'Bamboo Monarch',
    emoji: '🐼',
    url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'dragon-ember',
    species: 'Dragon',
    name: 'Lord of Embers',
    emoji: '🐉',
    url: 'https://images.unsplash.com/photo-1577493340887-b7bfff550145?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'capybara-zen',
    species: 'Other',
    name: 'Zen Gary',
    emoji: '🦫',
    url: 'https://images.unsplash.com/photo-1550935560-6a3f4e2c9ef8?auto=format&fit=crop&w=400&q=80'
  }
];

export const STICKERS = [
  { emoji: '🦴', label: 'Juicy Bone' },
  { emoji: '🐟', label: 'Fresh Tuna' },
  { emoji: '🥕', label: 'Crunchy Carrot' },
  { emoji: '🎾', label: 'Slobbery Ball' },
  { emoji: '🥩', label: 'Prime Steak' },
  { emoji: '🧀', label: 'Secret Cheese' },
  { emoji: '🪶', label: 'Tickly Feather' },
  { emoji: '🎋', label: 'Crisp Bamboo' },
  { emoji: '🐾', label: 'High Paw' },
  { emoji: '❤️', label: 'Pure Love' }
];

export function getSpeciesEmoji(species: string): string {
  if (!species) return '🐾';
  const found = ANIMAL_SPECIES_CATALOG.find(
    (item) => item.name.toLowerCase() === species.toLowerCase()
  );
  if (found) return found.emoji;

  const lower = species.toLowerCase();
  if (lower.includes('dog')) return '🐶';
  if (lower.includes('cat')) return '🐱';
  if (lower.includes('rabbit') || lower.includes('bunny')) return '🐰';
  if (lower.includes('hamster')) return '🐹';
  if (lower.includes('lion')) return '🦁';
  if (lower.includes('tiger')) return '🐯';
  if (lower.includes('zebra')) return '🦓';
  if (lower.includes('elephant')) return '🐘';
  if (lower.includes('giraffe')) return '🦒';
  if (lower.includes('monkey')) return '🐵';
  if (lower.includes('fox')) return '🦊';
  if (lower.includes('wolf')) return '🐺';
  if (lower.includes('bear')) return '🐻';
  if (lower.includes('penguin')) return '🐧';
  if (lower.includes('duck')) return '🦆';
  if (lower.includes('chicken')) return '🐔';
  if (lower.includes('croc')) return '🐊';
  if (lower.includes('snake')) return '🐍';
  if (lower.includes('turtle')) return '🐢';
  if (lower.includes('frog')) return '🐸';
  if (lower.includes('dolphin')) return '🐬';
  if (lower.includes('shark')) return '🦈';
  if (lower.includes('whale')) return '🐋';
  if (lower.includes('horse')) return '🐴';
  if (lower.includes('cow')) return '🐮';
  if (lower.includes('goat')) return '🐐';
  if (lower.includes('sheep')) return '🐑';
  if (lower.includes('deer')) return '🦌';
  if (lower.includes('panda')) return '🐼';
  if (lower.includes('koala')) return '🐨';
  if (lower.includes('kangaroo')) return '🦘';
  if (lower.includes('owl')) return '🦉';
  if (lower.includes('eagle')) return '🦅';
  if (lower.includes('parrot')) return '🦜';
  if (lower.includes('butterfly')) return '🦋';
  if (lower.includes('dragon')) return '🐉';
  if (lower.includes('bird')) return '🐦';
  return '🐾';
}
