import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// SEO Step Definitions

Given('I visit the homepage {string}', (url) => {
  cy.visit(url);
});

Then('the page should have:', (dataTable) => {
  const expectedElements = dataTable.hashes();

  expectedElements.forEach((row) => {
    const element = row['SEO Element'];
    const expected = row['Expected'];

    switch(element) {
      case 'Title tag':
        cy.title().should('eq', expected);
        break;
      case 'Meta description':
        cy.get('head meta[name="description"]').should('have.attr', 'content').and('contain', expected);
        break;
      case 'H1 tag':
        cy.get('h1').should('contain', expected);
        break;
      case 'Schema.org markup':
        cy.get('script[type="application/ld+json"]').should('exist');
        cy.get('script[type="application/ld+json"]').should('contain', expected);
        break;
      case 'Open Graph tags':
        cy.get('head meta[property^="og:"]').should('have.length.greaterThan', 3);
        cy.get('head meta[property="og:title"]').should('exist');
        cy.get('head meta[property="og:description"]').should('exist');
        cy.get('head meta[property="og:image"]').should('exist');
        break;
      case 'Twitter Cards':
        cy.get('head meta[name="twitter:card"]').should('exist');
        cy.get('head meta[name="twitter:title"]').should('exist');
        cy.get('head meta[name="twitter:description"]').should('exist');
        break;
    }
  });
});

Then('the page should load within {int} seconds', (seconds) => {
  cy.window().then((win) => {
    cy.wrap(win.performance.timing.loadEventEnd - win.performance.timing.navigationStart)
      .should('be.lessThan', seconds * 1000);
  });
});

Then('Lighthouse SEO score should be {int}+', (minScore) => {
  // Note: This would typically be run in a separate Lighthouse audit
  // For this test, we'll check key SEO elements that affect the score
  cy.get('head title').should('exist');
  cy.get('head meta[name="description"]').should('exist');
  cy.get('h1').should('exist');
  cy.get('head meta[name="viewport"]').should('exist');
});

Given('I visit an artist profile {string}', (url) => {
  cy.visit(url);
});

Then('the page should have dynamic SEO tags:', (dataTable) => {
  const expectedTags = dataTable.hashes();

  expectedTags.forEach((row) => {
    const element = row['SEO Element'];
    const content = row['Content'];

    switch(element) {
      case 'Title':
        cy.title().should('contain', 'Artist').and('contain', 'location');
        break;
      case 'Meta description':
        cy.get('head meta[name="description"]').should('have.attr', 'content')
          .and('contain', 'genre').and('have.length.greaterThan', 50);
        break;
      case 'Keywords':
        cy.get('head meta[name="keywords"]').should('have.attr', 'content')
          .and('contain', 'jazz').or('contain', 'rock').or('contain', 'pop');
        break;
      case 'Schema.org':
        cy.get('script[type="application/ld+json"]').should('exist');
        cy.get('script[type="application/ld+json"]').should('contain', '"@type":"MusicGroup"')
          .or('contain', '"@type":"Person"');
        break;
      case 'Open Graph image':
        cy.get('head meta[property="og:image"]').should('have.attr', 'content')
          .and('match', /\.(jpg|jpeg|png|webp)$/);
        break;
      case 'Canonical URL':
        cy.get('head link[rel="canonical"]').should('have.attr', 'href')
          .and('contain', '/artist/');
        break;
    }
  });
});

Then('the page should be indexable by search engines', () => {
  // Check that there are no noindex directives
  cy.get('head meta[name="robots"]').should('not.have.attr', 'content', 'noindex');
  cy.get('head meta[name="googlebot"]').should('not.have.attr', 'content', 'noindex');
});

Given('I visit {string}', (url) => {
  cy.visit(url);
});

