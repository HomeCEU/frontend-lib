import {TemplateAdminApproved} from "../../../fixtures/templates";
import {getEditorIframeBody, getTemplates, searchTemplates} from "../../../page-objects/template.po";
import {Given} from "cypress-cucumber-preprocessor/steps";
import 'cypress-iframe'

Given('A form displayed to manage template {string}', (template_name) => {
  getTemplates();
  searchTemplates(template_name);

  cy.intercept('GET', '**/template/enrollment/*').as('getTemplate');
  cy.get(`:nth-child(1) > .datatable-body-row`).click();
  cy.wait('@getTemplate');
})

Given('A template editor is displayed to create a template', () => {
  getTemplates();
  cy.get('#create').click()
})

Given('The editor is in source mode', (template_id) => {
  cy.wait(500);
  cy.get('.cke_button__source').click();
  cy.get('.cke_wysiwyg_frame').should('not.exist');
  cy.get('.cke_source').should('exist');
})

Given('The editor is in WYSIWYG mode', (template_id) => {
  cy.wait(500);
  cy.get('.cke_button__source').click();
  cy.get('.cke_wysiwyg_frame').should('exist');
  cy.get('.cke_source').should('not.exist');
})

Given('The text {string} is entered into the editor', (template_text) => {
  //cy.get('.cke_button__source').click()
  //cy.get('iframe').type(template_text)
  //cy.get('.cke_wysiwyg_frame.editorData[0].contentDocument.body.innerHTML').type(template_text)

  //cy.get('iframe').its('0.contentDocument').should('exist')


  //getIframeBody().type('hello')

  // cy.get('iframe').its('0.contentDocument.body').type('hello');

  // const temp = cy.get('iframe').its('0.contentDocument');
  // temp.its('body').type(template_text);

  // // ---------------------------------------
  // const iframe = cy
  //   .get('.cke_wysiwyg_frame')
  //   .its('0.contentDocument.body')
  //   .should('contain', 'testing')
  //   .then(element => {
  //     let temp = cy.wrap(element);
  //     temp.type('test');
  //   });

  //debugger;
  //iframe.type('test');

  // cy.frameLoaded();
  // cy.iframe().type('test');

  cy.get('.cke_source').type(template_text);

})

// Given('The editor is displayed in WYSIWYG mode', () => {
//   cy.get('.cke_button__source').click()
// })

// Given('I made changes to the template', () => {
//   cy.get('.cke_source').type('** EDITED TEMPLATE **')
// })

// When('I request to view an existing template', () => {
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



When('I enter a template name {string}', (template_key) => {
  cy.get('input[formcontrolname*="templateKey"]').type(template_key)
})

Then('A form containing the template text {string} is displayed to manage the template', (template_text) => {
  cy.get('.mat-dialog-container').should('exist');
  cy.get('#copy').should('not.have.class', 'mat-button-disabled');

  getEditorIframeBody().should('contain', template_text)
})

Then('A form is displayed to create the template', () => {
  cy.get('.mat-dialog-container').should('exist');
  cy.get('iframe').should('exist');
})

Then('The existing template is copied to a new template', () => {
  cy.get('#copy').should('have.class', 'mat-button-disabled');
  // todo - may need to find a way to verify the contents of the editor were not changed
})

Then('The template editor form is closed', () => {
  cy.get('.mat-dialog-container').should('not.exist');
})

Then('The template is rendered in source mode', (template_id) => {
  cy.get('.cke_wysiwyg_frame').should('not.exist');
  cy.get('.cke_source').should('exist');
})

Then('The editor contains additional markup for {string}', (template_text) => {
  let templateDisplayed = `<html>\n<head>\n\t<title></title>\n</head>\n<body>\n<p>${template_text}</p>\n</body>\n</html>\n`
  cy.get('.cke_source').should('have.value', templateDisplayed);
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
