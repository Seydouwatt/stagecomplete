# CHECKLIST JOUR PAR JOUR - VALIDATION LEAN
## StageComplete - 4 Semaines pour Product-Market Fit

**Durée totale** : 28 jours
**Budget** : 500€ (pub) + 30€ (outils)
**Temps requis** : 2-3h/jour en moyenne

---

## 📅 SEMAINE 1 : PRÉPARATION & LANCEMENT

### JOUR 1 (AUJOURD'HUI) - 2h
**Objectif** : Tester les landing pages et préparer le tracking

#### ☐ Matin (1h)

**1. Tester les landing pages localement** (30 min)
```bash
cd stagecomplete-frontend
npm install  # Si pas déjà fait
npm run dev
```
- [ ] Ouvrir `http://localhost:5173/venues/validation`
- [ ] Remplir le formulaire venues avec des données fictives
- [ ] Vérifier que le message de succès s'affiche
- [ ] Ouvrir `http://localhost:5173/artistes/validation`
- [ ] Remplir le formulaire artistes avec des données fictives
- [ ] Vérifier que le message de succès s'affiche
- [ ] Tester sur mobile (responsive) : Chrome DevTools > Toggle device toolbar

**2. Vérifier la console** (5 min)
- [ ] Ouvrir Console JavaScript (F12)
- [ ] Vérifier qu'il n'y a pas d'erreurs
- [ ] Noter si les `console.log` "[VENUE VALIDATION] Form submitted" apparaissent

**3. Screenshot pour référence** (5 min)
- [ ] Faire 4 screenshots :
  - Formulaire venues (desktop)
  - Page succès venues
  - Formulaire artistes (desktop)
  - Page succès artistes
- [ ] Les sauver dans un dossier `/docs/validation/screenshots/`

#### ☐ Après-midi (1h)

**4. Créer compte Facebook Business Manager** (30 min)
- [ ] Aller sur https://business.facebook.com
- [ ] Cliquer "Créer un compte"
- [ ] Renseigner :
  - Nom entreprise : "StageComplete"
  - Votre nom
  - Email professionnel
- [ ] Confirmer email
- [ ] Créer Page Facebook "StageComplete" (si pas déjà fait)
- [ ] Créer compte Instagram "stagecomplete_app" (si pas déjà fait)
- [ ] Lier Page Facebook + Instagram dans Business Manager

**5. Ajouter moyen de paiement** (10 min)
- [ ] Business Manager > Paramètres de facturation
- [ ] Ajouter carte bancaire
- [ ] Définir limite dépenses : 100€ (sécurité)

**6. Créer Pixel Facebook** (20 min)
- [ ] Business Manager > Gestionnaire d'événements > Pixels
- [ ] Cliquer "Ajouter" > "Créer un pixel"
- [ ] Nom : "StageComplete Validation"
- [ ] Copier le Pixel ID (ressemble à : 123456789012345)
- [ ] **IMPORTANT** : Noter ce Pixel ID dans un fichier texte

#### ✅ Fin Jour 1
**Check** : Landing pages testées ✓ / Facebook Business créé ✓ / Pixel ID noté ✓

---

### JOUR 2 - 3h
**Objectif** : Installer tracking et préparer le tableau de suivi

#### ☐ Matin (1h30)

**1. Installer Facebook Pixel sur les landing pages** (30 min)

Créer fichier `.env.local` dans `stagecomplete-frontend/` :
```bash
# .env.local
VITE_FACEBOOK_PIXEL_ID=VOTRE_PIXEL_ID_ICI
```

Puis dans le terminal :
```bash
cd stagecomplete-frontend
```

- [ ] Ouvrir `src/pages/validation/VenueLandingPage.tsx`
- [ ] Chercher la ligne `// TODO: Intégrer avec votre backend`
- [ ] Remplacer le bloc de tracking par :
```typescript
// Track avec Facebook Pixel
if (window.fbq) {
  window.fbq('track', 'Lead', {
    content_name: 'Venue Validation Form',
    content_category: 'Lead Generation',
    value: 5.00,
    currency: 'EUR'
  });
}
```

- [ ] Faire la même chose dans `ArtistLandingPage.tsx` (remplacer "Artist" dans content_name)

**2. Ajouter le script Pixel dans index.html** (15 min)

- [ ] Ouvrir `stagecomplete-frontend/index.html`
- [ ] Juste avant `</head>`, ajouter :
```html
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'REMPLACER_PAR_VOTRE_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=REMPLACER_PAR_VOTRE_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
<!-- End Facebook Pixel Code -->
```

- [ ] Remplacer `REMPLACER_PAR_VOTRE_PIXEL_ID` par votre vrai Pixel ID (2 fois)

**3. Tester le Pixel** (15 min)
```bash
npm run dev
```
- [ ] Ouvrir `http://localhost:5173/venues/validation`
- [ ] Ouvrir extension navigateur "Facebook Pixel Helper" (installer si besoin)
- [ ] Vérifier que le pixel est détecté (icône devient bleue)
- [ ] Remplir et soumettre le formulaire
- [ ] Vérifier que l'event "Lead" est envoyé (dans Pixel Helper)

**4. Commit et push** (10 min)
```bash
git add .
git commit -m "feat: add Facebook Pixel tracking to validation landing pages"
git push origin feature/validation-landing-pages
```

#### ☐ Après-midi (1h30)

**5. Créer Google Sheet de tracking** (45 min)

- [ ] Aller sur Google Sheets > Nouveau document
- [ ] Nom : "StageComplete - Validation Leads"
- [ ] Créer 3 onglets :
  - "Venues"
  - "Artistes"
  - "Dashboard"

**Onglet "Venues"** - Colonnes :
```
| Date | Nom Venue | Contact | Email | Tel | Type | Méthode Booking | Spectacles/mois | Pain Point | Budget Max | Score | Statut | Notes |
```

**Onglet "Artistes"** - Colonnes :
```
| Date | Nom Artiste | Contact | Email | Tel | Type | Discipline | Expérience | Promo Actuelle | Dates/mois | Prix Souhaité | Objectif | Score | Statut | Notes |
```

