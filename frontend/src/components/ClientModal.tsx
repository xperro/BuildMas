import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import "./styles/usermodal.style.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
};

const UserModal: React.FC<Props> = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
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
      <DialogTitle>Create New Client</DialogTitle>
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
