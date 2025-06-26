describe('Test de navegación', () => {
  let testUsername;

  beforeEach(() => {
    // Generar un nombre de usuario único
    testUsername = `testuser${Date.now()}`;
    
    cy.visit('/register');
    
    // Limpiar por si queda algo
    cy.get('input[name="username"]').clear({ force: true });
    cy.get('input[name="password"]').first().clear({ force: true });
    cy.get('input[name="confirmPassword"]').clear({ force: true });
  });

  it('debería permitir navegar entre páginas cuando el usuario está autenticado', () => {
    // Rellenar inputs para nuevo user
    cy.get('input[name="username"]').type(testUsername);
    cy.get('input[name="password"]').first().type('Testpass123');
    cy.get('input[name="confirmPassword"]').type('Testpass123', { force: true });
    cy.get('button').contains('Create account').click({ force: true });
    
    // Verificar que redirige al login
    cy.url().should('include', '/login');
    
    // Esperar a que los campos estén habilitados y limpios
    cy.get('input[name="username"]').should('be.enabled').clear({ force: true });
    cy.get('input[name="password"]').should('be.enabled').clear({ force: true });
    
    // Hacer login
    cy.get('input[name="username"]').type(testUsername);
    cy.get('input[name="password"]').type('Testpass123');
    cy.get('button').contains('Log in').click({ force: true });
    
    // Verificar que estamos en el lobby
    cy.url().should('include', '/lobby');

    // Verificar que el nombre de usuario aparece en el botón
    cy.get('button').contains(testUsername).should('be.visible');

    // Abrir el menú desplegable
    cy.get('button').contains(testUsername).click({ force: true });

    // Verificar que aparece el botón de logout
    cy.get('button').contains('Logout').should('be.visible');

    // Cerrar sesión
    cy.get('button').contains('Logout').click({ force: true });
    cy.url().should('include', '/login');

    // Limpiar después de completar el test
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  it('debería mostrar botones de registro y login cuando se accede al lobby sin autenticación', () => {
    // Limpiar cualquier estado de autenticación previo
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearAllCookies();

    // Visitar el lobby sin autenticación
    cy.visit('/lobby');
    
    // Verificar que los botones de registro y login están visibles
    cy.get('button').contains('Create Account').should('be.visible');
    cy.get('button').contains('Login').should('be.visible');

    // Verificar que los botones de juego están visibles
    cy.get('button').contains('Play Local').should('be.visible');
    cy.get('button').contains('Play Computer').should('be.visible');
    cy.get('button').contains('Play Online').should('be.visible');
    cy.get('button').contains('Top Players').should('be.visible');

    // Limpiar después de completar el test
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  it('debería permitir navegar a Top Players y los diferentes modos de juego', () => {
    // Registrar un nuevo usuario
    cy.get('input[name="username"]').type(testUsername);
    cy.get('input[name="password"]').first().type('Testpass123');
    cy.get('input[name="confirmPassword"]').type('Testpass123', { force: true });
    cy.get('button').contains('Create account').click({ force: true });
    
    // Verificar que redirige al login
    cy.url().should('include', '/login');
    
    // Hacer login
    cy.get('input[name="username"]').type(testUsername);
    cy.get('input[name="password"]').type('Testpass123');
    cy.get('button').contains('Log in').click({ force: true });
    
    // Verificar que estamos en el lobby
    cy.url().should('include', '/lobby');

    // Navegar a Top Players y verificar que esta el texto leaderboard y el logo
    cy.get('button').contains('Top Players').click({ force: true });
    cy.url().should('include', '/top');
    cy.get('h1').contains('Leaderboard').should('be.visible');
    cy.get('img[alt="Logo"]').click({ force: true });
    cy.url().should('include', '/lobby');

    // Navegar a Play Local y verificar el texto de local mode
    cy.get('button').contains('Play Local').click({ force: true });
    cy.url().should('include', '/local');
    cy.get('h1').contains('Tic Tac Toe - Local Mode').should('be.visible');
    cy.get('img[alt="Game Logo"]').click({ force: true });
    cy.url().should('include', '/lobby');

    // Navegar a Play Computer y verificar el texto de cpu mode
    cy.get('button').contains('Play Computer').click({ force: true });
    cy.url().should('include', '/cpu');
    cy.get('h1').contains('Tic Tac Toe - CPU Mode').should('be.visible');
    cy.get('img[alt="Game Logo"]').click({ force: true });
    cy.url().should('include', '/lobby');

    // Navegar a Play Online y verificar el texto de pvp mode
    cy.get('button').contains('Play Online').click({ force: true });
    cy.url().should('include', '/pvp');
    cy.get('h1').contains('TIC TAC TOE PVP').should('be.visible');
    cy.get('img[alt="Game Logo"]').click({ force: true });
    cy.url().should('include', '/lobby');

    // Limpiar después de completar el test
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });
}); 