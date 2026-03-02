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

const router = Router();

// =============================================================================
// STRIPE CHECKOUT SESSION
// Frontend calls this to create a Stripe Checkout session for plan upgrades
// =============================================================================
router.post('/billing/create-checkout-session', async (req: Request, res: Response) => {
  try {
    const { priceId, tierId, commitment, region, successUrl, cancelUrl } = req.body;

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
  } catch (error: any) {
    logger.error('Stripe checkout error:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
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
        logger.info(`Payment succeeded for session ${session.id}, tier: ${session.metadata?.tierId}`);
        // TODO: Activate license, update tenant plan, send welcome email
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        logger.info(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
        // TODO: Update tenant plan/status
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        logger.info(`Subscription cancelled: ${subscription.id}`);
        // TODO: Downgrade tenant to community
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        logger.warn(`Payment failed for invoice ${invoice.id}`);
        // TODO: Notify tenant, flag account
        break;
      }
      default:
        logger.info(`Unhandled Stripe event: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    logger.error('Stripe webhook error:', error);
    res.status(400).json({ error: `Webhook Error: ${error.message}` });
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
    const { customerId } = req.body;
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
  } catch (error: any) {
    logger.error('Stripe portal error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

export default router;
