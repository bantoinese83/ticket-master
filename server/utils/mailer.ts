import nodemailer from 'nodemailer';
import { Ticket } from '../../shared/types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTicketReceipt(to: string, name: string, tickets: Ticket[]) {
  const ticketList = tickets.map(ticket => `Ticket Number: <b>${ticket.ticketNumber}</b><br/>Ticket Type: ${ticket.ticketType.name}<br/>`).join('<br/>');
  const html = `
    <h2>Thank you for your purchase, ${name}!</h2>
    <p>Here are your ticket details for the event:</p>
    ${ticketList}
    <p>Please present this email at the event for verification.</p>
  `;
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'Your Event Ticket Receipt',
    html,
  });
} 