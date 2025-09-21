import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Public Artist Profiles Step Definitions

Given('there is a published artist with slug {string}', (slug) => {
  cy.intercept('GET', `**/api/public/artist/${slug}`, {
    fixture: 'public-artist-profile.json'
  }).as('getPublicProfile');
});

When('I visit {string}', (url) => {
  cy.visit(url);
});

Then('I should see the artist\'s public profile', () => {
  cy.wait('@getPublicProfile');
  cy.get('[data-cy="public-artist-profile"]').should('be.visible');
  cy.get('[data-cy="artist-name"]').should('be.visible');
});

Then('the page should load within {int} seconds', (seconds) => {
  cy.window().then((win) => {
    cy.wrap(win.performance.timing.loadEventEnd - win.performance.timing.navigationStart)
      .should('be.lessThan', seconds * 1000);
  });
});

Then('I should not see private information like exact prices', () => {
  cy.get('[data-cy="exact-price"]').should('not.exist');
  cy.get('[data-cy="contact-email"]').should('not.exist');
  cy.get('[data-cy="phone-number"]').should('not.exist');
});

Given('I visit a public artist profile', () => {
  cy.visit('/artist/jazz-virtuoso-paris');
  cy.wait('@getPublicProfile');
});

Then('the page should have proper meta tags', () => {
  cy.get('head title').should('exist').and('not.be.empty');
  cy.get('head meta[name="description"]').should('exist');
  cy.get('head meta[name="keywords"]').should('exist');
});

Then('the page should have Open Graph tags for social sharing', () => {
  cy.get('head meta[property="og:title"]').should('exist');
  cy.get('head meta[property="og:description"]').should('exist');
  cy.get('head meta[property="og:image"]').should('exist');
  cy.get('head meta[property="og:url"]').should('exist');
  cy.get('head meta[property="og:type"]').should('have.attr', 'content', 'profile');
});

Then('the page should have Schema.org markup for musicians', () => {
  cy.get('script[type="application/ld+json"]').should('exist');
  cy.get('script[type="application/ld+json"]').then(($script) => {
    const jsonLd = JSON.parse($script.text());
    expect(jsonLd['@type']).to.be.oneOf(['Person', 'MusicGroup']);
    expect(jsonLd).to.have.property('name');
    expect(jsonLd).to.have.property('description');
  });
});

Then('the page title should include the artist name', () => {
  cy.title().should('contain', 'Jazz Virtuoso');
});

Then('the page should be crawlable by search engines', () => {
  cy.get('head meta[name="robots"]').should('not.have.attr', 'content', 'noindex');
  cy.get('head link[rel="canonical"]').should('exist');
});

Given('I am viewing a public artist profile', () => {
  cy.visit('/artist/jazz-virtuoso-paris');
  cy.wait('@getPublicProfile');
  cy.get('[data-cy="public-artist-profile"]').should('be.visible');
});

Then('I should see all public information:', (dataTable) => {
  const sections = dataTable.hashes();

  sections.forEach((row) => {
    const section = row.Section;
    const content = row.Content;

    switch(section) {
      case 'Header':
        cy.get('[data-cy="profile-header"]').should('be.visible');
        cy.get('[data-cy="artist-name"]').should('be.visible');
        cy.get('[data-cy="artist-location"]').should('be.visible');
        cy.get('[data-cy="artist-genres"]').should('be.visible');
        break;
      case 'Overview':
        cy.get('[data-cy="artist-bio"]').should('be.visible');
        cy.get('[data-cy="artist-experience"]').should('be.visible');
        cy.get('[data-cy="artist-type"]').should('be.visible');
        break;
      case 'Portfolio':
        cy.get('[data-cy="portfolio-section"]').should('be.visible');
        cy.get('[data-cy="portfolio-photos"]').should('exist');
        break;
      case 'Contact':
        cy.get('[data-cy="contact-section"]').should('be.visible');
        cy.get('[data-cy="social-links"]').should('be.visible');
        break;
      case 'Members':
        cy.get('[data-cy="members-section"]').should('be.visible');
        break;
    }
  });
});

Then('I should not see private information:', (dataTable) => {
  const privateFields = dataTable.hashes();

  privateFields.forEach((row) => {
    const field = row['Private Field'];

    switch(field) {
      case 'Exact pricing':
        cy.get('[data-cy="exact-pricing"]').should('not.exist');
        break;
      case 'Contact email':
        cy.get('[data-cy="contact-email"]').should('not.exist');
        break;
      case 'Phone number':
        cy.get('[data-cy="phone-number"]').should('not.exist');
        break;
      case 'Internal notes':
        cy.get('[data-cy="internal-notes"]').should('not.exist');
        break;
    }
  });
});

When('I click on social sharing buttons', () => {
  cy.get('[data-cy="social-sharing"]').should('be.visible');
});

