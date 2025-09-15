      # language: fr

      Fonctionnalité: Authentification Artiste
      En tant qu'artiste
      Je veux pouvoir créer un compte et me connecter
      Afin d'accéder à mon espace personnalisé sur StageComplete

      Contexte:
      Étant donné que l'application est accessible
      Et que les services backend sont démarrés

      Scénario: Inscription d'un nouvel artiste
      Étant donné que je suis sur la page d'accueil
      Quand je clique sur "Créer mon compte"
      Et que je remplis le formulaire d'inscription avec:
      | nom          | Test Artist Band          |
      | email        | testband@stagecomplete.fr |
      | mot_de_passe | TestPass123!              |
      | type_compte  | ARTIST                    |
Et que je soumets le formulaire
Alors je devrais être redirigé vers le dashboard artiste
Et je devrais voir "Bienvenue Test Artist Band"

Scénario: Connexion avec des identifiants valides
Étant donné qu'un artiste existe avec l'email "existing@stagecomplete.fr" et le mot de passe "TestPass123!"
Quand je vais sur la page de connexion
Et que je saisis "existing@stagecomplete.fr" comme email
Et que je saisis "TestPass123!" comme mot de passe
Et que je clique sur "Se connecter"
Alors je devrais être redirigé vers le dashboard artiste
Et ma session devrait être sauvegardée

Scénario: Connexion avec des identifiants invalides
Quand je vais sur la page de connexion
Et que je saisis "invalid@email.com" comme email
Et que je saisis "wrongpassword" comme mot de passe
Et que je clique sur "Se connecter"
Alors je devrais voir une erreur "Identifiants invalides"
Et je devrais rester sur la page de connexion

Scénario: Persistance de session après rafraîchissement
Étant donné que je suis connecté en tant qu'artiste
Quand je rafraîchis la page
Alors je devrais toujours être connecté
Et je devrais voir mon dashboard artiste

Scénario: Déconnexion
Étant donné que je suis connecté en tant qu'artiste
Quand je clique sur mon profil dans l'en-tête
Et que je clique sur "Se déconnecter"
Alors je devrais être redirigé vers la page d'accueil
Et ma session devrait être effacée