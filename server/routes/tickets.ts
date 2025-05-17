import express from 'express';
import { Ticket, TicketType, PendingPurchase } from '../models';
import { PurchaseRequest } from '../../shared/types';
import { initializeTransaction, verifyTransaction } from '../utils/paystack';
import crypto from 'crypto';
import { sendTicketReceipt } from '../utils/mailer';
import { createTickets } from '../src/services/ticketService';
import { createPendingPurchase, completePendingPurchase } from '../src/services/purchaseService';
import { validatePurchase } from '../src/middlewares/validate';
import { logger } from '../src/utils/logger';

const router = express.Router();

// POST /api/tickets/purchase - Purchase a ticket (with Paystack integration)
router.post('/purchase', validatePurchase, async (req, res, next) => {
  const { ticketTypeId, attendee, quantity } = req.body;
  try {
    // Check ticket type exists and enough quantity
    const ticketType = await TicketType.findById(ticketTypeId);
    if (!ticketType) {
      res.status(404).json({ error: 'Ticket type not found' });
      return;
    }
    if (ticketType.quantityAvailable < quantity) {
      res.status(400).json({ error: 'Not enough tickets available' });
      return;
    }

    // Generate unique reference
    const reference = crypto.randomBytes(16).toString('hex');
    // Calculate total amount in kobo (Paystack expects NGN kobo)
    const amount = ticketType.price * quantity * 100;
    // Set callback URL (should be your frontend success page or a backend endpoint)
    const callback_url = process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/payment-success';

    // Create a pending purchase
    await createPendingPurchase(reference, ticketTypeId, attendee, quantity);

    // Initialize Paystack transaction
    const paystackRes = await initializeTransaction(attendee.email, amount, reference, callback_url);
    if (!paystackRes.status) {
      res.status(400).json({ error: 'Failed to initialize payment' });
      return;
    }
    logger.info(`Purchase initiated for ${attendee.email}, ref: ${reference}`);
    res.json({ success: true, message: 'Payment initialized', paymentUrl: paystackRes.data.authorization_url, reference });
  } catch (err) {
    logger.error('Purchase error:', err);
    next(err);
  }
});

// GET /api/tickets - List all tickets (admin)
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('ticketType');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// POST /api/tickets/paystack-webhook - Paystack webhook handler
router.post('/paystack-webhook', async (req, res, next) => {
  const event = req.body;

  if (event.event === 'charge.success') {
    const reference = event.data.reference;
    try {
      // Double-check with Paystack API
      const verifyRes = await verifyTransaction(reference);
      if (!verifyRes.status || verifyRes.data.status !== 'success') {
        res.status(400).json({ error: 'Payment not verified' });
        return;
      }
      // Complete pending purchase
      const pending = await completePendingPurchase(reference);
      // Create tickets (convert ObjectId to string)
      const tickets = await createTickets(pending.ticketType.toString(), pending.attendee, pending.quantity);
      // Populate ticketType for email
      const populatedTickets = await Ticket.find({
        ticketNumber: { $in: tickets.map(t => t.ticketNumber) }
      }).populate('ticketType');
      // Send email receipt
      try {
        await sendTicketReceipt(pending.attendee.email, pending.attendee.fullName, populatedTickets as any);
      } catch (emailErr) {
        // Log but don't fail webhook
        console.error('Failed to send ticket email:', emailErr);
      }
      logger.info(`Payment confirmed for ${pending.attendee.email}, ref: ${reference}`);
      res.sendStatus(200);
    } catch (err) {
      logger.error('Webhook error:', err);
      next(err);
    }
  } else {
    res.sendStatus(200);
  }
});

export default router; 