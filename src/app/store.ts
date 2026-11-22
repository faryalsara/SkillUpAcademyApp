
import { configureStore } from '@reduxjs/toolkit';

import coursesReducer from '../features/courses/coursesSlice';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/orderSlice';

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
