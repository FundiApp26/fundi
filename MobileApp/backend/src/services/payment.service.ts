import { env } from "../config/env";

export interface PaymentRequest {
  amount: number;
  phone: string;
  operator: "om" | "momo";
  description: string;
  callbackUrl?: string;
}

export interface PaymentResult {
  success: boolean;
  reference?: string;
  error?: string;
  pending?: boolean;
}

export interface PaymentProvider {
  initiate(req: PaymentRequest): Promise<PaymentResult>;
  verify(reference: string): Promise<{ status: "success" | "failed" | "pending" }>;
}

// --- Dohone Provider ---
class DohoneProvider implements PaymentProvider {
  private operatorCodes = { om: 1, momo: 2 };

  async initiate(req: PaymentRequest): Promise<PaymentResult> {
    try {
      const params = new URLSearchParams({
        cmd: "start",
        rN: env.DOHONE_MERCHANT_KEY,
        rMt: req.amount.toString(),
        rDvs: "XAF",
        rMo: this.operatorCodes[req.operator].toString(),
        rT: req.phone,
        rH: req.description,
        rUrl: req.callbackUrl || env.DOHONE_CALLBACK_URL,
      });

      const res = await fetch(`${env.DOHONE_API_URL}?${params}`, { method: "GET" });
      const text = await res.text();

      if (text.startsWith("OK")) {
        const ref = text.split(":")[1]?.trim();
        return { success: true, reference: ref, pending: true };
      }
      return { success: false, error: text };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async verify(reference: string) {
    try {
      const params = new URLSearchParams({
        cmd: "verify",
        rN: env.DOHONE_MERCHANT_KEY,
        rDTP: reference,
      });
      const res = await fetch(`${env.DOHONE_API_URL}?${params}`);
      const text = await res.text();
      if (text.includes("OK")) return { status: "success" as const };
      if (text.includes("PENDING")) return { status: "pending" as const };
      return { status: "failed" as const };
    } catch {
      return { status: "failed" as const };
    }
  }
}

// --- Dev/Mock Provider ---
class MockPaymentProvider implements PaymentProvider {
  async initiate(req: PaymentRequest): Promise<PaymentResult> {
    console.log(`[PAYMENT-DEV] ${req.operator} ${req.amount} XAF to ${req.phone}: ${req.description}`);
    return { success: true, reference: `MOCK-${Date.now()}`, pending: false };
  }

  async verify(_reference: string) {
    return { status: "success" as const };
  }
}

function createProvider(): PaymentProvider {
  if (env.DOHONE_MERCHANT_KEY) {
    console.log("[Payment] Using Dohone provider");
    return new DohoneProvider();
  }
  console.log("[Payment] Using Mock provider (dev mode)");
  return new MockPaymentProvider();
}

const provider = createProvider();

export async function initiatePayment(req: PaymentRequest) {
  return provider.initiate(req);
}

export async function verifyPayment(reference: string) {
  return provider.verify(reference);
}
