import prisma from "../lib/prisma";
import { env } from "../config/env";

// Cache configs in memory (refresh every 5 min)
let configCache: Record<string, string> = {};
let cacheExpiry = 0;

async function loadConfigs(): Promise<Record<string, string>> {
  if (Date.now() < cacheExpiry) return configCache;

  try {
    const configs = await prisma.systemConfig.findMany();
    configCache = {};
    configs.forEach((c) => { configCache[c.key] = c.value; });
    cacheExpiry = Date.now() + 5 * 60 * 1000; // 5 min cache
  } catch {
    // DB not available, use empty cache
  }
  return configCache;
}

// Get config value: DB first, then .env fallback
export async function getConfig(key: string): Promise<string> {
  const configs = await loadConfigs();
  if (configs[key] !== undefined && configs[key] !== "") return configs[key];

  // Fallback to env (map config keys to env keys)
  const envMap: Record<string, string> = {
    "camoo_api_key": env.CAMOO_API_KEY,
    "camoo_api_secret": env.CAMOO_API_SECRET,
    "camoo_sender_id": env.CAMOO_SENDER_ID,
    "camoo_route": env.CAMOO_ROUTE,
    "dohone_merchant_key": env.DOHONE_MERCHANT_KEY,
    "dohone_app_name": env.DOHONE_APP_NAME,
    "dohone_hash_code": env.DOHONE_HASH_CODE,
    "dohone_callback_url": env.DOHONE_CALLBACK_URL,
    "dohone_use_sandbox": env.DOHONE_USE_SANDBOX,
    "brevo_api_key": env.BREVO_API_KEY,
    "brevo_sender_email": env.BREVO_SENDER_EMAIL,
    "brevo_sender_name": env.BREVO_SENDER_NAME,
    "firebase_project_id": env.FIREBASE_PROJECT_ID,
    "firebase_client_email": env.FIREBASE_CLIENT_EMAIL,
    "firebase_private_key": env.FIREBASE_PRIVATE_KEY,
    "max_free_cotisations": "3",
    "max_free_sends": "15",
    "premium_price": "10000",
  };

  return envMap[key] || "";
}

// Force refresh cache (after admin updates a config)
export function invalidateConfigCache() {
  cacheExpiry = 0;
}
