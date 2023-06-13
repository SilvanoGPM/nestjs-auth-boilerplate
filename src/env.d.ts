declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    ORIGINS?: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    ACCESS_TOKEN_EXPIRATION_TIME: string;
    REFRESH_TOKEN_EXPIRATION_TIME: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GENERIC_VALIDATION_ERROR_MESSAGE?: string;
  }
}
