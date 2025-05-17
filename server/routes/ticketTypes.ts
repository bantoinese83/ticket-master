import express from 'express';
import { TicketType } from '../models';
import { validateTicketType } from '../src/middlewares/validate';
import { logger } from '../src/utils/logger';

const router = express.Router();

// GET /api/ticket-types - List all ticket types
router.get('/', async (req, res) => {
  try {
    const ticketTypes = await TicketType.find();
    res.json(ticketTypes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ticket types' });
  }
});

// POST /api/ticket-types - Create a new ticket type (admin)
router.post('/', validateTicketType, async (req, res, next) => {
  try {
    const { name, description, price, currency, quantityAvailable } = req.body;
    const ticketType = new TicketType({ name, description, price, currency, quantityAvailable });
    await ticketType.save();
    logger.info(`Ticket type created: ${name}`);
    res.status(201).json(ticketType);
  } catch (err) {
    logger.error('Ticket type creation error:', err);
    next(err);
  }
});

export default router; 