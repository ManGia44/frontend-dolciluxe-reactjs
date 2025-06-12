// src/hooks/useCart.js
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  getCart,
  removeCartItem,
  removeManyCartItem,
  updateCartItem,
} from '~/api/apiCart';
import { createInstance } from '~/redux/interceptors';
import { loginSuccess } from '~/redux/authSlice';
import { fetchCart as fetchCartAfterUpdate } from '~/redux/cartSlice';

export const useCart = (user) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const instance = createInstance(user, dispatch, loginSuccess);

  const fetchCart = async () => {
    if (!user?.accessToken) {
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const res = await getCart(instance);
      if (res.data?.items) {
        setCartItems(res.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await removeCartItem(instance, productId);
      dispatch(fetchCartAfterUpdate());
      await fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      throw err;
    }
  };

  const removeMultipleItems = async (productIds) => {
    try {
      await removeManyCartItem(instance, productIds);
      dispatch(fetchCartAfterUpdate());
      await fetchCart();
    } catch (err) {
      console.error('Error removing multiple items:', err);
      throw err;
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
  try {
    await updateCartItem(instance, { productId, quantity });
    await fetchCart();
  } catch (error) {
    console.error('Error updating quantity:', error);
    throw error;
  }
};


  useEffect(() => {
    if (user?.accessToken) {
      fetchCart();
    }
  }, [user?.accessToken]);

  return {
    cartItems,
    fetchCart,
    removeItem,
    removeMultipleItems,
    updateItemQuantity,
    loading,
  };
};
