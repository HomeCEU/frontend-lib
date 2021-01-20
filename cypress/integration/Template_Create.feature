Feature: Create a new template

  As a system administrator I want to create a new template so that the template can be used to create a
  certificate.

  Scenario: Display a form to create a new template
    Given A list of templates
    When I request to create a new template
    Then A form is displayed to create the template

  Scenario Outline: Create A template
    Given A template editor is displayed to create a template
    When I enter "<template_text>" into the editor
    And I request to change the view mode
    And I request to change the view mode
    Then The editor contains additional markup for "<template_text>"

    Examples:
      | template_text                                |
      | Simple template                              |
      | This is a new template which contains data   |

  Scenario: Save a new template (draft)
    Given A template editor is displayed to create a template
    When I enter "My Template" into the editor
    #And I enter a template name "Test Template"
    #And I request to save the template
    #Then The template is saved
