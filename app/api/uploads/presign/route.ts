import crypto from "crypto";

function isoNow() {
  return new Date().toISOString().replace(/[:\-]|\.\d{3}/g, "");
}

export async function POST(req: Request) {
  try {
    const { filename, contentType } = await req.json();

    const bucket = process.env.S3_BUCKET!;
    const region = process.env.S3_REGION!;
    const endpoint = process.env.S3_ENDPOINT!.replace(/^https?:\/\//, "");
    const accessKey = process.env.S3_ACCESS_KEY_ID!;
    const secretKey = process.env.S3_SECRET_ACCESS_KEY!;
    const key = `releases/${Date.now()}-${filename}`;

    // AWS Signature V4 for S3-compatible providers
    const host = `${bucket}.${endpoint}`;
    const method = "PUT";
    const url = `https://${host}/${key}`;
    const amzDate = isoNow();
    const dateStamp = amzDate.slice(0, 8);
    const service = "s3";
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

    const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";
    const payloadHash = "UNSIGNED-PAYLOAD";
    const canonicalHeaders =
      `content-type:${contentType}\n` +
      `host:${host}\n` +
      `x-amz-content-sha256:${payloadHash}\n` +
      `x-amz-date:${amzDate}\n`;

    const canonicalRequest =
      `${method}\n/${key}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const canonicalHash = crypto.createHash("sha256").update(canonicalRequest).digest("hex");
    const stringToSign =
      `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalHash}`;

    const kDate = crypto.createHmac("sha256", "AWS4" + secretKey).update(dateStamp).digest();
    const kRegion = crypto.createHmac("sha256", kDate).update(region).digest();
    const kService = crypto.createHmac("sha256", kRegion).update(service).digest();
    const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest();
    const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

    const authHeader =
      `${algorithm} Credential=${accessKey}/${credentialScope}, ` +
      `SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const headers = {
      "Authorization": authHeader,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      "content-type": contentType,
    };

    return Response.json({ url, headers, key });
  } catch (error) {
    console.error("Presign error:", error);
    return Response.json({ error: "Failed to generate presigned URL" }, { status: 500 });
  }
}

