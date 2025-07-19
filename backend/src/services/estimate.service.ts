import { prisma } from '../config/prisma';
import { Estimate } from '@prisma/client';

type EstimateInput = {
  title: string;
  description: string;
  laborCost: number;
  clientId: string;
  materialsTotal?: number;
};

export const getAllEstimates = async () => {
  return prisma.estimate.findMany({
    include: {
      client: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getEstimateById = async (id: string): Promise<Estimate | null> => {
  return prisma.estimate.findUnique({ where: { id } });
};

export const createEstimate = async (data: {
  title: string;
  description: string;
  laborCost: number;
  materialsTotal: number;
  totalCost: number;
  status: string;
  clientId: string;
}) => {
  return prisma.estimate.create({
    data: {
      title: data.title,
      description: data.description,
      laborCost: data.laborCost,
      materialsTotal: data.materialsTotal,
      totalCost: data.totalCost,
      status: data.status,
      clientId: data.clientId,
    },
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
