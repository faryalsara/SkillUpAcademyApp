
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order } from '../features/orders/orderSlice';

const ORDER_STORAGE_KEY = '@skillup_orders';

// Save orders
export const saveOrders = async (orders: Order[]) => {
  try {
    await AsyncStorage.setItem(
      ORDER_STORAGE_KEY,
      JSON.stringify(orders),
    );
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

// Load orders
export const loadOrders = async (): Promise<Order[]> => {
  try {
    const savedOrders = await AsyncStorage.getItem(ORDER_STORAGE_KEY);

    if (savedOrders) {
      return JSON.parse(savedOrders) as Order[];
    }

    return [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

// Clear saved orders
export const clearSavedOrders = async () => {
  try {
    await AsyncStorage.removeItem(ORDER_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing orders:', error);
  }
};
