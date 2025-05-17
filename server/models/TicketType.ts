import { Schema, model, Document } from 'mongoose';
import { TicketType as TicketTypeShared } from '../../shared/types';

type TicketTypeDoc = Omit<TicketTypeShared, 'id'> & Document;

const TicketTypeSchema = new Schema<TicketTypeDoc>({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  quantityAvailable: { type: Number, required: true },
}, { timestamps: true });

export default model<TicketTypeDoc>('TicketType', TicketTypeSchema); 