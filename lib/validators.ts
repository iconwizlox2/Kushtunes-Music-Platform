import { z } from "zod";

export const payoutRequestSchema = z.object({
  amount: z.coerce.number().positive("Amount must be > 0"),
  method: z.enum(["STRIPE_CONNECT", "PAYPAL", "REVOLUT", "USDT", "BANK_TRANSFER"]),
});

export const profileSchema = z.object({
  artistName: z.string().trim().min(1, "Artist name required"),
  email: z.string().trim().email("Valid email required"),
  country: z.string().trim().optional().default(""),
});

export const payoutMethodSchema = z.object({
  method: z.enum(["STRIPE_CONNECT", "PAYPAL", "REVOLUT", "USDT", "BANK_TRANSFER"]),
});

// Utility to parse JSON or FormData with the same schema
export async function parseJsonOrForm<T extends z.ZodTypeAny>(req: Request, schema: T) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const body = await req.json();
    return schema.parse(body);
  }
  const fd = await req.formData();
  const obj = Object.fromEntries(fd.entries());
  return schema.parse(obj);
}
