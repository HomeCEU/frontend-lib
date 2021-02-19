Feature: Display list of existing template partials and images

  As a system administrator I want to search for template partials and images so that I know what components are
  available for adding to a template

  Scenario: Display a list of template partials
    Given A list of templates
    When I request to search for a list of "partial"s
    Then A list of partials are displayed

  Scenario: Display a list of template images
    Given A list of templates
    When I request to search for a list of "image"s
    Then A list of images are displayed
