Feature: Sort list of existing templates

  As a system administrator I want to sort a list of templates so that I can identify existing templates.

  Background:
    Given A list of templates

  Scenario: Sort templates by template name
    When I sort by template name
    Then A list of templates are displayed sorted by template name, descending

  Scenario: Sort templates by author
    When I sort by author
    Then A list of templates are displayed sorted by author, descending

