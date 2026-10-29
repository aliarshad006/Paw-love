import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AnimalProfile, Species } from '../types';
import { ANIMAL_SPECIES_CATALOG, PRESET_AVATARS, getSpeciesEmoji } from '../data/petAvatars';
import { ProfileCard } from '../components/ProfileCard';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
  Plus,
  Check,
  Upload,
  Heart,
  Smile,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

const NAME_SUGGESTIONS = [
  'Princess Mittens',
  'Bruno the Destroyer',
  'Sir Hiss-a-Lot',
  'King Roar',
  'Zebra Zuckerberg',
  'Captain Waddles',
  'Lord Fluffington',
  'Gary the Capybara',
  'Duchess Sparkle',
  'Ember the Dragon'
];

const SUGGESTED_PERSONALITIES = [
  'Funny',
  'Shy',
  'Brave',
  'Lazy',
  'Playful',
  'Dramatic',
  'Friendly',
  'Mischievous',
  'Sleepy',
  'Overconfident',
  'Food lover',
  'Attention seeker',
  'Mysterious',
  'Romantic',
  'Easily jealous'
];

const SUGGESTED_INTERESTS = [
  'Sleeping',
  'Eating',
  'Running',
  'Exploring',
  'Making friends',
  'Causing drama',
  'Chasing things',
  'Taking selfies',
  'Dancing',
  'Hunting for snacks'
];

const SUGGESTED_FOODS = [
  'Sharp cheddar cheese',
  'Fresh sashimi salmon',
  'Crunchy sunflower seeds',
  'Organic banana chips',
  'Juicy prime meat',
  'Secret midnight pizza crust',
  'Sweet watermelon slice',
  'Crisp eucalyptus leaves',
  'Millet spray treats',
  'Hot sweet potatoes'
];

const SUGGESTED_STATUSES = [
  'Single and fabulous',
  'Looking for love',
  'Just here for friends',
  "It's complicated",
  'Emotionally unavailable',
  'Happily matched',
  'Not sure yet'
];

const SUGGESTED_BIOS = [
  'Professional napper. Part-time heartbreaker. Full-time snack hunter.',
  'Will stare you down until treats are provided. Claws out, heart warm.',
  'Looking for someone to run zoomies with at 3:00 AM sharp.',
  'Unbothered, moisturized, in my lane. Bringing pure royal vibes.',
  'I may look soft, but I hoard secrets and snacks like an international spy.'
];

