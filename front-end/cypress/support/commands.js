/* eslint-disable no-undef */
Cypress.Commands.add('resetRec', () => {
    cy.request('POST', 'http://localhost:5000/recommendations/reset', {})
})