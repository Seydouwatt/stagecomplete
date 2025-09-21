import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Mobile Experience Step Definitions

Given('I am using a mobile device \\(viewport: {int}x{int}\\)', (width, height) => {
  cy.viewport(width, height);
});

Given('the mobile experience is optimized', () => {
  cy.intercept('GET', '**/api/**').as('apiCalls');
});

Given('I visit the site on my mobile browser', () => {
  cy.viewport('iphone-x');
  cy.visit('/');
});

When('the PWA install prompt appears', () => {
  // Mock PWA install prompt
  cy.window().then((win) => {
    const mockEvent = {
      prompt: cy.stub().resolves(),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    };
    win.deferredPrompt = mockEvent;

    // Trigger custom PWA install prompt
    cy.get('[data-cy="pwa-install-prompt"]').should('be.visible');
  });
});

When('I choose to install the app', () => {
  cy.get('[data-cy="pwa-install-btn"]').click();
});

Then('the app should install successfully', () => {
  cy.window().then((win) => {
    // In a real scenario, this would check for successful PWA installation
    expect(win.deferredPrompt).to.exist;
  });
});

Then('I should be able to launch it from my home screen', () => {
  // This would be tested manually or with specific mobile testing tools
  cy.get('head link[rel="manifest"]').should('exist');
  cy.get('head meta[name="theme-color"]').should('exist');
});

Then('it should work offline for cached content', () => {
  // Test service worker functionality
  cy.window().then((win) => {
    expect(win.navigator.serviceWorker).to.exist;
  });

  // Simulate offline mode
  cy.intercept('GET', '**/api/**', { forceNetworkError: true });
  cy.get('[data-cy="offline-indicator"]').should('be.visible');
});

Given('I am on the mobile homepage', () => {
  cy.viewport('iphone-x');
  cy.visit('/');
  cy.get('[data-cy="homepage"]').should('be.visible');
});

Then('I should see a mobile-optimized navigation', () => {
  cy.get('[data-cy="mobile-nav"]').should('be.visible');
  cy.get('[data-cy="desktop-nav"]').should('not.be.visible');
});

Then('the search bar should be easily accessible', () => {
  cy.get('[data-cy="mobile-search-bar"]').should('be.visible');
  cy.get('[data-cy="search-input"]').should('have.css', 'min-height').and('match', /44px|2.75rem/);
});

Then('touch targets should be at least {int}px', (minSize) => {
  cy.get('button, a, [role="button"]').each(($el) => {
    cy.wrap($el).should('have.css', 'min-height').and('match', new RegExp(`${minSize}px|2.75rem`));
  });
});

When('I tap the menu button', () => {
  cy.get('[data-cy="mobile-menu-btn"]').click();
});

Then('I should see the mobile navigation menu', () => {
  cy.get('[data-cy="mobile-menu"]').should('be.visible');
  cy.get('[data-cy="mobile-menu-overlay"]').should('be.visible');
});

Then('all menu items should be touch-friendly', () => {
  cy.get('[data-cy="mobile-menu"] a').each(($link) => {
    cy.wrap($link).should('have.css', 'min-height').and('match', /44px|2.75rem/);
    cy.wrap($link).should('have.css', 'padding').and('not.eq', '0px');
  });
});

When('I tap the search bar', () => {
  cy.get('[data-cy="search-input"]').click();
});

Then('the mobile keyboard should appear', () => {
  cy.get('[data-cy="search-input"]').should('be.focused');
  // In a real mobile test, this would check for virtual keyboard
});

Then('the search interface should adapt to mobile', () => {
  cy.get('[data-cy="mobile-search-suggestions"]').should('be.visible');
  cy.get('[data-cy="search-input"]').should('have.attr', 'autocomplete', 'off');
});

When('I search for {string}', (searchTerm) => {
  cy.get('[data-cy="search-input"]').type(searchTerm);
  cy.get('[data-cy="search-input"]').type('{enter}');
});

Then('results should be displayed in a mobile-friendly format', () => {
  cy.get('[data-cy="mobile-search-results"]').should('be.visible');
  cy.get('[data-cy="artist-card"]').should('have.css', 'display', 'block');
  cy.get('[data-cy="artist-card"]').should('have.css', 'width', '100%');
});

Then('I should be able to scroll smoothly through results', () => {
  cy.get('[data-cy="search-results"]').scrollTo('bottom', { duration: 1000 });
  cy.get('[data-cy="load-more-btn"]').should('be.visible');
});

Given('I am browsing artist profiles on mobile', () => {
  cy.viewport('iphone-x');
  cy.visit('/artist/jazz-virtuoso-paris');
  cy.get('[data-cy="public-artist-profile"]').should('be.visible');
});

