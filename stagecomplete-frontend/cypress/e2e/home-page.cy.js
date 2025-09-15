describe('Home Page', () => {
  it('should display the home page with title and CTAs', () => {
    cy.visit('/home');

    // Vérifier le titre
    cy.contains('StageComplete').should('be.visible');

    // Vérifier la description (partie du texte)
    // cy.contains('plateforme qui connecte').should('be.visible');

    // Vérifier les boutons CTA
    cy.get('a').contains('Se connecter').should('be.visible');
    cy.get('a').contains('Créer mon compte').should('be.visible');

    // Vérifier les sections de fonctionnalités
    cy.contains('Profil Artistique').should('be.visible');
    cy.contains('Gestion d\'Équipe').should('be.visible');
    cy.contains('Statistiques').should('be.visible');
  });

  it('should navigate to login page when clicking Se connecter', () => {
    cy.visit('/');
    cy.contains('Se connecter').click();
    cy.url().should('include', '/login');
  });

  it('should navigate to register page when clicking Créer mon compte', () => {
    cy.visit('/home');
    cy.get('a').contains('Créer mon compte').click();
    cy.url().should('include', '/register');
  });

  it('should be accessible from /home route', () => {
    cy.visit('/home');
    cy.contains('StageComplete').should('be.visible');
  });
});