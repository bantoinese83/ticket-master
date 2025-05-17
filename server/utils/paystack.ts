import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

if (!PAYSTACK_SECRET_KEY) {
  throw new Error('Paystack secret key not set in environment variables');
}

export async function initializeTransaction(email: string, amount: number, reference: string, callback_url: string) {
  const res = await axios.post(
    `${PAYSTACK_BASE_URL}/transaction/initialize`,
    {
      email,
      amount, // amount in kobo
      reference,
      callback_url,
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

export async function verifyTransaction(reference: string) {
  const res = await axios.get(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );
  return res.data;
} 