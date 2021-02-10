Feature: Create a new template

  As a system administrator I want to create a new template so that the template can be used to render a
  certificate.

  Scenario: Display a form to create a new template
    Given A list of templates
    When I request to create a new template
    Then A form containing the template text "" is displayed to manage the template

  Scenario Outline: Create and save a template
    Given A template editor is displayed to create a template
    And The editor is in "source" mode
    And The template name "<template_name>" is entered
    And The text "<template_text>" is entered into the editor
    And The editor is in "WYSIWYG" mode
    When I request to save the template
    Then The template is saved
    And The template contains the text "<template_text>"

    Examples:
      | template_name   | template_text                                |
      | akdkl2e         | Simple template                              |
      | zdlekek         | This is a new template which contains data   |
