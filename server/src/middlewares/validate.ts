import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const purchaseSchema = z.object({
  ticketTypeId: z.string().min(1),
  quantity: z.number().int().min(1),
  attendee: z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
  }),
});

export const ticketTypeSchema = z.object({
  name: z.string().min(2),
  price: z.number().min(0),
  currency: z.string().min(2),
  quantityAvailable: z.number().int().min(1),
  description: z.string().optional(),
});

export function validatePurchase(req: Request, res: Response, next: NextFunction) {
  try {
    req.body = purchaseSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ error: err.errors || 'Invalid request' });
  }
}

export function validateTicketType(req: Request, res: Response, next: NextFunction) {
  try {
    req.body = ticketTypeSchema.parse(req.body);
    next();
  } catch (err: any) {
    res.status(400).json({ error: err.errors || 'Invalid ticket type' });
  }
} 