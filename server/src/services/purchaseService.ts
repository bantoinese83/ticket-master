import { PendingPurchase, TicketType } from '../../models';
import { AttendeeInfo } from '../../../shared/types';

export async function createPendingPurchase(reference: string, ticketTypeId: string, attendee: AttendeeInfo, quantity: number) {
  return PendingPurchase.create({
    reference,
    ticketType: ticketTypeId,
    attendee,
    quantity,
    status: 'pending',
  });
}

export async function completePendingPurchase(reference: string) {
  const pending = await PendingPurchase.findOne({ reference });
  if (!pending || pending.status !== 'pending') throw new Error('No pending purchase');
  pending.status = 'completed';
  await pending.save();
  return pending;
} 