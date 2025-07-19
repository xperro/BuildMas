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

export const createEstimate = async (data: EstimateInput): Promise<Estimate> => {
  const { laborCost, clientId, description, title } = data;

  const materialsTotal = data.materialsTotal || 0;
  const totalCost = laborCost + materialsTotal;

  return prisma.estimate.create({
    data: {
      laborCost,
      description,
      title,
      materialsTotal,
      totalCost,
      status: 'initiated',
      client: {
        connect: { id: clientId },
      },
    },
    include: {
      client: true,
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
  if (laborCost > 0 && materialsTotal > 0 && (data.clientId ?? estimate.clientId)) {
    status = 'in progress';
  }

  const updateData: any = {
    title: data.title ?? estimate.title,
    description: data.description ?? estimate.description,
    laborCost,
    materialsTotal,
    totalCost,
    status: data.status === 'completed' ? 'completed' : status,
  };

  if (data.clientId) {
    updateData.client = {
      connect: { id: data.clientId },
    };
  }

  return prisma.estimate.update({
    where: { id },
    data: updateData,
  });
};



export const deleteEstimate = async (id: string): Promise<Estimate> => {
  return prisma.estimate.delete({ where: { id } });
};
