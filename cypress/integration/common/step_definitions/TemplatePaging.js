import {
  dataTableFirstPage,
  dataTablePreviousPage
} from "../../../page-objects/template.po";

const PAGER_SELECTOR = 'datatable-pager>ul.pager>li';

When('I navigate to the last page', () => {
  cy.get('.datatable-icon-skip').click()
})

When('I navigate to the first page', () => {
  cy.get(PAGER_SELECTOR).eq(dataTableFirstPage).click()
})

When('I navigate to the next page', () => {
  cy.get('.datatable-icon-right').click()
})

When('I navigate to the previous page', () => {
  cy.get(PAGER_SELECTOR).eq(dataTablePreviousPage).click()
})

When('I navigate to page two', () => {
  cy.get(PAGER_SELECTOR).eq(3).click()
})

Then('The last page is displayed', () => {
  cy.get(PAGER_SELECTOR).last().should('have.class', 'disabled');
  cy.get(PAGER_SELECTOR).first().should('not.have.class', 'disabled');
})

Then('The first page is displayed', () => {
  cy.get(PAGER_SELECTOR).last().should('not.have.class', 'disabled');
  cy.get(PAGER_SELECTOR).first().should('have.class', 'disabled');
})

Then('The next page is displayed', () => {
  cy.get(PAGER_SELECTOR).eq(dataTableFirstPage).should('not.have.class', 'disabled')
})

Then('The previous page is displayed', () => {
  cy.get(PAGER_SELECTOR).eq(dataTableFirstPage).should('have.class', 'disabled')
})

Then('Page two is displayed', () => {
  cy.get(PAGER_SELECTOR).eq(3).should('have.class', 'active')
})
