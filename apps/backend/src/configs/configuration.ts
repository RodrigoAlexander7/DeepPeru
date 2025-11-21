export default () => ({
  database: {
    url: process.env.DATABASE_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  google: {
    clientID: process.env.AUTH_GOOGLE_ID,
    clientSecret: process.env.AUTH_GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  mercadoPago: {
    clientID: process.env.MERCADO_PAGO_CLIENT_ID,
    clientSecret: process.env.MERCADO_PAGO_CLIENT_SECRET,
    callbackURL: process.env.MERCADO_PAGO_CALLBACK_URL,
  },
  authSecret: process.env.AUTH_SECRET,
  frontendURL: process.env.FRONTEND_URL,
});
