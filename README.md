# FrontendLib

This project libraray contains Angular Custom Elements for managing functionality within HomeCEU.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

- Run `npm run build:dts`
- Copy `\elements\frontend-lib.js` and `\dist\frontend-lib\styles.css` to the Server where the element is exposed.

## Running unit tests

Developing and running `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Developing and running end-to-end tests

Regression tests make use of [Cucumber with Cypress](https://www.npmjs.com/package/cypress-cucumber-preprocessor).

- `npm run test:cypress:ci` to run regression tests locally -  starts the application, waits for the URL, then runs regression tests; when the tests end, shuts down app
- `npm run test:cypress:run` to run regression tests locally against the currently running application

Regression tests follow Behavioral Driven Development (BDD) and apply the following best practices:
- Tests are contained in “feature” files.
- Feature files contain a title, a single User Story, and one or more scenarios to test the User Story.
  - The title communicate in one concise line what the behavior is.
  - The User Story is written in the format “As a <type of user> I want <goal> so that <reason>.”
  - Scenarios are written in the Gherkin syntax and optionally contain “Examples” to test multiple outcomes.

Gherkin best practices
- A good scenario has only one When-Then pair.
- Given steps should use past or present-perfect tense, because they represent an initial state that must already be established.
- When steps should use present tense, because they represent actions actively performed as part of the behavior.
- Then steps should use present or future tense, because they represent what should happen after the behavior actions.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
