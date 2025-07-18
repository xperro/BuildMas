import { Request, Response } from 'express';
import * as clientService from '../services/client.service';

export const getAll = async (_req: Request, res: Response) => {
  const clients = await clientService.getAllClients();
  res.json(clients);
};

export const getById = async (req: Request, res: Response) => {
  const client = await clientService.getClientById(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json(client);
};

export const create = async (req: Request, res: Response) => {
  const { name, userId } = req.body;
  if (!name || !userId) return res.status(400).json({ error: 'Missing fields' });

  const client = await clientService.createClient(name, userId);
  res.status(201).json(client);
};

export const update = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing name' });

  const client = await clientService.updateClient(req.params.id, name);
  res.json(client);
};

export const remove = async (req: Request, res: Response) => {
  await clientService.deleteClient(req.params.id);
  res.status(204).send();
};

export const partialUpdate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
console.log('PATCH hit:', req.params.id, req.body);

  try {
    const updated = await clientService.partialUpdateClient(id, data);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error updating client' });
  }
};