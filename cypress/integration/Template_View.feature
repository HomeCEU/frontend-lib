Feature: View an existing template

  As a system administrator I want to view an existing template so that I can view template and certificate details.

  Scenario: Display an existing template
    Given A list of templates
    When I request to view an existing template
    Then A form is displayed to manage the template
