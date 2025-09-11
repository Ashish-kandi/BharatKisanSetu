import React, { useState, useMemo } from 'react';
import {
  Box, Typography, TextField, Chip, Paper, Grid, Card, CardContent, Dialog,
  DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';

const orderStatusColors = {
  Pending: 'warning',
  Accepted: 'primary',
  Dispatched: 'info',
  Delivered: 'success',
  Cancelled: 'error',
};

const demoOrders = [
  {
    id: 'ORD1001',
    product: 'Tomato',
    qty: 20,
    buyerName: 'Sita Devi',
    status: 'Pending',
    date: '2025-06-21',
    address: 'Hyderabad, Telangana',
    total: 400
  },
  {
    id: 'ORD1002',
    product: 'Potato',
    qty: 10,
    buyerName: 'Raju Kumar',
    status: 'Delivered',
    date: '2025-06-20',
    address: 'Secunderabad, Telangana',
    total: 250
  },
  {
    id: 'ORD1003',
    product: 'Brinjal',
    qty: 15,
    buyerName: 'Anil Singh',
    status: 'Dispatched',
    date: '2025-06-19',
    address: 'Warangal, Telangana',
    total: 375
  },
  {
    id: 'ORD1004',
    product: 'Chilli',
    qty: 5,
    buyerName: 'Sunita Rao',
    status: 'Cancelled',
    date: '2025-06-18',
    address: 'Nalgonda, Telangana',
    total: 100
  },
  {
    id: 'ORD1005',
    product: 'Onion',
    qty: 30,
    buyerName: 'Manoj Yadav',
    status: 'Accepted',
    date: '2025-06-22',
    address: 'Karimnagar, Telangana',
    total: 600
  },
];

function getOrderSummary(orders) {
  const summary = {
    total: orders.length,
    pending: 0,
    accepted: 0,
    dispatched: 0,
    delivered: 0,
    cancelled: 0
  };
  orders.forEach(order => {
    switch (order.status) {
      case 'Pending': summary.pending++; break;
      case 'Accepted': summary.accepted++; break;
      case 'Dispatched': summary.dispatched++; break;
      case 'Delivered': summary.delivered++; break;
      case 'Cancelled': summary.cancelled++; break;
      default: break;
    }
  });
  return summary;
}

function Orders() {
  const [orders] = useState(() => demoOrders);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    return orders.filter(order =>
      order.product.toLowerCase().includes(search.toLowerCase()) ||
      order.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  const summary = useMemo(() => getOrderSummary(orders), [orders]);

  const columns = [
    { field: 'id', headerName: 'Order ID', flex: 1, minWidth: 110 },
    { field: 'product', headerName: 'Product', flex: 1, minWidth: 120 },
    { field: 'qty', headerName: 'Qty', flex: 0.5, minWidth: 60, type: 'number' },
    { field: 'buyerName', headerName: 'Buyer', flex: 1, minWidth: 120 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={orderStatusColors[params.value] || 'default'}
          variant="outlined"
          sx={{ fontWeight: 600, fontSize: '1em' }}
        />
      ),
    },
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 100 },
    {
      field: 'details',
      headerName: 'Details',
      flex: 0.7,
      minWidth: 80,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<InfoIcon />}
          onClick={() => setSelectedOrder(params.row)}
        >
          View
        </Button>
      ),
    }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f6fbf9'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 1050, borderRadius: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom align="center">
          Orders
        </Typography>
        {/* Order Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={2.4}>
            <Card sx={{ bgcolor: '#e0ffe4', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Total</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Card sx={{ bgcolor: '#fffbe6', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Pending</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.pending}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Card sx={{ bgcolor: '#e3f2fd', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Accepted</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.accepted}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Card sx={{ bgcolor: '#e0f7fa', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Dispatched</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.dispatched}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Delivered</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.delivered}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={2.4}>
            <Card sx={{ bgcolor: '#ffebee', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">Cancelled</Typography>
                <Typography variant="h5" fontWeight={700}>{summary.cancelled}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Search Bar */}
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <TextField
            size="small"
            placeholder="Search orders..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.500' }} />
            }}
            sx={{ width: 280 }}
          />
        </Box>
        {/* Data Table */}
        <Box sx={{ height: 430, width: '100%' }}>
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableSelectionOnClick
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: 2,
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#e0ffe4', fontWeight: 700, fontSize: '1.07em' },
              '& .MuiDataGrid-row:hover': { bgcolor: '#f1f8e9' },
            }}
          />
        </Box>
      </Paper>
      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box>
              <Typography><b>Order ID:</b> {selectedOrder.id}</Typography>
              <Typography><b>Product:</b> {selectedOrder.product}</Typography>
              <Typography><b>Quantity:</b> {selectedOrder.qty}</Typography>
              <Typography><b>Buyer:</b> {selectedOrder.buyerName}</Typography>
              <Typography><b>Address:</b> {selectedOrder.address}</Typography>
              <Typography><b>Date:</b> {selectedOrder.date}</Typography>
              <Typography><b>Status:</b> <Chip label={selectedOrder.status} color={orderStatusColors[selectedOrder.status] || 'default'} /></Typography>
              <Typography><b>Total Amount:</b> ₹{selectedOrder.total}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrder(null)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders;
