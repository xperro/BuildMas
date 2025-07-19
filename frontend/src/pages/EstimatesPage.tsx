import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import {
  fetchEstimates,
  createEstimate,
  updateEstimate,
  type Estimate,
  deleteEstimate,
} from "../services/estimates";
import { fetchClients, type Client } from "../services/clients";

import DataTable, { type Column } from "../components/DataTable";
import EstimateModal from "../components/EstimateModal";
import "./styles/estimates.style.css";
import type { Material } from "../components/Materials";

const isReadyForInProgress = (estimate: Estimate): boolean => {
  return (
    !!estimate.clientId && estimate.laborCost > 0 && estimate.materialsTotal > 0
  );
};

const EstimatesPage = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const defaultClientId = query.get("clientId") ?? undefined;
  const [editingEstimate, setEditingEstimate] = useState<Estimate | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [estimateToComplete, setEstimateToComplete] = useState<Estimate | null>(
    null
  );
  const [estimateToDelete, setEstimateToDelete] = useState<Estimate | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchEstimates()
      .then(setEstimates)
      .catch(console.error)
      .finally(() => setLoading(false));

    fetchClients().then(setClients).catch(console.error);
  }, []);

  useEffect(() => {
    if (defaultClientId) {
      setModalOpen(true);
    }
  }, [defaultClientId]);

  const handleDelete = async () => {
    if (!estimateToDelete) return;
    try {
      await deleteEstimate(estimateToDelete.id);
      setEstimates((prev) => prev.filter((e) => e.id !== estimateToDelete.id));
      setDeleteDialogOpen(false);
      setEstimateToDelete(null);
    } catch (err) {
      alert("Error deleting estimate");
      console.error(err);
    }
  };

  const handleCreate = async (data: {
    title: string;
    description: string;
    laborCost: number;
    clientId: string;
    materials: Material[];
    materialsTotal: number;
    totalCost: number;
  }): Promise<{ id: string }> => {
    try {
      const newEstimate = await createEstimate(data);
      const client = clients.find((c) => c.id === newEstimate.clientId);

      setEstimates((prev) => [
        ...prev,
        {
          ...newEstimate,
          client: client!,
        } as Estimate,
      ]);

      const stored = localStorage.getItem("estimate-materials");
      const allMaterials = stored ? JSON.parse(stored) : {};
      allMaterials[newEstimate.id] = data.materials;
      localStorage.setItem("estimate-materials", JSON.stringify(allMaterials));

      setModalOpen(false);
      navigate("/estimates");

      return { id: newEstimate.id };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdate = async (
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
  ): Promise<void> => {
    try {
      const updated = await updateEstimate(id, data);

      setEstimates((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                ...updated,
                client: clients.find((c) => c.id === updated.clientId)!,
              }
            : e
        )
      );

      setModalOpen(false);
      setEditingEstimate(null);
      navigate("/estimates");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleStatusUpdate = async (
    id: string,
    newStatus: "in progress" | "completed"
  ) => {
    if (newStatus === "completed") {
      const estimate = estimates.find((e) => e.id === id);
      if (estimate) {
        setEstimateToComplete(estimate);
        setConfirmDialogOpen(true);
      }
      return;
    }

    try {
      const updated = await updateEstimate(id, { status: newStatus });
      setEstimates((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: updated.status } : e))
      );
    } catch (err) {
      alert("Error updating status");
      console.error(err);
    }
  };

  const columns: Column<Estimate>[] = [
    { header: "Title", accessor: "title" },
    {
      header: "Client Name",
      accessor: "client",
      render: (row) => row.client?.name ?? "—",
    },
    { header: "Labor Cost", accessor: "laborCost" },
    { header: "Materials Total", accessor: "materialsTotal" },
    { header: "Total Cost", accessor: "totalCost" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const colorMap: Record<string, string> = {
          initiated: "#FFD700",
          "in progress": "#FFA500",
          completed: "#4CAF50",
        };
        return (
          <span
            style={{
              backgroundColor: colorMap[row.status] || "#ddd",
              color: "#000",
              padding: "4px 8px",
              borderRadius: "6px",
              fontWeight: 500,
              textTransform: "capitalize",
              fontSize: "0.85rem",
            }}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <Box display="flex" flexDirection="column" gap={1}>
          {(row.status === "initiated" || row.status === "in progress") && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setEditingEstimate(row);
                setModalOpen(true);
              }}
            >
              Edit
            </Button>
          )}

          {row.status === "initiated" && isReadyForInProgress(row) && (
            <Button
              size="small"
              color="warning"
              variant="outlined"
              onClick={() => handleStatusUpdate(row.id, "in progress")}
            >
              Set In Progress
            </Button>
          )}

          {row.status === "in progress" && (
            <Button
              size="small"
              color="success"
              variant="outlined"
              onClick={() => handleStatusUpdate(row.id, "completed")}
            >
              Set Completed
            </Button>
          )}

          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => {
              setEstimateToDelete(row);
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Estimates</Typography>
        <Button
          className="new-estimate-button"
          onClick={() => setModalOpen(true)}
        >
          New Estimate
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable<Estimate> columns={columns} rows={estimates} />
      )}

      <EstimateModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEstimate(null);
          navigate("/estimates");
        }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        clients={clients}
        defaultClientId={defaultClientId}
        editing={editingEstimate}
      />
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Completion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark the estimate{" "}
            <strong>{estimateToComplete?.title}</strong> as{" "}
            <strong>completed</strong>? This action cannot be undone or modified
            later.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!estimateToComplete) return;
              try {
                const updated = await updateEstimate(estimateToComplete.id, {
                  status: "completed",
                });
                setEstimates((prev) =>
                  prev.map((e) =>
                    e.id === estimateToComplete.id
                      ? { ...e, status: updated.status }
                      : e
                  )
                );
                setConfirmDialogOpen(false);
                setEstimateToComplete(null);
              } catch (err) {
                alert("Error updating status");
                console.error(err);
              }
            }}
            color="warning"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Estimate</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete estimate{" "}
            <strong>{estimateToDelete?.title}</strong>? This action is
            irreversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EstimatesPage;