When('I perform touch gestures:', (dataTable) => {
  const gestures = dataTable.hashes();

  gestures.forEach((row) => {
    const gesture = row.Gesture;
    const expectedBehavior = row['Expected Behavior'];

    switch(gesture) {
      case 'Tap':
        cy.get('[data-cy="contact-btn"]').click();
        cy.get('[data-cy="contact-modal"], [data-cy="contact-section"]').should('be.visible');
        break;
      case 'Swipe':
        cy.get('[data-cy="photo-gallery"]').trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] });
        cy.get('[data-cy="photo-gallery"]').trigger('touchmove', { touches: [{ clientX: 50, clientY: 100 }] });
        cy.get('[data-cy="photo-gallery"]').trigger('touchend');
        break;
      case 'Pinch-to-zoom':
        cy.get('[data-cy="portfolio-photo"]').first().trigger('gesturestart');
        cy.get('[data-cy="portfolio-photo"]').first().trigger('gesturechange', { scale: 2 });
        cy.get('[data-cy="portfolio-photo"]').first().trigger('gestureend');
        break;
      case 'Pull-to-refresh':
        cy.get('body').trigger('touchstart', { touches: [{ clientX: 200, clientY: 50 }] });
        cy.get('body').trigger('touchmove', { touches: [{ clientX: 200, clientY: 150 }] });
        cy.get('body').trigger('touchend');
        break;
    }
  });
});

Then('all interactions should be smooth and responsive', () => {
  cy.get('[data-cy="touch-feedback"]').should('exist');
  cy.get('*').should('have.css', 'transition-duration').and('not.eq', '0s');
});

Then('there should be appropriate touch feedback', () => {
  cy.get('button:active').should('have.css', 'transform').and('not.eq', 'none');
  cy.get('a:active').should('have.css', 'background-color').and('not.eq', 'rgba(0, 0, 0, 0)');
});

Given('I visit an artist profile on mobile', () => {
  cy.viewport('iphone-x');
  cy.visit('/artist/jazz-virtuoso-paris');
  cy.get('[data-cy="public-artist-profile"]').should('be.visible');
});

Then('the profile should be fully responsive:', (dataTable) => {
  const elements = dataTable.hashes();

  elements.forEach((row) => {
    const element = row.Element;
    const mobileBehavior = row['Mobile Behavior'];

    switch(element) {
      case 'Photos':
        cy.get('[data-cy="photo-carousel"]').should('be.visible');
        cy.get('[data-cy="photo-carousel"]').should('have.attr', 'data-swipeable', 'true');
        break;
      case 'Information':
        cy.get('[data-cy="info-accordion"]').should('be.visible');
        cy.get('[data-cy="accordion-header"]').click();
        cy.get('[data-cy="accordion-content"]').should('be.visible');
        break;
      case 'Contact buttons':
        cy.get('[data-cy="contact-buttons"] button').should('have.css', 'min-height').and('match', /44px|2.75rem/);
        break;
      case 'Social links':
        cy.get('[data-cy="social-links"] a').should('have.css', 'min-height').and('match', /44px|2.75rem/);
        break;
    }
  });
});

Then('content should be readable without zooming', () => {
  cy.get('body').should('have.css', 'font-size').and('match', /1[4-8]px|1\.[0-2]rem/);
  cy.get('p').should('have.css', 'line-height').and('not.eq', '1');
});

Then('scrolling should be smooth and natural', () => {
  cy.get('body').should('have.css', '-webkit-overflow-scrolling', 'touch');
  cy.scrollTo('bottom', { duration: 1000 });
  cy.scrollTo('top', { duration: 1000 });
});

Given('I am on a 3G mobile connection', () => {
  // Simulate 3G connection
  cy.viewport('iphone-x');
  cy.intercept('**/*', (req) => {
    req.reply((res) => {
      // Add delay to simulate 3G
      return new Promise(resolve => {
        setTimeout(() => resolve(res), 100);
      });
    });
  });
});

When('I navigate through the site', () => {
  cy.visit('/');
  cy.get('[data-cy="featured-artists"] a').first().click();
  cy.get('[data-cy="public-artist-profile"]').should('be.visible');
});

Then('pages should load within {int} seconds', (seconds) => {
  cy.get('[data-cy="page-content"]').should('be.visible');
  // In real testing, measure actual load times
});

Then('images should be optimized for mobile', () => {
  cy.get('img').should('have.attr', 'loading', 'lazy');
  cy.get('img').should('have.attr', 'srcset');
  cy.get('picture source[media*="max-width"]').should('exist');
});

Then('the app should use lazy loading for content', () => {
  cy.get('[data-cy="lazy-content"]').should('have.attr', 'data-lazy', 'true');
  cy.scrollTo('bottom');
  cy.get('[data-cy="lazy-content"]').should('be.visible');
});