**Onglet "Dashboard"** - Ajouter :
```
MÉTRIQUES GLOBALES
==================
Total Leads : =COUNTA(Venues!A:A)+COUNTA(Artistes!A:A)-2
Venues : =COUNTA(Venues!A:A)-1
Artistes : =COUNTA(Artistes!A:A)-1

STATUTS
=======
À appeler : =COUNTIF(Venues!L:L,"À appeler")+COUNTIF(Artistes!M:M,"À appeler")
Interviewé : =COUNTIF(Venues!L:L,"Interviewé")+COUNTIF(Artistes!M:M,"Interviewé")
Beta : =COUNTIF(Venues!L:L,"Beta")+COUNTIF(Artistes!M:M,"Beta")
Client : =COUNTIF(Venues!L:L,"Client")+COUNTIF(Artistes!M:M,"Client")

BUDGET PUB
==========
Budget total : 500€
Dépensé : [À remplir manuellement]
CPL moyen : =[Dépensé]/[Total Leads]
```

- [ ] Formater joliment (couleurs, gras pour headers)
- [ ] Partager avec vous-même (accès édition)
- [ ] Épingler l'onglet dans Chrome (toujours accessible)

**6. Créer template email automatique** (30 min)

Créer document Google Doc "Templates Emails Validation" :

**Template 1 : Confirmation immédiate (Auto)**
```
Objet : ✅ [Prénom], votre demande d'accès StageComplete est confirmée

Bonjour [Prénom],

Merci pour votre intérêt ! Nous avons bien reçu votre demande.

🎯 Prochaines étapes :
1. Je vous appelle dans les 24h pour comprendre vos besoins
2. Si votre profil correspond, accès beta immédiat
3. [30 jours gratuits / 6 mois premium offerts]

Des questions ? Répondez à cet email.

À très vite,
[Votre prénom]
Fondateur, StageComplete
contact@stagecomplete.app
```

**Template 2 : Pas de réponse J+1**
```
Objet : [Prénom], j'ai essayé de vous joindre 📞

Bonjour [Prénom],

J'ai essayé de vous appeler aujourd'hui au [numéro] mais sans succès.

J'aimerais vraiment comprendre votre situation pour vous offrir le meilleur accès à la plateforme.

Quand êtes-vous disponible pour 15 minutes de discussion ?

Merci !
[Votre prénom]
```

- [ ] Sauvegarder dans Google Drive
- [ ] Ajouter le lien dans votre Google Sheet (onglet Dashboard)

**7. Préparer calendrier semaine** (15 min)

Dans votre agenda (Google Calendar, Outlook, etc.) :
- [ ] Bloquer **2h/jour de 9h à 11h** : "Appels prospects validation"
- [ ] Bloquer **30 min/jour à 18h** : "Check métriques pub + ajustements"
- [ ] Bloquer **1h vendredi 18h** : "Analyse semaine + décisions"

#### ✅ Fin Jour 2
**Check** : Pixel installé ✓ / Google Sheet créé ✓ / Templates emails prêts ✓

---

### JOUR 3 - 3h
**Objectif** : Créer les visuels publicitaires

#### ☐ Matin (2h)

**1. Créer compte Canva Pro** (10 min)
- [ ] Aller sur canva.com
- [ ] S'inscrire (essai gratuit 30 jours)
- [ ] Confirmer email

**2. Créer Visuel Venues #1 - Image statique** (45 min)

- [ ] Canva > Créer un design > Publication Instagram (1080×1080)
- [ ] Chercher template "Business Ad" ou partir de zéro
- [ ] Éléments à ajouter :

**Background** :
- [ ] Image de bar/café avec ambiance chaleureuse (Canva > Photos > "bar concert")
- [ ] Appliquer filtre overlay sombre (transparence 40%)

**Texte principal** :
- [ ] Titre (Police : Montserrat Bold, 72pt, blanc) : "Trouvez l'artiste parfait en 5 minutes"
- [ ] Sous-titre (Police : Open Sans, 36pt, blanc) : "500+ artistes vérifiés • 0% commission"