Then('I should be able to share on:', (dataTable) => {
  const platforms = dataTable.hashes();

  platforms.forEach((row) => {
    const platform = row.Platform;

    switch(platform) {
      case 'Facebook':
        cy.get('[data-cy="share-facebook"]').should('be.visible').and('have.attr', 'href');
        break;
      case 'Twitter':
        cy.get('[data-cy="share-twitter"]').should('be.visible').and('have.attr', 'href');
        break;
      case 'LinkedIn':
        cy.get('[data-cy="share-linkedin"]').should('be.visible').and('have.attr', 'href');
        break;
      case 'WhatsApp':
        cy.get('[data-cy="share-whatsapp"]').should('be.visible').and('have.attr', 'href');
        break;
    }
  });
});

Then('the shared content should include artist name and profile URL', () => {
  cy.get('[data-cy="share-facebook"]').should('have.attr', 'href').and('contain', 'Jazz%20Virtuoso');
  cy.get('[data-cy="share-twitter"]').should('have.attr', 'href').and('contain', window.location.href);
});

Then('the shared preview should show artist photo and description', () => {
  // This would be verified by checking Open Graph tags
  cy.get('head meta[property="og:image"]').should('have.attr', 'content').and('match', /\.(jpg|jpeg|png)$/);
  cy.get('head meta[property="og:description"]').should('have.attr', 'content').and('have.length.greaterThan', 50);
});

Given('I am viewing an artist profile with media', () => {
  cy.intercept('GET', '**/api/public/artist/jazz-virtuoso-paris', {
    fixture: 'artist-with-media.json'
  }).as('getArtistWithMedia');

  cy.visit('/artist/jazz-virtuoso-paris');
  cy.wait('@getArtistWithMedia');
});

When('I click on portfolio photos', () => {
  cy.get('[data-cy="portfolio-photo"]').first().click();
});

Then('photos should open in a lightbox gallery', () => {
  cy.get('[data-cy="lightbox"]').should('be.visible');
  cy.get('[data-cy="lightbox-image"]').should('be.visible');
});

Then('I should be able to navigate between photos', () => {
  cy.get('[data-cy="lightbox-next"]').should('be.visible');
  cy.get('[data-cy="lightbox-prev"]').should('be.visible');
  cy.get('[data-cy="lightbox-next"]').click();
  cy.get('[data-cy="lightbox-image"]').should('be.visible');
});

Then('photos should be optimized for fast loading', () => {
  cy.get('[data-cy="portfolio-photo"] img').should('have.attr', 'loading', 'lazy');
  cy.get('[data-cy="portfolio-photo"] img').should('have.attr', 'srcset');
});

When('I see YouTube or SoundCloud links', () => {
  cy.get('[data-cy="youtube-links"], [data-cy="soundcloud-links"]').should('be.visible');
});

Then('they should be properly embedded or linked', () => {
  cy.get('[data-cy="youtube-embed"], [data-cy="youtube-link"]').should('exist');
  cy.get('[data-cy="soundcloud-embed"], [data-cy="soundcloud-link"]').should('exist');
});

Then('media should be responsive on all devices', () => {
  cy.viewport('iphone-x');
  cy.get('[data-cy="portfolio-photo"]').should('be.visible');
  cy.get('[data-cy="portfolio-photo"] img').should('have.css', 'max-width', '100%');
});