Then('data usage should be minimized', () => {
  cy.get('img[srcset]').should('exist'); // Responsive images
  cy.get('video[preload="none"]').should('exist'); // No video preload
});

Given('I have visited pages while online', () => {
  cy.visit('/');
  cy.visit('/artist/jazz-virtuoso-paris');
  cy.visit('/search?q=jazz');
});

When('I go offline', () => {
  cy.intercept('**/*', { forceNetworkError: true }).as('offline');
});

Then('previously visited pages should still be accessible', () => {
  cy.visit('/');
  cy.get('[data-cy="homepage"]').should('be.visible');
  cy.get('[data-cy="cached-content"]').should('be.visible');
});

Then('I should see an offline indicator', () => {
  cy.get('[data-cy="offline-badge"]').should('be.visible');
  cy.contains('Mode hors ligne').should('be.visible');
});

Then('cached artist profiles should remain viewable', () => {
  cy.visit('/artist/jazz-virtuoso-paris');
  cy.get('[data-cy="public-artist-profile"]').should('be.visible');
  cy.get('[data-cy="cached-profile"]').should('exist');
});

When('I come back online', () => {
  cy.intercept('**/*').as('online');
});

Then('the app should sync automatically', () => {
  cy.get('[data-cy="sync-indicator"]').should('be.visible');
  cy.get('[data-cy="offline-badge"]').should('not.exist');
});

When('I tap the share button', () => {
  cy.get('[data-cy="mobile-share-btn"]').click();
});

Then('I should see native sharing options:', (dataTable) => {
  const options = dataTable.hashes();

  if (Cypress.browser.name === 'chrome' && Cypress.env('MOBILE_TESTING')) {
    // Test Web Share API if available
    cy.window().then((win) => {
      if (win.navigator.share) {
        cy.get('[data-cy="native-share"]').should('be.visible');
      } else {
        cy.get('[data-cy="fallback-share"]').should('be.visible');
      }
    });
  } else {
    // Fallback share options
    options.forEach((row) => {
      const option = row['Share Option'];
      switch(option) {
        case 'Copy link':
          cy.get('[data-cy="copy-link-btn"]').should('be.visible');
          break;
        case 'SMS/Messages':
          cy.get('[data-cy="share-sms"]').should('be.visible');
          break;
        case 'Email':
          cy.get('[data-cy="share-email"]').should('be.visible');
          break;
        case 'WhatsApp':
          cy.get('[data-cy="share-whatsapp"]').should('be.visible');
          break;
      }
    });
  }
});

Then('sharing should use the Web Share API when available', () => {
  cy.window().then((win) => {
    if (win.navigator.share) {
      cy.get('[data-cy="web-share-api"]').should('exist');
    }
  });
});

Given('I need to fill out forms on mobile', () => {
  cy.viewport('iphone-x');
  cy.visit('/register');
});

When('I interact with form elements', () => {
  cy.get('[data-cy="registration-form"]').should('be.visible');
});

Then('the mobile keyboard should be appropriate for each field:', (dataTable) => {
  const fields = dataTable.hashes();

  fields.forEach((row) => {
    const fieldType = row['Field Type'];
    const keyboardType = row['Keyboard Type'];

    switch(fieldType) {
      case 'Email':
        cy.get('input[type="email"]').should('have.attr', 'inputmode', 'email');
        break;
      case 'Phone':
        cy.get('input[type="tel"]').should('have.attr', 'inputmode', 'tel');
        break;
      case 'URL':
        cy.get('input[type="url"]').should('have.attr', 'inputmode', 'url');
        break;
      case 'Text':
        cy.get('input[type="text"]').should('have.attr', 'inputmode', 'text');
        break;
    }
  });
});

Then('form validation should be mobile-friendly', () => {
  cy.get('[data-cy="validation-message"]').should('have.css', 'font-size').and('match', /1[4-6]px/);
  cy.get('[data-cy="validation-message"]').should('be.visible');
});

Then('error messages should be clearly visible', () => {
  cy.get('input:invalid').should('have.css', 'border-color').and('not.eq', 'rgb(0, 0, 0)');
  cy.get('[data-cy="error-message"]').should('have.css', 'color').and('match', /rgb\(220, 38, 38\)|red/);
});

Given('I am uploading photos on mobile', () => {
  cy.viewport('iphone-x');
  cy.login('artist@test.com', 'password123');
  cy.visit('/dashboard/profile');
});

When('I tap the photo upload button', () => {
  cy.get('[data-cy="photo-upload-btn"]').click();
});

