import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import { fetchEstimates } from '../services/estimates';
import type { Estimate } from '../services/estimates';
import DataTable, { type Column } from '../components/DataTable';
import { useNavigate } from 'react-router-dom';

const EstimatesPage = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns: Column<Estimate>[] = [
    { header: 'Title', accessor: 'title' },
    { header: 'Client ID', accessor: 'clientId' },
    {
      header: 'Client Name',
      accessor: 'client',
      render: (row) => row.client?.name ?? '—',
    },
    { header: 'Labor Cost', accessor: 'laborCost' },
    { header: 'Materials Total', accessor: 'materialsTotal' },
    { header: 'Total Cost', accessor: 'totalCost' },
    { header: 'Status', accessor: 'status' },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => navigate(`/estimates/${row.id}`)}
        >
          Show
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchEstimates()
      .then(setEstimates)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Estimates</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/estimates/new')}
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
    </Box>
  );
};

export default EstimatesPage;
