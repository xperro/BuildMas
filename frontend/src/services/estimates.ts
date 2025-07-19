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

export const createEstimate = async (data: {
  title: string;
  description: string;
  laborCost: number;
  clientId: string;
  materialsTotal: number;
  totalCost: number;
}): Promise<Estimate> => {
  const payload = {
    ...data,
    status: "initiated",
  };

  const res = await api.post("/estimates", payload);
  return res.data;
};

export const updateEstimate = async (
  id: string,
  data: Partial<Pick<Estimate, "status" | "materialsTotal" | "totalCost">>
): Promise<Estimate> => {
  const res = await api.put(`/estimates/${id}`, data);
  return res.data;
};

export const deleteEstimate = async (id: string): Promise<void> => {
  await api.delete(`/estimates/${id}`);
};