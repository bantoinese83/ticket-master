import axios from 'axios';
import { API_BASE_URL } from '../../../shared/constants';
import { TicketType, PurchaseRequest } from '../../../shared/types';

export const fetchTicketTypes = () => axios.get<TicketType[]>(`${API_BASE_URL}/ticket-types`);
export const purchaseTicket = (data: PurchaseRequest) => axios.post(`${API_BASE_URL}/tickets/purchase`, data); 