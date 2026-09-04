import type { Post, User } from '@/lib/types';

const NOW = Date.now();
const hoursAgo = (n: number) => NOW - n * 3_600_000;
const photo = (seed: string, portrait = true) =>
  `https://picsum.photos/seed/level-${seed}/${portrait ? '900/1125' : '900/900'}`;
const face = (n: number) => `https://i.pravatar.cc/200?img=${n}`;

export const USERS: User[] = [
  { id: 'maya', name: 'Maya Okafor', handle: 'maya.film', avatar: face(47), bio: '35mm and whatever light is left.', tags: ['film', 'street'] },
  { id: 'jordan', name: 'Jordan Reyes', handle: 'jrey', avatar: face(12), bio: 'Skate, coffee, repeat.', tags: ['skate', 'street'] },
  { id: 'sam', name: 'Sam Lindqvist', handle: 'samlq', avatar: face(33), bio: 'Ceramics studio in a garage.', tags: ['ceramics', 'craft'] },
  { id: 'priya', name: 'Priya Nair', handle: 'priya.eats', avatar: face(45), bio: 'Cooking for six in a kitchen for two.', tags: ['food', 'home'] },
  { id: 'theo', name: 'Theo Marsh', handle: 'theo.climbs', avatar: face(15), bio: 'Chalk on everything.', tags: ['climbing', 'outdoors'] },
  { id: 'lena', name: 'Lena Fischer', handle: 'lenapaints', avatar: face(26), bio: 'Oil on canvas, slowly.', tags: ['painting', 'art'] },
  { id: 'kai', name: 'Kai Tanaka', handle: 'kai.builds', avatar: face(60), bio: 'Architecture student. Concrete enjoyer.', tags: ['architecture', 'street'] },
  { id: 'noor', name: 'Noor Haddad', handle: 'noor.plants', avatar: face(9), bio: 'Keeping forty plants alive, barely.', tags: ['plants', 'home'] },
  { id: 'eli', name: 'Eli Brooks', handle: 'eli.dogs', avatar: face(52), bio: 'Two dogs, one couch.', tags: ['dogs', 'home'] },
  { id: 'rosa', name: 'Rosa Delgado', handle: 'rosa.trails', avatar: face(20), bio: 'Weekend hikes and bad knees.', tags: ['outdoors', 'film'] },
];

export const USERS_BY_ID: Record<string, User> = Object.fromEntries(USERS.map((u) => [u.id, u]));

interface SeedPost {
  id: string;
  authorId: string;
  caption: string;
  hoursAgo: number;
  portrait?: boolean;
}

const SEED: SeedPost[] = [
  { id: 'p01', authorId: 'lena', caption: 'layer three of maybe nine', hoursAgo: 1 },
  { id: 'p02', authorId: 'maya', caption: "last frame on the roll, didn't check the light", hoursAgo: 2 },
  { id: 'p03', authorId: 'priya', caption: 'sunday for six', hoursAgo: 3 },
  { id: 'p04', authorId: 'noor', caption: "new leaf. it's the little things", hoursAgo: 4, portrait: false },
  { id: 'p05', authorId: 'jordan', caption: 'ledge finally waxed', hoursAgo: 5 },
  { id: 'p06', authorId: 'kai', caption: 'brutalism appreciation post', hoursAgo: 6 },
  { id: 'p07', authorId: 'rosa', caption: 'the ridge before the clouds came in', hoursAgo: 7 },
  { id: 'p08', authorId: 'sam', caption: "glaze test fourteen. we're getting somewhere", hoursAgo: 8, portrait: false },
  { id: 'p09', authorId: 'eli', caption: "he's not allowed on the couch", hoursAgo: 9 },
  { id: 'p10', authorId: 'theo', caption: 'sent it. barely.', hoursAgo: 12 },
  { id: 'p11', authorId: 'noor', caption: 'repotting day', hoursAgo: 20 },
  { id: 'p12', authorId: 'lena', caption: 'studio corner, north light', hoursAgo: 24 },
  { id: 'p13', authorId: 'maya', caption: 'the good bench', hoursAgo: 26 },
  { id: 'p14', authorId: 'priya', caption: 'leftovers, but make it a bowl', hoursAgo: 28, portrait: false },
  { id: 'p15', authorId: 'jordan', caption: 'flat ground, flat white', hoursAgo: 30, portrait: false },
  { id: 'p16', authorId: 'eli', caption: 'walk was good', hoursAgo: 31, portrait: false },
  { id: 'p17', authorId: 'kai', caption: 'stairs that go nowhere in particular', hoursAgo: 33 },
  { id: 'p18', authorId: 'theo', caption: 'rest day means looking at rocks', hoursAgo: 36 },
  { id: 'p19', authorId: 'sam', caption: 'kiln day', hoursAgo: 40 },
  { id: 'p20', authorId: 'rosa', caption: 'trail snacks are a food group', hoursAgo: 45, portrait: false },
  { id: 'p21', authorId: 'eli', caption: 'both of them, one blanket', hoursAgo: 48 },
  { id: 'p22', authorId: 'jordan', caption: 'after the rain', hoursAgo: 50 },
  { id: 'p23', authorId: 'lena', caption: 'palette after a long day', hoursAgo: 55, portrait: false },
  { id: 'p24', authorId: 'priya', caption: 'the tomato situation', hoursAgo: 60 },
  { id: 'p25', authorId: 'noor', caption: 'monstera has opinions', hoursAgo: 66 },
  { id: 'p26', authorId: 'maya', caption: 'expired stock, no regrets', hoursAgo: 70, portrait: false },
  { id: 'p27', authorId: 'kai', caption: 'model, week nine', hoursAgo: 72, portrait: false },
  { id: 'p28', authorId: 'theo', caption: 'chalk everywhere', hoursAgo: 80, portrait: false },
  { id: 'p29', authorId: 'sam', caption: 'seconds shelf', hoursAgo: 90 },
  { id: 'p30', authorId: 'rosa', caption: 'knees held up. mostly.', hoursAgo: 96 },
];

export const SEED_POSTS: Post[] = SEED.map((s) => {
  const portrait = s.portrait ?? true;
  return {
    id: s.id,
    authorId: s.authorId,
    caption: s.caption,
    createdAt: hoursAgo(s.hoursAgo),
    image: photo(s.id, portrait),
    aspect: portrait ? 4 / 5 : 1,
    tags: USERS_BY_ID[s.authorId]?.tags ?? [],
  };
});

