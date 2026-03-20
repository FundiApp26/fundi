import { env } from "../config/env";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<{ success: boolean }>;
}

// --- Brevo Provider ---
class BrevoProvider implements EmailProvider {
  async send(options: EmailOptions) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": env.BREVO_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: { name: "Fundi", email: "noreply@fundi-app.com" },
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.html,
      }),
    });
    return { success: res.ok };
  }
}

// --- Console Provider ---
class ConsoleEmailProvider implements EmailProvider {
  async send(options: EmailOptions) {
    console.log(`[EMAIL-DEV] To: ${options.to} | Subject: ${options.subject}`);
    return { success: true };
  }
}

function createProvider(): EmailProvider {
  if (env.BREVO_API_KEY) {
    console.log("[Email] Using Brevo provider");
    return new BrevoProvider();
  }
  console.log("[Email] Using Console provider (dev mode)");
  return new ConsoleEmailProvider();
}

const provider = createProvider();

export async function sendEmail(options: EmailOptions) {
  return provider.send(options);
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: "Bienvenue sur Fundi !",
    html: `<h1>Bienvenue ${name} !</h1><p>Votre compte Fundi a été créé avec succès.</p>`,
  });
}
