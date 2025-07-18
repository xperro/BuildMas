import { Request, Response } from 'express';
import * as estimateService from '../services/estimate.service';

export const getAll = async (_req: Request, res: Response) => {
  const estimates = await estimateService.getAllEstimates();
  res.json(estimates);
};

export const getById = async (req: Request, res: Response) => {
  const estimate = await estimateService.getEstimateById(req.params.id);
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' });
  res.json(estimate);
};

export const create = async (req: Request, res: Response) => {
  const data = req.body;
  const requiredFields = ['title', 'description', 'laborCost', 'clientId', 'status'];
  const hasAllFields = requiredFields.every((f) => data[f] !== undefined);

  if (!hasAllFields) return res.status(400).json({ error: 'Missing required fields' });

  const estimate = await estimateService.createEstimate(data);
  res.status(201).json(estimate);
};

export const update = async (req: Request, res: Response) => {
  try {
    const estimate = await estimateService.updateEstimate(req.params.id, req.body);
    res.json(estimate);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Estimate not found')) {
        return res.status(404).json({ error: error.message });
      }

      if (error.message.includes('Estimate can only be completed')) {
        return res.status(400).json({ error: error.message });
      }
    }

    console.error('Error updating estimate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const remove = async (req: Request, res: Response) => {
  await estimateService.deleteEstimate(req.params.id);
  res.status(204).send();
};
