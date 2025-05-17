import { Schema, model, Document, Types } from 'mongoose';
import { Ticket as TicketShared, AttendeeInfo } from '../../shared/types';

export interface TicketDoc extends Omit<TicketShared, 'id' | 'ticketType'>, Document {
  ticketType: Types.ObjectId;
  attendee: AttendeeInfo;
}

const TicketSchema = new Schema({
  ticketNumber: { type: String, required: true, unique: true },
  ticketType: { type: Schema.Types.ObjectId, ref: 'TicketType', required: true },
  attendee: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  purchaseDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
}, { timestamps: true });

export default model<TicketDoc>('Ticket', TicketSchema); 