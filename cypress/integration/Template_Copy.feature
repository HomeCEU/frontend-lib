Feature: Copy an existing template

  As a system administrator I want to copy an existing template so that I can reduce the time needed to create a
  new template and to use styles and data from an existing template

  Scenario: Copy an existing template
    Given A form displayed to manage template "admin-approved"
    When I request to copy the template
    Then The existing template is copied to a new template

