import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Noms d'artistes réalistes par genre
const artistNames = {
  SOLO: {
    Rock: ['Luna Steel', 'Max Thunder', 'Jade Rivers', 'Alex Storm', 'Nina Spark'],
    Pop: ['Léa Shine', 'Tom Bright', 'Emma Rose', 'Lucas Star', 'Chloé Dream'],
    Jazz: ['Miles Harper', 'Ella Morgan', 'Duke Williams', 'Billie Laurent', 'Charlie Rhodes'],
    'Hip-Hop': ['MC Flow', 'Ryze', 'Lyric Soul', 'Urban Poet', 'Beat Master'],
    'Rap français': ['Le Chroniqueur', 'Rime Parfaite', 'Flow King', 'Verbe Libre', 'Métro Poésie'],
    Electronic: ['Neon Pulse', 'Electra Vibe', 'Synth Wave', 'Digital Dream', 'Circuit Beat'],
    Folk: ['River Song', 'Oak Tree', 'Morning Dove', 'Willow Grace', 'Meadow Voice'],
    'Stand-up': ['Le Rigolo', 'Comique du Soir', 'Humour en Scène', 'Rire & Moi', 'Stand Up King'],
    Drame: ['Émilie Dumont', 'Pierre Lefèvre', 'Sophie Bernard', 'Antoine Moreau', 'Claire Vincent'],
    default: ['The Artist', 'Solo Act', 'Performer', 'Stage Name', 'The Voice']
  },
  BAND: {
    Rock: ['Thunder Squad', 'Electric Wolves', 'Stone River', 'Midnight Riders', 'Rebel Noise'],
    Pop: ['Sunshine Gang', 'Crystal Hearts', 'Velvet Dreams', 'Neon Lights', 'Pop Fiction'],
    Jazz: ['Jazz Collective', 'Blue Note Quartet', 'Smooth Operators', 'Swing Society', 'Bebop Brothers'],
    'Hip-Hop': ['Urban Legends', 'Groove Squad', 'Beat Battalion', 'Flow Masters', 'Rhyme Collective'],
    'Rap français': ['Collectif Urbain', 'Flow & Cie', 'Rime Squad', 'Verbe Collectif', 'Street Poètes'],
    Metal: ['Iron Legion', 'Dark Storm', 'Steel Hearts', 'Chaos Theory', 'Metal Forge'],
    Reggae: ['Island Vibes', 'Roots Collective', 'Sunshine Reggae', 'One Love Band', 'Rasta Soul'],
    Folk: ['Wandering Souls', 'Forest Folk', 'Acoustic Travelers', 'Meadow Singers', 'Folk Roots'],
    Funk: ['Groove Machine', 'Funk Dynasty', 'Soul Kitchen', 'Rhythm Section', 'Funky Business'],
    default: ['The Band', 'Music Collective', 'Live Act', 'Stage Crew', 'The Group']
  },
  COMEDY_GROUP: {
    'Stand-up': ['Les Humoristes', 'Rire Ensemble', 'Comique Troupe', 'Laughing Crew', 'Comedy Squad'],
    Impro: ['Impro Team', 'Les Improvisateurs', 'Spontaneous Laughs', 'Quick Wit Collective', 'Impro Gang'],
    Sketch: ['Sketch Masters', 'Les Sketcheurs', 'Comedy Sketches', 'Laugh Factory', 'Sketch Squad'],
    default: ['Comedy Crew', 'Humour Group', 'Laugh Team', 'Funny People', 'Comedy Collective']
  }
};

const villes = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux',
  'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Lille',
  'Rennes', 'Reims', 'Grenoble', 'Dijon', 'Angers'
];

function getRandomName(artistType: string, genres: string[]): string {
  const typeNames = artistNames[artistType] || artistNames.SOLO;

  // Essayer de trouver un nom basé sur le premier genre
  const primaryGenre = genres[0];
  const genreNames = typeNames[primaryGenre];

  if (genreNames && genreNames.length > 0) {
    const randomIndex = Math.floor(Math.random() * genreNames.length);
    return genreNames[randomIndex];
  }

  // Fallback sur default
  const defaultNames = typeNames['default'];
  const randomIndex = Math.floor(Math.random() * defaultNames.length);
  return defaultNames[randomIndex];
}

function getRandomLocation(): string {
  return villes[Math.floor(Math.random() * villes.length)];
}

async function updateArtistNames() {
  console.log('🎨 Mise à jour des noms d\'artistes...\n');

  // Récupérer tous les artistes avec leur profile
  const artists = await prisma.artist.findMany({
    include: {
      profile: true
    }
  });

  console.log(`Trouvé ${artists.length} artistes à mettre à jour\n`);

  let updated = 0;
  const usedNames = new Set<string>();

  for (const artist of artists) {
    let artistName = getRandomName(artist.artistType, artist.genres || []);

    // Éviter les doublons en ajoutant un numéro si nécessaire
    let finalName = artistName;
    let counter = 1;
    while (usedNames.has(finalName)) {
      finalName = `${artistName} ${counter}`;
      counter++;
    }
    usedNames.add(finalName);

    // Mettre à jour le profile name
    await prisma.profile.update({
      where: { id: artist.profileId },
      data: {
        name: finalName,
        bio: artist.profile.bio || `${finalName} - Artiste ${artist.artistType === 'SOLO' ? 'solo' : 'en groupe'} de ${artist.genres?.[0] || 'musique'}. Passionné(e) par la scène et le live.`
      }
    });

    // Mettre à jour baseLocation si vide
    if (!artist.baseLocation) {
      await prisma.artist.update({
        where: { id: artist.id },
        data: { baseLocation: getRandomLocation() }
      });
    }

    updated++;
    if (updated % 10 === 0) {
      console.log(`✅ ${updated}/${artists.length} artistes mis à jour...`);
    }
  }

  console.log(`\n🎉 Terminé ! ${updated} artistes mis à jour avec des noms réalistes`);
}

updateArtistNames()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
