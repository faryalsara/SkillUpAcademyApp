
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '../../types/course';

export interface CartItem extends Course {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add a course to the cart
    addItem: (state, action: PayloadAction<Course>) => {
      const existingItem = state.items.find(
        item => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    // Remove a course from the cart
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        item => item.id !== action.payload,
      );
    },

    // Update course quantity
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const { id, quantity } = action.payload;

      const item = state.items.find(
        course => course.id === id,
      );

      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
    },

    // Restore saved cart items
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    // Empty the cart
    clearCart: state => {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  setCartItems,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
