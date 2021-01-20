Feature: Manage existing template

  As a system administrator I want to view and edit an existing templates so that I can manage my existing my
  exiting templates.

  Scenario: Display an existing template
    Given A list of templates
    When I request to view an existing template
    Then A form is displayed to manage the template

  Scenario: Close editor without changes
    Given A form displayed to manage template "admin-approved"
    When I request to close the form
    Then The template editor form is closed

  Scenario: Preview a template
    Given A form displayed to manage template "admin-approved"
    When I request to change the view mode
    Then The template is rendered in WYSISYG mode

  Scenario Outline: Edit and save template
    Given A form displayed to manage template "benchmark"
    When I replace the text "<current_text>" with the new "<new_text>"
    #And I request to save the template
    Then The template is saved
    And The template contains the text "<new_text>"

    Examples:
      | current_text    | new_text      |
      | test            | updated text  |
