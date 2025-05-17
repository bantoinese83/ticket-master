// Ticket type (e.g., Regular, VIP)
export interface TicketType {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantityAvailable: number;
}

// Attendee information
export interface AttendeeInfo {
  fullName: string;
  email: string;
  phone?: string;
}

// Ticket purchase request
export interface PurchaseRequest {
  ticketTypeId: string;
  attendee: AttendeeInfo;
  quantity: number;
}

// Ticket entity
export interface Ticket {
  id: string;
  ticketNumber: string;
  ticketType: TicketType;
  attendee: AttendeeInfo;
  purchaseDate: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

// Purchase response (after payment)
export interface PurchaseResponse {
  success: boolean;
  message: string;
  ticket?: Ticket;
  paymentUrl?: string; // For Paystack redirect
} 