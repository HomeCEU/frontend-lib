import { Given } from "cypress-cucumber-preprocessor/steps";
import {
  dataTableExpandRow,
  dataTableTemplateDetails, dataTableTemplateName, getTemplates
} from "../../../page-objects/template.po";

const url = 'http://localhost:4200/'

Given('A list of templates', () => {
  getTemplates();
})

When('I request to search for a list of {string}s', (templateType) => {
  cy.intercept('GET', '**/partial?docType=enrollment').as('getTemplates');
  cy.get('[type="radio"]').check(templateType, { force: true }).click({ force: true });
  cy.wait('@getTemplates');
})

When('I expand row {string} for a template', (row_number) => {
  dataTableExpandRow(row_number).click()
})

Then('A list of templates are displayed', () => {
  dataTableTemplateName(1).should('contain', 'acp');
})

Then('A list of partials are displayed', () => {
  dataTableTemplateName(1).should('contain', 'acp_asha_block.png');
})

Then('Template details should contain a Template ID {string}', (template_id) => {
  dataTableTemplateDetails(0).contains('td', template_id);
})

Then('Template details should contain a Body Uri {string}', (template_id) => {
  dataTableTemplateDetails(1).contains('td', template_id);
})

