import React, { useEffect, useState } from "react";
import { Typography, Button, Box, CircularProgress } from "@mui/material";
import {
  fetchClients,
  createClient,
  deleteClient,
  updateClient,
} from "../services/clients";
import type { Client } from "../services/clients";
import DataTable, { type Column } from "../components/DataTable";
import { useNavigate } from "react-router-dom";
import ClientModal from "../components/ClientModal";
import "./styles/client.style.css";

const MOCKED_USER_ID = "user-1234";

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const navigate = useNavigate();

  const loadClients = () => {
    setLoading(true);
    fetchClients()
      .then(setClients)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleCreateClient = async (name: string) => {
    try {
      await createClient({ name, userId: MOCKED_USER_ID });
      setModalOpen(false);
      loadClients();
    } catch (err) {
      console.error("Error creating client:", err);
    }
  };

  const handleUpdateClient = async (name: string) => {
    if (!editingClient) return;
    try {
      await updateClient(editingClient.id, { name });
      setModalOpen(false);
      setEditingClient(null);
      loadClients();
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  const columns: Column<Client>[] = [
    { header: "Name", accessor: "name" },
    {
      header: "Actions",
      accessor: "id",
      render: (client) => (
        <Box display="flex" gap={1}>
          <Button
            className="action-estimate-button"
            onClick={() => navigate(`/estimates?clientId=${client.id}`)}
          >
            {client.estimates.length > 0 ? "View Estimates" : "New Estimate"}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setEditingClient(client);
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            className="delete-client-button"
            onClick={async () => {
              if (
                confirm(
                  `Delete client "${client.name}" and all associated estimates?`
                )
              ) {
                try {
                  await deleteClient(client.id);
                  loadClients();
                } catch (err) {
                  console.error("Error deleting client:", err);
                }
              }
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
      <ClientModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingClient(null);
        }}
        onCreate={handleCreateClient}
        onUpdate={handleUpdateClient}
        editing={editingClient}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Clients</Typography>
        <Button
          className="new-client-button"
          onClick={() => {
            setEditingClient(null);
            setModalOpen(true);
          }}
        >
          New Client
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable<Client> columns={columns} rows={clients} />
      )}
    </Box>
  );
};

export default ClientsPage;
