Feature: Create a new template

  As a system administrator I want to create a new template so that the template can be used to create a
  certificate.

  Scenario: Display a form to create a new template
    Given A list of templates
    When I request to create a new template
    Then A form is displayed to manage the template