export const CreateProfile: React.FC = () => {
  const { currentProfile, saveProfile, setActiveTab, firebaseStatus } = useApp();

  // Step 1 to 5 wizard
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [displayName, setDisplayName] = useState(currentProfile?.displayName || '');
  const [species, setSpecies] = useState<string>(currentProfile?.species || 'Dog');
  const [customSpeciesName, setCustomSpeciesName] = useState('');
  const [isCustomSpecies, setIsCustomSpecies] = useState(false);
  const [speciesSearch, setSpeciesSearch] = useState('');

  const [age, setAge] = useState<number>(currentProfile?.age || 3);
  const [characterVibe, setCharacterVibe] = useState(currentProfile?.gender || 'Good Boy');

  // Personalities with "+ Add My Own"
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>(
    currentProfile?.personalityTraits || ['Funny', 'Dramatic']
  );
  const [customPersonalityInput, setCustomPersonalityInput] = useState('');
  const [showAddPersonality, setShowAddPersonality] = useState(false);

  // Interests with "+ Add My Own"
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    currentProfile?.interests || ['Sleeping', 'Hunting for snacks']
  );
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [showAddInterest, setShowAddInterest] = useState(false);

  // Food with "+ Add My Own"
  const [favouriteFood, setFavouriteFood] = useState(
    currentProfile?.favouriteFood || 'Sharp cheddar cheese'
  );
  const [customFoodInput, setCustomFoodInput] = useState('');
  const [showAddFood, setShowAddFood] = useState(false);

  // Relationship Status with custom option
  const [relationshipStatus, setRelationshipStatus] = useState<string>(
    currentProfile?.relationshipStatus || 'Single and fabulous'
  );
  const [customStatusInput, setCustomStatusInput] = useState('');
  const [isCustomStatus, setIsCustomStatus] = useState(false);

  // Bio
  const [bio, setBio] = useState(
    currentProfile?.bio || 'Professional napper. Part-time heartbreaker. Full-time snack hunter.'
  );

  // Avatar
  const [avatarUrl, setAvatarUrl] = useState(
    currentProfile?.avatarUrl || PRESET_AVATARS[0].url
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [photoUrls, setPhotoUrls] = useState<string[]>(currentProfile?.photoUrls || []);

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter animals by search
  const filteredCatalog = ANIMAL_SPECIES_CATALOG.filter((a) =>
    a.name.toLowerCase().includes(speciesSearch.toLowerCase())
  );

  // Handlers for Custom Items
  const handleAddCustomPersonality = (e: React.FormEvent) => {
    e.preventDefault();
    const val = customPersonalityInput.trim();
    if (val && !selectedPersonalities.includes(val)) {
      setSelectedPersonalities([...selectedPersonalities, val]);
      setCustomPersonalityInput('');
      setShowAddPersonality(false);
    }
  };

  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const val = customInterestInput.trim();
    if (val && !selectedInterests.includes(val)) {
      setSelectedInterests([...selectedInterests, val]);
      setCustomInterestInput('');
      setShowAddInterest(false);
    }
  };

  const handleAddCustomFood = (e: React.FormEvent) => {
    e.preventDefault();
    const val = customFoodInput.trim();
    if (val) {
      setFavouriteFood(val);
      setCustomFoodInput('');
      setShowAddFood(false);
    }
  };

  const togglePersonality = (p: string) => {
    if (selectedPersonalities.includes(p)) {
      setSelectedPersonalities(selectedPersonalities.filter((item) => item !== p));
    } else {
      setSelectedPersonalities([...selectedPersonalities, p]);
    }
  };

  const toggleInterest = (i: string) => {
    if (selectedInterests.includes(i)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== i));
    } else {
      setSelectedInterests([...selectedInterests, i]);
    }
  };

  const handleCustomPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addGalleryPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setPhotoUrls((previous) => previous.length < 5 ? [...previous, result] : previous);
      }
    };
    reader.readAsDataURL(file);
  };

  // Live preview profile object
  const finalSpecies = isCustomSpecies && customSpeciesName.trim() ? customSpeciesName.trim() : species;
  const finalStatus = isCustomStatus && customStatusInput.trim() ? customStatusInput.trim() : relationshipStatus;

  const previewProfile: AnimalProfile = {
    id: currentProfile?.id || 'preview-id',
    displayName: displayName.trim() || 'Your Animal Name',
    species: finalSpecies,
    age: Number(age) || 1,
    gender: characterVibe,
    relationshipStatus: finalStatus,
    personalityTraits: selectedPersonalities.length > 0 ? selectedPersonalities : ['Funny'],
    interests: selectedInterests.length > 0 ? selectedInterests : ['Sleeping'],
    favouriteFood: favouriteFood || 'Snacks',
    bio: bio || 'Welcome to my animal world!',
    avatarUrl,
    photoUrls,
    createdAt: Date.now(),
    isUserCreated: true,
    location: 'Ruff Luck'
  };

  // Step Validation & Navigation
  const handleNextStep = () => {
    setValidationError(null);
    if (currentStep === 1) {
      if (!displayName.trim()) {
        setValidationError('Please give your animal a name, buddy!');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (isCustomSpecies && !customSpeciesName.trim()) {
        setValidationError('Please type what kind of animal you are!');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (selectedPersonalities.length === 0) {
        setValidationError('Please pick at least one personality trait!');
        return;
      }
      if (selectedInterests.length === 0) {
        setValidationError('Please select at least one interest!');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!favouriteFood.trim()) {
        setValidationError('Please tell us your favourite food!');
        return;
      }
      if (!bio.trim() || bio.trim().length < 8) {
        setValidationError('Please write a short funny bio (at least 8 characters)!');
        return;
      }
      setCurrentStep(5);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      setValidationError(null);

      await saveProfile({
        id: currentProfile?.id,
        displayName: displayName.trim(),
        species: finalSpecies,
        age: Number(age) || 1,
        gender: characterVibe,
        relationshipStatus: finalStatus,
        personalityTraits: selectedPersonalities,
        interests: selectedInterests,
        favouriteFood: favouriteFood.trim(),
        bio: bio.trim(),
        avatarUrl,
        photoUrls,
        location: 'Ruff Luck'
      });

      // Jump into discover immediately
      setActiveTab('discover');
    } catch (err: any) {
      setValidationError(err?.message || 'Could not save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen paw-pattern-bg py-8 px-4 sm:px-6 pb-24 text-left">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Stepper Bar */}
        <div className="bg-white rounded-3xl p-5 border border-pink-200 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-black uppercase text-pink-600 bg-pink-100 px-3 py-1 rounded-full border border-pink-200">
                Step {currentStep} of 5
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-purple-950 mt-1">
                {currentStep === 1 && "What's your name, buddy?"}
                {currentStep === 2 && "What kind of animal are you?"}
                {currentStep === 3 && "What makes you special?"}
                {currentStep === 4 && "What's your favourite food & bio?"}
                {currentStep === 5 && "Choose your avatar & review profile"}
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="w-full sm:w-48 bg-pink-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="bg-rose-50 border border-rose-300 text-rose-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Main Content: Step Card + Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Wizard Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-pink-200 shadow-xl space-y-6">

            {/* STEP 1: Animal Name & Identity */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <label className="block text-sm font-black text-purple-950">
                    Hey, little buddy! What's your name? 🐾
                  </label>
                  <p className="text-xs text-purple-700/80">
                    Pick a funny royal title, heroic name, or type your own.
                  </p>
                </div>

                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Princess Mittens, Bruno the Destroyer"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-pink-200 bg-pink-50/20 text-purple-950 text-base font-extrabold focus:outline-pink-500 focus:bg-white"
                />

                {/* Name Quick Suggestions */}
                <div>
                  <span className="text-[11px] font-black uppercase text-purple-400 block mb-2">
                    Click to use an animal name idea:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {NAME_SUGGESTIONS.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setDisplayName(name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          displayName === name
                            ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                            : 'bg-pink-50/60 text-purple-900 border-pink-200 hover:bg-pink-100'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age & Vibe */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-purple-900 mb-1">
                      Age (in animal years)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-pink-50/20 text-purple-950 text-sm font-bold focus:outline-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-purple-900 mb-1">
                      Animal Vibe / Identity
                    </label>
                    <select
                      value={characterVibe}
                      onChange={(e) => setCharacterVibe(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-pink-50/20 text-purple-950 text-sm font-bold focus:outline-pink-500 cursor-pointer"
                    >
                      <option value="Good Boy">Good Boy</option>
                      <option value="Good Girl">Good Girl</option>
                      <option value="Majestic Royal">Majestic Royal</option>
                      <option value="Little Dude">Little Dude</option>
                      <option value="Feathered Diva">Feathered Diva</option>
                      <option value="Unbothered Legend">Unbothered Legend</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Animal Species Selection */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <label className="block text-sm font-black text-purple-950">
                    What kind of animal are you? 🦁 🐶 🐱 🐉
                  </label>
                  <p className="text-xs text-purple-700/80">
                    Search or browse. Every animal is welcome!
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search any animal (Lion, Dragon, Zebra, Penguin, Frog...)"
                    value={speciesSearch}
                    onChange={(e) => setSpeciesSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 bg-pink-50/20 text-purple-950 text-xs sm:text-sm font-medium focus:outline-pink-500"
                  />
                </div>

                {/* Animal Grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto p-1">
                  {filteredCatalog.map((item) => {
                    const isSelected = !isCustomSpecies && species.toLowerCase() === item.name.toLowerCase();
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setIsCustomSpecies(false);
                          setSpecies(item.name);
                          setAvatarUrl(item.defaultPhotoUrl);
                        }}
                        className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-900 text-white border-purple-900 shadow-md scale-105'
                            : 'bg-white text-purple-950 border-pink-200 hover:bg-pink-50'
                        }`}
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="truncate">{item.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom "Other" Animal Option */}
                <div className="pt-2 border-t border-pink-100">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCustomSpecies(!isCustomSpecies)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        isCustomSpecies
                          ? 'bg-pink-500 text-white border-pink-500'
                          : 'bg-pink-50 text-purple-900 border-pink-200'
                      }`}
                    >
                      + Type My Own Animal Name
                    </button>
                  </div>

                  {isCustomSpecies && (
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Type animal species (e.g. Red Panda, Komodo Dragon, Axolotl)..."
                        value={customSpeciesName}
                        onChange={(e) => setCustomSpeciesName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-pink-300 bg-pink-50/30 text-purple-950 font-bold focus:outline-pink-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: Personality Traits & Interests */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                {/* Personality Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-black text-purple-950">
                      What makes you special? (Personality) ✨
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddPersonality(!showAddPersonality)}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add My Own Personality</span>
                    </button>
                  </div>

                  {showAddPersonality && (
                    <form onSubmit={handleAddCustomPersonality} className="flex gap-2 pb-1">
                      <input
                        type="text"
                        placeholder="Type your own personality trait..."
                        value={customPersonalityInput}
                        onChange={(e) => setCustomPersonalityInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-pink-300 bg-white"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-pink-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </form>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PERSONALITIES.map((p) => {
                      const isSel = selectedPersonalities.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => togglePersonality(p)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            isSel
                              ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                              : 'bg-purple-50/70 text-purple-900 border-purple-200 hover:bg-purple-100'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '}
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interests Section */}
                <div className="space-y-2 pt-4 border-t border-pink-100">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-black text-purple-950">
                      Interests 🐾
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddInterest(!showAddInterest)}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add My Own Interest</span>
                    </button>
                  </div>

                  {showAddInterest && (
                    <form onSubmit={handleAddCustomInterest} className="flex gap-2 pb-1">
                      <input
                        type="text"
                        placeholder="Type your own hobby or interest..."
                        value={customInterestInput}
                        onChange={(e) => setCustomInterestInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-pink-300 bg-white"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-pink-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Add
                      </button>
                    </form>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_INTERESTS.map((i) => {
                      const isSel = selectedInterests.includes(i);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => toggleInterest(i)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            isSel
                              ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                              : 'bg-pink-50 text-pink-900 border-pink-200 hover:bg-pink-100'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '}
                          {i}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Favourite Food & Bio */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fadeIn">
                {/* Food */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-black text-purple-950">
                      What's your favourite food? 🧀 🥩 🐟 🥕
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddFood(!showAddFood)}
                      className="text-xs font-bold text-pink-600 hover:text-pink-800 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add My Own Food</span>
                    </button>
                  </div>

                  {showAddFood && (
                    <form onSubmit={handleAddCustomFood} className="flex gap-2 pb-1">
                      <input
                        type="text"
                        placeholder="Type what snack you crave..."
                        value={customFoodInput}
                        onChange={(e) => setCustomFoodInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-pink-300 bg-white"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-pink-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Set
                      </button>
                    </form>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_FOODS.map((food) => (
                      <button
                        key={food}
                        type="button"
                        onClick={() => setFavouriteFood(food)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          favouriteFood === food
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'bg-amber-50/70 text-amber-950 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {favouriteFood === food ? '✓ ' : ''}
                        {food}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Relationship Status */}
                <div className="space-y-2 pt-3 border-t border-pink-100">
                  <label className="block text-sm font-black text-purple-950">
                    Relationship Status
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SUGGESTED_STATUSES.map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          setIsCustomStatus(false);
                          setRelationshipStatus(st);
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all text-left cursor-pointer ${
                          !isCustomStatus && relationshipStatus === st
                            ? 'bg-pink-500 text-white border-pink-500'
                            : 'bg-pink-50/50 text-purple-900 border-pink-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  {/* Custom Relationship Status */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setIsCustomStatus(!isCustomStatus)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border cursor-pointer ${
                        isCustomStatus ? 'bg-pink-500 text-white' : 'text-pink-700 border-pink-200'
                      }`}
                    >
                      + Write Custom Status
                    </button>
                    {isCustomStatus && (
                      <input
                        type="text"
                        placeholder="e.g. In love with the ceiling fan, Open to snack bribes..."
                        value={customStatusInput}
                        onChange={(e) => setCustomStatusInput(e.target.value)}
                        className="w-full mt-2 px-3 py-1.5 text-xs rounded-xl border border-pink-300"
                      />
                    )}
                  </div>
                </div>

                {/* Funny Bio */}
                <div className="space-y-2 pt-3 border-t border-pink-100">
                  <label className="block text-sm font-black text-purple-950">
                    Tell everyone about yourself (Bio)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write a short funny bio for other animals to read..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-pink-200 bg-pink-50/20 text-purple-950 text-xs sm:text-sm font-medium focus:outline-pink-500"
                  />

                  {/* Bio suggestions click to fill */}
                  <div>
                    <span className="text-[11px] font-bold text-purple-400 block mb-1">
                      Or click an example bio:
                    </span>
                    <div className="space-y-1.5">
                      {SUGGESTED_BIOS.map((b, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setBio(b)}
                          className="w-full text-left p-2 rounded-xl text-xs bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-100 cursor-pointer"
                        >
                          "{b}"
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Avatar Selection & Final Review */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <label className="block text-sm font-black text-purple-950">
                    Choose your Animal Avatar 📸
                  </label>
                  <p className="text-xs text-purple-700/80">
                    Pick a preset picture or upload a custom animal photo.
                  </p>
                </div>

                {/* Preset Avatars */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAvatarUrl(a.url)}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                        avatarUrl === a.url
                          ? 'border-pink-500 ring-3 ring-pink-400 scale-105 shadow-md'
                          : 'border-pink-200 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                      {avatarUrl === a.url && (
                        <div className="absolute inset-0 bg-pink-600/30 flex items-center justify-center text-white">
                          <Check className="w-5 h-5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Upload or URL */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-pink-100">
                  <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold hover:bg-purple-100 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-purple-600" />
                    <span>Upload Animal Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCustomPhotoUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="w-full sm:flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="Or paste photo URL..."
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-pink-200 bg-pink-50/20 text-purple-950"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customAvatarUrl.trim()) setAvatarUrl(customAvatarUrl.trim());
                      }}
                      className="px-3 py-2 bg-pink-500 text-white text-xs font-bold rounded-xl hover:bg-pink-600 cursor-pointer"
                    >
                      Set
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-pink-100 p-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div>
                      <p className="text-xs font-black text-purple-950">Extra gallery photos</p>
                      <p className="text-[11px] text-purple-700/80">Add up to five additional images.</p>
                    </div>
                    <label className="px-3 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold cursor-pointer">
                      Add photos
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => Array.from(e.target.files || []).forEach(addGalleryPhoto)} />
                    </label>
                  </div>
                  {photoUrls.length > 0 && <div className="grid grid-cols-5 gap-2">
                    {photoUrls.map((url, index) => <div key={url} className="relative aspect-square overflow-hidden rounded-lg">
                      <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setPhotoUrls((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 text-white text-xs" aria-label="Remove photo">×</button>
                    </div>)}
                  </div>}
                </div>

                {/* Final Summary Checklist */}
                <div className="bg-pink-50/80 p-4 rounded-2xl border border-pink-200 text-xs text-purple-900 space-y-1">
                  <div className="font-extrabold text-sm text-pink-900 mb-1">
                    Ready to join Ruff Luck!
                  </div>
                  <div>• <strong>Character:</strong> {displayName} the {finalSpecies} ({characterVibe}, {age} yrs)</div>
                  <div>• <strong>Status:</strong> "{finalStatus}"</div>
                  <div>• <strong>Favourite Food:</strong> {favouriteFood}</div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Footer Buttons */}
            <div className="pt-4 border-t border-pink-100 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('welcome')}
                  className="text-xs font-bold text-purple-500 hover:text-purple-800 cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-pink-500/20 cursor-pointer hover:opacity-95"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-black text-sm flex items-center gap-2 shadow-xl shadow-pink-500/30 cursor-pointer hover:opacity-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Animal Life...</span>
                    </>
                  ) : (
                    <>
                      <span>Create profile & start matching 🐾</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>

          </div>

          {/* Right Live Preview Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="text-xs font-black uppercase text-purple-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-500" /> Live Pet Profile Preview
              </span>
              <span className="text-[11px] font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">
                Step {currentStep} of 5
              </span>
            </div>

            <ProfileCard profile={previewProfile} showActions={false} />
          </div>

        </div>
      </div>
    </div>
  );
};
