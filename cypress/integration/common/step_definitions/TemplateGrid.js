import { Given } from "cypress-cucumber-preprocessor/steps";
import {
  dataTableExpandRow,
  dataTableTemplateDetails
} from "../../../page-objects/template.po";

const url = 'http://localhost:4200/'

Given('A list of templates', () => {
  cy.intercept('GET', '**/template*').as('getTemplates')
  cy.visit(url)
  cy.wait('@getTemplates');
})

When('I expand row {string} for a template', (row_number) => {
  dataTableExpandRow(row_number).click()
})

Then('Template details should contain a Template ID {string}', (template_id) => {
  dataTableTemplateDetails(0).contains('td', template_id);
})

Then('template details should contain a Body Uri {string}', (template_id) => {
  dataTableTemplateDetails(1).contains('td', template_id);
})

Then('template details should contain a Document Type {string}', (template_id) => {
  dataTableTemplateDetails(2).contains('td', template_id);
})
