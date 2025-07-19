import api from './api';

export type Estimate = {
  id: string;
  title: string;
  description: string;
  laborCost: number;
  materialsTotal: number;
  totalCost: number;
  status: 'initiated' | 'in progress' | 'completed';
  clientId: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
  };
};

export const fetchEstimates = async (): Promise<Estimate[]> => {
  const res = await api.get<Estimate[]>('/estimates');
  return res.data;
};
