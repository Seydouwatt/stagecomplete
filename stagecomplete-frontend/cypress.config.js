import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5174',
    specPattern: 'cypress/e2e/**/*.{cy.js,cy.ts,feature}',
    async setupNodeEvents(on, config) {
      // Add Cucumber preprocessor plugin
      await addCucumberPreprocessorPlugin(on, config);
      
      // Configure esbuild bundler with Cucumber plugin
      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      
      return config;
    },
    supportFile: 'cypress/support/e2e.js',
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
  },
  env: {
    apiUrl: 'http://localhost:3000/api',
  },
});