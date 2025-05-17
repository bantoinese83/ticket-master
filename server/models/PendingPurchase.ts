import { Schema, model, Document, Types } from 'mongoose';
import { AttendeeInfo } from '../../shared/types';

interface PendingPurchaseDoc extends Document {
  reference: string;
  ticketType: Types.ObjectId;
  attendee: AttendeeInfo;
  quantity: number;
  status: 'pending' | 'completed' | 'failed';
}

const PendingPurchaseSchema = new Schema<PendingPurchaseDoc>({
  reference: { type: String, required: true, unique: true },
  ticketType: { type: Schema.Types.ObjectId, ref: 'TicketType', required: true },
  attendee: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
  },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

export default model<PendingPurchaseDoc>('PendingPurchase', PendingPurchaseSchema); 