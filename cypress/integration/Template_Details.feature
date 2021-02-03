Feature: View details of an existing template

  As a system administrator I want to display details of an existing template so that I can view
  additional properties of the template.

  Scenario Outline: View template details
    Given A list of templates
    When I expand row "<row>" for a template
    Then Template details should contain a Template ID "<template_id>"
    And Template details should contain a Body Uri "<body_uri>"
    And Template details should contain a Document Type "<document_type>"

    Examples:
    | row | template_id                            | body_uri                                       | document_type |
    | 1   | 87f4d434-60b4-11eb-807d-0242ac110003   | /template/87f4d434-60b4-11eb-807d-0242ac110003 | enrollment    |
    | 2   | bba87dc0-6583-11eb-a368-0242ac110003   | /template/bba87dc0-6583-11eb-a368-0242ac110003 | enrollment    |

