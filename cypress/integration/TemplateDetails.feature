Feature: View existing template details

  I want to display details of a template so that I can find out information about existing templates in the system.

  Scenario Outline: View template details
    Given A list of templates
    When I expand row "<row>" for a template
    Then Template details should contain a Template ID "<template_id>"
    And template details should contain a Body Uri "<body_uri>"
    And template details should contain a Document Type "<document_type>"

    Examples:
    | row | template_id                            | body_uri                                       | document_type |
    | 1   | 2fa85f64-5717-4562-b3fc-2c963f66aaa2   | /template/2fa85f64-5717-4562-b3fc-2c963f66aaa2 | enrollment    |
    | 2   | 2fa85f64-5717-4562-b3fc-2c963f33afa4   | /template/2fa85f64-5717-4562-b3fc-2c963f33afa4 | enrollment    |



