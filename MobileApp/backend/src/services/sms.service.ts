import { env } from "../config/env";

export interface SmsProvider {
  send(phone: string, message: string): Promise<{ success: boolean; messageId?: string }>;
}

// --- Camoo SMS Provider ---
class CamooSmsProvider implements SmsProvider {
  async send(phone: string, message: string) {
    const res = await fetch("https://api.camoo.cm/v1/sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: env.CAMOO_API_KEY,
        api_secret: env.CAMOO_API_SECRET,
        from: "Fundi",
        to: phone,
        message,
      }),
    });
    const data = await res.json() as any;
    return { success: res.ok, messageId: data?.id };
  }
}

// --- Dev/Console Provider (fallback) ---
class ConsoleSmsProvider implements SmsProvider {
  async send(phone: string, message: string) {
    console.log(`[SMS-DEV] To: ${phone} | Message: ${message}`);
    return { success: true, messageId: `dev-${Date.now()}` };
  }
}

// Auto-select provider
function createProvider(): SmsProvider {
  if (env.CAMOO_API_KEY && env.CAMOO_API_SECRET) {
    console.log("[SMS] Using Camoo provider");
    return new CamooSmsProvider();
  }
  console.log("[SMS] Using Console provider (dev mode)");
  return new ConsoleSmsProvider();
}

const provider = createProvider();

export async function sendSMS(phone: string, message: string) {
  return provider.send(phone, message);
}

export async function sendOtpSms(phone: string, code: string) {
  return sendSMS(phone, `Votre code Fundi est: ${code}. Il expire dans 5 minutes.`);
}

export async function sendReminderSms(phone: string, cotisationName: string, deadlineTime: string) {
  return sendSMS(phone, `Rappel: l'heure limite de cotisation de ${cotisationName} est ${deadlineTime}.`);
}
