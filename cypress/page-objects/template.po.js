export const dataTableFirstPage = 0;
export const dataTablePreviousPage = 1;
export const dataTableNextPage = 4;
export const dataTableLastPage = 5;

const url = 'http://localhost:4200/'

export const dataTableHeader = colNumber =>
  cy.get(
    `:nth-child(${colNumber}) > .datatable-header-cell-template-wrap > .datatable-header-cell-wrapper > .datatable-header-cell-label`
  );

export const dataTableTemplateName = rowNumber =>
  cy.get(
    `:nth-child(${rowNumber}) > .datatable-body-row > .datatable-row-center > :nth-child(2) > .datatable-body-cell-label > span`
  );

export const dataTableAuthor = rowNumber =>
  cy.get(
    `:nth-child(${rowNumber}) > .datatable-body-row > .datatable-row-center > :nth-child(3) > .datatable-body-cell-label > span`
  );

export const dataTableDateTime = rowNumber =>
  cy.get(
    `:nth-child(${rowNumber}) > .datatable-body-row > .datatable-row-center > :nth-child(4) > .datatable-body-cell-label`
  );

export const dataTableTemplateDetails = id =>
  cy.get('.datatable-row-detail > table > tr').eq(id);

export const dataTableExpandRow = rowNumber =>
  cy.get(
    `:nth-child(${rowNumber}) > .datatable-body-row > .datatable-row-center > :nth-child(1) > .datatable-body-cell-label > a`
  );

export function getTemplates() {
  cy.viewport(1400, 1000);
  cy.intercept('GET', '**/template*').as('getTemplates');
  cy.visit(url);
  cy.wait('@getTemplates');
}

export function searchTemplates(searchValue) {
  cy.intercept('GET', '**/template*').as('getTemplates')
  cy.get('input').type(searchValue)
  cy.wait('@getTemplates');
}
