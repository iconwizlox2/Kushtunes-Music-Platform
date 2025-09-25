type Rates = Record<string, number>; // e.g. { USD: 1, EUR: 1.08, GBP: 1.27 }

function parseRates(): Rates {
  // Optional: set NEXT_PUBLIC_FX_RATES='{"USD":1,"EUR":1.08,"GBP":1.27}' in Vercel
  try {
    const raw = process.env.NEXT_PUBLIC_FX_RATES || process.env.FX_RATES || "";
    if (!raw) return { USD: 1 };
    const obj = JSON.parse(raw);
    if (typeof obj !== "object" || !obj) return { USD: 1 };
    return { USD: 1, ...obj };
  } catch {
    return { USD: 1 };
  }
}

const RATES = parseRates();

export function toUSD(amount: number | null | undefined, currency?: string | null): number {
  if (!amount) return 0;
  const cur = (currency || "USD").toUpperCase();
  const rate = RATES[cur] ?? 1; // fallback: treat as USD if missing
  return amount * rate;
}
