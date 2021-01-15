import {Given} from "cypress-cucumber-preprocessor/steps";
import {
  dataTableTemplateName,
  dataTableAuthor
} from "../../../page-objects/template.po";

const url = 'http://localhost:4200/'

const ITEMS_IN_PAGE = 10;

Given(`Search results for {string} are shown`, (search_value) => {
  cy.intercept('GET', '**/template*').as('getTemplates')
  cy.visit(url)
  cy.wait('@getTemplates');
  cy.get('input').type(search_value)
})

When('I search for templates containing {string}', (search_value) => {
  cy.get('input').type(search_value)
})

When('I clear the search field', () => {
  cy.get('#clear').click()
})

Then('{string} templates are displayed for template {string}', (num_of_templates, search_value) => {
  // verify the displayed items contain the search field
  const templates = num_of_templates > ITEMS_IN_PAGE ? ITEMS_IN_PAGE : num_of_templates;
  for(let i = 1; i < templates; i++) {
    dataTableTemplateName(i).should('contain', search_value);
  }

  cy.get(".page-count").should("contain", num_of_templates);
})

Then('{string} templates are displayed for author {string}', (num_of_templates, search_value) => {
  // verify the displayed items contain the search field
  const templates = num_of_templates > ITEMS_IN_PAGE ? ITEMS_IN_PAGE : num_of_templates;
  for(let i = 1; i < templates; i++) {
    dataTableAuthor(i).should('contain', search_value);
  }

  cy.get(".page-count").should("contain", num_of_templates);
})

Then('An unfiltered list of templates is displayed', () => {
  cy.get(".page-count").should("contain", "13");
})