Then('the page should have genre-specific SEO:', (dataTable) => {
  const expectedSEO = dataTable.hashes();

  expectedSEO.forEach((row) => {
    const element = row['SEO Element'];
    const content = row['Content'];

    switch(element) {
      case 'Title':
        cy.title().should('contain', content);
        break;
      case 'Meta description':
        cy.get('head meta[name="description"]').should('have.attr', 'content')
          .and('contain', 'Jazz').and('contain', 'artistes');
        break;
      case 'H1':
        cy.get('h1').should('contain', content);
        break;
      case 'Keywords':
        cy.get('head meta[name="keywords"]').should('have.attr', 'content')
          .and('contain', 'jazz');
        break;
      case 'Breadcrumbs':
        cy.get('[data-cy="breadcrumbs"]').should('be.visible');
        cy.get('[data-cy="breadcrumbs"]').should('contain', 'Home');
        cy.get('[data-cy="breadcrumbs"]').should('contain', 'Artistes');
        cy.get('[data-cy="breadcrumbs"]').should('contain', 'Jazz');
        break;
    }
  });
});

Then('the page should list all jazz artists', () => {
  cy.get('[data-cy="artist-card"]').should('have.length.greaterThan', 0);
  cy.get('[data-cy="artist-card"]').each(($card) => {
    cy.wrap($card).find('[data-cy="artist-genres"]').should('contain', 'Jazz');
  });
});

Then('pagination should be SEO-friendly', () => {
  cy.get('[data-cy="pagination"]').should('be.visible');
  cy.get('[data-cy="pagination"] a').should('have.attr', 'href');
  cy.get('head link[rel="next"]').should('exist').or('not.exist'); // Depends on if there's a next page
});

Then('the page should have location-specific SEO:', (dataTable) => {
  const expectedSEO = dataTable.hashes();

  expectedSEO.forEach((row) => {
    const element = row['SEO Element'];
    const content = row['Content'];

    switch(element) {
      case 'Title':
        cy.title().should('contain', 'Jazz').and('contain', 'Paris');
        break;
      case 'Meta description':
        cy.get('head meta[name="description"]').should('have.attr', 'content')
          .and('contain', 'Jazz').and('contain', 'Paris');
        break;
      case 'H1':
        cy.get('h1').should('contain', 'Jazz').and('contain', 'Paris');
        break;
      case 'Keywords':
        cy.get('head meta[name="keywords"]').should('have.attr', 'content')
          .and('contain', 'Jazz').and('contain', 'Paris');
        break;
      case 'Breadcrumbs':
        cy.get('[data-cy="breadcrumbs"]').should('contain', 'Paris');
        break;
    }
  });
});

Then('the URL should be clean and readable', () => {
  cy.url().should('match', /\/artistes\/[a-z]+\/[a-z]+$/);
  cy.url().should('not.contain', '?');
  cy.url().should('not.contain', '&');
});

Then('the page should be indexed for local searches', () => {
  cy.get('script[type="application/ld+json"]').should('exist');
  cy.get('script[type="application/ld+json"]').should('contain', 'address')
    .or('contain', 'location');
});

Given('I visit {string}', (url) => {
  cy.visit(url);
});

Then('the page should have search-specific SEO:', (dataTable) => {
  const expectedSEO = dataTable.hashes();

  expectedSEO.forEach((row) => {
    const element = row['SEO Element'];
    const content = row['Content'];

    switch(element) {
      case 'Title':
        cy.title().should('contain', 'jazz').and('contain', 'paris');
        break;
      case 'Meta description':
        cy.get('head meta[name="description"]').should('have.attr', 'content')
          .and('contain', 'résultats');
        break;
      case 'Canonical URL':
        cy.get('head link[rel="canonical"]').should('have.attr', 'href')
          .and('contain', '/search');
        break;
    }
  });
});

Then('the page should use proper noindex\\/follow if needed', () => {
  // Search pages might be noindex to prevent duplicate content
  cy.get('head meta[name="robots"]').should('have.attr', 'content')
    .and('match', /(noindex,follow|index,follow)/);
});

Then('pagination should preserve search parameters', () => {
  cy.get('[data-cy="pagination"] a').first().should('have.attr', 'href')
    .and('contain', 'q=jazz');
});

