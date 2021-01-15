import {
  dataTableHeader,
  dataTableTemplateName,
  dataTableAuthor,
  dataTableDateTime
} from "../../../page-objects/template.po";

When('I sort by template name', () => {
  dataTableHeader(2).click();
})

When('I sort by author', () => {
  dataTableHeader(3).click();
})

When('I sort by date and time', () => {
  dataTableHeader(4).click();
})

Then('A list of templates are displayed sorted by template name, descending', () => {
  dataTableTemplateName(1).should('contain', 'vibrant-care');
})

Then('A list of templates are displayed sorted by author, descending', () => {
  dataTableAuthor(1).should('contain', 'Dan');
})

Then('A list of templates are displayed sorted by date and time, descending', () => {
  dataTableDateTime(1).should('contain', '3/23/20, 11:40 AM');
})
