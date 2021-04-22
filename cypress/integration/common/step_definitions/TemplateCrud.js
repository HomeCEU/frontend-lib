import {getEditorIframeBody, getTemplates, searchTemplates} from "../../../page-objects/template.po";
import {Given} from "cypress-cucumber-preprocessor/steps";

Given('A form displayed to manage template {string}', (template_name) => {
  getTemplates();
  searchTemplates(template_name);

  cy.intercept('GET', '**/template/*').as('getTemplate');
  cy.get(`:nth-child(1) > .datatable-body-row`).click();
  cy.wait('@getTemplate');
})

Given('A template editor is displayed to create a template', () => {
  getTemplates();
  cy.get('#create').click()
})

Given('The editor is in {string} mode', (source_mode) => {
  // performance of the CKEditor is out of our control
  cy.wait(1000);
  cy.get('.cke_button__source').click();
  if (source_mode === 'source') {
    cy.get('.cke_wysiwyg_frame').should('not.exist');
    cy.get('.cke_source').should('exist');
  }
  else if (source_mode === 'WYSIWYG') {
    cy.get('.cke_wysiwyg_frame').should('exist');
    cy.get('.cke_source').should('not.exist');
  }
})

Given('The template name {string} is entered', (template_name) => {
  cy.get('input[formcontrolname*="key"]').type(template_name)
})

Given('The text {string} is entered into the editor', (template_text) => {
  cy.get('.cke_source').type(template_text);
})

When('I select template {string}', (template_name) => {
  searchTemplates(template_name);
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
  // mocks a backend call to save a template
  cy.intercept('POST', '**/template', { fixture: 'post_template_response.json' }).as('postTemplate');
  cy.get('#save').click()
  cy.wait('@postTemplate');
})

When('I request to save an invalid template', () => {
  // mocks a backend call to save a template which returns an error
  cy.intercept('POST', '**/template', { statusCode:400 }).as('postTemplate');
  cy.get('#save').click()
  cy.wait('@postTemplate');
})

When('I request to change the view mode', () => {
  cy.wait(500);
  cy.get('.cke_button__source').click();
})

Then('A form containing the template text {string} is displayed to manage the template', (template_text) => {
  cy.get('.mat-dialog-container').should('exist');

  getEditorIframeBody().should('contain', template_text)
})

Then('The existing template is copied to a new template', () => {
  cy.get('#copy').should('have.class', 'mat-button-disabled');
})

Then('The form is closed', () => {
  cy.get('.mat-dialog-container').should('not.exist');
})

Then('The template is rendered in source mode', (template_id) => {
  cy.get('.cke_wysiwyg_frame').should('not.exist');
  cy.get('.cke_source').should('exist');
})

Then('The template is saved', () => {
  cy.get('.statusMessage').contains('Template saved.')
  cy.get('#copy').should('not.have.class', 'mat-button-disabled');
})

Then('The template is not saved', () => {
  cy.get('.statusMessage').contains('Save failed. Please try again.')
  cy.get('#copy').should('have.class', 'mat-button-disabled');
})

Then('The template contains the text {string}', (template_text) => {
  getEditorIframeBody().should('contain', template_text)
})
