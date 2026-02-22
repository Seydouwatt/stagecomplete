import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing -
}

// Photos d'artistes réalistes (Unsplash)
const musicianPhotos = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=800',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800',
  'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=800',
];

const bandPhotos = [
  'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=800',
  'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800',
  'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800',
  'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800',
  'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
];

const comedyPhotos = [
  'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
];

// Cover photos (concert venues, stages)
const coverPhotos = [
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
  'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200',
  'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200',
];

function getRandomPhoto(artistType: string): string {
  if (artistType === 'SOLO') {
    return musicianPhotos[Math.floor(Math.random() * musicianPhotos.length)];
  } else if (artistType === 'COMEDY_GROUP') {
    return comedyPhotos[Math.floor(Math.random() * comedyPhotos.length)];
  } else {
    return bandPhotos[Math.floor(Math.random() * bandPhotos.length)];
  }
}

function getRandomCover(): string {
  return coverPhotos[Math.floor(Math.random() * coverPhotos.length)];
}

async function addSlugsAndPhotos() {
  console.log('🎨 Ajout des slugs et photos...\n');

  const artists = await prisma.artist.findMany({
    include: {
      profile: true,
    },
  });

  console.log(`Trouvé ${artists.length} artistes\n`);

  let updated = 0;
  const usedSlugs = new Set<string>();

  for (const artist of artists) {
    const profileName = artist.profile.name || 'artiste';
    let slug = slugify(profileName);

    // Éviter les doublons
    let finalSlug = slug;
    let counter = 1;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }
    usedSlugs.add(finalSlug);

    // Mettre à jour l'artiste
    await prisma.artist.update({
      where: { id: artist.id },
      data: {
        publicSlug: finalSlug,
        logo: artist.logo || getRandomPhoto(artist.artistType),
        coverPhoto: artist.coverPhoto || getRandomCover(),
      },
    });

    // Mettre à jour le profile avatar si vide
    if (!artist.profile.avatar) {
      await prisma.profile.update({
        where: { id: artist.profileId },
        data: {
          avatar: getRandomPhoto(artist.artistType),
        },
      });
    }

    updated++;
    if (updated % 10 === 0) {
      console.log(`✅ ${updated}/${artists.length} artistes mis à jour...`);
    }
  }

  console.log(`\n🎉 Terminé ! ${updated} artistes ont maintenant :`);
  console.log(`   - Des slugs publics (URLs propres)`);
  console.log(`   - Des photos de profil`);
  console.log(`   - Des photos de couverture`);
}

addSlugsAndPhotos()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
