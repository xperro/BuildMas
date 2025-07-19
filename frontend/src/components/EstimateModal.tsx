import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import type { Client } from "../services/clients";
import Materials, { type Material } from "./Materials";
import type { Estimate } from "../services/estimates";
import "./styles/estimatemodal.style.css";

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
  editing?: Estimate | null;
  onUpdate?: (
    id: string,
    data: {
      title: string;
      description: string;
      laborCost: number;
      clientId: string;
      materials: Material[];
      materialsTotal: number;
      totalCost: number;
    }
  ) => Promise<void>;
};

const EstimateModal: React.FC<Props> = ({
  open,
  onClose,
  onCreate,
  onUpdate,
  clients,
  defaultClientId,
  editing,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [laborCost, setLaborCost] = useState("");
  const [clientId, setClientId] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setError(null);
      return;
    }

    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description);
      setLaborCost(editing.laborCost.toString());
      setClientId(editing.clientId);

      const raw = localStorage.getItem("estimate-materials");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed[editing.id]) {
          setMaterials(parsed[editing.id]);
        } else {
          setMaterials([]);
        }
      } else {
        setMaterials([]);
      }
    } else {
      setTitle("");
      setDescription("");
      setLaborCost("");
      setClientId(defaultClientId ?? "");
      setMaterials([]);
    }

    setError(null);
  }, [editing, defaultClientId, open]);

  const handleAddMaterial = () => {
    setMaterials([...materials, { name: "", quantity: 0, unitPrice: 0 }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleUpdateMaterial = (
    index: number,
    field: keyof Material,
    value: string
  ) => {
    const updated = [...materials];
    if (field === "quantity" || field === "unitPrice") {
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

  const totalCost = parseFloat(laborCost || "0") + materialsTotal;

  const isValid = (): boolean => {
    const parsedLabor = parseFloat(laborCost);
    if (
      !title.trim() ||
      !description.trim() ||
      !clientId ||
      !laborCost.trim()
    ) {
      setError("All fields are required.");
      return false;
    }

    if (isNaN(parsedLabor) || parsedLabor <= 0) {
      setError("Labor cost must be greater than zero.");
      return false;
    }

    const hasValidMaterial = materials.some(
      (m) => m.name.trim() !== "" && m.quantity > 0 && m.unitPrice > 0
    );

    if (!hasValidMaterial) {
      setError(
        "Each material must have a name, quantity > 0 and unit price > 0."
      );
      return false;
    }

    for (const material of materials) {
      if (
        material.name.trim() !== "" &&
        (material.quantity <= 0 || material.unitPrice <= 0)
      ) {
        setError(
          `Material "${material.name}" must have quantity and unit price greater than zero.`
        );
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid()) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      laborCost: parseFloat(laborCost),
      clientId,
      materials,
      materialsTotal,
      totalCost,
    };

    try {
      if (editing && onUpdate) {
        await onUpdate(editing.id, payload);

        const raw = localStorage.getItem("estimate-materials");
        const existing = raw ? JSON.parse(raw) : {};
        existing[editing.id] = materials;
        localStorage.setItem("estimate-materials", JSON.stringify(existing));
      } else {
        const estimate = await onCreate(payload);
        const raw = localStorage.getItem("estimate-materials");
        const existing = raw ? JSON.parse(raw) : {};
        existing[estimate.id] = materials;
        localStorage.setItem("estimate-materials", JSON.stringify(existing));
      }

      onClose();
    } catch (err) {
      setError("Error saving estimate.");
      console.error(err);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="construction-dialog"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {editing ? "Edit Estimate" : "Create New Estimate"}
      </DialogTitle>
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
          slotProps={{
            input: {
              inputProps: {
                min: 1,
              },
            },
          }}
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
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {editing ? "Save Changes" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EstimateModal;
