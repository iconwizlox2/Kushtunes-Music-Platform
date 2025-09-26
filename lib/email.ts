import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendVerificationEmailParams {
  to: string;
  name: string;
  verificationUrl: string;
}

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl
}: SendVerificationEmailParams) {
  // Skip sending email if SMTP is not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log('SMTP not configured, skipping email send');
    console.log('Verification URL:', verificationUrl);
    return;
  }

  const mailOptions = {
    from: `"Kushtunes" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Verify your Kushtunes account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your Kushtunes account</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f8fafc;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #6366f1;
              margin-bottom: 10px;
            }
            .title {
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .content {
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
              color: white;
              text-decoration: none;
              padding: 16px 32px;
              border-radius: 8px;
              font-weight: 600;
              text-align: center;
              margin: 20px 0;
            }
            .button:hover {
              background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 14px;
              color: #6b7280;
              text-align: center;
            }
            .warning {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 6px;
              padding: 12px;
              margin: 20px 0;
              font-size: 14px;
              color: #92400e;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎵 Kushtunes</div>
              <h1 class="title">Verify your account</h1>
            </div>
            
            <div class="content">
              <p>Hi ${name},</p>
              
              <p>Welcome to Kushtunes! To complete your account setup and start distributing your music, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #6366f1;">${verificationUrl}</p>
              
              <div class="warning">
                <strong>Important:</strong> This verification link will expire in 24 hours for security reasons.
              </div>
              
              <p>Once verified, you'll be able to:</p>
              <ul>
                <li>Upload and distribute your music worldwide</li>
                <li>Access detailed analytics and insights</li>
                <li>Manage your releases and earnings</li>
                <li>Connect with our global artist community</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>If you didn't create an account with Kushtunes, you can safely ignore this email.</p>
              <p>© 2025 Kushtunes. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Hi ${name},
      
      Welcome to Kushtunes! To complete your account setup and start distributing your music, please verify your email address by visiting this link:
      
      ${verificationUrl}
      
      This verification link will expire in 24 hours for security reasons.
      
      Once verified, you'll be able to upload and distribute your music worldwide, access detailed analytics, manage your releases and earnings, and connect with our global artist community.
      
      If you didn't create an account with Kushtunes, you can safely ignore this email.
      
      © 2025 Kushtunes. All rights reserved.
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', to);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}
