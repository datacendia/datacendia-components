// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * API Routes — Billing
 *
 * Express route handler defining REST endpoints.
 * @module routes/billing
 */

// =============================================================================
// DATACENDIA BILLING ROUTES - Stripe Integration
// Configure STRIPE_SECRET_KEY in .env to enable payment processing
// =============================================================================

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { notificationService } from '../services/NotificationService.js';

import { z } from 'zod';

const bodySchema0 = z.object({
  priceId: z.any(),
  tierId: z.any(),
  commitment: z.any(),
  region: z.any(),
  successUrl: z.any(),
  cancelUrl: z.any(),
}).passthrough();
const bodySchema1 = z.object({
  customerId: z.any(),
}).passthrough();

const router = Router();

// =============================================================================
// STRIPE CHECKOUT SESSION
// Frontend calls this to create a Stripe Checkout session for plan upgrades
// =============================================================================
router.post('/billing/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { priceId, tierId, commitment, region, successUrl, cancelUrl } = bodySchema0.parse(req.body);

    if (!priceId || !tierId) {
      return res.status(400).json({
        error: 'Missing required fields: priceId, tierId',
      });
    }

    // Check if Stripe is configured
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      logger.warn('Stripe not configured — STRIPE_SECRET_KEY not set');
      return res.status(503).json({
        error: 'Payment processing not configured',
        message: 'Contact sales@datacendia.com to set up billing.',
        fallback: `mailto:sales@datacendia.com?subject=${encodeURIComponent(`${tierId} Plan Inquiry`)}`,
      });
    }

    // Dynamic import — only load Stripe when key is configured
    // @ts-ignore — stripe is an optional dependency, only loaded when STRIPE_SECRET_KEY is set
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as any });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing`,
      metadata: {
        tierId,
        commitment,
        region,
      },
      // If user is logged in, attach their email
      ...(req.body.customerEmail ? { customer_email: req.body.customerEmail } : {}),
    });

    logger.info(`Stripe checkout session created: ${session.id} for tier ${tierId}`);

    res.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: unknown) {
    logger.error('Stripe checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// =============================================================================
// STRIPE WEBHOOK
// Handles Stripe events (payment success, subscription updates, etc.)
// Configure STRIPE_WEBHOOK_SECRET in .env
// =============================================================================
router.post('/billing/webhook', async (req: Request, res: Response) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return res.status(503).json({ error: 'Stripe webhooks not configured' });
  }

  try {
    // @ts-ignore — stripe is an optional dependency
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as any });

    const sig = req.headers['stripe-signature'] as string;
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const tierId = session.metadata?.tierId;
        const tenantId = session.metadata?.tenantId || session.client_reference_id;
        logger.info(`Payment succeeded for session ${session.id}, tier: ${tierId}, tenant: ${tenantId}`);

        if (tenantId && tierId) {
          const planMap: Record<string, string> = {
            foundation: 'FOUNDATION', enterprise: 'ENTERPRISE', strategic: 'STRATEGIC',
          };
          const dbPlan = planMap[tierId] || 'FOUNDATION';
          await prisma.tenants.update({
            where: { id: tenantId },
            data: {
              plan: dbPlan as any,
              status: 'ACTIVE' as any,
              trial_ends_at: null,
              updated_at: new Date(),
            },
          });
          logger.info(`Tenant ${tenantId} upgraded to ${dbPlan}`);

          // Send welcome email via notification service
          try {
            const tenant = await prisma.tenants.findUnique({ where: { id: tenantId } });
            if (tenant?.billing_email) {
              await notificationService.send({
                userId: tenantId,
                organizationId: tenantId,
                type: 'SYSTEM' as any,
                title: 'Welcome to Datacendia',
                message: `Your ${tierId} plan is now active. Thank you for your purchase.`,
                channels: ['EMAIL', 'IN_APP'],
                metadata: { tierId, sessionId: session.id },
              });
            }
          } catch (notifyErr) {
            logger.warn('Failed to send welcome notification:', notifyErr);
          }
        }
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const tenantId = subscription.metadata?.tenantId;
        logger.info(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);

        if (tenantId) {
          const statusMap: Record<string, string> = {
            active: 'ACTIVE', past_due: 'ACTIVE', trialing: 'TRIAL',
            canceled: 'CHURNED', unpaid: 'SUSPENDED', incomplete: 'PENDING',
          };
          const dbStatus = statusMap[subscription.status] || 'ACTIVE';
          await prisma.tenants.update({
            where: { id: tenantId },
            data: { status: dbStatus as any, updated_at: new Date() },
          });
          logger.info(`Tenant ${tenantId} status updated to ${dbStatus}`);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const tenantId = subscription.metadata?.tenantId;
        logger.info(`Subscription cancelled: ${subscription.id}`);

        if (tenantId) {
          await prisma.tenants.update({
            where: { id: tenantId },
            data: {
              plan: 'TRIAL' as any,
              status: 'CHURNED' as any,
              subscription_ends_at: new Date(),
              updated_at: new Date(),
            },
          });
          logger.info(`Tenant ${tenantId} downgraded to trial (churned)`);

          try {
            await notificationService.send({
              userId: tenantId,
              organizationId: tenantId,
              type: 'SYSTEM' as any,
              title: 'Subscription Cancelled',
              message: 'Your subscription has been cancelled. Your account has been downgraded.',
              channels: ['EMAIL', 'IN_APP'],
              metadata: { subscriptionId: subscription.id },
            });
          } catch (notifyErr) {
            logger.warn('Failed to send cancellation notification:', notifyErr);
          }
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const tenantId = invoice.metadata?.tenantId || invoice.subscription_details?.metadata?.tenantId;
        logger.warn(`Payment failed for invoice ${invoice.id}, tenant: ${tenantId}`);

        if (tenantId) {
          await prisma.tenants.update({
            where: { id: tenantId },
            data: { status: 'SUSPENDED' as any, updated_at: new Date() },
          });

          try {
            await notificationService.send({
              userId: tenantId,
              organizationId: tenantId,
              type: 'SYSTEM' as any,
              title: 'Payment Failed',
              message: 'Your latest payment has failed. Please update your payment method to avoid service interruption.',
              channels: ['EMAIL', 'IN_APP'],
              metadata: { invoiceId: invoice.id },
            });
          } catch (notifyErr) {
            logger.warn('Failed to send payment failure notification:', notifyErr);
          }
        }
        break;
      }
      default:
        logger.info(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: unknown) {
    logger.error('Stripe webhook error:', error);
    res.status(400).json({ error: `Webhook Error: ${error instanceof Error ? error.message : 'Unknown'}` });
  }
});

// =============================================================================
// BILLING PORTAL
// Redirect to Stripe Customer Portal for managing subscriptions
// =============================================================================
router.post('/billing/portal-session', async (req: Request, res: Response) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(503).json({ error: 'Stripe not configured' });
  }

  try {
    const { customerId } = bodySchema1.parse(req.body);
    if (!customerId) {
      return res.status(400).json({ error: 'Missing customerId' });
    }

    // @ts-ignore — stripe is an optional dependency
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' as any });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings/billing`,
    });

    res.json({ url: session.url });
  } catch (error: unknown) {
    logger.error('Stripe portal error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

export default router;
