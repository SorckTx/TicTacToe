import { io } from "socket.io-client";

// Conéctate al backend (asegúrate de que la URL es la correcta)
const socket = io("http://localhost:8000");

export default socket;