**Badge** (coin haut droit) :
- [ ] Rectangle arrondi violet (#9333EA)
- [ ] Texte : "30 jours gratuits" (blanc, 24pt)

**Logo** (bas centre) :
- [ ] Texte "StageComplete" avec emoji 🎭 (ou créer logo simple)

**CTA** (bas) :
- [ ] Rectangle blanc arrondi
- [ ] Texte violet : "Accès prioritaire →"

- [ ] Télécharger en PNG (haute qualité)
- [ ] Nom fichier : `venue_ad_static.png`

**3. Créer Visuel Venues #2 - Alternative problème** (45 min)

- [ ] Dupliquer le design précédent
- [ ] Changer le titre pour : "Encore un groupe annulé à la dernière minute ? 😤"
- [ ] Sous-titre : "Réservez des artistes fiables en 2 heures"
- [ ] Changer couleur dominante (bleu au lieu de violet)
- [ ] Télécharger : `venue_ad_problem.png`

#### ☐ Après-midi (1h)

**4. Créer Visuel Artistes #1 - FOMO** (30 min)

- [ ] Nouveau design 1080×1080
- [ ] Background : Artiste avec guitare/micro (photos Canva)
- [ ] Titre : "500 artistes ont déjà leur profil. Et vous ? 🎤"
- [ ] Sous-titre : "URL personnalisée • Portfolio • 100% GRATUIT"
- [ ] Badge : "6 mois premium offerts" (vert)
- [ ] CTA : "Créer mon profil gratuit"
- [ ] Télécharger : `artist_ad_fomo.png`

**5. Créer Visuel Artistes #2 - ROI** (30 min)

- [ ] Dupliquer design artistes
- [ ] Titre : "Marre d'envoyer ton press-kit par email ? 📧"
- [ ] Sous-titre : "1 seul lien pour tout ton portfolio"
- [ ] Liste bullet points :
  - "✓ Maj en 2 clics"
  - "✓ Analytics gratuits"
  - "✓ Partage 1-clic réseaux"
- [ ] Télécharger : `artist_ad_roi.png`

**6. Organiser les fichiers** (10 min)
```bash
# Créer dossier local
mkdir -p docs/validation/assets/ads/

# Y déplacer les 4 PNG téléchargés
```

- [ ] Vérifier que les 4 fichiers font moins de 10 MB chacun
- [ ] Les renommer si besoin (pas d'espaces, lowercase)

#### ✅ Fin Jour 3
**Check** : 4 visuels créés et sauvegardés ✓

---

### JOUR 4 - 2h
**Objectif** : Créer les campagnes Facebook Ads (mode brouillon)

#### ☐ Matin (2h)

**1. Créer Gestionnaire de publicités** (10 min)
- [ ] Business Manager > Gestionnaire de publicités
- [ ] Créer compte pub si demandé
- [ ] Pays : France
- [ ] Devise : EUR (€)
- [ ] Fuseau horaire : Paris

**2. Campagne #1 : Venues Test A** (25 min)

- [ ] Cliquer "Créer" > Campagne
- [ ] Objectif : **Conversions** (pas "Génération de prospects")
- [ ] Nom campagne : "Venues - Test A - Problème"
- [ ] Cliquer "Suivant"

**Ensemble de publicités** :
- [ ] Nom : "Venues Île-de-France 25-55"
- [ ] Pixel : Sélectionner "StageComplete Validation"
- [ ] Événement de conversion : **Lead**
- [ ] Budget quotidien : **15€**
- [ ] Dates : Du [aujourd'hui] au [J+4]

**Audience** :
- [ ] Lieux : France > Paris + Île-de-France (rayon 50 km)
- [ ] Âge : 25-55 ans
- [ ] Sexe : Tous
- [ ] Intérêts détaillés :
  - [ ] Chercher et ajouter : "Culture"
  - [ ] Chercher et ajouter : "Arts du spectacle"
  - [ ] Chercher et ajouter : "Musique live"
  - [ ] Chercher et ajouter : "Gestion d'entreprise"
- [ ] Estimation audience : Vérifier 15 000 - 50 000 personnes

**Placements** :
- [ ] Sélectionner "Placements manuels"
- [ ] Cocher uniquement :
  - [ ] Facebook - Fil d'actualité
  - [ ] Instagram - Fil d'actualité
- [ ] Décocher tout le reste (Stories, Audience Network, etc.)

- [ ] Cliquer "Suivant"

**Publicité** :
- [ ] Nom : "Venue Problem Focus"
- [ ] Page Facebook : Sélectionner "StageComplete"
- [ ] Format : Image unique
- [ ] Ajouter média : Uploader `venue_ad_problem.png`

**Texte principal** :
```
Encore un groupe qui a annulé à la dernière minute ? 😤

Trouver des artistes fiables ne devrait pas être un parcours du combattant.

Avec StageComplete :
✅ 500+ artistes vérifiés (musique, théâtre, stand-up)
✅ Réponse moyenne en moins de 2h
✅ 0% de commission sur les réservations

🎁 30 jours gratuits pour les 50 premiers inscrits

👉 Cliquez pour obtenir votre accès prioritaire
```

**Titre** : "Trouvez des artistes vérifiés en 5 min"

**Description** : "0% commission • Réponse <2h • 500+ profils"

**Bouton d'appel à l'action** : "S'inscrire"

**URL du site web** : `https://votre-domaine.netlify.app/venues/validation`

- [ ] Prévisualiser sur mobile et desktop
- [ ] **NE PAS PUBLIER** - Sauvegarder en brouillon

**3. Campagne #2 : Venues Test B** (20 min)

- [ ] Dupliquer Campagne #1
- [ ] Renommer : "Venues - Test B - Solution"
- [ ] Ensemble de publicités : identique
- [ ] Publicité : Uploader `venue_ad_static.png`

**Texte principal** :
```
Et si vous pouviez booker un artiste en 5 minutes chrono ? 🎵

StageComplete, c'est Netflix pour trouver des artistes professionnels.

Recherchez par :
→ Genre musical (Jazz, Rock, Électro...)
→ Disponibilité (ce week-end ?)
→ Budget (de 200€ à 2000€)
→ Ville (Paris, région...)

💰 Économisez 15-30% vs agences traditionnelles
⏱️ Gagnez 10h de recherche par mois

🎁 Testez gratuitement pendant 30 jours (aucune carte bancaire)

👉 Découvrir la plateforme
```

- [ ] Sauvegarder en brouillon

**4. Campagne #3 : Artistes Test A** (20 min)

- [ ] Nouvelle campagne > Conversions
- [ ] Nom : "Artistes - Test A - FOMO"
- [ ] Ensemble de publicités :
  - Nom : "Artistes France 20-45"
  - Budget : 15€/jour
  - Lieux : France entière (ou Paris + 5 grandes villes)
  - Âge : 20-45 ans
  - Intérêts :
    - [ ] "Musicien"
    - [ ] "Arts de la scène"
    - [ ] "Production musicale"
    - [ ] "Stand-up comedy"
  - Placements : Facebook + Instagram Fil uniquement

**Publicité** :
- [ ] Uploader `artist_ad_fomo.png`

**Texte** :
```
500 artistes ont déjà leur profil. Et vous ? 🎤

Créez votre vitrine professionnelle gratuite en 5 minutes :

✨ URL personnalisée (stagecomplete.app/votre-nom)
📸 Portfolio complet (photos, vidéos, tarifs)
📱 Partage 1-clic Instagram, Facebook, WhatsApp
📊 Analytics gratuits (vues, clics, demandes)
🎯 Visibilité auprès de 100+ venues

🎁 Bonus : 6 mois premium offerts (valeur 54€)

👉 Créer mon profil gratuit
```

**Titre** : "Votre vitrine pro gratuite en 5 min"

**URL** : `https://votre-domaine.netlify.app/artistes/validation`

- [ ] Sauvegarder en brouillon

**5. Campagne #4 : Artistes Test B** (20 min)

- [ ] Dupliquer Campagne #3
- [ ] Renommer : "Artistes - Test B - ROI"
- [ ] Uploader `artist_ad_roi.png`

**Texte** :
```
Marre de perdre du temps à envoyer ton press-kit par email ? 📧

Chaque venue te demande ta bio, tes photos, vidéos, tarifs...

Et si tu avais UN SEUL LIEN à partager ?

Avec StageComplete :
→ 1 URL unique pour tout ton portfolio
→ Maj en 2 clics (pas 50 emails à renvoyer)
→ Analytics : qui regarde ton profil
→ Partage direct sur tous tes réseaux

💡 Plus de 500 artistes nous font confiance

🎁 100% gratuit + 6 mois premium pour les early adopters

👉 Simplifier ma vie d'artiste
```

- [ ] Sauvegarder en brouillon

**6. Vérification finale** (15 min)

- [ ] Relire les 4 campagnes (fautes d'orthographe ?)
- [ ] Vérifier URLs (https, pas http)
- [ ] Vérifier budgets (4 × 15€/jour = 60€ pour 4 jours)
- [ ] Noter quelque part : "Lancer le [date J+5]"

#### ✅ Fin Jour 4
**Check** : 4 campagnes créées en brouillon ✓ / Prêt à lancer ✓

---

### JOUR 5 - 1h
**Objectif** : Déployer en production et lancer les campagnes

#### ☐ Matin (1h)

**1. Merger et déployer les landing pages** (20 min)

```bash
# Vérifier que tout est commit
git status

# Merger dans main
git checkout main
git merge feature/validation-landing-pages

# Push (Netlify va auto-déployer)
git push origin main
```

- [ ] Attendre 2-3 minutes (déploiement Netlify)
- [ ] Vérifier que c'est en ligne :
  - [ ] Ouvrir `https://votre-domaine.netlify.app/venues/validation`
  - [ ] Ouvrir `https://votre-domaine.netlify.app/artistes/validation`
- [ ] Tester sur mobile (depuis votre téléphone)
- [ ] Remplir 1 formulaire test pour vérifier email/console

**2. Vérifier Pixel en production** (10 min)

- [ ] Installer extension Chrome "Facebook Pixel Helper"
- [ ] Ouvrir les 2 landing pages en prod
- [ ] Vérifier que Pixel Helper détecte le pixel (icône bleue)
- [ ] Aller dans Business Manager > Gestionnaire d'événements
- [ ] Vérifier événement "PageView" reçu (peut prendre 5-10 min)

**3. Lancer les 4 campagnes** (20 min)

- [ ] Aller dans Gestionnaire de publicités
- [ ] Campagne #1 "Venues Test A" > Publier
- [ ] Campagne #2 "Venues Test B" > Publier
- [ ] Campagne #3 "Artistes Test A" > Publier
- [ ] Campagne #4 "Artistes Test B" > Publier

- [ ] Vérifier que statut passe de "Brouillon" à "En cours d'examen" (15-30 min)
- [ ] Si rejeté : lire la raison, corriger, republier

**4. Setup notifications** (10 min)

- [ ] Activer notifications email Facebook Ads :
  - Business Manager > Paramètres > Notifications
  - Cocher "Résultats de campagne"
  - Cocher "Problèmes de facturation"

- [ ] Ajouter raccourci dans favoris Chrome :
  - Gestionnaire de publicités
  - Google Sheet tracking
  - Landing page venues
  - Landing page artistes

**5. Premier check métriques** (10 min)

Dans Gestionnaire de publicités :
- [ ] Vérifier impressions (devrait commencer dans l'heure)
- [ ] Noter dans Google Sheet onglet Dashboard :
  - Date lancement : [Aujourd'hui]
  - Budget engagé : 60€
  - Status : 4 campagnes actives

#### ✅ Fin Jour 5
**Check** : Landing pages en prod ✓ / 4 campagnes lancées ✓ / Notifications ON ✓

🎉 **FÉLICITATIONS ! Les pubs tournent, premiers leads arrivent dans 2-6 heures !**

---

### JOUR 6-9 : PHASE TEST (4 jours)
**Objectif** : Collecter data, ajuster, préparer scale

#### ☐ Chaque jour (1h30)

**Routine quotidienne à 18h** :

**1. Check métriques pub** (15 min)
- [ ] Ouvrir Gestionnaire de publicités
- [ ] Pour chaque campagne, noter dans un fichier texte :
  - Impressions
  - Clics (lien)
  - CTR (taux de clic)
  - Coût par clic (CPC)
  - Leads générés
  - Coût par lead (CPL)

**2. Traiter les leads du jour** (1h)

**Pour chaque nouveau lead reçu** :

- [ ] Copier les infos du formulaire dans Google Sheet
- [ ] Calculer score (voir guide 01_SCRIPT_INTERVIEWS)
- [ ] Envoyer email confirmation (Template 1) - Remplacer [Prénom]
- [ ] Appeler sous 1h si reçu avant 18h, sinon lendemain matin
- [ ] Si pas de réponse : Laisser message vocal + envoyer SMS

**Script appel (ultra-simple)** :
```
"Bonjour [Prénom], c'est [Votre nom] de StageComplete.
Vous avez rempli notre formulaire hier pour tester la plateforme.

J'ai 3 questions rapides pour comprendre vos besoins,
vous avez 10 minutes maintenant ?"

[Si oui] → Suivre script du guide 01
[Si non] → "Ok, quand seriez-vous dispo ? Je vous rappelle."
```

- [ ] Pendant l'appel : Remplir notes dans Google Sheet
- [ ] Après l'appel : Envoyer email récap (Template dans guide 01)

**3. Analyse quotidienne** (15 min)

Dans un carnet/fichier texte, noter :
- Nombre de leads aujourd'hui : X
- Taux de réponse téléphonique : X/Y = Z%
- Insight du jour : "Pattern remarqué..." / "Objection récurrente..."
- Action demain : "Ajuster copy de..." / "Appeler plus tôt..."

#### ☐ Jour 9 - Vendredi 18h (2h)
**Analyse de fin de phase test**

**1. Agréger les métriques** (30 min)

Créer tableau récap dans Google Sheet onglet Dashboard :

```
RÉSULTATS PHASE TEST (J5-J9)
============================

CAMPAGNE          | Impressions | Clics | CTR  | CPL   | Leads
------------------|-------------|-------|------|-------|------
Venues Test A     |             |       |      |       |
Venues Test B     |             |       |      |       |
Artistes Test A   |             |       |      |       |
Artistes Test B   |             |       |      |       |
TOTAL             |             |       |      |       |

GAGNANTS (CPL le plus bas) :
- Meilleure campagne Venues : [A ou B]
- Meilleure campagne Artistes : [A ou B]
```

- [ ] Remplir avec les données du Gestionnaire de publicités

**2. Décision : Quelle(s) campagne(s) garder ?** (15 min)

**Critères** :
- CPL < 7€ = ✅ Garder
- CPL 7-10€ = ⚠️ Ajuster
- CPL > 10€ = ❌ Couper

- [ ] Désactiver les 2 campagnes avec CPL le plus élevé
- [ ] Garder les 2 gagnantes (1 venue + 1 artiste)

**3. Analyse qualitative leads** (30 min)

Dans Google Sheet, trier par score décroissant :
- [ ] Combien de leads score > 14/18 ? (Top prospects)
- [ ] Quel pain point revient le plus chez venues ?
- [ ] Quel objectif revient le plus chez artistes ?
- [ ] Y a-t-il un pattern (âge, type, localisation) ?

**4. Préparer phase scale** (30 min)

- [ ] Calculer budget restant : 500€ - [dépensé] = X€
- [ ] Diviser par 10 jours = Budget/jour pour phase scale
- [ ] Ajuster budget des 2 campagnes gagnantes dans Facebook Ads :
  - Budget quotidien : [Nouveau budget]€
  - Dates : Du [J10] au [J19]

**5. Identifier top 10 prospects pour beta** (15 min)

- [ ] Dans Google Sheet, filtrer : Score >= 14
- [ ] Trier par "Statut" = "Interviewé"
- [ ] Sélectionner les 10 meilleurs (5 venues + 10 artistes idéalement)
- [ ] Les marquer "Statut : Beta invité"
- [ ] Préparer email invitation beta (envoyer lundi J10)

#### ✅ Fin Semaine 1
**Check** :
- 60€ dépensés ✓
- 30-50 leads générés ✓
- 10-15 interviews faites ✓
- 2 campagnes gagnantes identifiées ✓
- 10 prospects beta sélectionnés ✓

---

## 📅 SEMAINE 2 : SCALE PUB + INTERVIEWS

### JOUR 10-14 (Lundi-Vendredi)
**Objectif** : Atteindre 100 leads total + 20 interviews complétées

#### ☐ Chaque matin (2h)

**Routine 9h-11h : Appels prospects**

- [ ] Ouvrir Google Sheet > Filtre "Statut = À appeler"
- [ ] Appeler 5-8 prospects (15-20 min par appel)
- [ ] Suivre script du guide 01_SCRIPT_INTERVIEWS
- [ ] Remplir grille scoring après chaque appel
- [ ] Envoyer email récap sous 1h

**Objectif semaine** : 10 nouvelles interviews (2/jour)

#### ☐ Chaque soir (30 min)

**Routine 18h : Métriques + Leads du jour**

- [ ] Check Facebook Ads Manager
- [ ] Noter métriques dans Google Sheet
- [ ] Traiter nouveaux leads (email + appel si joignable)
- [ ] Mettre à jour Dashboard (total leads, CPL moyen)

**Red flag à surveiller** :
- Si CPL > 7€ pendant 2 jours consécutifs → Ajuster audience ou créatif
- Si taux réponse téléphone < 30% → Revoir timing d'appel (tester matin vs soir)

#### ☐ Vendredi soir J14 (2h)
**Analyse de mi-parcours**

**1. Métriques globales** (30 min)

Dans Google Sheet Dashboard :
```
SEMAINE 2 - RÉSULTATS
=====================
Leads générés : [X] / 100 objectif
CPL moyen : [X]€ / 5€ target
Interviews complétées : [X] / 20 objectif
Taux réponse appels : [X]%

QUALITÉ LEADS
=============
Score moyen : [X] / 18
Leads score >14 : [X]
Venues willing to pay 49€+ : [X]%
Artistes willing to pay 9€+ : [X]%
```

- [ ] Remplir honnêtement

**2. Décision GO/NO GO** (30 min)

**Si métriques vertes (≥ 80% objectifs)** :
- [ ] ✅ Continuer semaine 3 comme prévu
- [ ] Inviter 10 meilleurs prospects en beta
- [ ] Préparer onboarding

**Si métriques oranges (50-80% objectifs)** :
- [ ] ⚠️ Identifier le goulot :
  - Pas assez de leads ? → Augmenter budget pub ou tester nouvelle audience
  - Leads de mauvaise qualité ? → Revoir formulaire ou messaging
  - Taux réponse faible ? → Changer approche (email avant appel ?)
- [ ] Ajuster et continuer 1 semaine supplémentaire

**Si métriques rouges (< 50% objectifs)** :
- [ ] 🛑 Pause et analyse profonde :
  - Relire les 10 interviews faites
  - Le problème est-il validé ?
  - Le pricing est-il adapté ?
  - Faut-il pivoter l'audience ou l'offre ?
- [ ] Décision : Itérer ou pivoter

**3. Sélection cohorte beta** (30 min)

Si GO :
- [ ] Google Sheet > Trier par Score DESC
- [ ] Sélectionner 15 personnes (5 venues + 10 artistes)
- [ ] Vérifier qu'ils ont dit "Oui" à beta lors interview
- [ ] Marquer "Statut : Beta confirmé"

**4. Préparer onboarding semaine 3** (30 min)

- [ ] Créer 15 comptes manuellement dans l'app :
  - Email temporaire : [prenom.nom]@test.stagecomplete.app
  - Mot de passe : "BetaTester2024!"
- [ ] Préparer email invitation (envoyer lundi matin)

#### ✅ Fin Semaine 2
**Check** :
- 100 leads générés ✓
- 20 interviews complétées ✓
- 15 beta testers sélectionnés ✓
- Comptes créés ✓

---

## 📅 SEMAINE 3 : BETA FERMÉE

### JOUR 15 (Lundi) - 3h
**Lancement beta cohorte 1**

#### ☐ Matin (2h)

**1. Activer mode beta dans l'app** (30 min)

```bash
cd stagecomplete-frontend
```

Créer `.env.production` :
```bash
VITE_BETA_MODE=true
VITE_ENABLE_MESSAGING=false
VITE_ENABLE_BOOKINGS=false
VITE_ENABLE_ANALYTICS=false
```

Commit et push :
```bash
git add .env.production
git commit -m "feat: enable beta mode in production"
git push origin main
```

- [ ] Attendre redéploiement Netlify (2-3 min)
- [ ] Vérifier en prod que banner "Version Beta" apparaît

**2. Envoyer invitations beta** (1h30)

Template email :
```
Objet : 🎉 [Prénom], votre accès StageComplete est actif !

Bonjour [Prénom],

Félicitations, vous faites partie des 15 premiers testeurs de StageComplete ! 🚀

🔑 VOS ACCÈS :
URL : https://stagecomplete.app/login
Email : [leur email]
Mot de passe : BetaTester2024!

(Changez-le dès la 1ère connexion dans Paramètres)

🎯 CE QUE JE VOUS DEMANDE :
1. Connectez-vous dans les 24h
2. [VENUES] Faites au moins 1 recherche d'artiste
   [ARTISTES] Complétez votre profil avec 1 photo + bio
3. Utilisez le bouton "💬 Feedback" en bas à droite pour tout commentaire

⏰ CALL DE DÉMO :
Je vous appelle demain pour un mini-tutoriel de 10 min. Répondez à cet email avec votre dispo (matin ou après-midi).

Merci de votre confiance !

[Votre prénom]
Fondateur, StageComplete
[Votre tel]
```

- [ ] Envoyer 1 par 1 (personnaliser [Prénom] et [VENUES]/[ARTISTES])
- [ ] Cocher dans Google Sheet "Email envoyé J15"

#### ☐ Après-midi (1h)

**3. Calls de confirmation** (45 min)

- [ ] Appeler les 5 venues (5 min chacune) :
  - "Bonjour [Prénom], vous avez reçu l'email avec les accès ?"
  - "Je vous appelle demain 10 min pour vous montrer comment chercher des artistes, ça marche ?"
  - Noter créneau dans agenda

- [ ] Appeler les 10 artistes (3 min chacun) :
  - "Salut [Prénom], l'email avec tes accès est arrivé ?"
  - "Si tu bloques pour compléter ton profil, dis-moi, je t'aide !"

**4. Monitorer premières connexions** (15 min)

- [ ] Backend logs ou Google Analytics
- [ ] Combien se sont connectés dans les 2h ?
- [ ] Si < 30% : Relancer par SMS

#### ✅ Fin Jour 15
**Check** : 15 invitations envoyées ✓ / Calls confirmation ✓

---

### JOUR 16-17 (Mardi-Mercredi)
**Onboarding calls 1-to-1**

#### ☐ Chaque jour (3h)

**Routine 9h-12h : Calls onboarding**

**Pour les venues** (15 min par call) :

Script :
```
1. Partage d'écran (Zoom ou Google Meet)
2. "Je vais vous montrer comment trouver un artiste en 2 min"
3. Démo live :
   - Page recherche
   - Filtrer par genre (ex: Jazz)
   - Cliquer sur profil artiste
   - Montrer bouton "Contacter"
4. "À votre tour, faites une recherche"
5. Observer (ne pas interrompre)
6. "Des questions ? Qu'est-ce qui manque ?"
7. "Cette semaine, essayez de contacter 1 artiste, OK ?"
```

- [ ] Après chaque call : Noter feedback dans Google Sheet (colonne Notes)

**Pour les artistes** (10 min par call) :

Script :
```
1. "Je vois que votre profil est complété à X%"
2. Si < 80% : "Je vous aide à finir ?"
   - Guider upload photo : "Paramètres > Mon profil > Photo"
   - Guider bio : "150 mots max, dites qui vous êtes et votre style"
3. "Votre lien public : stagecomplete.app/artist/[slug]"
4. "Partagez-le sur Instagram, on verra les stats ensemble dans 1 semaine"
5. "Des questions ?"
```

#### ☐ Soir (30 min)

**Check activité du jour**

Dans l'app (ou logs backend) :
- [ ] Qui s'est connecté aujourd'hui ?
- [ ] Combien de recherches effectuées (venues) ?
- [ ] Combien de profils complétés (artistes) ?

Dans Google Sheet, mettre à jour colonnes :
- "Dernier login : [Date]"
- "Actions : [Recherche / Profil complété / Contact artiste]"

---

### JOUR 18-21 (Jeudi-Dimanche)
**Suivi et relances**

#### ☐ Jeudi J18 (1h)

**Email J+3 à tous les beta testers** :

```
Objet : [Prénom], comment se passe votre expérience StageComplete ?

Bonjour [Prénom],

Ça fait 3 jours que vous testez la plateforme !

💬 J'aimerais avoir votre retour rapide (2 min) :
1. Qu'est-ce qui vous a plu ?
2. Qu'est-ce qui vous a bloqué ou manqué ?
3. Sur une échelle de 0 à 10, recommanderiez-vous StageComplete à un ami ?

Répondez directement à cet email, ça m'aide énormément !

Merci,
[Votre prénom]

PS : Si vous n'avez pas encore testé, dites-le-moi, je comprends !
```

- [ ] Envoyer à tous (personnaliser [Prénom])
- [ ] Créer dossier Gmail "Feedback Beta" pour trier les réponses

#### ☐ Vendredi J19 (2h)

**Relances téléphoniques des inactifs**

- [ ] Google Sheet > Filtrer "Dernier login < J18" (pas connecté depuis 2 jours)
- [ ] Appeler chacun (5 min) :
  - "Salut [Prénom], je vois que tu t'es pas reconnecté, tout va bien ?"
  - "Tu as rencontré un bug ou un blocage ?"
  - "Tu veux qu'on refasse un call ensemble ?"

**Typologie réponses attendues** :
- "Pas eu le temps" → OK, rappeler dans 3 jours
- "Je ne vois pas l'intérêt" → **Red flag**, creuser pourquoi
- "C'est compliqué" → Bug UX, noter et fixer
- "Il manque X feature" → Noter dans backlog

#### ☐ Dimanche J21 soir (1h)

**Analyse mi-beta**

Google Sheet, calculer :
```
ENGAGEMENT BETA (J15-J21)
=========================
Activation (connecté au moins 1 fois) : X / 15 = X%
Utilisateurs actifs J7 : X / 15 = X%

ACTIONS VENUES :
Recherches effectuées : X
Artistes contactés : X
Taux conversion recherche → contact : X%

ACTIONS ARTISTES :
Profils complétés (>80%) : X / 10 = X%
Liens partagés sur réseaux : X
Profils vus (analytics) : X vues total

FEEDBACK :
NPS moyen (0-10) : [Moyenne des réponses]
Pain points récurrents : [Lister top 3]
Feature requests top 3 : [Lister]
```

- [ ] Si engagement < 50% : **Houston we have a problem**
  - Organiser call d'urgence avec les 3 beta testers les plus engagés
  - Comprendre ce qui ne marche pas
  - Itérer rapidement

- [ ] Si engagement > 60% : ✅ On est sur la bonne voie
  - Continuer le suivi
  - Préparer offre de conversion pour S4

#### ✅ Fin Semaine 3
**Check** :
- 15 beta testers onboardés ✓
- 80%+ ont testé la plateforme ✓
- 50%+ actifs à J7 ✓
- Feedback collecté ✓

---

## 📅 SEMAINE 4 : CONVERSION PAYANTE

### JOUR 22-23 (Lundi-Mardi)
**Préparer l'offre de conversion**

#### ☐ Jour 22 (2h)

**Si Stripe pas encore intégré** :

```bash
# Backend
cd stagecomplete-backend
npm install stripe
```

- [ ] Créer compte Stripe sur stripe.com
- [ ] Récupérer clés API (Dashboard > Développeurs > Clés API)
- [ ] Ajouter dans `.env` backend :
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

- [ ] Créer 2 produits dans Stripe Dashboard :
  - "Venue Basic" : 49€/mois (recurring)
  - "Artist Premium" : 9€/mois (recurring)

- [ ] Intégrer checkout basique (voir doc Stripe ou demander à Claude Code)

**Si Stripe déjà intégré** :
- [ ] Tester le tunnel de paiement en mode test
- [ ] Vérifier que webhooks fonctionnent

**Créer page pricing** :
- [ ] `/pricing` avec 2 plans
- [ ] Boutons "Passer à Premium" qui redirigent vers Stripe Checkout

#### ☐ Jour 23 (1h)

**Préparer offre early adopter**

Créer document "Offre Founders" :

```
🎁 OFFRE EXCLUSIVE BETA TESTERS
================================

En remerciement d'avoir testé StageComplete, vous bénéficiez de :

VENUES :
✅ 49€/mois au lieu de 99€ (50% off à vie)
✅ Accès prioritaire à toutes les nouvelles features
✅ Badge "Founding Member" sur votre profil
✅ Support prioritaire (réponse <4h)
✅ Sans engagement (annulation à tout moment)

ARTISTES :
✅ 9€/mois au lieu de 19€ (50% off à vie)
✅ Toutes les features premium débloquées
✅ Badge "Founding Member" sur votre profil
✅ Mise en avant dans les recherches
✅ Sans engagement

⏰ Offre valable jusqu'au [date J+30 après lancement]

Questions ? Répondez à cet email !
```

- [ ] Sauvegarder ce template

---

### JOUR 24-26 (Mercredi-Vendredi)
**Conversion calls**

#### ☐ Chaque jour (3h)

**Routine 9h-12h : Calls de conversion**

**Priorisation** :
1. Top 5 beta testers les plus engagés (actifs chaque jour)
2. Ceux qui ont exprimé satisfaction (NPS >8)
3. Venues qui ont contacté un artiste
4. Artistes dont le profil a eu >20 vues

**Script call de conversion** (15 min) :

```
"Salut [Prénom], merci d'avoir testé StageComplete ces 2 semaines !

[1. Feedback]
Avant de parler business, j'aimerais ton retour honnête :
- Qu'est-ce qui t'a plu ?
- Qu'est-ce qui t'a manqué ?
- Sur 10, tu recommanderais à un autre [venue/artiste] ?

[Écouter, prendre notes]

[2. Usage]
Tu as [fait X recherches / eu Y vues sur ton profil].
Est-ce que tu as trouvé de la valeur dans la plateforme ?

[Si oui]

[3. Transition vers offre]
Parfait ! Donc on lance officiellement la semaine prochaine.

Les early adopters comme toi ont un tarif spécial :
- [49€ au lieu de 99€ / 9€ au lieu de 19€]
- 50% off À VIE (pas juste 3 mois)
- Badge "Founding Member"
- Support prioritaire
- Sans engagement, tu peux annuler quand tu veux

[4. Ask]
Ça te tente de continuer avec nous ?

[Si hésitation]
"Qu'est-ce qui te fait hésiter ?"
[Écouter objection]
[Répondre à l'objection]

[Si oui]
"Super ! Je t'envoie le lien de paiement par email dans 10 min.
Une fois payé, ton compte passe en Premium automatiquement."

[Si non]
"Pas de souci, je comprends. On reste en contact,
tu peux continuer à utiliser la version gratuite !"
```

**Après chaque call** :
- [ ] Envoyer lien Stripe Checkout si accepté
- [ ] Mettre à jour Google Sheet colonne "Convertirait en payant ?"
- [ ] Noter objection si refus (pour itérer pricing/offre)

#### ☐ Vendredi soir J26 (2h)

**Analyse conversions**

Google Sheet Dashboard :
```
CONVERSIONS SEMAINE 4
=====================
Calls passés : X
Acceptations verbales : X
Paiements reçus : X

TAUX DE CONVERSION :
Trial → Payant : X / 15 = X%

MRR (Monthly Recurring Revenue) :
Venues : X × 49€ = X€
Artistes : X × 9€ = X€
TOTAL MRR : X€

OBJECTIONS RÉCURRENTES :
1. [Ex: "Trop cher"]
2. [Ex: "Pas assez d'artistes"]
3. [Ex: "Manque feature X"]
```

---

### JOUR 27-28 (Samedi-Dimanche)
**Récap final + décision**

#### ☐ Samedi J27 (3h)

**Rapport complet 4 semaines**

Créer document Google Doc "StageComplete - Rapport Validation 4 Semaines" :

```markdown
# RAPPORT VALIDATION LEAN - STAGECOMPLETE
## 28 jours pour Product-Market Fit

Date : [Aujourd'hui]
Auteur : [Votre nom]

---

## RÉSUMÉ EXÉCUTIF

### Investissement
- Budget pub : [X]€ / 500€ prévu
- Temps : [X]h
- Outils : [X]€

### Résultats
- Leads générés : [X] / 100 objectif
- Interviews complétées : [X] / 20 objectif
- Beta testers : [X] / 15 objectif
- Clients payants : [X] / 3 objectif
- MRR : [X]€

### Conclusion
[SUCCÈS / MITIGÉ / ÉCHEC]

---

## MÉTRIQUES DÉTAILLÉES

### Acquisition (S1-S2)

| Métrique | Target | Réel | % Objectif |
|----------|--------|------|------------|
| Leads    | 100    |      |            |
| CPL      | <5€    |      |            |
| Taux conversion landing | >3% | |         |
| Interviews | 20   |      |            |

### Validation (S2)

| Métrique | Target | Réel |
|----------|--------|------|
| % valident problème | >80% | |
| % willing to pay | >60% | |
| Score moyen prospects | >12/18 | |

### Activation (S3)

| Métrique | Target | Réel |
|----------|--------|------|
| Taux activation | >80% | |
| Rétention J7 | >50% | |
| NPS moyen | >40 | |

### Conversion (S4)

| Métrique | Target | Réel |
|----------|--------|------|
| Trial → Payant | >20% | |
| Clients payants | 3+ | |
| MRR | 100€+ | |

---

## INSIGHTS CLÉS

### Ce qui a marché ✅
1. [Ex: "Messaging 'problème' convertit 2x mieux"]
2. [Ex: "Artistes 20-30 ans très réactifs"]
3. [...]

### Ce qui n'a pas marché ❌
1. [Ex: "Taux réponse téléphone très faible (20%)"]
2. [Ex: "Feature X jamais utilisée"]
3. [...]

### Surprises 🤯
1. [Ex: "Venues préfèrent contacter par email, pas chat"]
2. [...]

---

## VERBATIMS CLIENTS (citations)

### Positifs
- "[Citation venue]"
- "[Citation artiste]"

### Négatifs / Objections
- "[Citation]"

---

## RECOMMANDATIONS

### Si SUCCÈS (3+ clients, validation forte)

✅ **NEXT STEPS** :
1. Continuer acquisition : Budget pub 1000€/mois
2. Itérer sur top 3 features demandées :
   - [Feature 1]
   - [Feature 2]
   - [Feature 3]
3. Recruter cohorte 2 beta (50 users)
4. Préparer lancement public dans 8 semaines

### Si MITIGÉ (1-2 clients, validation partielle)

⚠️ **NEXT STEPS** :
1. Ajuster pricing : Tester [nouveau prix]
2. Pivoter messaging vers [nouveau positionnement]
3. Prolonger beta 4 semaines
4. Tester nouvelle audience : [laquelle ?]

### Si ÉCHEC (0 client, validation faible)

🛑 **NEXT STEPS** :
1. Pause acquisition
2. Interviews approfondies 10 prospects
3. Décision pivot :
   - Option A : [Ex: "Focus uniquement artistes, pas venues"]
   - Option B : [Ex: "Commission sur booking au lieu d'abonnement"]
   - Option C : [Ex: "Changer de marché (US/UK)"]
4. Itérer ou couper selon learnings

---

## ANNEXES

- Lien Google Sheet leads : [URL]
- Enregistrements interviews : [Dossier]
- Screenshots feedbacks : [Dossier]
```

- [ ] Remplir honnêtement ce rapport
- [ ] Imprimer ou sauver en PDF

#### ☐ Dimanche J28 (2h)

**Décision finale**

**Seul ou avec co-founder** :
- [ ] Relire le rapport J27
- [ ] Lister pros/cons de continuer
- [ ] Décider :
  - [ ] ✅ GO : Scaler (budget 2000€/mois, recruter, foncer)
  - [ ] ⚠️ ITÉRER : Ajuster et 4 semaines de plus
  - [ ] 🛑 PIVOTER : Changer fondamentalement quelque chose

**Si GO** :
- [ ] Planifier S5-S8 (lancement public)
- [ ] Budget pub : Passer à 2000€/mois
- [ ] Recrutement : Chercher co-founder/stagiaire ?

**Si ITÉRER** :
- [ ] Écrire plan d'itération (qu'est-ce qui change ?)
- [ ] Budget : Rallonger 500€
- [ ] Timeline : +4 semaines

**Si PIVOTER** :
- [ ] Définir le pivot (audience, produit, pricing, business model ?)
- [ ] Réécrire plan validation pour le pivot
- [ ] Timeline : Redémarrer à J1 avec nouveau positionnement

**Célébrer** 🎉 :
- [ ] Peu importe le résultat, vous avez APPRIS en 4 semaines ce que 90% des fondateurs apprennent en 6-12 mois
- [ ] Vous avez 535€ de dépensés, pas 50k€
- [ ] Vous avez de la data réelle, pas des hypothèses
- [ ] Prendre 1 jour de repos avant de repartir !

#### ✅ FIN DES 4 SEMAINES
**Check final** :
- Rapport complet rédigé ✓
- Décision prise ✓
- Plan S5+ défini ✓

---

## 📞 NUMÉROS UTILES

### Contacts
- Support Facebook Ads : https://www.facebook.com/business/help
- Community Lean Startup : Reddit r/startups
- Votre mentor/advisors : [Lister noms + tels]

### Ressources
- Guide original : `/docs/validation/00_PLAN_VALIDATION_LEAN.md`
- Script interviews : `/docs/validation/01_SCRIPT_INTERVIEWS_PROSPECTS.md`
- Guide pub : `/docs/validation/02_GUIDE_CAMPAGNE_PUBLICITAIRE.md`
- Google Sheet tracking : [URL]

---

## ✅ CHECKLIST ULTIME

**Préparation (J1-J4)** :
- [ ] Landing pages testées
- [ ] Facebook Business Manager créé
- [ ] Pixel installé et testé
- [ ] Google Sheet configuré
- [ ] 4 visuels créés
- [ ] 4 campagnes en brouillon
- [ ] Templates emails prêts

**Lancement (J5)** :
- [ ] Landing pages déployées en prod
- [ ] 4 campagnes lancées
- [ ] Notifications activées

**Phase Test (J6-J9)** :
- [ ] Check quotidien 18h
- [ ] Appels prospects sous 1h
- [ ] 30-50 leads générés
- [ ] 2 campagnes gagnantes identifiées

**Scale (J10-J14)** :
- [ ] Budget augmenté sur gagnantes
- [ ] 100 leads atteints
- [ ] 20 interviews complétées
- [ ] 15 beta testers sélectionnés

**Beta (J15-J21)** :
- [ ] 15 invitations envoyées
- [ ] Onboarding calls faits
- [ ] Feedback collecté
- [ ] 80%+ activés

**Conversion (J22-J26)** :
- [ ] Stripe intégré (si besoin)
- [ ] Offre early adopter créée
- [ ] Conversion calls passés
- [ ] 3+ clients payants

**Décision (J27-J28)** :
- [ ] Rapport final rédigé
- [ ] Décision GO/ITÉRER/PIVOTER prise
- [ ] Plan S5+ défini

---

**Version** : 1.0
**Dernière mise à jour** : 28 octobre 2025
**Auteur** : Claude Code pour StageComplete

🚀 **LET'S GO ! JOUR 1 COMMENCE MAINTENANT !**
