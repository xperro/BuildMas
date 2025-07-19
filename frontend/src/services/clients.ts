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

export const fetchEstimates = async (): Promise<Estimate[]> => {
  const res = await api.get<Estimate[]>('/estimates');
  return res.data;
};