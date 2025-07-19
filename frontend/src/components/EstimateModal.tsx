import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import type { Client } from '../services/clients';
import Materials, { type Material } from './Materials';
import './styles/estimatemodal.style.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    description: string;
    laborCost: number;
    clientId: string;
    materials: Material[];
    materialsTotal: number;
    totalCost: number;
  }) => Promise<{ id: string }>;
  clients: Client[];
  defaultClientId?: string;
};

const EstimateModal: React.FC<Props> = ({
  open,
  onClose,
  onCreate,
  clients,
  defaultClientId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [laborCost, setLaborCost] = useState('');
  const [clientId, setClientId] = useState('');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultClientId) setClientId(defaultClientId);
  }, [defaultClientId]);

  const handleAddMaterial = () => {
    setMaterials([...materials, { name: '', quantity: 0, unitPrice: 0 }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleUpdateMaterial = (index: number, field: keyof Material, value: string) => {
    const updated = [...materials];
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index][field] = parseFloat(value) || 0;
    } else {
      updated[index][field] = value;
    }
    setMaterials(updated);
  };

  const materialsTotal = materials.reduce(
    (sum, m) => sum + m.quantity * m.unitPrice,
    0
  );

  const totalCost = parseFloat(laborCost || '0') + materialsTotal;

  const isValid = (): boolean => {
    if (!title.trim() || !description.trim() || !clientId || !laborCost.trim()) {
      setError('All fields are required.');
      return false;
    }

    const hasValidMaterial = materials.some(
      (m) => m.name.trim() !== '' && m.quantity > 0 && m.unitPrice > 0
    );

    if (!hasValidMaterial) {
      setError('At least one material with name, quantity > 0 and unit price > 0 is required.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid()) return;

    try {
      const estimate = await onCreate({
        title: title.trim(),
        description: description.trim(),
        laborCost: parseFloat(laborCost),
        clientId,
        materials,
        materialsTotal,
        totalCost,
      });

      const raw = localStorage.getItem('estimate-materials');
      const existing = raw ? JSON.parse(raw) : {};
      existing[estimate.id] = materials;
      localStorage.setItem('estimate-materials', JSON.stringify(existing));

      setTitle('');
      setDescription('');
      setLaborCost('');
      setClientId('');
      setMaterials([]);
    } catch (err) {
      setError('Error creating estimate.');
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} className="construction-dialog" fullWidth maxWidth="sm">
      <DialogTitle>Create New Estimate</DialogTitle>
      <DialogContent className="row-modal">
        <TextField
          select
          label="Client"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          fullWidth
          margin="dense"
        >
          {clients.map((client) => (
            <MenuItem key={client.id} value={client.id}>
              {client.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="dense"
        />
        <TextField
          label="Labor Cost"
          value={laborCost}
          onChange={(e) => setLaborCost(e.target.value)}
          type="number"
          fullWidth
          margin="dense"
        />

        <Materials
          materials={materials}
          onAdd={handleAddMaterial}
          onRemove={handleRemoveMaterial}
          onUpdate={handleUpdateMaterial}
        />

        <Box mt={2}>
          <Typography variant="body1">
            <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
          </Typography>
        </Box>

        {error && (
          <Box mt={1}>
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EstimateModal;
