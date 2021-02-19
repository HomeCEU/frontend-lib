import { Given } from "cypress-cucumber-preprocessor/steps";
import {
  dataTableDocumentType,
  dataTableExpandRow,
  dataTableTemplateDetails, getTemplates
} from "../../../page-objects/template.po";

const url = 'http://localhost:4200/'

Given('A list of templates', () => {
  getTemplates();
})

When('I request to search for a list of {string}s', (docType) => {
  cy.get('[type="radio"]').check(`enrollment/${docType}`, { force: true }).click({ force: true });
})

When('I expand row {string} for a template', (row_number) => {
  dataTableExpandRow(row_number).click()
})

Then('A list of images are displayed', () => {
  dataTableDocumentType(1).should('contain', 'enrollment/image');
})

Then('A list of partials are displayed', () => {
  dataTableDocumentType(1).should('contain', 'enrollment/partial');
})

Then('Template details should contain a Template ID {string}', (template_id) => {
  dataTableTemplateDetails(0).contains('td', template_id);
})

Then('Template details should contain a Body Uri {string}', (template_id) => {
  dataTableTemplateDetails(1).contains('td', template_id);
})

