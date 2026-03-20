import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const env = {
  // App
  NODE_ENV: optionalEnv("NODE_ENV", "development"),
  PORT: parseInt(optionalEnv("PORT", "3000"), 10),
  FRONTEND_URL: optionalEnv("FRONTEND_URL", "http://localhost:8100"),

  // Database
  DATABASE_URL: optionalEnv("DATABASE_URL", "postgresql://fundi:fundi_dev_2026@localhost:5432/fundi"),

  // Redis
  REDIS_URL: optionalEnv("REDIS_URL", "redis://localhost:6379"),

  // Auth
  JWT_SECRET: optionalEnv("JWT_SECRET", "dev-secret-change-in-production"),
  JWT_REFRESH_SECRET: optionalEnv("JWT_REFRESH_SECRET", "dev-refresh-secret-change-in-production"),

  // Dohone (Paiements OM / MoMo)
  // Docs: https://www.my-dohone.com/dohone-api7/site/modules/pagesExtra/api/1/tuto-api-dohone.pdf
  DOHONE_MERCHANT_KEY: optionalEnv("DOHONE_MERCHANT_KEY", ""),       // Clé marchande Dohone
  DOHONE_APP_NAME: optionalEnv("DOHONE_APP_NAME", "Fundi"),          // Nom de l'app sur Dohone
  DOHONE_HASH_CODE: optionalEnv("DOHONE_HASH_CODE", ""),             // Code de hachage pour vérifier les callbacks
  DOHONE_API_URL: optionalEnv("DOHONE_API_URL", "https://www.my-dohone.com/dohone/pay"),
  DOHONE_SANDBOX_URL: optionalEnv("DOHONE_SANDBOX_URL", "https://www.my-dohone.com/dohone-sandbox/pay"),
  DOHONE_PAYOUT_URL: optionalEnv("DOHONE_PAYOUT_URL", "https://www.my-dohone.com/dohone/transfert"),
  DOHONE_CALLBACK_URL: optionalEnv("DOHONE_CALLBACK_URL", ""),       // URL callback pour notifications de paiement
  DOHONE_USE_SANDBOX: optionalEnv("DOHONE_USE_SANDBOX", "true"),     // true en dev, false en prod

  // Camoo SMS (Cameroun)
  // Docs: https://github.com/camoo/sms | https://www.camoo.cm
  CAMOO_API_KEY: optionalEnv("CAMOO_API_KEY", ""),                   // Clé API Camoo
  CAMOO_API_SECRET: optionalEnv("CAMOO_API_SECRET", ""),             // Secret API Camoo
  CAMOO_SENDER_ID: optionalEnv("CAMOO_SENDER_ID", "Fundi"),         // Nom expéditeur SMS (max 11 chars)
  CAMOO_ROUTE: optionalEnv("CAMOO_ROUTE", "premium"),                // classic ou premium

  // Brevo (Email transactionnel)
  // Docs: https://developers.brevo.com/docs/send-a-transactional-email
  BREVO_API_KEY: optionalEnv("BREVO_API_KEY", ""),                   // Clé API Brevo (api-key header)
  BREVO_SENDER_EMAIL: optionalEnv("BREVO_SENDER_EMAIL", "noreply@fundi-app.com"),
  BREVO_SENDER_NAME: optionalEnv("BREVO_SENDER_NAME", "Fundi"),

  // Firebase Cloud Messaging (Push Notifications)
  // Docs: https://firebase.google.com/docs/cloud-messaging/send/v1-api
  FIREBASE_PROJECT_ID: optionalEnv("FIREBASE_PROJECT_ID", ""),       // ID du projet Firebase
  FIREBASE_CLIENT_EMAIL: optionalEnv("FIREBASE_CLIENT_EMAIL", ""),   // Email du service account
  FIREBASE_PRIVATE_KEY: optionalEnv("FIREBASE_PRIVATE_KEY", ""),     // Clé privée (JSON escaped avec \n)

  // Admin
  ADMIN_PHONES: optionalEnv("ADMIN_PHONES", ""),                     // Numéros admin séparés par virgule
} as const;
