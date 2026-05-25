// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Service — Email
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports emailService
 * @module services/email
 */

// =============================================================================
// DATACENDIA EMAIL SERVICE
// Production-ready email service with multiple provider support
// =============================================================================

import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';
import { sovereignMode } from './sovereign/SovereignModeService.js';

// =============================================================================
// TYPES
// =============================================================================

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

// =============================================================================
// TRANSPORTER CONFIGURATION
// =============================================================================

const SMTP_FALLBACK_FROM = 'Datacendia <noreply@datacendia.com>';
const isSmtpEnabled = (): boolean => (process.env.SMTP_ENABLED ?? 'false').toLowerCase() !== 'false';

const getSmtpTransporter = () => {
  if (!isSmtpEnabled()) {
    logger.info('[email] SMTP disabled, skipping send');
    return null;
  }

  const host = process.env.SMTP_HOST;
  const portValue = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !portValue || !user || !pass) {
    logger.warn('[email] SMTP not fully configured, skipping send');
    return null;
  }

  const port = Number.parseInt(portValue, 10);
  if (!Number.isFinite(port)) {
    logger.warn('[email] SMTP_PORT is invalid, skipping send');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

const templates = {
  emailVerification: (name: string, verificationUrl: string): EmailTemplate => ({
    subject: 'Verify Your Datacendia Account',
    text: `
Hello ${name},

Welcome to Datacendia! Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
The Datacendia Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #18181b; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Datacendia</h1>
    </div>
    <div style="padding: 40px 30px;">
      <p style="color: #a1a1aa; font-size: 16px; margin-bottom: 20px;">Hello ${name},</p>
      <p style="color: #d4d4d8; font-size: 16px; margin-bottom: 30px;">
        Thank you for joining Datacendia. Please verify your email address to get started with your AI-powered executive council.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #71717a; font-size: 14px; margin-top: 30px;">
        This link will expire in 24 hours. If you didn't create an account, please ignore this email.
      </p>
    </div>
    <div style="background-color: #27272a; padding: 20px; text-align: center;">
      <p style="color: #71717a; font-size: 12px; margin: 0;">
        Â© ${new Date().getFullYear()} Datacendia. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }),

  passwordReset: (name: string, resetUrl: string): EmailTemplate => ({
    subject: 'Reset Your Datacendia Password',
    text: `
Hello ${name},

We received a request to reset your password. Click the link below to create a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email or contact support if you're concerned.

Best regards,
The Datacendia Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #18181b; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
    </div>
    <div style="padding: 40px 30px;">
      <p style="color: #a1a1aa; font-size: 16px; margin-bottom: 20px;">Hello ${name},</p>
      <p style="color: #d4d4d8; font-size: 16px; margin-bottom: 30px;">
        We received a request to reset your password. Click the button below to create a new password.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Reset Password
        </a>
      </div>
      <p style="color: #71717a; font-size: 14px; margin-top: 30px;">
        This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
      </p>
    </div>
    <div style="background-color: #27272a; padding: 20px; text-align: center;">
      <p style="color: #71717a; font-size: 12px; margin: 0;">
        Â© ${new Date().getFullYear()} Datacendia. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }),

  welcomeEmail: (name: string, loginUrl: string): EmailTemplate => ({
    subject: 'Welcome to Datacendia - Your Account is Ready',
    text: `
Hello ${name},

Your Datacendia account has been verified and is ready to use!

Log in now to access your AI Executive Council:
${loginUrl}

Here's what you can do:
- Ask strategic questions to your AI C-suite
- Explore data lineage with The Graph
- Monitor organizational health with The Pulse
- Run predictive scenarios with The Lens
- Automate workflows with The Bridge

Best regards,
The Datacendia Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #18181b; border-radius: 12px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #22c55e 0%, #10b981 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">You're All Set!</h1>
    </div>
    <div style="padding: 40px 30px;">
      <p style="color: #a1a1aa; font-size: 16px; margin-bottom: 20px;">Hello ${name},</p>
      <p style="color: #d4d4d8; font-size: 16px; margin-bottom: 30px;">
        Your Datacendia account has been verified and is ready to use. Start making better decisions with your AI Executive Council.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #10b981 100%); color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Go to Dashboard
        </a>
      </div>
      <div style="background-color: #27272a; border-radius: 8px; padding: 20px; margin-top: 30px;">
        <h3 style="color: #d4d4d8; margin: 0 0 15px 0; font-size: 16px;">What you can do:</h3>
        <ul style="color: #a1a1aa; font-size: 14px; margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 8px;">Ask strategic questions to your AI C-suite</li>
          <li style="margin-bottom: 8px;">Explore data lineage with The Graph</li>
          <li style="margin-bottom: 8px;">Monitor organizational health with The Pulse</li>
          <li style="margin-bottom: 8px;">Run predictive scenarios with The Lens</li>
          <li>Automate workflows with The Bridge</li>
        </ul>
      </div>
    </div>
    <div style="background-color: #27272a; padding: 20px; text-align: center;">
      <p style="color: #71717a; font-size: 12px; margin: 0;">
        Â© ${new Date().getFullYear()} Datacendia. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }),
};

// =============================================================================
// EMAIL SERVICE
// =============================================================================

export const emailService = {
  /**
   * Send a raw email
   */
  async send(options: EmailOptions): Promise<boolean> {
    // Sovereign mode: block external email when notifications are disabled
    if (!sovereignMode.isExternalNotifyEnabled) {
      logger.info(`[Email] External notifications disabled (sovereign mode) — email to ${options.to} suppressed`);
      return true; // Return true so callers don't treat it as a failure
    }

    const transporter = getSmtpTransporter();

    // No transporter available (SMTP disabled or missing config)
    if (!transporter) {
      return true;
    }

    try {
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || SMTP_FALLBACK_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      logger.info(`Email sent: ${info.messageId}`);

      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  },

  /**
   * Send email verification
   */
  async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/verify-email?token=${token}`;
    const template = templates.emailVerification(name, verificationUrl);
    
    return this.send({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  },

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/reset-password?token=${token}`;
    const template = templates.passwordReset(name, resetUrl);
    
    return this.send({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  },

  /**
   * Send welcome email after verification
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/login`;
    const template = templates.welcomeEmail(name, loginUrl);
    
    return this.send({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  },
};

export default emailService;
