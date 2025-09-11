import React, { useState, useMemo } from 'react';
import {
  Container, Box, Typography, Button, TextField, Card, CardContent, CardMedia,
  Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, InputAdornment
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from 'react-router-dom';

const defaultImage = "https://cdn-icons-png.flaticon.com/512/590/590685.png";

function MyProducts() {
  const location = useLocation();
  const farmer = location.state?.farmer ||
    JSON.parse(localStorage.getItem('farmer')) ||
    { name: "Farmer", phone: "", address: "" };

  // Load products from localStorage for demo
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem(`products_${farmer.phone}`);
    return stored ? JSON.parse(stored) : [];
  });
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // For delete confirmation dialog
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  // Product form state
  const [form, setForm] = useState({
    name: '', price: '', unit: '', image: ''
  });

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(prod =>
      prod.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  // Handle opening the add/edit dialog
  const openDialog = (product = null) => {
    setEditingProduct(product);
    setForm(product
      ? { name: product.name, price: product.price, unit: product.unit, image: product.image || '' }
      : { name: '', price: '', unit: '', image: '' }
    );
    setDialogOpen(true);
  };

  // Handle image upload (base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  // Add or update product
  const handleSave = () => {
    let updated;
    if (editingProduct) {
      updated = products.map(prod =>
        prod.id === editingProduct.id ? { ...editingProduct, ...form } : prod
      );
    } else {
      updated = [
        ...products,
        { ...form, id: Date.now() }
      ];
    }
    setProducts(updated);
    localStorage.setItem(`products_${farmer.phone}`, JSON.stringify(updated));
    setDialogOpen(false);
    setEditingProduct(null);
    setForm({ name: '', price: '', unit: '', image: '' });
  };

  // Delete product
  const handleDelete = (id) => {
    const updated = products.filter(prod => prod.id !== id);
    setProducts(updated);
    localStorage.setItem(`products_${farmer.phone}`, JSON.stringify(updated));
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom align="center">
          My Products
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><SearchIcon /></InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={() => openDialog()}
            sx={{ bgcolor: '#43e97b', color: '#1b4332', fontWeight: 600 }}
          >
            Add Product
          </Button>
        </Box>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems={filteredProducts.length === 0 ? "center" : undefined}
          sx={{
            minHeight: filteredProducts.length === 0 ? '40vh' : undefined,
          }}
        >
          {filteredProducts.length === 0 && (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '30vh',
                }}
              >
                <Typography color="text.secondary" align="center">
                  No products found. Click "Add Product" to list your first item!
                </Typography>
              </Box>
            </Grid>
          )}
          {filteredProducts.map(prod => (
            <Grid item xs={12} sm={6} md={4} key={prod.id}>
              <Card sx={{ position: 'relative', boxShadow: 4 }}>
                <CardMedia
                  component="img"
                  height="170"
                  image={prod.image || defaultImage}
                  alt={prod.name}
                  sx={{ objectFit: 'cover', background: "#f0f0f0" }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>{prod.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ₹{prod.price} / {prod.unit}
                  </Typography>
                </CardContent>
                {/* Remove button (delete) at top-right */}
                <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                  <IconButton
                    color="error"
                    aria-label="delete"
                    onClick={() => setDeleteConfirm({ open: true, id: prod.id })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Product Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            fullWidth
          />
          <TextField
            label="Price (₹)"
            type="number"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            required
            fullWidth
          />
          <TextField
            label="Unit (e.g. kg, dozen)"
            value={form.unit}
            onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
            required
            fullWidth
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ alignSelf: 'flex-start' }}
          >
            {form.image ? "Change Image" : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageUpload}
            />
          </Button>
          {form.image && (
            <Box sx={{ mt: 1 }}>
              <img src={form.image} alt="Product" style={{ width: 90, height: 90, borderRadius: 8, objectFit: 'cover' }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ bgcolor: '#43e97b', color: '#1b4332', fontWeight: 600 }}
            disabled={!form.name || !form.price || !form.unit}
          >
            {editingProduct ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this product?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, id: null })} color="secondary">
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              handleDelete(deleteConfirm.id);
              setDeleteConfirm({ open: false, id: null });
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyProducts;
