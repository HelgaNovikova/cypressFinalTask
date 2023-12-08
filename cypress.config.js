const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://consumersenergymanagement.ca/",
    'testIsolation': false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});