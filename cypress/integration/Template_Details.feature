Feature: View details of an existing template

  As a system administrator I want to display details of an existing template so that I can view
  additional properties of the template.

  Scenario Outline: View template details
    Given A list of templates
    When I expand row "<row>" for a template
    Then Template details should contain a Template ID "<template_id>"
    And Template details should contain a Body Uri "<body_uri>"

    Examples:
    | row | template_id                            | body_uri                                              |
    | 1   | e854eedd-e0a3-4259-8fb2-4a126d52e715   | /api/v1/template/e854eedd-e0a3-4259-8fb2-4a126d52e715 |
    | 2   | ea57e9dc-a203-11eb-871b-0242ac110003   | /api/v1/template/ea57e9dc-a203-11eb-871b-0242ac110003 |