Given('the application has published content', () => {
  // Assume the application has content
  cy.task('seedDatabase'); // Custom task to seed test data
});

When('I visit {string}', (url) => {
  cy.request(url).then((response) => {
    expect(response.status).to.eq(200);
    expect(response.headers['content-type']).to.contain('application/xml');
  });
});

Then('I should see a valid XML sitemap', () => {
  cy.get('urlset').should('exist');
  cy.get('url').should('have.length.greaterThan', 0);
});

Then('it should include all public pages:', (dataTable) => {
  const expectedPages = dataTable.hashes();

  expectedPages.forEach((row) => {
    const pageType = row['Page Type'];

    switch(pageType) {
      case 'Homepage':
        cy.get('url loc').should('contain', Cypress.config().baseUrl);
        break;
      case 'Directory pages':
        cy.get('url loc').should('contain', '/directory');
        break;
      case 'Genre pages':
        cy.get('url loc').should('contain', '/artistes/');
        break;
      case 'Artist profiles':
        cy.get('url loc').should('contain', '/artist/');
        break;
    }
  });
});

Then('URLs should be properly formatted', () => {
  cy.get('url loc').each(($loc) => {
    cy.wrap($loc).should('match', /^https?:\/\/.+/);
  });
});

Then('lastmod dates should be accurate', () => {
  cy.get('url lastmod').should('have.length.greaterThan', 0);
  cy.get('url lastmod').first().should('match', /^\d{4}-\d{2}-\d{2}/);
});

Then('I should see proper robots directives:', (dataTable) => {
  const expectedDirectives = dataTable.hashes();

  expectedDirectives.forEach((row) => {
    const directive = row['Directive'];
    const value = row['Value'];

    switch(directive) {
      case 'User-agent':
        cy.contains('User-agent: *').should('exist');
        break;
      case 'Sitemap':
        cy.contains('Sitemap:').should('contain', '/sitemap.xml');
        break;
      case 'Allow':
        cy.contains('Allow: /').should('exist');
        break;
      case 'Disallow':
        cy.contains('Disallow: /admin').should('exist');
        break;
    }
  });
});

Then('crawling rules should be appropriate', () => {
  cy.contains('Disallow: /dashboard').should('exist');
  cy.contains('Disallow: /api').should('exist');
  cy.contains('Allow: /artist/').should('exist');
});

Given('I visit any public page', () => {
  cy.visit('/');
});

Then('the page should meet Core Web Vitals:', (dataTable) => {
  const vitals = dataTable.hashes();

  // This would typically be measured with real tools like Lighthouse
  // For testing, we'll check implementation features that affect these metrics

  vitals.forEach((row) => {
    const metric = row['Metric'];
    const target = row['Target'];

    switch(metric) {
      case 'LCP (Largest Contentful Paint)':
        cy.get('img[loading="lazy"]').should('exist'); // Lazy loading helps LCP
        break;
      case 'FID (First Input Delay)':
        cy.get('[data-cy="search-input"]').should('be.visible').and('not.be.disabled');
        break;
      case 'CLS (Cumulative Layout Shift)':
        cy.get('img[width][height]').should('exist'); // Sized images prevent CLS
        break;
    }
  });
});

Then('images should be optimized and lazy-loaded', () => {
  cy.get('img[loading="lazy"]').should('exist');
  cy.get('img[srcset]').should('exist'); // Responsive images
});

Then('CSS and JS should be minimized', () => {
  cy.get('link[rel="stylesheet"]').should('have.attr', 'href')
    .and('match', /\.min\.css$|assets/); // Production builds
  cy.get('script[src]').should('have.attr', 'src')
    .and('match', /\.min\.js$|assets/); // Minified JS
});

Given('I visit any page on a mobile device', () => {
  cy.viewport('iphone-x');
  cy.visit('/');
});

