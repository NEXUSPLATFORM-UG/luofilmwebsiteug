const PAYMENT_BASE = "https://function-bun-production-ac72.up.railway.app";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("256") && digits.length >= 12) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 10) return `+256${digits.slice(1)}`;
  if (digits.length === 9) return `+256${digits}`;
  return `+${digits}`;
}

async function post(path: string, body: object) {
  const res = await fetch(`${PAYMENT_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || data?.error || "Payment request failed");
  return data;
}

async function get(path: string) {
  const res = await fetch(`${PAYMENT_BASE}${path}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || data?.error || "Request failed");
  return data;
}

export const paymentApi = {
  validatePhone: async (phone: string) => {
    const msisdn = normalizePhone(phone);
    return post("/api/validate-phone", { msisdn });
  },

  deposit: async (phone: string, amount: number, description: string, reference: string) => {
    const msisdn = normalizePhone(phone);
    return post("/api/deposit", { msisdn, amount, description, reference });
  },

  checkStatus: async (internalReference: string) => {
    return get(`/api/request-status?internal_reference=${encodeURIComponent(internalReference)}`);
  },

  walletBalance: async () => {
    return get("/api/wallet/balance");
  },

  withdraw: async (phone: string, amount: number, description: string, reference: string) => {
    const msisdn = normalizePhone(phone);
    return post("/api/withdraw", { msisdn, amount, description, reference });
  },

  normalizePhone,
};

export type PaymentStatus = "idle" | "validating" | "pending" | "polling" | "success" | "failed";
