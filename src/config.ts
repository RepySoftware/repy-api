export const CONFIG: {
    HOST: string,
    PORT: number,

    DB_HOST: string,
    DB_SCHEMA: string,
    DB_USER: string,
    DB_PASSWORD: string,

    JWT_SECRET: string,

    EMAIL_SERVICE: string,
    EMAIL_USER: string,
    EMAIL_PASSWORD: string,

    TWILIO_ACCOUNT_SID: string,
    TWILIO_AUTH_TOKEN: string,
    TWILIO_WHATS_APP_FROM: string

} = process.env as any;

// export const DEFAULT_DATETIME_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';