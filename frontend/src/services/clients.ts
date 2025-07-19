import api from './api';
import type { Estimate } from './estimates';

export type Client = {
  id: string;
  name: string;
  estimates: { id: string }[];
};

export const fetchClients = async (): Promise<Client[]> => {
  const res = await api.get<Client[]>('/clients');
  return res.data;
};

export const createClient = async (data: { name: string; userId: string }): Promise<Client> => {
  const res = await api.post<Client>('/clients', data);
  return res.data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await api.delete(`/clients/${id}`);
};

export const updateClient = async (id: string, data: Partial<Client>): Promise<Client> => {
  const res = await api.patch<Client>(`/clients/${id}`, data);
  return res.data;
};