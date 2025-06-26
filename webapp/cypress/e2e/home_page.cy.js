describe('Homepage', () => {
  it('should load the homepage', () => {
      cy.visit('/');
      cy.contains('Play Tic Tac Toe on the best freeworking site!');
  });
});