Given('I am not logged in', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

Then('I should see social media links to contact the artist', () => {
  cy.get('[data-cy="social-links"]').should('be.visible');
  cy.get('[data-cy="instagram-link"]').should('be.visible');
  cy.get('[data-cy="facebook-link"]').should('be.visible');
});

Then('I should see a {string} call-to-action', (ctaText) => {
  cy.get('[data-cy="contact-cta"]').should('contain', ctaText);
});

When('I click contact options', () => {
  cy.get('[data-cy="contact-cta"]').click();
});

Then('I should be directed to external platforms or registration', () => {
  // This would either open external links or show registration modal
  cy.url().should('satisfy', (url) => {
    return url.includes('instagram.com') ||
           url.includes('facebook.com') ||
           url.includes('/register') ||
           url.includes('/login');
  });
});

Given('I am on a mobile device', () => {
  cy.viewport('iphone-x');
});

When('I view a public artist profile', () => {
  cy.visit('/artist/jazz-virtuoso-paris');
  cy.wait('@getPublicProfile');
});

Then('the profile should be fully responsive', () => {
  cy.get('[data-cy="public-artist-profile"]').should('be.visible');
  cy.get('[data-cy="profile-header"]').should('have.css', 'display').and('not.eq', 'none');
});

Then('touch interactions should work smoothly', () => {
  cy.get('[data-cy="portfolio-photo"]').first().click();
  cy.get('[data-cy="lightbox"]').should('be.visible');
  cy.get('[data-cy="lightbox-close"]').click();
  cy.get('[data-cy="lightbox"]').should('not.exist');
});

Then('media should be optimized for mobile viewing', () => {
  cy.get('img').should('have.attr', 'loading', 'lazy');
  cy.get('img').each(($img) => {
    cy.wrap($img).should('have.css', 'max-width', '100%');
  });
});

Then('loading should be fast on 3G connections', () => {
  // This would be tested with network throttling
  cy.get('[data-cy="public-artist-profile"]').should('be.visible');
});

Given('I visit {string}', (url) => {
  cy.visit(url, { failOnStatusCode: false });
});

Then('I should see a 404 error page', () => {
  cy.get('[data-cy="404-page"]').should('be.visible');
  cy.contains('404').should('be.visible');
});

Then('the page should suggest browsing other artists', () => {
  cy.get('[data-cy="browse-artists-link"]').should('be.visible');
  cy.contains('Découvrir d\'autres artistes').should('be.visible');
});

Then('I should have navigation options to return to the site', () => {
  cy.get('[data-cy="home-link"]').should('be.visible');
  cy.get('[data-cy="directory-link"]').should('be.visible');
});

Then('the 404 page should maintain the site\'s design', () => {
  cy.get('[data-cy="site-header"]').should('be.visible');
  cy.get('[data-cy="site-footer"]').should('be.visible');
});

Given('there is an artist with a private profile', () => {
  cy.intercept('GET', '**/api/public/artist/private-artist', {
    statusCode: 404,
    body: { message: 'Profile not found or private' }
  }).as('getPrivateProfile');
});

When('I try to visit their public URL', () => {
  cy.visit('/artist/private-artist', { failOnStatusCode: false });
});

Then('I should see a {string} message', (message) => {
  cy.wait('@getPrivateProfile');
  cy.contains(message).should('be.visible');
});

Then('the artist should not appear in public searches', () => {
  cy.visit('/search?q=private');
  cy.get('[data-cy="artist-card"]').should('not.contain', 'Private Artist');
});

Given('I am the owner of a public profile', () => {
  cy.login('artist@test.com', 'password123');
  cy.visit('/dashboard');
});

Given('visitors have viewed my profile', () => {
  // Assume analytics data exists
  cy.intercept('GET', '**/api/auth/artist/analytics', {
    fixture: 'profile-analytics.json'
  }).as('getAnalytics');
});

When('I check my analytics', () => {
  cy.get('[data-cy="view-analytics"]').click();
  cy.wait('@getAnalytics');
});

Then('I should see view counts', () => {
  cy.get('[data-cy="profile-views"]').should('be.visible');
  cy.get('[data-cy="profile-views"]').should('contain', 'vues');
});

Then('I should see basic visitor statistics', () => {
  cy.get('[data-cy="visitor-stats"]').should('be.visible');
  cy.get('[data-cy="monthly-views"]').should('be.visible');
  cy.get('[data-cy="referral-sources"]').should('be.visible');
});

Then('visitor personal information should remain private', () => {
  cy.get('[data-cy="visitor-names"]').should('not.exist');
  cy.get('[data-cy="visitor-emails"]').should('not.exist');
  cy.get('[data-cy="visitor-ips"]').should('not.exist');
});

Then('content should be displayed in the appropriate language', () => {
  cy.get('html').should('have.attr', 'lang', 'fr');
  cy.get('[data-cy="artist-bio"]').should('be.visible');
});

Then('special characters in artist names should display correctly', () => {
  cy.get('[data-cy="artist-name"]').should('not.contain', '&amp;');
  cy.get('[data-cy="artist-name"]').should('not.contain', '&lt;');
  cy.get('[data-cy="artist-name"]').should('not.contain', '&gt;');
});

Then('location names should be properly formatted', () => {
  cy.get('[data-cy="artist-location"]').should('be.visible');
  cy.get('[data-cy="artist-location"]').should('not.be.empty');
});

Given('I have a public artist profile URL', () => {
  cy.window().then((win) => {
    win.testProfileUrl = `${Cypress.config().baseUrl}/artist/jazz-virtuoso-paris`;
  });
});

When('I share this URL directly', () => {
  cy.window().then((win) => {
    cy.visit(win.testProfileUrl);
  });
});

Then('it should open correctly for anyone', () => {
  cy.get('[data-cy="public-artist-profile"]').should('be.visible');
});

Then('no authentication should be required', () => {
  cy.get('[data-cy="login-required"]').should('not.exist');
  cy.get('[data-cy="artist-name"]').should('be.visible');
});

Then('the profile should load completely for anonymous users', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
  cy.reload();
  cy.get('[data-cy="public-artist-profile"]').should('be.visible');
  cy.get('[data-cy="artist-name"]').should('be.visible');
});