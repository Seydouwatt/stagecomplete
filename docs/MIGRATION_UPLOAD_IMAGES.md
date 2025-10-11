# Migration: Stockage d'Images - De Base64 vers Upload Binaire

## Problème Actuel

### Architecture Legacy (Base64)
```typescript
// ❌ MAUVAISE PRATIQUE - Actuelle
{
  coverPhoto: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEA..." // 2MB → 2.66MB en base64
}
```

**Problèmes:**
- 🔴 **+33% de taille** : Base64 encode les données avec overhead
- 🔴 **10MB body limit** : Nécessaire pour accepter les images
- 🔴 **RAM serveur** : Chaque requête charge tout en mémoire
- 🔴 **PostgreSQL** : Non optimisé pour fichiers binaires
- 🔴 **Pas de CDN** : Pas de cache, pas d'optimisation automatique
- 🔴 **Scalabilité** : Impossible de scaler au-delà de quelques centaines d'utilisateurs

### État Actuel
- **Frontend**: Compression agressive (1024px, 60% qualité)
- **Backend**: Body limit 10MB, DTO MaxLength 2M caractères
- **Logs détaillés**: ValidationPipe affiche les erreurs précises

## Solution Court Terme (MVP) ✅ FAIT

```typescript
// ImageUpload.tsx ligne 72
const compressImage = async (file: File, maxWidth = 1024, quality = 0.6)
```

**Améliorations apportées:**
- Réduction maxWidth: 1920px → 1024px
- Réduction qualité: 80% → 60%
- Images compressées: ~200-400KB en base64
- Body limit réduit: 50MB → 10MB

**Suffisant pour MVP** mais non scalable.

## Solution Long Terme - 3 Options

### Option 1: Cloudinary (⭐ Recommandée pour MVP+)

**Avantages:**
- ✅ **Gratuit jusqu'à 25GB/mois** - parfait pour démarrer
- ✅ **CDN global** - performances excellentes
- ✅ **Transformations automatiques** - resize, format, qualité
- ✅ **SDK officiel** - facile à intégrer
- ✅ **Backup automatique** - sécurité
- ✅ **Analyse images** - modération contenu

**Coût:**
- **Gratuit**: 25 crédits/mois (25GB stockage + 25GB bande passante)
- **Payant**: $0.02/GB au-delà

**Implémentation:**
```bash
npm install cloudinary
```

```typescript
// Backend - upload
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadImage = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'stagecomplete/artists',
    transformation: [
      { width: 1920, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });
  return result.secure_url; // https://res.cloudinary.com/...
};
```

```typescript
// Frontend - affichage optimisé
<img
  src={`${coverPhoto}?w=400&q=auto`}
  alt="Cover"
/>
```

### Option 2: AWS S3 + CloudFront

**Avantages:**
- ✅ **Scalabilité infinie** - croissance sans limite
- ✅ **Contrôle total** - configuration fine
- ✅ **Intégration AWS** - Lambda, Rekognition, etc.

**Inconvénients:**
- ❌ **Plus complexe** - IAM, buckets, policies
- ❌ **Pas de transformations natives** - besoin Lambda
- ❌ **Coût initial** - même petit usage

**Coût:**
- **S3**: $0.023/GB/mois stockage + $0.09/GB transfert
- **CloudFront**: $0.085/GB transfert CDN

**Implémentation:**
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({ region: 'eu-west-3' });

