import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { fetchClients } from '../services/clients';
import type { Client } from '../services/clients';

import DataTable, { type Column } from '../components/DataTable';
import { useNavigate } from 'react-router-dom';

const ClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns: Column<Client>[] = [
    { header: 'Name', accessor: 'name' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (client) => (
        <Button
          variant="outlined"
          color={client.estimates.length > 0 ? 'primary' : 'success'}
          onClick={() =>
            navigate(
              client.estimates.length > 0
                ? `/estimates?clientId=${client.id}`
                : `/estimates/new?clientId=${client.id}`
            )
          }
        >
          {client.estimates.length > 0 ? 'View Estimates' : 'New Estimate'}
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchClients()
      .then(setClients)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Clients</Typography>
        <Button variant="contained" color="primary">
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
