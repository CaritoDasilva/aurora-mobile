// URL del motor Aurora (aurora-be). Se define en `.env` (ver `.env.example`):
//   EXPO_PUBLIC_API_URL=http://<IP-de-tu-PC>:3000
// Debe leerse con notación de punto para que Expo la incluya en el bundle.
// Recuerda que el servidor debe escuchar fuera de localhost (AURORA_HOST=0.0.0.0).
export const API_BASE_URL: string = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
