Feature: Manage existing template

  As a system administrator I want to view and edit an existing template so that I can manage my existing my
  exiting templates.

  Scenario Outline: Display an existing template
    Given A list of templates
    When I select template "<template_name>"
    Then A form containing the template text "<template_text>" is displayed to manage the template

    Examples:
      | template_name   | template_text |
      | benchmark       | testing       |

  Scenario Outline: Close editor without changes
    Given A form displayed to manage template "<template_name>"
    When I request to close the form
    Then The form is closed

    Examples:
      | template_name   |
      | benchmark       |
      | admin-approved  |

  Scenario: View template source code
    Given A form displayed to manage template "admin-approved"
    When I request to change the view mode
    Then The template is rendered in source mode

  Scenario Outline: Edit and save template
    Given A form displayed to manage template "<template_name>"
    And The editor is in "source" mode
    And The text "<template_text>" is entered into the editor
    And The editor is in "WYSIWYG" mode
    When I request to save the template
    Then The template is saved
    And The template contains the text "<template_text>"

    Examples:
      | template_name   | template_text |
      | benchmark       | testing       |

  Scenario Outline: Error occurs when editing and saving a template
    Given A form displayed to manage template "<template_name>"
    And The editor is in "source" mode
    And The text "<template_text>" is entered into the editor
    And The editor is in "WYSIWYG" mode
    When I request to save an invalid template
    Then The template is not saved

    Examples:
      | template_name   | template_text |
      | benchmark       | testing       |
