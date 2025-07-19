import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import type { Client } from "../services/clients";
import "./styles/usermodal.style.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  onUpdate?: (name: string) => void;
  editing?: Client | null;
};

const UserModal: React.FC<Props> = ({
  open,
  onClose,
  onCreate,
  onUpdate,
  editing,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
    } else {
      setName("");
    }
  }, [editing]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editing && onUpdate) {
      onUpdate(name.trim());
    } else {
      onCreate(name.trim());
    }

    setName("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="construction-dialog"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{editing ? "Edit Client" : "Create New Client"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Client Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {editing ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
