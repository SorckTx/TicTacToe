export function getTokenServerSide(context) {
    const { req } = context;
    const token = req.cookies?.token;
  
    if (!token) {
      console.log('No token found, redirecting to login.');
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    console.log('Token encontrado:', token);
    return { props: {} }; // devolvemos props vacío, xq no necesitamos nada, solo checkear el token
  }
export function getUserFromToken() {
  if (typeof document === 'undefined') return null; 

  const cookie = document.cookie.split('; ').find(row => row.startsWith('token='));
  if (!cookie) {
    console.log("No user found.");
    return null;
  }

  try {
    const token = cookie.split('=')[1];
    const payload = JSON.parse(atob(token.split('.')[1])); 
    console.log(`Logged user: ${payload.username}`); 
    return payload.username;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function getUserIDFromToken() {
  if (typeof document === "undefined") return null; // Si no estamos en el navegador, no podemos acceder a document
  const cookie = document.cookie.split("; ").find(row => row.startsWith("token=")); // Buscamos la cookie con el token
  if (!cookie) {
    console.log("No token found.");
    return null;
  }

  const token = cookie.split("=")[1]; 
  console.log("Token:", token);

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodificamos el payload del token, que es la parte del medio del token y lo parseamos de Json a javascript
    console.log("Decoded payload", payload);

    // Usamos `sub` como el userID
    return payload.sub || null; // Devolvemos el userID o null si no existe
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

