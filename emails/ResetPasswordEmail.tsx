import * as React from "react";
import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Tailwind, Text } from "@react-email/components";

export default function ResetPasswordEmail({
  url,
  host,
  brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "Kushtunes",
  logoUrl = process.env.NEXT_PUBLIC_EMAIL_LOGO_URL || "",
  supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@kushtunes.com",
  accent = process.env.NEXT_PUBLIC_EMAIL_ACCENT || "#0ea5e9",
}: { 
  url: string; 
  host: string; 
  brandName?: string; 
  logoUrl?: string; 
  supportEmail?: string; 
  accent?: string; 
}) {
  return (
    <Html>
      <Head />
      <Preview>Reset your {brandName} password</Preview>
      <Tailwind>
        <Body className="bg-[#f6f7f9] m-0 p-0">
          <Section className="px-4 py-8">
            <Container className="max-w-[560px] mx-auto bg-white rounded-xl border border-[#e5e7eb] p-7">
              {logoUrl ? <Img src={logoUrl} alt={brandName} className="h-9 mx-auto mb-2" /> : null}
              <Text className="text-[20px] font-semibold text-[#0f172a] mt-0 mb-1">Reset your password</Text>
              <Text className="text-[14px] leading-6 text-[#475569] mt-0 mb-4">
                Click the button below to set a new password for <strong>{host}</strong>.
              </Text>
              <Button href={url} className="inline-block no-underline rounded-lg px-4 py-3 font-semibold text-white" style={{ backgroundColor: accent }}>
                Set new password
              </Button>
              <Text className="text-[13px] text-[#475569] mt-3">This link expires in 1 hour and can be used once.</Text>
              <Hr className="my-6" />
              <Text className="text-[14px] leading-6 text-[#475569] mt-0 mb-1">If the button doesn't work, paste this URL into your browser:</Text>
              <Text className="text-[12px] leading-6 text-[#475569] break-all">{url}</Text>
              <Hr className="my-6" />
              <Text className="text-[13px] text-[#475569]">
                Didn't request this? Ignore this email or contact <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
              </Text>
            </Container>
            <Text className="text-center text-[12px] text-[#94a3b8] mt-3">© {new Date().getFullYear()} {brandName} · {host}</Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
