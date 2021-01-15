import {dataTableHeader} from "../../../page-objects/template.po";

When('I request to view an existing template', () => {
  cy.get('input').type('admin-approved')
  cy.get(
    `:nth-child(1) > .datatable-body-row`).click();
})

When('I request to create a new template', () => {
  cy.get('#create').click()
})

Then('A form is displayed to manage the template', () => {
  cy.get('.mat-dialog-container').should('exist');
})

