# language: fr

Fonctionnalité: Dashboard Artiste
  En tant qu'artiste connecté
  Je veux accéder à un dashboard complet
  Afin de gérer mon activité sur la plateforme

  Contexte:
    Étant donné que je suis connecté en tant qu'artiste

  Scénario: Affichage du dashboard artiste
    Quand je vais sur le dashboard
    Alors je devrais voir mon nom d'artiste affiché
    Et je devrais voir les sections suivantes:
      | Statistiques      |
      | Actions rapides   |
      | Profil artiste    |
      | Graphiques        |

  Scénario: Navigation vers le profil artiste
    Quand je suis sur le dashboard
    Et que je clique sur "Gérer mon profil"
    Alors je devrais être redirigé vers la page de profil artiste

  Scénario: Affichage des statistiques
    Quand je suis sur le dashboard
    Alors je devrais voir les statistiques suivantes:
      | Vues du profil    |
      | Demandes reçues   |
      | Taux de réponse   |
      | Événements        |

  Scénario: Affichage des graphiques
    Quand je suis sur le dashboard
    Alors je devrais voir les graphiques suivants:
      | Graphique en barres des vues mensuelles |
      | Graphique circulaire des genres         |
      | Graphique linéaire des performances     |

  Scénario: Responsivité mobile du dashboard
    Quand je redimensionne la fenêtre en mode mobile
    Alors le dashboard devrait s'adapter au mobile
    Et les graphiques devraient être affichés en carousel
    Et la navigation devrait être optimisée pour mobile

  Scénario: Actions rapides disponibles
    Quand je suis sur le dashboard
    Alors je devrais voir les actions rapides:
      | Modifier mon profil     |
      | Voir ma fiche publique  |
      | Gérer mes membres       |
      | Paramètres du compte    |

  Scénario: Indicateur de complétion du profil
    Étant donné que mon profil n'est pas complet
    Quand je vais sur le dashboard
    Alors je devrais voir un indicateur de complétion
    Et je devrais voir "Profil incomplet"
    Et je devrais voir un lien "Compléter mon profil"