const uploadToS3 = async (file: Express.Multer.File) => {
  const key = `artists/${Date.now()}-${file.originalname}`;
  await s3Client.send(new PutObjectCommand({
    Bucket: 'stagecomplete-media',
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  return `https://cdn.stagecomplete.com/${key}`;
};
```

### Option 3: Système de fichiers local + Nginx

**Avantages:**
- ✅ **Gratuit** - pas de coût externe
- ✅ **Simple** - juste filesystem
- ✅ **Contrôle total** - pas de vendor lock-in

**Inconvénients:**
- ❌ **Pas de CDN** - performances limitées
- ❌ **Backup manuel** - risque perte données
- ❌ **Scalabilité limitée** - un seul serveur

**À utiliser uniquement si:**
- Budget vraiment serré
- Trafic très faible (<100 utilisateurs actifs)
- Infrastructure déjà en place

## Plan de Migration Recommandé

### Phase 1: Préparation (1-2 jours)

1. **Créer compte Cloudinary**
   ```bash
   # .env
   CLOUDINARY_CLOUD_NAME=stagecomplete
   CLOUDINARY_API_KEY=xxx
   CLOUDINARY_API_SECRET=xxx
   ```

2. **Installer dépendances**
   ```bash
   cd stagecomplete-backend
   npm install cloudinary multer
   npm install -D @types/multer
   ```

3. **Créer module upload**
   ```bash
   nest g module upload
   nest g service upload
   nest g controller upload
   ```

### Phase 2: Backend (2-3 jours)

1. **Créer endpoint upload**
   ```typescript
   // upload.controller.ts
   @Post('upload/image')
   @UseInterceptors(FileInterceptor('file'))
   async uploadImage(@UploadedFile() file: Express.Multer.File) {
     const url = await this.uploadService.uploadToCloudinary(file);
     return { url };
   }
   ```

2. **Migrer DTOs**
   ```typescript
   // update-artist-profile.dto.ts
   @IsOptional()
   @IsUrl() // Plus de MaxLength!
   coverPhoto?: string;

   @IsOptional()
   @IsUrl()
   logo?: string;
   ```

3. **Migration base de données**
   ```sql
   -- Optionnel: changer type colonne
   ALTER TABLE "Artist"
   ALTER COLUMN "coverPhoto" TYPE VARCHAR(500);
   ```

### Phase 3: Frontend (2-3 jours)

1. **Migrer ImageUpload vers mode API**
   ```typescript
   // PublicationWizard.tsx
   <ImageUpload
     artistPageId={artistPageId} // Utiliser mode API
     // value={...} // Supprimer mode legacy
   />
   ```

2. **Tester upload**
   - Upload une image
   - Vérifier URL Cloudinary retournée
   - Vérifier affichage avec transformations

### Phase 4: Migration données existantes (1 jour)

**Script de migration:**
```typescript
// scripts/migrate-images-to-cloudinary.ts
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

async function migrateImages() {
  const artists = await prisma.artist.findMany({
    where: {
      OR: [
        { coverPhoto: { startsWith: 'data:image' } },
        { logo: { startsWith: 'data:image' } }
      ]
    }
  });

  console.log(`🔄 Migrating ${artists.length} artists...`);

  for (const artist of artists) {
    try {
      // Upload coverPhoto si base64
      if (artist.coverPhoto?.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(artist.coverPhoto, {
          folder: 'stagecomplete/artists',
        });
        await prisma.artist.update({
          where: { id: artist.id },
          data: { coverPhoto: result.secure_url }
        });
        console.log(`✅ Migrated coverPhoto for artist ${artist.id}`);
      }

      // Idem pour logo
      if (artist.logo?.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(artist.logo, {
          folder: 'stagecomplete/artists/logos',
        });
        await prisma.artist.update({
          where: { id: artist.id },
          data: { logo: result.secure_url }
        });
        console.log(`✅ Migrated logo for artist ${artist.id}`);
      }
    } catch (error) {
      console.error(`❌ Error migrating artist ${artist.id}:`, error);
    }
  }

  console.log('✅ Migration complete!');
}

migrateImages();
```

### Phase 5: Nettoyage (1 jour)

1. **Supprimer code legacy**
   - Retirer mode base64 de ImageUpload
   - Retirer compression frontend (Cloudinary le fait)
   - Réduire body limit à 1MB

2. **Documentation**
   - Mettre à jour README
   - Documenter endpoints upload
   - Guide utilisateur

## Estimation Totale

- **Développement**: 7-10 jours
- **Tests**: 2-3 jours
- **Migration données**: 1 jour
- **Total**: **2-3 semaines**

## Recommandation

**Pour StageComplete MVP:**

1. ✅ **Court terme (maintenant)**: Compression agressive actuelle suffit
2. 🎯 **Moyen terme (dans 1-2 mois)**: Migrer vers Cloudinary
3. 🚀 **Long terme (si croissance)**: Envisager AWS si >10k utilisateurs

**Pourquoi Cloudinary?**
- Gratuit jusqu'à 25GB (suffit pour 500-1000 artistes)
- Implémentation rapide (1-2 semaines)
- Performances CDN excellentes
- Transformations automatiques
- Pas de maintenance infrastructure

## Références

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [Multer Middleware](https://github.com/expressjs/multer)
