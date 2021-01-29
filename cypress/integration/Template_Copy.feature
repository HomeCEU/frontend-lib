Feature: Copy an existing template

  As a system administrator I want to copy an existing template so that I can use that copied template to create a
  new template

  Scenario: Copy an existing template
    Given A form displayed to manage template "admin-approved"
    When I request to copy the template
    Then The existing template is copied to a new template

