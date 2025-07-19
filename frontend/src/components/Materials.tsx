import React from "react";
import { Box, TextField, Typography, Button, IconButton } from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import "./styles/materials.style.css";

export type Material = {
  name: string;
  quantity: number;
  unitPrice: number;
};

type Props = {
  materials: Material[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof Material, value: string) => void;
};

const Materials: React.FC<Props> = ({
  materials,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  const materialsTotal = materials.reduce(
    (sum, m) => sum + m.quantity * m.unitPrice,
    0
  );

  return (
    <Box mt={2}>
      <Typography variant="h6" gutterBottom>
        Materials
      </Typography>

      {materials.map((material, index) => (
        <Box key={index} className="material-row">
          <TextField
            label="Name"
            value={material.name}
            onChange={(e) => onUpdate(index, "name", e.target.value)}
            margin="dense"
            fullWidth
            className="material-input"
          />

          <Box className="material-inline-row">
            <TextField
              label="Qty"
              type="number"
              value={material.quantity}
              onChange={(e) => onUpdate(index, "quantity", e.target.value)}
              margin="dense"
              className="material-number"
              slotProps={{
                input: {
                  inputProps: {
                    min: 1,
                  },
                },
              }}
            />

            <TextField
              label="Unit $"
              type="number"
              value={material.unitPrice}
              onChange={(e) => onUpdate(index, "unitPrice", e.target.value)}
              margin="dense"
              className="material-number"
              slotProps={{
                input: {
                  inputProps: {
                    min: 1,
                  },
                },
              }}
            />

            <Typography className="material-total">
              ${(material.quantity * material.unitPrice).toFixed(2)}
            </Typography>

            <IconButton onClick={() => onRemove(index)} color="error">
              <Delete />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Button
        startIcon={<AddCircleOutline />}
        onClick={onAdd}
        className="add-material-button"
      >
        Add Material
      </Button>

      <Box mt={2}>
        <Typography variant="body1">
          <strong>Materials Total:</strong> ${materialsTotal.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default Materials;
