Feature: Search list of existing templates

  As a system administrator I want to search for a template so that I can identify existing templates.

  Scenario Outline: Search for a template by the Template Name
    Given A list of templates
    When I search for templates containing "<search_value>"
    Then "<num_of_templates>" templates are displayed for template "<search_value>"

    Examples:
      | search_value    | num_of_templates |
      | badvalue        | 0                |
      | in              | 4                |
      | encompass_care  | 1                |
      | admin-approved  | 1                |
      | infinity_rehab  | 1                |

  Scenario Outline: Search for a template by the Author
    Given A list of templates
    When I search for templates containing "<search_value>"
    Then "<num_of_templates>" templates are displayed for author "<search_value>"

    Examples:
      | search_value    | num_of_templates |
      | badvalue        | 0                |
      | Dan             | 10               |
      | Test User       | 5                |

  Scenario: Clearing search field displays original list of templates
    Given Search results for "encompass_care" are shown
    When I clear the search field
    Then An unfiltered list of templates is displayed


