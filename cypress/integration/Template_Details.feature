Feature: View details of an existing template

  As a system administrator I want to display details of an existing template so that I can view
  additional properties of the template.

  Scenario Outline: View template details
    Given A list of templates
    When I expand row "<row>" for a template
    Then Template details should contain a Template ID "<template_id>"
    And template details should contain a Body Uri "<body_uri>"
    And template details should contain a Document Type "<document_type>"

    Examples:
    | row | template_id                            | body_uri                                       | document_type |
    | 1   | e854eedd-e0a3-4259-8fb2-4a126d52e715   | /template/e854eedd-e0a3-4259-8fb2-4a126d52e715 | enrollment    |
    | 2   | 1ad8a97b-2cc9-484b-97b3-c227f02cf2cc   | /template/1ad8a97b-2cc9-484b-97b3-c227f02cf2cc | enrollment    |



