import { prisma } from '../config/prisma';
import { Estimate } from '@prisma/client';

type EstimateInput = {
  title: string;
  description: string;
  laborCost: number;
  clientId: string;
  materialsTotal?: number; // opcional, viene del frontend
};

export const getAllEstimates = async (): Promise<Estimate[]> => {
  return prisma.estimate.findMany();
};

export const getEstimateById = async (id: string): Promise<Estimate | null> => {
  return prisma.estimate.findUnique({ where: { id } });
};

export const createEstimate = async (data: EstimateInput): Promise<Estimate> => {
  const { laborCost, clientId, description, title } = data;

  const materialsTotal = data.materialsTotal || 0;
  const totalCost = laborCost + materialsTotal;

  let status: 'initiated' | 'in progress' = 'initiated';
  if (laborCost > 0 && materialsTotal > 0 && clientId) {
    status = 'in progress';
  }

  return prisma.estimate.create({
    data: {
      laborCost,
      clientId,
      description,
      title,
      materialsTotal,
      totalCost,
      status
    }
  });
};

export const updateEstimate = async (id: string, data: Partial<Estimate>): Promise<Estimate> => {
  const estimate = await prisma.estimate.findUnique({ where: { id } });
  if (!estimate) throw new Error('Estimate not found');

  if (data.status === 'completed' && estimate.status !== 'in progress') {
    throw new Error('Estimate can only be completed from "in progress" status');
  }

  const laborCost = data.laborCost ?? estimate.laborCost;
  const materialsTotal = data.materialsTotal ?? estimate.materialsTotal;
  const totalCost = laborCost + materialsTotal;

  let status = estimate.status;
  if (laborCost > 0 && materialsTotal > 0 && estimate.clientId) {
    status = 'in progress';
  }

  return prisma.estimate.update({
    where: { id },
    data: {
      ...data,
      totalCost,
      status: data.status === 'completed' ? 'completed' : status,
    }
  });
};


export const deleteEstimate = async (id: string): Promise<Estimate> => {
  return prisma.estimate.delete({ where: { id } });
};
