// src/api/apiCart.js
// import { response } from '~/services/axios';

export const getCart = async (instance) => {
  try {
    const res = await instance.get('/api/cart');
    return res;
  } catch (err) {
    handleError(err, 'getCart');
  }
};

export const addCartItem = async (instance, item) => {
  try {
    const res = await instance.post('/api/cart', item);
    return res;
  } catch (err) {
    handleError(err, 'addCartItem');
  }
};

export const updateCartItem = async (instance, item) => {
  try {
    const res = await instance.put('/api/cart', item);
    return res;
  } catch (err) {
    handleError(err, 'updateCartItem');
  }
};

export const removeCartItem = async (instance, productId) => {
  try {
    const res = await instance.delete(`/api/cart/delete/${productId}`);
    return res;
  } catch (err) {
    handleError(err, 'removeCartItem');
  }
};

export const removeManyCartItem = async (instance, productIds) => {
  try {
    const res = await instance.delete('/api/cart/delete-many', {
      data: { productIds },
    });
    return res;
  } catch (err) {
    handleError(err, 'removeManyCartItem');
  }
};

export const createOrder = async (instance, invoice) => {
  try {
    const res = await instance.post('/api/order', invoice);
    return res;
  } catch (err) {
    handleError(err, 'createOrder');
  }
};

// --- helper function ---
const handleError = (err, name) => {
  if (err.response) {
    console.error(`[${name}] Server error:`, err.response.data?.message || err.message, err.response.status);
  } else {
    console.error(`[${name}] Request error:`, err.message);
  }
  throw err; // Để caller biết lỗi
};