Then('I should see mobile-specific options:', (dataTable) => {
  const options = dataTable.hashes();

  options.forEach((row) => {
    const option = row['Upload Option'];

    switch(option) {
      case 'Take photo':
        cy.get('input[type="file"][capture="environment"]').should('exist');
        break;
      case 'Choose from gallery':
        cy.get('input[type="file"][accept="image/*"]').should('exist');
        break;
      case 'Browse files':
        cy.get('input[type="file"]').should('exist');
        break;
    }
  });
});

Then('the upload process should work smoothly', () => {
  const fileName = 'test-mobile-photo.jpg';
  cy.fixture(fileName, 'base64').then(fileContent => {
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(fileContent, 'base64'),
      fileName: fileName,
      mimeType: 'image/jpeg'
    }, { force: true });
  });
});

Then('progress indicators should be visible', () => {
  cy.get('[data-cy="upload-progress"]').should('be.visible');
  cy.get('[data-cy="upload-progress-bar"]').should('exist');
});

Given('I test different mobile screen sizes:', (dataTable) => {
  const devices = dataTable.hashes();

  devices.forEach((row, index) => {
    const device = row.Device;
    const screenSize = row['Screen Size'];
    const orientation = row.Orientation;

    const [width, height] = screenSize.split('x').map(Number);

    cy.viewport(width, height);
    cy.visit('/');

    cy.get('[data-cy="homepage"]').should('be.visible');
    cy.get('[data-cy="responsive-content"]').should('be.visible');
  });
});

Then('the layout should adapt properly to each size', () => {
  cy.get('[data-cy="responsive-grid"]').should('exist');
  cy.get('[data-cy="mobile-layout"]').should('be.visible');
});

Then('content should remain readable and usable', () => {
  cy.get('body').should('have.css', 'font-size').and('match', /1[4-8]px/);
  cy.get('button').should('have.css', 'min-height').and('match', /44px|2.75rem/);
});

Then('no horizontal scrolling should be required', () => {
  cy.get('body').should('have.css', 'overflow-x', 'hidden');
  cy.get('[data-cy="content-container"]').should('have.css', 'max-width', '100%');
});

Given('I am using mobile accessibility features', () => {
  cy.viewport('iphone-x');
  // Mock accessibility settings
  cy.window().then((win) => {
    win.matchMedia = cy.stub().returns({ matches: true });
  });
});

Then('the app should support:', (dataTable) => {
  const features = dataTable.hashes();

  features.forEach((row) => {
    const feature = row['Accessibility Feature'];
    const support = row['Support Level'];

    switch(feature) {
      case 'Screen readers':
        cy.get('[aria-label]').should('exist');
        cy.get('[role]').should('exist');
        cy.get('img[alt]').should('exist');
        break;
      case 'Voice control':
        cy.get('[data-cy="voice-search-btn"]').should('exist');
        break;
      case 'High contrast mode':
        cy.get('body').should('have.css', 'color-contrast').or('not.have.css', 'color-contrast');
        break;
      case 'Large text':
        cy.get('body').should('have.css', 'font-size').and('match', /1[6-9]px|[2-9]rem/);
        break;
      case 'Touch accommodations':
        cy.get('button').should('have.css', 'min-height').and('match', /44px|2.75rem/);
        break;
    }
  });
});

Then('all interactive elements should be accessible', () => {
  cy.get('button, a, input, select, textarea').each(($el) => {
    cy.wrap($el).should('satisfy', ($elem) => {
      return $elem.attr('aria-label') ||
             $elem.attr('title') ||
             $elem.text().trim() ||
             $elem.attr('alt');
    });
  });
});

Given('I use the mobile version regularly', () => {
  cy.viewport('iphone-x');
  // Set up user preferences for mobile experience
  cy.window().then((win) => {
    win.localStorage.setItem('preferredPlatform', 'mobile');
  });
});

Then('it should feel like a native app:', (dataTable) => {
  const features = dataTable.hashes();

  features.forEach((row) => {
    const feature = row.Feature;
    const implementation = row.Implementation;

    switch(feature) {
      case 'Smooth animations':
        cy.get('[data-cy="animated-element"]').should('have.css', 'transition-duration').and('not.eq', '0s');
        break;
      case 'Native scrolling':
        cy.get('body').should('have.css', '-webkit-overflow-scrolling', 'touch');
        break;
      case 'Touch feedback':
        cy.get('button').should('have.css', 'user-select', 'none');
        break;
      case 'Status bar styling':
        cy.get('head meta[name="theme-color"]').should('exist');
        break;
      case 'Splash screen':
        cy.get('[data-cy="splash-screen"]').should('exist');
        break;
    }
  });
});

Then('performance should match native app expectations', () => {
  cy.window().then((win) => {
    const timing = win.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    expect(loadTime).to.be.lessThan(3000); // Less than 3 seconds
  });
});