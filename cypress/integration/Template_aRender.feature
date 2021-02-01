Feature: Render certificate

  As a system administrator I want to preview a template with data so that I can see what the certificate will
  look like

  Background:
    Given A list of templates

  Scenario: Render template
    Given A form displayed to manage template "benchmark"
    When I enter data key "1234567"
    And I request to render a certificate
    Then The emplate is rendered

