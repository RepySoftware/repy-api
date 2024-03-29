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
    TWILIO_WHATS_APP_FROM: string,

    ZENVIA_TOKEN: string,
    GOOGLE_KEY: string,

    DEVICE_GAS_LEVEL_HISTORY_READ_INTERVAL_MINUTES: number,

    ONE_SIGNAL_APP_ID: string,
    ONE_SIGNAL_API_KEY: string

} = process.env as any;

// export const DEFAULT_DATETIME_FORMAT: string = 'YYYY-MM-DD HH:mm:ss';