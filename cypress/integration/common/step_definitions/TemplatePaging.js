import {
  dataTableFirstPage,
  dataTableLastPage,
  dataTableNextPage,
  dataTablePreviousPage
} from "../../../page-objects/template.po";

When('I navigate to the last page', () => {
  cy.get('datatable-pager>ul.pager>li').eq(dataTableLastPage).click()
})

When('I navigate to the first page', () => {
  cy.get('datatable-pager>ul.pager>li').eq(dataTableFirstPage).click()
})

When('I navigate to the next page', () => {
  cy.get('datatable-pager>ul.pager>li').eq(dataTableNextPage).click()
})

When('I navigate to the previous page', () => {
  cy.get('datatable-pager>ul.pager>li').eq(dataTablePreviousPage).click()
})

When('I navigate to page two', () => {
  cy.get('datatable-pager>ul.pager>li').eq(3).click()
})

Then('The last page is displayed', () => {
  cy.get('datatable-pager>ul.pager>li').eq(dataTableLastPage).should('have.class', 'disabled')
  cy.get('datatable-pager>ul.pager>li').eq(dataTableFirstPage).should('not.have.class', 'disabled')
})

Then('The first page is displayed', () => {
  cy.get('datatable-pager>ul.pager>li').eq(dataTableLastPage).should('not.have.class', 'disabled')
  cy.get('datatable-pager>ul.pager>li').eq(dataTableFirstPage).should('have.class', 'disabled')
})

Then('The next page is displayed', () => {
  cy.get('datatable-pager>ul.pager>li').eq(dataTableFirstPage).should('not.have.class', 'disabled')
})

Then('The previous page is displayed', () => {
  cy.get('datatable-pager>ul.pager>li').eq(dataTableFirstPage).should('have.class', 'disabled')
})

Then('Page two is displayed', () => {
  cy.get('datatable-pager>ul.pager>li').eq(3).should('have.class', 'active')
})
