describe('Home Page', () => {
  it('should display the home page with hero section and CTAs', () => {
    cy.visit('/');

    // Vérifier le titre principal
    cy.contains('Artistes, créez votre').should('be.visible');
    cy.contains('fiche gratuite').should('be.visible');

    // Vérifier le badge
    cy.contains('La plateforme de découverte d\'artistes').should('be.visible');

    // Vérifier la description
    cy.contains('Rejoignez la plus grande communauté d\'artistes professionnels').should('be.visible');

    // TODO: Implémenter la barre de recherche publique
    // cy.get('[data-cy="public-search-bar"]').should('be.visible');

    // Vérifier les boutons CTA
    cy.get('a').contains('Créer mon profil d\'artiste').should('be.visible');
    cy.get('a').contains('Découvrir les artistes').should('be.visible');

    cy.scrollTo('bottom');

    // Vérifier les sections "Comment ça marche"
    cy.contains('Créez votre profil').should('be.visible');
    cy.contains('Publiez votre vitrine').should('be.visible');
    cy.contains('Soyez découvert').should('be.visible');
  });

  it('should navigate to register page when clicking Créer mon profil d\'artiste', () => {
    cy.visit('/');
    cy.get('a').contains('Créer mon profil d\'artiste').click();
    cy.url().should('include', '/register');
  });

  it('should navigate to directory page when clicking Découvrir les artistes', () => {
    cy.visit('/');
    cy.get('a').contains('Découvrir les artistes').click();
    cy.url().should('include', '/directory');
  });

  // TODO: Implémenter la section "Recherches populaires"
  it.skip('should display popular search suggestions', () => {
    cy.visit('/');

    // Vérifier les suggestions populaires
    cy.contains('Recherches populaires').should('be.visible');
    cy.contains('Jazz Paris').should('be.visible');
    cy.contains('Rock Lyon').should('be.visible');
    cy.contains('Solo Marseille').should('be.visible');
  });

  // TODO: Dépend de la section "Recherches populaires"
  it.skip('should navigate to search results when clicking popular searches', () => {
    cy.visit('/');

    // Cliquer sur une recherche populaire et vérifier la navigation
    cy.contains('Jazz Paris').click();
    cy.url().should('include', '/search?q=Jazz%20Paris');
  });

  it('should display featured artists section', () => {
    cy.visit('/');

    // Vérifier que la section artistes en vedette existe
    cy.get('[data-cy="featured-artists"]').should('be.visible');
  });

  it('should display public stats section', () => {
    cy.visit('/');

    // Vérifier que la section stats publiques existe
    cy.get('[data-cy="public-stats"]').should('be.visible');
  });

  it('should display final CTA section', () => {
    cy.visit('/');

    // Vérifier la section CTA finale
    // cy.contains('Prêt à partager votre talent ?').should('be.visible');
    cy.contains('Créer mon profil d\'artiste').should('be.visible');
    cy.contains('Voir la démo').should('be.visible');
  });
});