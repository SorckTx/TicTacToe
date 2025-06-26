describe('Test del juego', () => {
  beforeEach(() => {
    cy.visit('/login');
    
    cy.get('input[name="username"]').type('willyrex2');
    cy.get('input[name="password"]').type('Koala860_');
    cy.contains('button', 'Log in').click({ force: true });

    //Asegurar la redirección al lobby antes de continuar
    cy.url().should('include', '/lobby');

    cy.visit('/local');

    //Esperar a que la partida se inicialice en el backend
    cy.request({
      method: 'POST',
      url: 'http://localhost:8000/game/init',
      failOnStatusCode: false, //Evita que Cypress falle si hay un error en el backend
    }).then((response) => {
      cy.log(`📡 Respuesta del backend: ${response.status}`);
    });

    //Esperar a que el tablero esté listo
    cy.get('[data-cy="square_0"]', { timeout: 15000 }).should('exist');
  });

  it('Verifica que los botones de acción existen y funcionan', () => {
    //Verificar botones principales
    cy.contains('button', 'Restart Game').should('exist');
    cy.contains('button', 'Back to Lobby').should('exist');
    cy.contains('button', 'Log Out').should('exist');

    //Probar que los botones son clicables
    cy.contains('button', 'Restart Game').click();
    cy.contains('button', 'Back to Lobby').click();

    cy.url().should('include', '/lobby');

    cy.visit('/local');
  });

  it('Verifica escenario de victoria', () => {

    cy.contains('button', 'Restart Game').click();

    //Simular una partida donde "X" gana
    cy.get('[data-cy="square_0"]').click(); // X
    cy.get('[data-cy="square_3"]').click(); // O
    cy.get('[data-cy="square_1"]').click(); // X
    cy.get('[data-cy="square_4"]').click(); // O
    cy.get('[data-cy="square_2"]').click(); // X (Gana)

    //Verificar que el mensaje de victoria aparece
    cy.contains('Winner: X').should('exist');
  });

  it('Verifica escenario de empate', () => {

    cy.contains('button', 'Restart Game').click();

    //Simular un empate (sin ganadores)
    cy.get('[data-cy="square_0"]').click(); // X
    cy.get('[data-cy="square_1"]').click(); // O
    cy.get('[data-cy="square_2"]').click(); // X
    cy.get('[data-cy="square_4"]').click(); // O
    cy.get('[data-cy="square_3"]').click(); // X
    cy.get('[data-cy="square_5"]').click(); // O
    cy.get('[data-cy="square_7"]').click(); // X
    cy.get('[data-cy="square_6"]').click(); // O
    cy.get('[data-cy="square_8"]').click(); // X

    //Verificar mensaje de empate
    cy.contains('Draw').should('exist');
  });

  it('Verifica escenario de derrota', () => {

    cy.contains('button', 'Restart Game').click();

    //Simular una partida donde "O" gana
    cy.get('[data-cy="square_0"]').click(); // X
    cy.get('[data-cy="square_1"]').click(); // O
    cy.get('[data-cy="square_3"]').click(); // X
    cy.get('[data-cy="square_4"]').click(); // O
    cy.get('[data-cy="square_5"]').click(); // X
    cy.get('[data-cy="square_7"]').click(); // O (Gana)

    //Verificar que el mensaje de derrota aparece
    cy.contains('Winner: O').should('exist');
  });
});