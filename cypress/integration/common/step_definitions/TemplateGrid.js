import { Given } from "cypress-cucumber-preprocessor/steps";

//http://dts-staging.us-west-2.elasticbeanstalk.com/status
const url = 'http://localhost:4200/'

Given('A list of templates', () => {
  cy.intercept('GET', '**/template*').as('getTemplates')
  cy.visit(url)
  cy.wait('@getTemplates');
})

When('I expand row {string} for a template', (row_number) => {
  cy.get(
    ':nth-child(' + row_number + ') > .datatable-body-row > .datatable-row-center > :nth-child(1) > .datatable-body-cell-label > a'
  ).click()
})

Then('Template details should contain a Template ID {string}', (template_id) => {
  cy.get('table>tr').eq(0).contains('td', template_id);
})

Then('template details should contain a Body Uri {string}', (template_id) => {
  cy.get('table>tr').eq(1).contains('td', template_id);
})

Then('template details should contain a Document Type {string}', (template_id) => {
  cy.get('table>tr').eq(2).contains('td', template_id);
})
