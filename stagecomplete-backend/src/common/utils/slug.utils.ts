import { PrismaService } from '../../prisma/prisma.service';

/**
 * Génère un slug URL-friendly à partir d'un nom
 * @param name Le nom à convertir en slug
 * @returns Le slug généré
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Remplace les tirets multiples par un seul
    .replace(/^-|-$/g, ''); // Supprime les tirets en début et fin
}

/**
 * Génère un slug unique en ajoutant un suffixe numérique si nécessaire
 * @param prisma Instance de PrismaService pour vérifier l'unicité
 * @param name Le nom à convertir en slug
 * @returns Le slug unique généré
 */
export async function generateUniqueSlug(
  prisma: PrismaService,
  name: string,
): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  // Vérifier l'unicité du slug dans la table Artist
  while (true) {
    const existingArtist = await prisma.artist.findFirst({
      where: { publicSlug: slug },
    });

    if (!existingArtist) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}