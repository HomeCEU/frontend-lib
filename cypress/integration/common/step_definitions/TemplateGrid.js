import { Given } from "cypress-cucumber-preprocessor/steps";
import {
  dataTableExpandRow,
  dataTableTemplateDetails, getTemplates
} from "../../../page-objects/template.po";

const url = 'http://localhost:4200/'

Given('A list of templates', () => {
  getTemplates();
})

When('I expand row {string} for a template', (row_number) => {
  dataTableExpandRow(row_number).click()
})

Then('Template details should contain a Template ID {string}', (template_id) => {
  dataTableTemplateDetails(0).contains('td', template_id);
})

Then('Template details should contain a Body Uri {string}', (template_id) => {
  dataTableTemplateDetails(1).contains('td', template_id);
})

Then('Template details should contain a Document Type {string}', (template_id) => {
  dataTableTemplateDetails(2).contains('td', template_id);
})
