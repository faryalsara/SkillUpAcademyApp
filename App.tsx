
import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  View,
} from 'react-native';

import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store } from './src/app/store';
import { useAppSelector } from './src/app/hooks';

import AppNavigator from './src/navigation/AppNavigator';

import {
  loadCart,
  saveCart,
} from './src/services/cartStorage';

import { setCartItems } from './src/features/cart/cartSlice';

// Automatically save cart whenever Redux cart changes
const CartPersistence = () => {
  const cartItems = useAppSelector(
    state => state.cart.items,
  );

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  return null;
};

// Main application
const App = () => {
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Restore cart when application starts
  useEffect(() => {
    const initializeCart = async () => {
      try {
        const savedItems = await loadCart();

        store.dispatch(setCartItems(savedItems));

        console.log('Cart restored successfully:', savedItems);
      } catch (error) {
        console.error('Cart initialization failed:', error);
      } finally {
        setIsCartLoaded(true);
      }
    };

    initializeCart();
  }, []);

  // Show loading indicator until cart is restored
  if (!isCartLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#3157D5"
        />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <CartPersistence />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
