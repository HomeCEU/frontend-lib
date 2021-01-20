import {TemplateAdminApproved} from "../../../fixtures/templates";
import {getTemplates, searchTemplates} from "../../../page-objects/template.po";
import {Given} from "cypress-cucumber-preprocessor/steps";

Given('A form displayed to manage a template', () => {
  getTemplates();
  searchTemplates('admin-approved');
  cy.get(`:nth-child(1) > .datatable-body-row`).click();
})

Given('A template editor is displayed to create a template', () => {
  getTemplates();
  cy.get('#create').click()
})

// Given('The editor is displayed in WYSIWYG mode', () => {
//   cy.get('.cke_button__source').click()
// })

// Given('I made changes to the template', () => {
//   cy.get('.cke_source').type('** EDITED TEMPLATE **')
// })

When('I request to view an existing template', () => {
  searchTemplates('admin-approved');
  cy.get(`:nth-child(1) > .datatable-body-row`).click();
})

When('I request to create a new template', () => {
  cy.get('#create').click()
})

When('I request to copy the template', () => {
  cy.get('#copy').click()
})

When('I request to close the form', () => {
  cy.get('#close').click()
})

When('I request to save the template', () => {
  cy.get('#save').click()
})

When('I request to change the view mode', () => {
  cy.get('.cke_button__source').click()
})

When('I enter {string} into the editor', (template_text) => {
  cy.get('.cke_source').type(template_text)
})

When('I enter a template name {string}', (template_key) => {
  cy.get('input[formcontrolname*="templateKey"]').type(template_key)
})

Then('A form is displayed to manage the template', () => {
  cy.get('.mat-dialog-container').should('exist');
  cy.get('.cke_source').should('have.value', TemplateAdminApproved);
  cy.get('#save').should('have.class', 'mat-button-disabled');
  cy.get('#copy').should('not.have.class', 'mat-button-disabled');
})

Then('A form is displayed to create the template', () => {
  cy.get('.mat-dialog-container').should('exist');
  cy.get('.cke_source').should('have.value', '');
  cy.get('#save').should('have.class', 'mat-button-disabled');
  cy.get('#copy').should('have.class', 'mat-button-disabled');
})

Then('The existing template is copied to a new template', () => {
  cy.get('#copy').should('have.class', 'mat-button-disabled');
  // todo - may need to find a way to verify the contents of the editor were not changed
})

Then('The template editor form is closed', () => {
  cy.get('.mat-dialog-container').should('not.exist');
})

Then('The template is rendered in WYSISYG mode', (template_id) => {
  cy.get('iframe').should('exist');
})

Then('The editor contains additional markup for {string}', (template_text) => {
  let templateDisplayed = `<html>\n<head>\n\t<title></title>\n</head>\n<body>\n<p>${template_text}</p>\n</body>\n</html>\n`
  cy.get('.cke_source').should('have.value', templateDisplayed);
})

Then('The template is saved', () => {
  // todo
})
