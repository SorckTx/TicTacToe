describe('Test de la página del lobby', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debería cargar correctamente la página del lobby', () => {
    cy.contains('Play Local').should('be.visible');
    cy.contains('Play Computer').should('be.visible');
    cy.contains('Play Online').should('be.visible');
    cy.contains('Top Players').should('be.visible');
    cy.contains('Create Account').should('be.visible');
    cy.contains('Login').should('be.visible');
  });
}); 