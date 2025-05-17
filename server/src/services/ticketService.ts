import { Ticket, TicketType, PendingPurchase } from '../../models';
import type { TicketDoc } from '../../models/Ticket';
import { AttendeeInfo } from '../../../shared/types';
import crypto from 'crypto';

export async function createTickets(ticketTypeId: string, attendee: AttendeeInfo, quantity: number) {
  const ticketType = await TicketType.findById(ticketTypeId);
  if (!ticketType || ticketType.quantityAvailable < quantity) throw new Error('Not enough tickets available');
  ticketType.quantityAvailable -= quantity;
  await ticketType.save();
  const tickets: TicketDoc[] = [];
  for (let i = 0; i < quantity; i++) {
    const ticketNumber = crypto.randomBytes(8).toString('hex');
    tickets.push(await Ticket.create({
      ticketNumber,
      ticketType: ticketType._id,
      attendee,
      paymentStatus: 'paid',
    }));
  }
  return tickets;
} 