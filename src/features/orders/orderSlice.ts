
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../cart/cartSlice';

export interface Order {
  id: string;
  apiOrderId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Confirmed';
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.loading = false;
      state.error = null;
    },

    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  addOrder,
  setOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