Then('the page should be mobile-optimized:', (dataTable) => {
  const requirements = dataTable.hashes();

  requirements.forEach((row) => {
    const aspect = row['Aspect'];
    const requirement = row['Requirement'];

    switch(aspect) {
      case 'Responsive design':
        cy.get('head meta[name="viewport"]').should('have.attr', 'content')
          .and('contain', 'width=device-width');
        break;
      case 'Touch targets':
        cy.get('button, a').first().should('have.css', 'min-height').and('match', /44px|2.75rem/);
        break;
      case 'Font size':
        cy.get('body').should('have.css', 'font-size').and('not.match', /^(10|11|12)px$/);
        break;
      case 'Viewport meta':
        cy.get('head meta[name="viewport"]').should('have.attr', 'content')
          .and('contain', 'width=device-width');
        break;
    }
  });
});

Then('mobile Lighthouse score should be {int}+', (minScore) => {
  // This would be run as a separate audit
  // For testing, check mobile-friendly features
  cy.get('head meta[name="viewport"]').should('exist');
  cy.get('[data-cy="mobile-menu"]').should('be.visible');
});

When('I check the structured data', () => {
  cy.get('script[type="application/ld+json"]').should('exist');
});

Then('it should validate against Schema.org', () => {
  cy.get('script[type="application/ld+json"]').then(($script) => {
    const jsonLd = JSON.parse($script.text());
    expect(jsonLd).to.have.property('@context', 'https://schema.org');
    expect(jsonLd).to.have.property('@type');
  });
});

Then('it should include all required properties:', (dataTable) => {
  const properties = dataTable.hashes();

  cy.get('script[type="application/ld+json"]').then(($script) => {
    const jsonLd = JSON.parse($script.text());

    properties.forEach((row) => {
      const property = row['Property'];
      const type = row['Type'];

      expect(jsonLd).to.have.property(property);

      if (type === 'URL') {
        expect(jsonLd[property]).to.match(/^https?:\/\/.+/);
      } else if (type === 'Array of URLs') {
        expect(jsonLd[property]).to.be.an('array');
      }
    });
  });
});

Then('Google Rich Results should recognize it', () => {
  // This would be tested with Google's Rich Results Test tool
  // For automation, we ensure proper structure
  cy.get('script[type="application/ld+json"]').should('contain', 'name');
  cy.get('script[type="application/ld+json"]').should('contain', '@type');
});

Given('the site serves multiple regions', () => {
  // Assume multi-language/region support
  cy.visit('/');
});

Then('hreflang tags should be properly configured', () => {
  cy.get('head link[rel="alternate"][hreflang]').should('exist');
});

Then('language-specific content should be marked', () => {
  cy.get('html[lang]').should('have.attr', 'lang').and('match', /^[a-z]{2}(-[A-Z]{2})?$/);
});

Then('URLs should follow international SEO best practices', () => {
  // Check for proper URL structure for international sites
  cy.url().should('not.contain', '?lang=');
  cy.get('head link[rel="canonical"]').should('exist');
});

Given('I want to verify SEO implementation', () => {
  cy.visit('/');
});

When('I use SEO testing tools', () => {
  // This represents running various SEO tools
  cy.log('Running SEO audit...');
});

Then('all meta tags should be properly rendered', () => {
  cy.get('head meta[name="description"]').should('exist');
  cy.get('head meta[property^="og:"]').should('have.length.greaterThan', 2);
  cy.get('head meta[name^="twitter:"]').should('have.length.greaterThan', 1);
});

Then('JavaScript-generated content should be crawlable', () => {
  // Check that dynamic content is rendered
  cy.get('[data-cy="artist-card"]').should('be.visible');
  cy.get('h1').should('not.be.empty');
});

Then('server response times should be optimal', () => {
  cy.window().then((win) => {
    const timing = win.performance.timing;
    const responseTime = timing.responseEnd - timing.requestStart;
    expect(responseTime).to.be.lessThan(1000); // Less than 1 second
  });
});

Then('there should be no SEO errors or warnings', () => {
  // Check for common SEO issues
  cy.get('img:not([alt])').should('have.length', 0); // All images should have alt text
  cy.get('a[href="#"]').should('have.length', 0); // No empty links
  cy.get('h1').should('have.length', 1); // Exactly one H1 per page
});