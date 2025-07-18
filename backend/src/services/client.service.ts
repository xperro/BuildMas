import { prisma } from '../config/prisma';
import { Client } from '@prisma/client';

export const getAllClients = async (): Promise<Client[]> => {
  return prisma.client.findMany();
};

export const getClientById = async (id: string): Promise<Client | null> => {
  return prisma.client.findUnique({ where: { id } });
};

export const createClient = async (name: string, userId: string): Promise<Client> => {
  return prisma.client.create({
    data: { name, userId }
  });
};

export const updateClient = async (id: string, name: string): Promise<Client> => {
  return prisma.client.update({
    where: { id },
    data: { name }
  });
};

export const deleteClient = async (id: string): Promise<Client> => {
  return prisma.client.delete({ where: { id } });
};
