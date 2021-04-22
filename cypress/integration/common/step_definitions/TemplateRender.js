
When('I enter data key {string}', (data_key) => {
  cy.get('input[formcontrolname*="dataKey"]').type(data_key)
})

When('I request to render a certificate', () => {
  // todo - stub the popup window to prevent it from opening
  // cy.window().then((win) => {
  //   cy.stub(win, 'open', url => {
  //     return new window();
  //   });
  // })

  cy.intercept('GET', '**/hotrender/**').as('renderTemplate');
  cy.get('#preview').click();
  cy.wait('@renderTemplate');
})

Then('The template is rendered', () => {
  // todo - verify the popup displayed
})
