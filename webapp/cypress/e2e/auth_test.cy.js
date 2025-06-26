describe('Test de autenticación', () => {
  let testUsername;

  beforeEach(() => {
    // Generar un nombre de usuario único
    testUsername = `testuser${Date.now()}`;
    
    cy.visit('/register');
    
    // Limpiar todos los campos del formulario por si queda algo escrito
    cy.get('input[name="username"]').clear({ force: true });
    cy.get('input[name="password"]').first().clear({ force: true });
    cy.get('input[name="confirmPassword"]').clear({ force: true });
  });

  it('debería permitir el registro y login de un usuario', () => {
    // Hace input de los tres campos
    cy.get('input[name="username"]').type(testUsername);
    cy.get('input[name="password"]').first().type('Testpass123');
    cy.get('input[name="confirmPassword"]').type('Testpass123', { force: true });
    
    // ECuando se ha rellenado los inputs hace click en create account
    cy.get('button').contains('Create account').click({ force: true });
    
    // Verificar que se redirige al login despues de create account
    cy.url().should('include', '/login');
    
    // Limpiar campos del login por si queda algo escrito
    cy.get('input[name="username"]').clear({ force: true });
    cy.get('input[name="password"]').clear({ force: true });
    
    // Hacer login con el usuario creado
    cy.get('input[name="username"]').type(testUsername);
    cy.get('input[name="password"]').type('Testpass123');
    cy.get('button').contains('Log in').click({ force: true });
    
    // Verificar que redirige al lobby
    cy.url().should('include', '/lobby');

    // Limpiar para futuros tests
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  it('debería mostrar errores de validación en el registro', () => {
    // Intentar registrar sin llenar campos
    cy.get('button').contains('Create account').click({ force: true });
    
    // Verificar que aparece algún mensaje de error
    cy.get('[role="alert"]').should('be.visible');
    
    // Limpiar campos antes de la siguiente prueba
    cy.get('input[name="username"]').clear({ force: true });
    cy.get('input[name="password"]').first().clear({ force: true });
    cy.get('input[name="confirmPassword"]').clear({ force: true });

    // Intentar registrar con contraseña débil
    cy.get('input[name="username"]').type(testUsername);
    cy.get('input[name="password"]').first().type('weak');
    cy.get('input[name="confirmPassword"]').type('weak', { force: true });
    cy.get('button').contains('Create account').click({ force: true });
    
    // Verificar que aparece algún mensaje de error
    cy.get('[role="alert"]').should('be.visible');

    // Limpiar campos antes de la siguiente prueba
    cy.get('input[name="username"]').clear({ force: true });
    cy.get('input[name="password"]').first().clear({ force: true });
    cy.get('input[name="confirmPassword"]').clear({ force: true });

    // Intentar registrar con contraseñas que no coinciden
    cy.get('input[name="password"]').first().type('Testpass123');
    cy.get('input[name="confirmPassword"]').type('Differentpass123', { force: true });
    cy.get('button').contains('Create account').click({ force: true });
    
    // Verificar que aparece algún mensaje de error
    cy.get('[role="alert"]').should('be.visible');

    // Limpiar al final
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });
});