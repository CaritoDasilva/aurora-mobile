// URL del backend, en orden de preferencia:
//  1. Variable de entorno EXPO_PUBLIC_API_URL (recomendado — no queda en git):
//       EXPO_PUBLIC_API_URL=https://tu-dominio.ngrok-free.dev npx expo start
//  2. El fallback de abajo: edítalo localmente con tu IP de WiFi
//     (ipconfig → IPv4) para pruebas en la misma red.
//
// NOTA: no commitees aquí tu URL de ngrok — mientras el backend no tenga
// autenticación, quien tenga la URL puede llamar a la API.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.100:3000';
