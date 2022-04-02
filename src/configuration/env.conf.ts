export const PORT = +process.env.PORT || 5000;
export const DB_HOST = process.env.POSTGRES_HOST;
export const DB_PORT = +process.env.POSTGRES_PORT;
export const DB_USER = process.env.POSTGRES_USER;
export const DB_PASS = process.env.POSTGRES_PASSWORD;
export const DB_NAME = process.env.POSTGRES_DB;
export const P_KEY = process.env.PRIVATE_KEY;

export const CORS_ORIGIN = JSON.parse(process.env.CORS_ORIGIN) as string[];
