import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

export const PRICE_IDS = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
  yearly: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly',
};

