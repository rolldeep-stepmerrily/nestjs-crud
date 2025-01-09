declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_URL: string;
    NODE_ENV: 'development' | 'production';
    PORT: number;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    DATABASE_URL: string;
    JWT_SECRET_KEY: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
  }
}
