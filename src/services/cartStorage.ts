
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../features/cart/cartSlice';

const CART_STORAGE_KEY = '@skillup_cart';

export const saveCart = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items),
    );
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const loadCart = async (): Promise<CartItem[]> => {
  try {
    const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      return JSON.parse(savedCart) as CartItem[];
    }

    return [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};

export const clearSavedCart = async () => {
  try {
    await AsyncStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};
