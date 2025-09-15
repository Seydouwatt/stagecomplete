# language: fr

Fonctionnalité: Gestion du Profil Artiste
  En tant qu'artiste connecté
  Je veux pouvoir créer et gérer mon profil artistique complet
  Afin de présenter mon travail aux venues

  Contexte:
    Étant donné que je suis connecté en tant qu'artiste

  Scénario: Création d'un profil artiste solo complet
    Quand je vais sur la page de profil artiste
    Et que je remplis les informations générales avec:
      | nom_de_scene | Solo Artist Pro        |
      | bio          | Artiste professionnel depuis 10 ans |
      | localisation | Paris, France          |
      | site_web     | https://soloartist.com |
    Et que je passe à l'onglet "Artistique"
    Et que je sélectionne le type d'artiste "SOLO"
    Et que je sélectionne les genres musicaux:
      | Pop  |
      | Rock |
    Et que je saisis "10" comme années d'expérience
    Et que je passe à l'onglet "Membres"
    Alors je devrais voir qu'un membre par défaut est créé
    Et que je clique sur "Sauvegarder"
    Alors je devrais voir "Profil sauvegardé avec succès"

  Scénario: Création d'un profil artiste groupe avec plusieurs membres
    Quand je vais sur la page de profil artiste
    Et que je passe à l'onglet "Artistique"
    Et que je sélectionne le type d'artiste "BAND"
    Et que je passe à l'onglet "Membres"
    Et que j'ajoute un membre avec:
      | nom         | Marie Dupont      |
      | role        | Chanteuse         |
      | email       | marie@band.com    |
      | instruments | Chant             |
      | experience  | PROFESSIONAL      |
      | fondateur   | true              |
    Et que j'ajoute un membre avec:
      | nom         | Paul Martin       |
      | role        | Guitariste        |
      | email       | paul@band.com     |
      | instruments | Guitare, Basse    |
      | experience  | EXPERT            |
      | fondateur   | false             |
    Et que je clique sur "Sauvegarder"
    Alors je devrais voir "Profil sauvegardé avec succès"
    Et je devrais voir 2 membres dans la liste

  Scénario: Modification d'un membre existant
    Étant donné que j'ai un profil groupe avec 2 membres
    Quand je vais sur la page de profil artiste
    Et que je passe à l'onglet "Membres"
    Et que je clique sur "Modifier" pour le premier membre
    Et que je modifie le rôle en "Lead Singer"
    Et que j'ajoute l'instrument "Piano"
    Et que je clique sur "Sauvegarder les modifications"
    Alors je devrais voir "Membre modifié avec succès"
    Et le membre devrait afficher "Lead Singer" comme rôle

  Scénario: Suppression d'un membre
    Étant donné que j'ai un profil groupe avec 2 membres
    Quand je vais sur la page de profil artiste
    Et que je passe à l'onglet "Membres"
    Et que je clique sur "Supprimer" pour le deuxième membre
    Et que je confirme la suppression
    Alors je devrais voir "Membre supprimé avec succès"
    Et je devrais voir 1 membre dans la liste

  Scénario: Validation des données membre
    Quand je vais sur la page de profil artiste
    Et que je passe à l'onglet "Membres"
    Et que je clique sur "Ajouter un membre"
    Et que je laisse le nom vide
    Et que je saisis un email invalide "email-invalide"
    Et que je clique sur "Sauvegarder"
    Alors je devrais voir les erreurs de validation:
      | Le nom du membre est obligatoire        |
      | L'adresse email n'est pas valide        |

  Scénario: Configuration des tarifs artiste
    Quand je vais sur la page de profil artiste
    Et que je passe à l'onglet "Tarifs"
    Et que je remplis les tarifs avec:
      | tarif_minimum | 500  |
      | tarif_maximum | 2000 |
      | conditions    | Frais de déplacement en sus |
    Et que je clique sur "Sauvegarder"
    Alors je devrais voir "Tarifs sauvegardés avec succès"

  Scénario: Prévisualisation du profil public
    Étant donné que j'ai complété mon profil artiste
    Quand je vais sur la page de profil artiste
    Et que je passe à l'onglet "Public"
    Alors je devrais voir un aperçu de ma fiche publique
    Et je devrais voir toutes mes informations affichées correctement
    Et je devrais voir tous mes membres listés