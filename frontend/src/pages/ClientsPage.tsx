import React, { useEffect, useState } from "react";
import { Typography, Button, Box, CircularProgress } from "@mui/material";
import { fetchClients, createClient } from "../services/clients";
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
  const navigate = useNavigate();

  const columns: Column<Client>[] = [
    { header: "Name", accessor: "name" },
    {
      header: "Actions",
      accessor: "id",
      render: (client) => (
        <Button
          className="action-estimate-button"
          onClick={() => navigate(`/estimates?clientId=${client.id}`)}
        >
          {client.estimates.length > 0 ? "View Estimates" : "New Estimate"}
        </Button>
      ),
    },
  ];

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

  return (
    <Box>
      <ClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateClient}
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
          onClick={() => setModalOpen(true)}
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
