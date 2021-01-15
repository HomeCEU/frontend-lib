Feature: Navigate though a list of existing templates

  As a system administrator I want to navigate though a list of existing templates
  so that I can identify existing templates.

  Background:
    Given A list of templates

  Scenario: Navigate to the last page
    When I navigate to the last page
    Then The last page is displayed

  Scenario: Navigate to the first page
    When I navigate to the last page
    And I navigate to the first page
    Then The first page is displayed

  Scenario: Navigate to the next page
    When I navigate to the next page
    Then The next page is displayed

  Scenario: Navigate to the previous page
    When I navigate to the next page
    And I navigate to the previous page
    Then The previous page is displayed

  Scenario: Navigate to a specific page number
    When I navigate to page two
    Then Page two is displayed
