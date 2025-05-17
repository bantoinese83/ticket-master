import { z } from 'zod';

export const purchaseSchema = z.object({
  ticketTypeId: z.string().min(1, 'Ticket type is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  attendee: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional(),
  }),
});

export const ticketTypeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().min(2, 'Currency is required'),
  quantityAvailable: z.number().int().min(1, 'Quantity must be at least 1'),
  description: z.string().optional(),
}); 